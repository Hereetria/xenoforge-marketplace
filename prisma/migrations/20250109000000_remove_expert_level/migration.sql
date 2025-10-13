-- Update any existing EXPERT courses to ADVANCED
UPDATE "Course" SET level = 'ADVANCED' WHERE level = 'EXPERT';

-- Remove EXPERT from the CourseLevel enum
ALTER TYPE "CourseLevel" RENAME TO "CourseLevel_old";
CREATE TYPE "CourseLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
ALTER TABLE "Course" ALTER COLUMN level TYPE "CourseLevel" USING level::text::"CourseLevel";
DROP TYPE "CourseLevel_old";
