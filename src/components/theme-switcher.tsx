"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { DropdownMenuItem } from "./ui/dropdown-menu";

export default function ThemeSwitch() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  function toggleTheme() {
    if (theme === "dark") {
      // Whenever the user explicitly chooses light mode
      localStorage.theme = "light";
      document.documentElement.classList.toggle("dark");
      setTheme("light");
    } else {
      // Whenever the user explicitly chooses dark mode
      localStorage.theme = "dark";
      document.documentElement.classList.toggle("dark");
      setTheme("dark");
    }
  }

  useEffect(() => {
    if (localStorage.getItem("theme") === "light") {
      setTheme("light");
    } else if (localStorage.getItem("theme") === "dark") {
      setTheme("dark");
    }
  }, []);

  return (
    <>
      {theme === "dark" && (
        <DropdownMenuItem onClick={toggleTheme}>
          Light Mode
          <Sun className="ml-auto w-3" />
        </DropdownMenuItem>
      )}

      {theme === "light" && (
        <DropdownMenuItem onClick={toggleTheme}>
          Dark Mode
          <Moon className="ml-auto w-3" />
        </DropdownMenuItem>
      )}
    </>
  );
}
