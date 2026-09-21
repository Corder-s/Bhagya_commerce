import { Info } from "lucide-react";
import * as React from "react";

/**
 * AuthNotice — the honest "this form is not wired yet" banner.
 *
 * Phase 1 ships real, accessible forms with real validation; what is missing is
 * the backend. Rather than fake a success screen, each auth route tells the user
 * exactly what is and is not implemented. Replaced by real API error surfacing
 * in Phase 2.
 */
export function AuthNotice({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 rounded-md border border-info/25 bg-info-surface px-3.5 py-3 text-caption text-info">
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p>
        {children ?? (
          <>
            Accounts, OTP delivery and sessions arrive in Phase 2. This form
            validates input and demonstrates every state, but does not create a
            session yet.
          </>
        )}
      </p>
    </div>
  );
}
