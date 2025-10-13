import CartPageClient from "./_components/CartPageClient";

export const metadata = {
  title: "Your Cart | Subtrack Marketplace",
  description: "Review items in your cart and proceed to checkout.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/cart",
  },
  openGraph: {
    title: "Your Cart",
    description: "Review items in your cart and proceed to checkout.",
    url: "/cart",
  },
};

export default function CartPage() {
  return <CartPageClient />;
}
