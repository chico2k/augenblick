/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import React, { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from "../lib/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Zod validation schema for login form.
 * German error messages as per spec.
 */
export const loginValidationSchema = z.object({
  email: z
    .string({ required_error: "Bitte eine E-Mail angeben." })
    .email({ message: "Ungültige E-Mail" }),

  password: z
    .string({ required_error: "Bitte ein Passwort angeben." })
    .min(8, { message: "Mindestens 8 Zeichen" }),
});

type LoginFormData = z.infer<typeof loginValidationSchema>;

/**
 * Login form component with shadcn/ui styling.
 *
 * Features:
 * - Modern card-based design
 * - Email and password validation
 * - German language labels and error messages
 * - Generic error message for failed login (no user enumeration)
 * - Redirect to /office on successful login
 *
 * Note: No social login, "forgot password" or "register" links as per spec.
 */
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    mode: "onTouched",
    resolver: zodResolver(loginValidationSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoginError(null);
    setIsSubmitting(true);

    try {
      const result = await signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: "/office",
      });

      if (result.error) {
        // Generic error message - don't reveal if email exists
        setLoginError("Ungültige Anmeldedaten. Bitte überprüfen Sie Ihre E-Mail und Ihr Passwort.");
      } else {
        // Successful login - redirect to office
        router.push("/office");
      }
    } catch {
      // Network or unexpected error
      setLoginError("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bei Ihrem Konto anmelden</CardTitle>
          <CardDescription>
            Geben Sie Ihre E-Mail-Adresse und Ihr Passwort ein, um sich anzumelden
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              {/* Login Error Message */}
              {loginError && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                  {loginError}
                </div>
              )}

              {/* Email Field */}
              <div className="grid gap-2">
                <Label htmlFor="email">E-Mail</Label>
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="m@beispiel.de"
                  autoComplete="email"
                  className={cn(errors.email && "border-destructive")}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="grid gap-2">
                <Label htmlFor="password">Passwort</Label>
                <Input
                  {...register("password")}
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className={cn(errors.password && "border-destructive")}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-fuchsia-600 hover:bg-fuchsia-900 transition-none"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Wird angemeldet..." : "Anmelden"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginForm;
