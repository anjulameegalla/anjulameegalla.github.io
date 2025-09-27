'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

// Helper function to determine if it's after 6pm
function isAfter6PM() {
  const currentHour = new Date().getHours();
  return currentHour >= 18; // 18 is 6pm in 24-hour format
}

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Set theme based on time of day when component mounts
  useEffect(() => {
    setMounted(true);
    
    // Check if we should apply time-based theme
    const preferredTheme = isAfter6PM() ? 'dark' : 'light';
    
    // Only set theme if it hasn't been manually set before
    // This checks for localStorage to see if user has a preference
    if (!localStorage.getItem('theme')) {
      setTheme(preferredTheme);
    }
  }, [setTheme]);

  if (!mounted) {
    return (
      <div 
        className="rounded-full bg-gray-200 dark:bg-gray-700" 
        style={{ 
          width: '18px', 
          height: '18px', 
          border: '1px solid rgba(156, 163, 175, 0.2)' 
        }}
      ></div>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="rounded-full bg-gray-100 dark:bg-gray-800 transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      style={{ 
        width: '18px', 
        height: '18px', 
        border: '1px solid rgba(156, 163, 175, 0.5)' 
      }}
    ></button>
  );
} 