import Link from "next/link";

export default function LoginLink() {
  return (
    <div className="mt-8 text-center">
      <p className="text-[#6B7280] text-sm">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="text-[#F5B301] hover:underline font-medium transition-colors duration-200"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
