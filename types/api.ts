// API Response Types
export interface CourseWithEnrollment {
  id: string;
  title: string;
  description: string;
  shortDescription: string | null;
  price: number;
  thumbnail: string | null;
  level: string;
  duration: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  instructor: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
    color: string | null;
  } | null;
  modules: {
    id: string;
    title: string;
    order: number;
  }[];
  enrollments: {
    id: string;
    createdAt: Date;
  }[];
  _count: {
    enrollments: number;
  };
  isEnrolled?: boolean;
  enrollmentId?: string | null;
  enrolledAt?: Date | null;
}

export interface PaymentWithDetails {
  id: string;
  status: string;
  amount: number;
  currency: string;
  provider: string;
  courseTitle: string | null;
  courseId: string | null;
  createdAt: string;
  stripePaymentIntentId: string | null;
  subscription?: {
    id: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    active: boolean;
    cancelAtPeriodEnd: boolean;
  } | null;
}

export interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  _count: {
    courses: number;
  };
}

export interface EnrolledCourse {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  instructor: string;
  price: number;
  duration: number;
  level: string;
  language: string;
  averageRating: number;
  studentCount: number;
  progress: number;
  lastAccessedAt: Date | null;
  completedAt: Date | null;
  hasReviewed: boolean;
  course: {
    id: string;
    title: string;
    description: string;
    thumbnail: string | null;
    instructor: string;
    price: number;
    duration: number;
    level: string;
    language: string;
    averageRating: number;
    studentCount: number;
  };
}
