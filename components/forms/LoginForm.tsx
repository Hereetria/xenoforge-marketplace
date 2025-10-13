"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { User, Zap } from "lucide-react";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  root: z.string().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [isDemoLoggingIn, setIsDemoLoggingIn] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
      root: undefined,
    },
  });

  const handleDemoLogin = async (email: string, password: string) => {
    try {
      setIsDemoLoggingIn(true);

      // Auto-fill the form
      form.setValue("email", email);
      form.setValue("password", password);

      // Trigger form validation
      await form.trigger();

      // Simulate the same flow as manual login
      const result = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      });

      if (result?.ok) {
        window.location.href = "/courses";
      } else if (result?.error) {
        // Check if it's a rate limit error or other API error
        let errorMessage = "Invalid email or password. Please try again.";

        if (
          result.error.includes("Too Many Requests") ||
          result.error.includes("rate limit")
        ) {
          errorMessage =
            "Too many login attempts. Please wait a moment and try again.";
        } else if (result.error.includes("CredentialsSignin")) {
          errorMessage = "Invalid email or password. Please try again.";
        } else if (result.error) {
          errorMessage = result.error;
        }

        form.setError("root", {
          type: "manual",
          message: errorMessage,
        });
      }
    } catch (error) {
      console.error("Demo login error:", error);

      let errorMessage = "An error occurred during login. Please try again.";

      if (error instanceof Error) {
        if (
          error.message.includes("Too Many Requests") ||
          error.message.includes("rate limit")
        ) {
          errorMessage =
            "Too many login attempts. Please wait a moment and try again.";
        } else if (error.message) {
          errorMessage = error.message;
        }
      }

      form.setError("root", {
        type: "manual",
        message: errorMessage,
      });
    } finally {
      setIsDemoLoggingIn(false);
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log("Login data:", data);

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        form.setError("root", {
          type: "manual",
          message: "Invalid email or password. Please try again.",
        });
        return;
      }

      if (result?.ok) {
        window.location.href = "/courses";
      }
    } catch (error) {
      console.error("Login error:", error);
      form.setError("root", {
        type: "manual",
        message: "An error occurred during login. Please try again.",
      });
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {form.formState.errors.root && (
            <div className="p-3 text-sm text-red-400 bg-red-900/20 border border-red-500/30 rounded-md">
              {form.formState.errors.root.message}
            </div>
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    className={`bg-[#1C1F2A] border-[#6B7280] text-white placeholder-[#6B7280] focus:border-[#F5B301] focus:ring-[#F5B301]/20 ${
                      form.formState.errors.email
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : ""
                    }`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    readOnly={isDemoLoggingIn}
                    className={`bg-[#1C1F2A] border-[#6B7280] text-white placeholder-[#6B7280] focus:border-[#F5B301] focus:ring-[#F5B301]/20 ${
                      form.formState.errors.password
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : ""
                    } ${isDemoLoggingIn ? "opacity-75 cursor-not-allowed" : ""}`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={form.formState.isSubmitting || isDemoLoggingIn}
            className="w-full bg-[#F5B301] text-[#1C1F2A] hover:bg-[#FFF9E6] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            {form.formState.isSubmitting || isDemoLoggingIn ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-[#1C1F2A] border-t-transparent rounded-full animate-spin"></div>
                {isDemoLoggingIn ? "Demo Signing In..." : "Signing In..."}
              </span>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </Form>

      {/* Demo Accounts Section */}
      <div className="mt-6 pt-6 border-t border-[#6B7280]/30">
        <Card className="bg-gradient-to-r from-[#1C1F2A] to-[#2A2D3A] border-[#6B7280]/50 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#F5B301]/20 rounded-lg">
              <Zap className="h-4 w-4 text-[#F5B301]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Demo Account</h3>
              <p className="text-xs text-gray-400">
                Try the app with demo credentials
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => handleDemoLogin("demo@example.com", "Password123")}
              disabled={isDemoLoggingIn || form.formState.isSubmitting}
              className="w-full bg-[#F5B301]/10 hover:bg-[#F5B301]/20 text-[#F5B301] border border-[#F5B301]/30 hover:border-[#F5B301]/50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <User className="h-4 w-4 mr-2" />
              {isDemoLoggingIn ? "Signing In..." : "Login as Demo User"}
            </Button>

            <div className="text-xs text-gray-400 bg-[#1C1F2A]/50 rounded-md p-2 text-center">
              <strong className="text-[#F5B301]">Email:</strong> demo@example.com |{" "}
              <strong className="text-[#F5B301]">Password:</strong> Password123
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
