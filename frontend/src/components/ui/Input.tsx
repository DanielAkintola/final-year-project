import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      className={`px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 ${className}`}
      {...props}
    />
  ),
);

Input.displayName = "Input";
