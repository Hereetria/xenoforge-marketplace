import LoginForm from "@/components/forms/LoginForm";
import AuthBackground from "../_components/AuthBackground";
import LoginHeader from "./_components/LoginHeader";
import SignupLink from "@/app/auth/login/_components/SignupLink";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative h-full">
      <AuthBackground />
      <div className="w-full max-w-md relative z-10">
        <Card className="bg-[#2A2D3A] border-[#6B7280] shadow-2xl">
          <CardContent className="p-8">
            <LoginHeader />
            <LoginForm />
            <SignupLink />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
