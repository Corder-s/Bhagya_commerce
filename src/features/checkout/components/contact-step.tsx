"use client";

import { useState } from "react";
import { Mail, Phone, ChevronRight } from "lucide-react";
import { useCheckout } from "../checkout-context";

export function ContactStep() {
  const { contact, updateContact, goToNextStep } = useCheckout();
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});
  const [touched, setTouched] = useState<{ email?: boolean; phone?: boolean }>({});

  function validate(field: "email" | "phone", value: string) {
    if (field === "email") {
      if (!value.trim()) return "Email address is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email (e.g. name@example.com).";
    }
    if (field === "phone") {
      const clean = value.replace(/[\s\-\+]/g, "").replace(/^91/, "");
      if (!clean) return "Phone number is required.";
      if (!/^[6-9]\d{9}$/.test(clean)) return "Enter a valid 10-digit Indian mobile number.";
    }
    return undefined;
  }

  function handleBlur(field: "email" | "phone") {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validate(field, contact[field]);
    setErrors((prev) => ({ ...prev, [field]: err }));
  }

  function handleChange(field: "email" | "phone", value: string) {
    updateContact({ [field]: value });
    if (touched[field]) {
      const err = validate(field, value);
      setErrors((prev) => ({ ...prev, [field]: err }));
    }
  }

  function handleContinue() {
    const emailErr = validate("email", contact.email);
    const phoneErr = validate("phone", contact.phone);
    setErrors({ email: emailErr, phone: phoneErr });
    setTouched({ email: true, phone: true });
    if (!emailErr && !phoneErr) goToNextStep();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-ink mb-1">Contact Details</h2>
        <p className="text-sm text-ink-soft">Used for order updates and delivery notifications.</p>
      </div>

      <div className="space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="contact-email" className="block text-sm font-semibold text-ink mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink-subtle pointer-events-none" />
            <input
              id="contact-email"
              type="email"
              autoComplete="email"
              value={contact.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              placeholder="you@example.com"
              className={`w-full pl-10 pr-4 py-3 rounded-xl bg-surface border text-ink placeholder:text-ink-subtle text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/20 ${
                errors.email && touched.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-line focus:border-primary"
              }`}
            />
          </div>
          {errors.email && touched.email && (
            <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="contact-phone" className="block text-sm font-semibold text-ink mb-1.5">
            Mobile Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink-subtle pointer-events-none" />
            <input
              id="contact-phone"
              type="tel"
              autoComplete="tel"
              value={contact.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              onBlur={() => handleBlur("phone")}
              placeholder="+91 98765 43210"
              className={`w-full pl-10 pr-4 py-3 rounded-xl bg-surface border text-ink placeholder:text-ink-subtle text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/20 ${
                errors.phone && touched.phone
                  ? "border-red-500 focus:border-red-500"
                  : "border-line focus:border-primary"
              }`}
            />
          </div>
          {errors.phone && touched.phone && (
            <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.phone}</p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={handleContinue}
        className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-btn-gold text-[#151515] font-bold text-sm transition-all duration-200 shadow-md shadow-primary/20 hover:brightness-105 active:scale-[0.99] cursor-pointer"
      >
        Continue to Address <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
