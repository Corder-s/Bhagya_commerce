"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useCheckout } from "../checkout-context";
import { INDIAN_STATES } from "../checkout-utils";
import type { Address } from "../checkout-types";

const EMPTY_ADDRESS: Address = {
  fullName: "", phone: "", addressLine1: "", addressLine2: "",
  landmark: "", city: "", state: "", postalCode: "", country: "India", addressType: "home",
};

interface FieldError { [key: string]: string | undefined }

function validate(addr: Address): FieldError {
  const e: FieldError = {};
  if (!addr.fullName || addr.fullName.trim().length < 2) e.fullName = "Full name is required (min 2 chars).";
  const cleanPhone = addr.phone.replace(/[\s\-\+]/g, "").replace(/^91/, "");
  if (!cleanPhone) e.phone = "Phone number is required.";
  else if (!/^[6-9]\d{9}$/.test(cleanPhone)) e.phone = "Enter a valid 10-digit Indian mobile number.";
  if (!addr.addressLine1 || addr.addressLine1.trim().length < 5) e.addressLine1 = "Street address is required (min 5 chars).";
  if (!addr.city || addr.city.trim().length < 2) e.city = "City is required.";
  if (!addr.state) e.state = "Please select your state.";
  if (!/^\d{6}$/.test(addr.postalCode?.trim() ?? "")) e.postalCode = "Enter a valid 6-digit PIN code.";
  return e;
}

function AddressForm({
  initial, onSave, onCancel, submitLabel,
}: { initial: Address; onSave: (addr: Address) => void; onCancel?: () => void; submitLabel?: string }) {
  const [addr, setAddr] = useState<Address>(initial);
  const [errors, setErrors] = useState<FieldError>({});
  const [touched, setTouched] = useState<FieldError>({});

  const set = (key: keyof Address, val: string) => {
    setAddr((p) => ({ ...p, [key]: val }));
    if (touched[key]) {
      const errs = validate({ ...addr, [key]: val });
      setErrors((p) => ({ ...p, [key]: errs[key] }));
    }
  };

  const blur = (key: keyof Address) => {
    setTouched((p) => ({ ...p, [key]: "1" }));
    setErrors((p) => ({ ...p, [key]: validate(addr)[key] }));
  };

  const handleSubmit = () => {
    const errs = validate(addr);
    setErrors(errs);
    const allTouched: FieldError = {};
    Object.keys(errs).forEach((k) => (allTouched[k] = "1"));
    setTouched(allTouched);
    if (Object.keys(errs).length === 0) onSave(addr);
  };

  const inputClass = (key: string) =>
    `w-full px-4 py-3 rounded-xl bg-surface border text-ink placeholder:text-ink-subtle text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/20 ${
      errors[key] && touched[key] ? "border-red-500 focus:border-red-500" : "border-line focus:border-primary"
    }`;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(["home", "work", "other"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => set("addressType", t)}
            className={`py-2 px-4 rounded-xl text-sm font-semibold border transition-all duration-200 capitalize cursor-pointer ${
              addr.addressType === t
                ? "border-primary bg-gold-soft/30 dark:bg-gold/15 text-gold-dark dark:text-gold shadow-xs"
                : "border-line bg-surface text-ink-soft hover:border-primary"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-ink mb-1">Full Name *</label>
          <input value={addr.fullName} onChange={(e) => set("fullName", e.target.value)} onBlur={() => blur("fullName")} placeholder="Recipient's full name" className={inputClass("fullName")} />
          {errors.fullName && touched.fullName && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.fullName}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-ink mb-1">Phone *</label>
          <input value={addr.phone} onChange={(e) => set("phone", e.target.value)} onBlur={() => blur("phone")} placeholder="+91 98765 43210" className={inputClass("phone")} />
          {errors.phone && touched.phone && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.phone}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-ink mb-1">Address Line 1 *</label>
        <input value={addr.addressLine1} onChange={(e) => set("addressLine1", e.target.value)} onBlur={() => blur("addressLine1")} placeholder="House / Flat / Street" className={inputClass("addressLine1")} />
        {errors.addressLine1 && touched.addressLine1 && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.addressLine1}</p>}
      </div>
      <div>
        <label className="block text-xs font-semibold text-ink mb-1">Address Line 2</label>
        <input value={addr.addressLine2 ?? ""} onChange={(e) => set("addressLine2", e.target.value)} placeholder="Apartment / Block (optional)" className={inputClass("addressLine2")} />
      </div>
      <div>
        <label className="block text-xs font-semibold text-ink mb-1">Landmark</label>
        <input value={addr.landmark ?? ""} onChange={(e) => set("landmark", e.target.value)} placeholder="Near landmark (optional)" className={inputClass("landmark")} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-ink mb-1">City *</label>
          <input value={addr.city} onChange={(e) => set("city", e.target.value)} onBlur={() => blur("city")} placeholder="City / District" className={inputClass("city")} />
          {errors.city && touched.city && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.city}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-ink mb-1">State *</label>
          <select value={addr.state} onChange={(e) => set("state", e.target.value)} onBlur={() => blur("state")} className={inputClass("state")}>
            <option value="">Select state</option>
            {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.state && touched.state && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.state}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-ink mb-1">PIN Code *</label>
          <input value={addr.postalCode} onChange={(e) => set("postalCode", e.target.value)} onBlur={() => blur("postalCode")} placeholder="6-digit PIN" maxLength={6} className={inputClass("postalCode")} />
          {errors.postalCode && touched.postalCode && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.postalCode}</p>}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={handleSubmit} className="flex-1 py-3 px-6 rounded-xl bg-gradient-btn-gold text-[#151515] font-bold text-sm transition-all duration-200 shadow-md shadow-primary/20 hover:brightness-105 active:scale-[0.99] cursor-pointer">
          {submitLabel ?? "Save Address"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-6 py-3 rounded-xl border border-line bg-surface text-ink hover:bg-canvas-deep text-sm font-medium transition-all duration-200 cursor-pointer">
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

export function AddressStep() {
  const { savedAddresses, selectedAddressId, isAddingNewAddress, setShippingAddress, selectSavedAddress, setIsAddingNewAddress, addNewSavedAddress, goToNextStep, goToPreviousStep } = useCheckout();

  async function handleSave(addr: Address) {
    await addNewSavedAddress(addr);
    setShippingAddress(addr);
    setIsAddingNewAddress(false);
    goToNextStep();
  }

  function handleSelectAndContinue(addr: Address) {
    selectSavedAddress(addr.id!);
    setShippingAddress(addr);
    goToNextStep();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-ink mb-1">Delivery Address</h2>
        <p className="text-sm text-ink-soft">Select a saved address or add a new one.</p>
      </div>

      {!isAddingNewAddress && (
        <>
          {savedAddresses.length > 0 && (
            <div className="space-y-3">
              {savedAddresses.map((addr) => (
                <button
                  key={addr.id}
                  type="button"
                  onClick={() => handleSelectAndContinue(addr)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                    selectedAddressId === addr.id
                      ? "border-primary bg-gold-soft/20 dark:bg-gold/10 shadow-xs ring-1 ring-primary"
                      : "border-line bg-surface hover:border-primary/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-ink">{addr.fullName}</span>
                        {addr.addressType && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-canvas-deep text-ink-soft font-semibold capitalize">{addr.addressType}</span>
                        )}
                        {addr.isDefault && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gold-soft/30 dark:bg-gold/15 text-gold-dark dark:text-gold font-bold">Default</span>
                        )}
                      </div>
                      <p className="text-sm text-ink-soft leading-relaxed">
                        {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                        {addr.landmark ? `, Near ${addr.landmark}` : ""}
                        <br />
                        {addr.city}, {addr.state} – {addr.postalCode}
                      </p>
                      <p className="text-xs text-ink-subtle mt-1">{addr.phone}</p>
                    </div>
                    <div className={`mt-1 size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${selectedAddressId === addr.id ? "border-primary bg-primary" : "border-line-strong"}`}>
                      {selectedAddressId === addr.id && <div className="size-2 rounded-full bg-[#151515]" />}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsAddingNewAddress(true)}
            className="w-full py-3 rounded-xl border border-dashed border-primary text-gold-dark dark:text-gold bg-surface hover:bg-gold-soft/20 text-sm font-semibold transition-all duration-200 cursor-pointer"
          >
            + Add New Address
          </button>

          {savedAddresses.length > 0 && (
            <div className="flex gap-3">
              <button type="button" onClick={goToPreviousStep} className="px-6 py-3 rounded-xl border border-line bg-surface text-ink hover:bg-canvas-deep text-sm font-medium transition-all duration-200 cursor-pointer">
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (selectedAddressId) {
                    const addr = savedAddresses.find((a) => a.id === selectedAddressId);
                    if (addr) handleSelectAndContinue(addr);
                  }
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-btn-gold text-[#151515] font-bold text-sm transition-all duration-200 shadow-md shadow-primary/20 hover:brightness-105 active:scale-[0.99] cursor-pointer"
              >
                Continue to Delivery <ChevronRight className="size-4" />
              </button>
            </div>
          )}
        </>
      )}

      {isAddingNewAddress && (
        <AddressForm
          initial={EMPTY_ADDRESS}
          onSave={handleSave}
          onCancel={savedAddresses.length > 0 ? () => setIsAddingNewAddress(false) : undefined}
          submitLabel="Save & Continue"
        />
      )}
    </div>
  );
}
