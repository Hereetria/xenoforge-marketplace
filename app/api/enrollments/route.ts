import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";
import { handleError } from "@/lib/errors/errorHandler";
import prisma from "@/lib/prisma";
import { PaymentStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { user } = await requireAuth();

    // Ensure enrollments exist for all successfully purchased courses by this user
    // This covers cases where payments were created (including admin-granted) but enrollment rows are missing
    const successfulCoursePayments = await prisma.payment.findMany({
      where: {
        buyerId: user.id,
        status: PaymentStatus.SUCCEEDED,
        courseId: { not: null },
      },
      select: { id: true, courseId: true },
    });

    for (const payment of successfulCoursePayments) {
      if (!payment.courseId) continue;

      const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: payment.courseId,
          },
        },
      });

      if (!existingEnrollment) {
        await prisma.enrollment.create({
          data: {
            userId: user.id,
            courseId: payment.courseId,
            paymentId: payment.id,
          },
        });
      }
    }

    // Get user's enrollments with course details
    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: user.id
      },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            },
            category: {
              select: {
                name: true
              }
            },
            modules: {
              include: {
                lessons: {
                  select: {
                    id: true,
                    title: true,
                    duration: true
                  }
                }
              }
            }
          }
        },
        lessonCompletions: {
          select: {
            id: true,
            lessonId: true,
            completedAt: true
          }
        }
      },
      orderBy: {
        lastAccessedAt: 'desc'
      }
    });

    // Calculate additional statistics
    const totalCourses = enrollments.length;
    const completedCourses = enrollments.filter(e => e.progress === 100).length;
    const totalHours = enrollments.reduce((sum, e) => {
      const courseHours = e.course.duration / 60;
      return sum + courseHours * (e.progress / 100);
    }, 0);
    
    const totalLessons = enrollments.reduce((sum, e) => {
      return sum + e.course.modules.reduce((moduleSum, module) => {
        return moduleSum + module.lessons.length;
      }, 0);
    }, 0);

    const completedLessons = enrollments.reduce((sum, e) => {
      return sum + e.lessonCompletions.length;
    }, 0);

    // Calculate learning streak (simplified - in production you'd want more sophisticated logic)
    const recentEnrollments = enrollments.filter(e => {
      const daysSinceEnrollment = Math.floor((Date.now() - e.createdAt.getTime()) / (1000 * 60 * 60 * 24));
      return daysSinceEnrollment <= 30; // Active in last 30 days
    });
    const learningStreak = Math.min(recentEnrollments.length, 30);

    // Get certificates count
    const certificatesCount = await prisma.certificate.count({
      where: {
        userId: user.id
      }
    });

    // Fetch all certificates for this user to mark courses that have an earned certificate
    const userCertificates = await prisma.certificate.findMany({
      where: { userId: user.id },
      select: { courseId: true }
    });
    const courseIdWithCertificates = new Set(userCertificates.map((c) => c.courseId));

    // Transform enrollments for frontend
    const transformedEnrollments = enrollments.map(enrollment => {
      const course = enrollment.course;
      const totalLessonsInCourse = course.modules.reduce((sum, module) => sum + module.lessons.length, 0);
      const completedLessonsInCourse = enrollment.lessonCompletions.length;
      
      return {
        id: enrollment.id,
        courseId: course.id,
        title: course.title,
        instructor: course.instructor.name,
        instructorAvatar: course.instructor.avatar,
        progress: enrollment.progress,
        thumbnail: course.thumbnail,
        lastAccessed: enrollment.lastAccessedAt,
        duration: `${Math.round(course.duration / 60)} hours`,
        lessonsCompleted: completedLessonsInCourse,
        totalLessons: totalLessonsInCourse,
        level: course.level,
        category: course.category?.name || 'General',
        isCompleted: enrollment.progress === 100,
        completedAt: enrollment.completedAt,
        // Persisted, backend-driven flag indicating the user has earned a certificate for this course at least once
        hasCertificateEver: courseIdWithCertificates.has(course.id)
      };
    });

    return NextResponse.json({
      enrollments: transformedEnrollments,
      statistics: {
        totalCourses,
        completedCourses,
        totalHours: parseFloat(totalHours.toFixed(1)),
        totalLessons,
        completedLessons,
        learningStreak,
        certificatesCount
      }
    });

  } catch (error) {
    return handleError(error);
  }
}