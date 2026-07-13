"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  floating?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      floating = false,
      id,
      onFocus,
      onBlur,
      onChange,
      value,
      defaultValue,
      placeholder,
      ...props
    },
    ref
  ) => {
    const inputId = React.useId();
    const activeId = id || inputId;

    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);
    const innerRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);

    React.useEffect(() => {
      if (innerRef.current) {
        setHasValue(innerRef.current.value.length > 0);
      }
    }, [value, defaultValue]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      if (onFocus) onFocus(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      if (innerRef.current) {
        setHasValue(innerRef.current.value.length > 0);
      }
      if (onBlur) onBlur(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      if (onChange) onChange(e);
    };

    const showFloatingLabel = floating && label;

    return (
      <div className="w-full flex flex-col gap-1.5">
        <div className="relative w-full flex items-center">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3.5 text-charcoal-400 dark:text-foreground/40 pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            type={type}
            id={activeId}
            ref={innerRef}
            placeholder={showFloatingLabel ? " " : placeholder}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            value={value}
            defaultValue={defaultValue}
            className={cn(
              "w-full rounded-xl border border-input bg-background text-foreground text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary disabled:cursor-not-allowed disabled:bg-secondary/50",
              // Sizing
              showFloatingLabel ? "h-14 pt-5 pb-1.5 px-4" : "h-11 px-4 py-2.5",
              leftIcon && (showFloatingLabel ? "pl-11" : "pl-11"),
              rightIcon && "pr-11",
              // Error state
              error
                ? "border-destructive focus:ring-destructive/30 focus:border-destructive"
                : "border-border",
              className
            )}
            {...props}
          />

          {/* Floating or Standard Label */}
          {label && (
            <label
              htmlFor={activeId}
              className={cn(
                "pointer-events-none transition-all duration-200 select-none",
                showFloatingLabel
                  ? cn(
                      "absolute left-4 text-xs text-charcoal-400 dark:text-foreground/40",
                      leftIcon && "left-11",
                      isFocused || hasValue
                        ? "top-1.5 scale-90 translate-y-0 text-primary dark:text-ring"
                        : "top-1/2 -translate-y-1/2 text-sm"
                    )
                  : "sr-only" // if label is provided but floating=false, we keep standard label above the container or rely on sr-only (we handle standard label below)
              )}
            >
              {label}
            </label>
          )}

          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute right-3.5 text-charcoal-400 dark:text-foreground/40">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Standard Label fallback for non-floating */}
        {!floating && label && (
          <label
            htmlFor={activeId}
            className="text-xs font-semibold text-charcoal-700 dark:text-foreground/75 order-first"
          >
            {label}
          </label>
        )}

        {/* Helper Text or Error Messages */}
        {error ? (
          <p className="text-xs font-medium text-destructive dark:text-red-400 animate-fade-in">
            {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-charcoal-400 dark:text-foreground/45">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
