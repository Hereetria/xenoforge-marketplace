# Subtrack Marketplace

A modern e-learning marketplace built with Next.js, featuring course creation, purchasing, and learning management.

## Features

- 🎓 **Course Management**: Create, edit, and manage courses
- 💳 **Stripe Integration**: Secure payment processing with test mode
- 🛒 **Shopping Cart**: Add multiple courses to cart
- 👥 **User Authentication**: NextAuth.js integration
- 📱 **Responsive Design**: Mobile-first approach
- 🎨 **Modern UI**: Tailwind CSS with custom components

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/subtrack_marketplace"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"

# Stripe (Test Mode)
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key_here"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"

# Optional: Discount Feature
NEXT_PUBLIC_DISCOUNT_ENABLED="true"
```

## Getting Started

1. **Install dependencies:**
```bash
pnpm install
```

2. **Set up environment variables:**
   - Copy the environment variables above to `.env.local`
   - Get your Stripe test keys from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)

3. **Set up the database:**
```bash
npx prisma generate
npx prisma db push
```

4. **Run the development server:**
```bash
pnpm dev
```

5. **Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.**

## Testing Payments

The application includes Stripe test mode integration. Use these test card numbers:

- **Success**: `4242 4242 4242 4242`
- **Declined**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

## Project Structure

```
├── app/
│   ├── (main)/           # Main application pages
│   │   ├── checkout/     # Payment checkout
│   │   ├── courses/      # Course browsing
│   │   ├── my-learning/  # User's enrolled courses
│   │   └── my-teaching/  # Instructor's courses
│   ├── api/              # API routes
│   │   ├── payments/     # Stripe payment processing
│   │   ├── courses/      # Course management
│   │   └── auth/         # Authentication
│   └── auth/             # Authentication pages
├── components/           # Reusable UI components
├── lib/                  # Utility functions
└── prisma/              # Database schema
```

## Tech Stack

- **Framework**: Next.js 15.5.4
- **Database**: PostgreSQL + Prisma
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Language**: TypeScript

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
