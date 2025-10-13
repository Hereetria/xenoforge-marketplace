-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- Insert default categories
INSERT INTO "Category" ("id", "name", "slug", "description", "icon", "color", "isActive") VALUES
('cat_web_dev', 'Web Development', 'web-development', 'Learn HTML, CSS, JavaScript, and modern web frameworks', '💻', 'blue', true),
('cat_data_science', 'Data Science', 'data-science', 'Master data analysis, machine learning, and AI', '📊', 'green', true),
('cat_ui_ux', 'UI/UX Design', 'ui-ux-design', 'Design beautiful and user-friendly interfaces', '🎨', 'purple', true),
('cat_mobile', 'Mobile Development', 'mobile-development', 'Build iOS and Android applications', '📱', 'orange', true),
('cat_marketing', 'Digital Marketing', 'digital-marketing', 'Learn SEO, social media, and online advertising', '📈', 'pink', true),
('cat_python', 'Python', 'python', 'Master Python programming and frameworks', '🐍', 'yellow', true),
('cat_react', 'React', 'react', 'Build modern web applications with React', '⚛️', 'blue', true),
('cat_ai', 'AI & Machine Learning', 'ai-machine-learning', 'Explore artificial intelligence and ML algorithms', '🤖', 'teal', true),
('cat_cybersecurity', 'Cybersecurity', 'cybersecurity', 'Learn to protect systems and data', '🔒', 'red', true),
('cat_blockchain', 'Blockchain', 'blockchain', 'Understand cryptocurrency and blockchain technology', '⛓️', 'indigo', true);
