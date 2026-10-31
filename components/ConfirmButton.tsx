"use client";

import { useEffect, useRef, useState } from "react";
import { DANGER_BUTTON_CLASS, SECONDARY_BUTTON_CLASS } from "@/lib/styles";

const CONFIRM_WINDOW_MS = 3000;

interface ConfirmButtonProps {
  label: string;
  onConfirm: () => void;
  confirmLabel?: string;
  disabled?: boolean;
}

export function ConfirmButton({
  label,
  onConfirm,
  confirmLabel = "Click again to confirm",
  disabled = false,
}: ConfirmButtonProps) {
  const [armed, setArmed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const handleClick = () => {
    if (timer.current) clearTimeout(timer.current);
    if (armed) {
      setArmed(false);
      onConfirm();
      return;
    }
    setArmed(true);
    timer.current = setTimeout(() => setArmed(false), CONFIRM_WINDOW_MS);
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className={armed ? DANGER_BUTTON_CLASS : SECONDARY_BUTTON_CLASS}
    >
      {armed ? confirmLabel : label}
    </button>
  );
}
