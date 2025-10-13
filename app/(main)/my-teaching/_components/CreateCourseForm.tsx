"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCourseSchema } from "@/lib/validation/schemas";
import toast from "react-hot-toast";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import RestrictedPopup from "@/components/ui/restricted-popup";

type CreateCourseFormData = {
  title: string;
  description: string;
  thumbnail?: string;
  price: number;
  level: "BEGINNER" | "INTERMEDIATE" | "EXPERT";
  duration: number;
};

export default function CreateCourseForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRestrictedPopup, setShowRestrictedPopup] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleRestrictedAction = () => {
    setShowRestrictedPopup(true);
  };

  // Handle scroll effect for sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const navbarHeight = 80; // Approximate navbar height
      setIsScrolled(scrollPosition > navbarHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const form = useForm<CreateCourseFormData>({
    resolver: zodResolver(createCourseSchema),
    mode: "onChange", // Enable real-time validation
    defaultValues: {
      title: "",
      description: "",
      thumbnail: "",
      price: undefined,
      level: "BEGINNER",
      duration: undefined,
    },
  });

  const onSubmit = async (data: CreateCourseFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/courses/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Handle specific error cases
        if (errorData.code === "USER_NOT_SYNCED") {
          toast.error(
            "You need to register an account first. Redirecting to signup page..."
          );
          window.location.href = "/auth/signup";
          return;
        }

        throw new Error(errorData.error || "Failed to create course");
      }

      await response.json();
      toast.success("Course created successfully!");
      form.reset();

      // Dispatch event to refresh courses list
      window.dispatchEvent(new CustomEvent("courseCreated"));
    } catch {
      toast.error("Error creating course. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <RestrictedPopup
        isVisible={showRestrictedPopup}
        onClose={() => setShowRestrictedPopup(false)}
      />
      <Card
        className={`bg-[#1C1F2A] border-[#6B7280] p-3 sm:p-4 lg:p-6 transition-all duration-300 ease-in-out ${
          isScrolled ? "sticky top-17 z-30 shadow-lg" : "relative"
        }`}
      >
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 sm:mb-6">
          Create New Course
        </h2>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-6"
          >
            {/* Form Validation Summary */}
            {Object.keys(form.formState.errors).length > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-md p-4">
                <h4 className="text-red-400 font-semibold mb-2">
                  Please fix the following errors:
                </h4>
                <ul className="text-red-300 text-sm space-y-1">
                  {Object.entries(form.formState.errors).map(([field, error]) => (
                    <li key={field}>• {error?.message}</li>
                  ))}
                </ul>
              </div>
            )}
            {/* Basic Information */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-[#F5B301]">
                Course Information
              </h3>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Course Title *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter course title"
                        className="bg-[#2A2D3A] border-[#6B7280] text-white placeholder-[#6B7280] focus:border-[#F5B301] focus:ring-[#F5B301]/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Description *</FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="Describe what students will learn in this course"
                        rows={4}
                        className="w-full bg-[#2A2D3A] border border-[#6B7280] text-white placeholder-[#6B7280] focus:border-[#F5B301] focus:ring-[#F5B301]/20 rounded-md px-3 py-2 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Thumbnail URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/thumbnail.jpg"
                        className="bg-[#2A2D3A] border-[#6B7280] text-white placeholder-[#6B7280] focus:border-[#F5B301] focus:ring-[#F5B301]/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            {/* Course Details */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-[#F5B301]">
                Course Details
              </h3>

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Price ($) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Enter price (e.g., 29.99)"
                        className="bg-[#2A2D3A] border-[#6B7280] text-white placeholder-[#6B7280] focus:border-[#F5B301] focus:ring-[#F5B301]/20"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? 0 : parseFloat(value) || 0);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Level *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-[#2A2D3A] border-[#6B7280] text-white focus:border-[#F5B301] focus:ring-[#F5B301]/20">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#2A2D3A] border-[#6B7280]">
                          <SelectItem
                            value="BEGINNER"
                            className="text-white hover:bg-[#3A3D4A]"
                          >
                            Beginner
                          </SelectItem>
                          <SelectItem
                            value="INTERMEDIATE"
                            className="text-white hover:bg-[#3A3D4A]"
                          >
                            Intermediate
                          </SelectItem>
                          <SelectItem
                            value="EXPERT"
                            className="text-white hover:bg-[#3A3D4A]"
                          >
                            Expert
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">
                        Duration (hours) *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0.1"
                          step="0.1"
                          placeholder="Enter duration (e.g., 2.5)"
                          className="bg-[#2A2D3A] border-[#6B7280] text-white placeholder-[#6B7280] focus:border-[#F5B301] focus:ring-[#F5B301]/20"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === "" ? 1 : parseFloat(value) || 1
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button
              type="button"
              onClick={handleRestrictedAction}
              disabled={isSubmitting}
              className="w-full bg-[#F5B301] text-[#1C1F2A] hover:bg-[#FFF9E6] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#1C1F2A] border-t-transparent rounded-full animate-spin"></div>
                  Creating Course...
                </span>
              ) : (
                "Create Course"
              )}
            </Button>
          </form>
        </Form>
      </Card>
    </>
  );
}
