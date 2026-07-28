import type { Metadata } from "next";
import { Logo } from "@/components/logo";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
          <h1 className="font-display text-2xl font-medium tracking-tight">Admin sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage bookings, quotes and website content.
          </p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          All Seasons Catering Company · Staff only
        </p>
      </div>
    </div>
  );
}
