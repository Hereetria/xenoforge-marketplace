import { NextRequest } from "next/server";
import { createCourseSchema } from "@/lib/validation/schemas";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/requireAuth";
import { validate } from "@/lib/validation/validate";
import { handleError } from "@/lib/errors/errorHandler";

// export async function POST(request: NextRequest) {
//   try {
//     // Get authenticated user
//     const { user } = await requireAuth();

//     // Validate request body
//     const body = await request.json();
//     const validatedData = validate(createCourseSchema, body);

//     // Create course with validated data
//     const course = await prisma.course.create({
//       data: {
//         title: validatedData.title,
//         description: validatedData.description,
//         thumbnail: validatedData.thumbnail,
//         price: validatedData.price,
//         level: validatedData.level,
//         duration: Math.round(validatedData.duration * 60), // Convert hours to minutes
//         instructorId: user.id, // Tie userId to instructorId
//         language: "English", // Default language
//         tags: [],
//         requirements: [],
//         learningGoals: [],
//       },
//     });

//     return Response.json(course, { status: 201 });
//   } catch (error) {
//     return handleError(error);
//   }
// }
