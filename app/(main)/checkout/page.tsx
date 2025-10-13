import CheckoutPageClient from "./_components/CheckoutPageClient";

export const metadata = {
  title: "Secure Checkout | Subtrack Marketplace",
  description:
    "Complete your course purchase securely with our trusted payment methods.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/checkout",
  },
  openGraph: {
    title: "Secure Checkout",
    description:
      "Complete your course purchase securely with our trusted payment methods.",
    url: "/checkout",
  },
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
