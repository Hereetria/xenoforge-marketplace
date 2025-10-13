import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createCourseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  thumbnail: z.string().optional(),
  price: z.number().min(0, "Price must be 0 or greater"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "EXPERT"]),
  duration: z.number().min(0.1, "Duration must be at least 0.1 hours"),
});

export const updateCourseSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  shortDescription: z.string().optional(),
  thumbnail: z.string().optional(),
  previewVideo: z.string().optional(),
  price: z.number().min(0).optional(),
  originalPrice: z.number().min(0).optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "EXPERT"]).optional(),
  language: z.string().optional(),
  duration: z.number().min(1).optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  learningGoals: z.array(z.string()).optional(),
});

export const createReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export const updateReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export const createEnrollmentSchema = z.object({
  courseId: z.string().min(1),
});

export const updateEnrollmentSchema = z.object({
  progress: z.number().min(0).max(100),
  isCompleted: z.boolean().optional(),
  lastAccessed: z.string().datetime().optional(),
});

export const completeLessonSchema = z.object({
  lessonId: z.string().min(1),
});

export const validateCouponSchema = z.object({
  code: z.string().min(1),
  courseId: z.string().min(1).optional(),
});

export const createPaymentSchema = z.object({
  courseId: z.string().min(1).optional(),
  courseIds: z.array(z.string()).optional(),
  paymentMethod: z.enum(["stripe"]),
  amount: z.number().min(0),
  currency: z.string().default("usd"),
});

export const createRefundSchema = z.object({
  provider: z.enum(["stripe"]),
  paymentIntentId: z.string().min(1).optional(),
  orderId: z.string().min(1).optional(),
  amount: z.number().min(0),
  currency: z.string().min(1),
  reason: z.string().optional(),
}).refine((data) => {
  if (data.provider === "stripe") {
    return true;
  }
  return true;
});

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  bio: z.string().optional(),
  website: z.string().url().optional(),
  avatar: z.string().url().optional(),
});

export const courseQuerySchema = z.object({
  page: z.string().transform((val) => parseInt(val) || 1).optional(),
  limit: z.string().transform((val) => parseInt(val) || 12).optional(),
  category: z.string().optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "EXPERT"]).optional(),
  search: z.string().optional(),
  priceRange: z.enum(["free", "under-25", "25-50", "50-100", "over-100"]).optional(),
  rating: z.string().transform((val) => parseFloat(val)).optional(),
  duration: z.enum(["under-2h", "2-10h", "10-30h", "30h-plus"]).optional(),
  sort: z.enum(["newest", "oldest", "price-low", "price-high", "popular", "rating"]).optional(),
  featured: z.string().transform((val) => val === "true").optional(),
});

export const createOfferSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().min(0),
  type: z.enum(["ONE_TIME", "SUBSCRIPTION"]),
});

export const updateOfferSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  price: z.number().min(0).optional(),
  type: z.enum(["ONE_TIME", "SUBSCRIPTION"]).optional(),
});

export const createDiscountOfferSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  discountPercentage: z.number().min(1).max(100),
  validFrom: z.string().datetime(),
  validUntil: z.string().datetime(),
  courseIds: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
});

export const updateDiscountOfferSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  discountPercentage: z.number().min(1).max(100).optional(),
  validFrom: z.string().datetime().optional(),
  validUntil: z.string().datetime().optional(),
  courseIds: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});
