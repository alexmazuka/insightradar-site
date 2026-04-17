"use client";

import { useState, ReactNode } from "react";
import TrialModal from "./TrialModal";

interface TrialCTAProps {
  children: ReactNode;
  className: string;
}

/**
 * Reusable client-side trigger for the trial request modal.
 * Wrap any label/children in a styled button that opens TrialModal.
 */
export default function TrialCTA({ children, className }: TrialCTAProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className}
      >
        {children}
      </button>
      <TrialModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
