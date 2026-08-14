import React from "react";

import { CircleAlert, CircleCheck, Info, TriangleAlert, X, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/cn";
import { Typography } from "@/components/ui/Typography";

/**
 * SLDS **toast** (`.slds-notify_toast`) — the pill that drops in under the
 * Lightning header after an action: "Quote Q-10428 was submitted for approval."
 *
 * Salesforce's toast is a *solid-filled* bar, not the tinted inline box that
 * `ui/Callout` renders. That difference is the whole reason this exists: a
 * Salesforce screen that reports the outcome of an action should look like
 * Salesforce reporting it.
 *
 * ── When to use which ───────────────────────────────────────────────────────
 * `Toast` is transient feedback about something that just happened. `Callout`
 * is standing advisory attached to the record — and it is specifically the
 * warn-and-acknowledge component for a missing purchase order (guard-ok), which
 * must never become a toast, because a toast disappears and a warning the user
 * has to weigh must not. Constraint 2 in CLAUDE.md.
 *
 * Prototypes are static: this renders in place, does not dismiss, and the close
 * control is decoration.
 */

export type ToastVariant = "info" | "success" | "warning" | "error";

type VariantSpec = { icon: LucideIcon; className: string };

/**
 * SLDS theme fills. `warning` is the only one that takes dark text — its
 * orange is too light to carry white, which is exactly the trap the KeyShot
 * accent rule guards against on our own surfaces.
 */
const variantSpecs: Record<ToastVariant, VariantSpec> = {
  info: { icon: Info, className: "bg-sf-info text-sf-inverse" },
  success: { icon: CircleCheck, className: "bg-sf-success text-sf-inverse" },
  warning: { icon: TriangleAlert, className: "bg-sf-warning text-sf-text" },
  error: { icon: CircleAlert, className: "bg-sf-error text-sf-inverse" },
};

export type ToastProps = {
  /** The message. A fixed outcome phrase — static chrome, not a data value. */
  children: React.ReactNode;
  variant?: ToastVariant;
  /** Bold lead-in before the message. */
  title?: string;
  className?: string;
};

export function Toast({ children, variant = "info", title, className }: ToastProps) {
  const spec = variantSpecs[variant];
  const Icon = spec.icon;

  return (
    <div
      role="status"
      className={cn(
        "flex items-start gap-3 rounded-sf-md px-4 py-3 font-slds shadow-sm",
        spec.className,
        className
      )}
    >
      <Icon size={16} aria-hidden className="mt-0.5 shrink-0" />
      <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2">
        {title && (
          <Typography size="sm" bold className="text-current">
            {title}
          </Typography>
        )}
        <Typography as="div" size="sm" className="min-w-0 text-current">
          {children}
        </Typography>
      </div>
      <X size={14} aria-hidden className="mt-0.5 shrink-0 opacity-70" />
    </div>
  );
}
