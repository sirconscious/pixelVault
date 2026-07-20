"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn, Loader2 } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validation";
import { loginAction } from "./actions";

export default function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: LoginInput) => {
    setServerError(null);
    const fd = new FormData();
    fd.set("email", values.email);
    fd.set("password", values.password);
    startTransition(async () => {
      const res = await loginAction({}, fd);
      // Only reached when the action returns (i.e. did not redirect on success).
      if (res?.error) setServerError(res.error);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {serverError && (
        <div role="alert" className="alert alert-error">
          <span>{serverError}</span>
        </div>
      )}

      <div className="form-control">
        <label className="label" htmlFor="email">
          <span className="label-text">Email</span>
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          className={`input input-bordered w-full ${errors.email ? "input-error" : ""}`}
          placeholder="admin@example.com"
          {...register("email")}
        />
        {errors.email && (
          <span className="mt-1 text-sm text-error">{errors.email.message}</span>
        )}
      </div>

      <div className="form-control">
        <label className="label" htmlFor="password">
          <span className="label-text">Password</span>
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className={`input input-bordered w-full ${errors.password ? "input-error" : ""}`}
          placeholder="••••••••"
          {...register("password")}
        />
        {errors.password && (
          <span className="mt-1 text-sm text-error">
            {errors.password.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={pending}
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <LogIn className="size-4" />
        )}
        Sign in
      </button>
    </form>
  );
}
