"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface DiscountTimer {
  endTime: number;
  isActive: boolean;
}

export default function DiscountAlert() {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  const isDiscountEnabled = process.env.NEXT_PUBLIC_DISCOUNT_ENABLED === "true";

  const generateRandomEndTime = () => {
    const days = Math.floor(Math.random() * 7) + 1;
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);

    const totalMinutes = days * 24 * 60 + hours * 60 + minutes;
    const endTime = Date.now() + totalMinutes * 60 * 1000;

    return endTime;
  };

  const calculateTimeLeft = (endTime: number) => {
    const now = Date.now();
    const diff = endTime - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0 };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes };
  };

  const loadDiscountTimer = useCallback((): DiscountTimer | null => {
    if (typeof window === "undefined") return null;

    try {
      const stored = localStorage.getItem("discount-timer");
      if (stored) {
        const timer: DiscountTimer = JSON.parse(stored);
        const now = Date.now();

        if (timer.endTime <= now) {
          const newEndTime = generateRandomEndTime();
          const newTimer: DiscountTimer = {
            endTime: newEndTime,
            isActive: timer.isActive,
          };
          localStorage.setItem("discount-timer", JSON.stringify(newTimer));
          return newTimer;
        }

        return timer;
      }
    } catch (error) {
      console.error("Error loading discount timer:", error);
    }

    return null;
  }, []);

  const saveDiscountTimer = (timer: DiscountTimer) => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem("discount-timer", JSON.stringify(timer));
    } catch (error) {
      console.error("Error saving discount timer:", error);
    }
  };

  useEffect(() => {
    if (!isDiscountEnabled) {
      setIsVisible(false);
      return;
    }

    let timer = loadDiscountTimer();

    if (!timer) {
      const endTime = generateRandomEndTime();
      timer = {
        endTime,
        isActive: true,
      };
      saveDiscountTimer(timer);
    }

    const showTimer = setTimeout(() => {
      setIsVisible(true);
      setTimeLeft(calculateTimeLeft(timer?.endTime || Date.now()));
    }, 1000);

    return () => clearTimeout(showTimer);
  }, [isDiscountEnabled, loadDiscountTimer]);

  useEffect(() => {
    if (!isVisible || !isDiscountEnabled) return;

    const timer = setInterval(() => {
      const storedTimer = loadDiscountTimer();
      if (!storedTimer) return;

      const newTimeLeft = calculateTimeLeft(storedTimer.endTime);
      setTimeLeft(newTimeLeft);

      if (
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0
      ) {
        const newEndTime = generateRandomEndTime();
        const newTimer: DiscountTimer = {
          endTime: newEndTime,
          isActive: storedTimer.isActive,
        };
        saveDiscountTimer(newTimer);
        setTimeLeft(calculateTimeLeft(newEndTime));
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [isVisible, isDiscountEnabled, loadDiscountTimer]);

  const handleClose = () => {
    setIsVisible(false);

    const timer = loadDiscountTimer();
    if (timer) {
      timer.isActive = false;
      saveDiscountTimer(timer);
    }
  };

  if (!isDiscountEnabled || !isVisible) {
    return null;
  }

  return (
    <Card className="bg-[#F5B301] text-[#1C1F2A] py-2 sm:py-3 px-2 sm:px-4 relative border-0 rounded-none">
      <div className="max-w-7xl mx-auto">
        {/* Mobile Layout */}
        <div className="flex flex-col sm:hidden space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Tag className="h-4 w-4" />
              <span className="font-bold text-base">40% OFF</span>
            </div>
            <Button
              onClick={handleClose}
              variant="ghost"
              size="sm"
              className="text-[#1C1F2A] hover:text-[#2A2D3A] hover:bg-transparent p-1 h-auto"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-xs text-center">
            Limited time offer! Get 40% off on all courses
          </div>
          <div className="flex items-center justify-center space-x-2 bg-[#1C1F2A] text-[#F5B301] px-3 py-1 rounded-full mx-auto">
            <Clock className="h-3 w-3" />
            <span className="font-mono text-xs">
              {timeLeft.days}d {String(timeLeft.hours).padStart(2, "0")}h{" "}
              {String(timeLeft.minutes).padStart(2, "0")}m
            </span>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center justify-center relative">
          <div className="flex items-center space-x-4 lg:space-x-6">
            <div className="flex items-center space-x-2">
              <Tag className="h-5 w-5" />
              <span className="font-bold text-lg">40% OFF</span>
            </div>
            <div className="hidden md:block">
              <span className="text-sm">
                Limited time offer! Get 40% off on all courses
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-[#1C1F2A] text-[#F5B301] px-3 py-1 rounded-full">
              <Clock className="h-4 w-4" />
              <span className="font-mono text-sm">
                {timeLeft.days}d {String(timeLeft.hours).padStart(2, "0")}h{" "}
                {String(timeLeft.minutes).padStart(2, "0")}m
              </span>
            </div>
          </div>
          <Button
            onClick={handleClose}
            variant="ghost"
            size="sm"
            className="absolute right-0 text-[#1C1F2A] hover:text-[#2A2D3A] hover:bg-transparent p-1 h-auto"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
