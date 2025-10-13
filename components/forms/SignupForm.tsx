"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must be less than 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must be less than 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address")
      .max(100, "Email must be less than 100 characters"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must be less than 100 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    agreeToTerms: z
      .boolean()
      .refine((val) => val === true, "You must agree to the terms and conditions"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSubmit = async (data: SignupFormData) => {
    try {
      console.log("Signup data:", data);

      // First check if we're being rate limited
      try {
        const testResponse = await fetch("/api/auth/csrf", {
          method: "GET",
        });

        if (testResponse.status === 429) {
          form.setError("root", {
            type: "manual",
            message: "Too many signup attempts. Please wait a moment and try again.",
          });
          return;
        }
      } catch (testError) {
        // If test request fails, continue with normal signup
      }

      const response = await axios.post("/api/auth/register", {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      console.log("Registration successful:", response.data);

      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        console.error("Auto-login failed:", signInResult.error);

        form.reset();
        window.location.href =
          "/auth/login?message=Registration successful! Please log in.";
        return;
      }

      if (signInResult?.ok) {
        console.log("Auto-login successful");
        form.reset();

        router.push("/");
        return;
      }

      form.reset();
      window.location.href =
        "/auth/login?message=Registration successful! Please log in.";
    } catch (error) {
      console.error("Signup error:", error);

      let errorMessage = "An error occurred during signup. Please try again.";

      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data?.error || error.message;

        if (
          apiError.includes("Too Many Requests") ||
          apiError.includes("rate limit")
        ) {
          errorMessage =
            "Too many signup attempts. Please wait a moment and try again.";
        } else if (
          apiError.includes("User already exists") ||
          apiError.includes("email")
        ) {
          errorMessage =
            "An account with this email already exists. Please try logging in instead.";
        } else {
          errorMessage = apiError;
        }
      } else if (error instanceof Error) {
        if (
          error.message.includes("Too Many Requests") ||
          error.message.includes("rate limit")
        ) {
          errorMessage =
            "Too many signup attempts. Please wait a moment and try again.";
        } else {
          errorMessage = error.message;
        }
      }

      form.setError("root", {
        type: "manual",
        message: errorMessage,
      });
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          key="signup-form"
        >
          {form.formState.errors.root && (
            <div className="p-3 text-sm text-red-400 bg-red-900/20 border border-red-500/30 rounded-md">
              {form.formState.errors.root.message}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your first name"
                      className={`bg-[#1C1F2A] border-[#6B7280] text-white placeholder-[#6B7280] focus:border-[#F5B301] focus:ring-[#F5B301]/20 ${
                        form.formState.errors.firstName
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
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your last name"
                      className={`bg-[#1C1F2A] border-[#6B7280] text-white placeholder-[#6B7280] focus:border-[#F5B301] focus:ring-[#F5B301]/20 ${
                        form.formState.errors.lastName
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
          </div>

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
                    placeholder="Create a strong password"
                    className={`bg-[#1C1F2A] border-[#6B7280] text-white placeholder-[#6B7280] focus:border-[#F5B301] focus:ring-[#F5B301]/20 ${
                      form.formState.errors.password
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
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    className={`bg-[#1C1F2A] border-[#6B7280] text-white placeholder-[#6B7280] focus:border-[#F5B301] focus:ring-[#F5B301]/20 ${
                      form.formState.errors.confirmPassword
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
            name="agreeToTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="mt-1 w-4 h-4 text-[#F5B301] bg-[#1C1F2A] border-[#6B7280] rounded focus:ring-[#F5B301] focus:ring-2 transition-colors duration-200 cursor-pointer"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm text-[#6B7280] leading-relaxed cursor-pointer">
                    I agree to the{" "}
                    <span className="text-[#F5B301] hover:underline font-medium cursor-pointer">
                      Terms of Service
                    </span>{" "}
                    and{" "}
                    <span className="text-[#F5B301] hover:underline font-medium cursor-pointer">
                      Privacy Policy
                    </span>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full bg-[#F5B301] text-[#1C1F2A] hover:bg-[#FFF9E6] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            {form.formState.isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-[#1C1F2A] border-t-transparent rounded-full animate-spin"></div>
                Creating Account...
              </span>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}
