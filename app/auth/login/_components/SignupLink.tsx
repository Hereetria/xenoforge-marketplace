import Link from "next/link";

export default function SignupLink() {
  return (
    <div className="mt-8 text-center">
      <p className="text-[#6B7280] text-sm">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/signup"
          className="text-[#F5B301] hover:underline font-medium transition-colors duration-200"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
