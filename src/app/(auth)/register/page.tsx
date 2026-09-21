import type { Metadata } from "next";

import { RegisterForm } from "@/features/auth/register-form";
import { constructMetadata } from "@/config/seo";

export const metadata: Metadata = constructMetadata({
  title: "Create account",
  description:
    "Create one Bhagya Commerce account — shop now, and add a store to the same account whenever you are ready.",
  path: "/register",
});

export default function RegisterPage() {
  return (
    <>
      <header className="mb-7 flex flex-col gap-2">
        <h1 className="text-heading-xl text-ink">Create your account</h1>
        <p className="text-body-sm text-ink-soft">
          One account for shopping and, if you ever want it, selling.
        </p>
      </header>
      <RegisterForm />
    </>
  );
}
