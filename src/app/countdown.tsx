"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useEffect, useState, useMemo } from "react";

export default function CountdownTimer({
  startDate = new Date(),
}: {
  startDate: Date;
}) {
  // Calculate the end date (24 hours after the start date) using useMemo
  const endDate = useMemo(() => {
    const date = new Date(startDate);
    date.setHours(date.getHours() + 24);
    return date;
  }, [startDate]);

  // Initialize the timer to 24 hours in milliseconds
  const initialTimeRemaining = 24 * 60 * 60 * 1000; // 24 hours
  const [timeRemaining, setTimeRemaining] =
    useState<number>(initialTimeRemaining);
  const [isTimerStarted, setIsTimerStarted] = useState<boolean>(false);

  useEffect(() => {
    // Start the timer after 1 second
    const timerStartDelay = setTimeout(() => {
      setIsTimerStarted(true);
    }, 1000);

    return () => clearTimeout(timerStartDelay);
  }, []);

  useEffect(() => {
    if (!isTimerStarted) return; // Don't start the timer until the delay is over

    // Update the timer every second
    const timerInterval = setInterval(() => {
      const newTime = endDate.getTime() - Date.now();
      if (newTime <= 0) {
        clearInterval(timerInterval);
        setTimeRemaining(0); // Stop the timer
      } else {
        setTimeRemaining(newTime); // Update remaining time
      }
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(timerInterval);
  }, [isTimerStarted, endDate]);

  // Calculate hours, minutes, and seconds
  const hours = Math.floor(
    (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  return (
    <Badge
      variant={timeRemaining > 0 ? "default" : "destructive"}
      className={cn(`h-fit w-fit text-center`, {
        "animate-pulse": timeRemaining < 0,
      })}
    >
      {timeRemaining > 0
        ? `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        : "Deleting ..."}
    </Badge>
  );
}
