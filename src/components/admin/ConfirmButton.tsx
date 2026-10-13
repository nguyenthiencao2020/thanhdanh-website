"use client";

/** Submit button that asks for confirmation before a destructive form action. */
export function ConfirmButton({ message, children, className }: { message: string; children: React.ReactNode; className?: string }) {
  return (
    <button
      type="submit"
      className={className ?? "text-sm font-medium text-brand-600 hover:underline"}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
