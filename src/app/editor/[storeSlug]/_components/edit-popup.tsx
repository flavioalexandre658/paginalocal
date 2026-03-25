"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface Props {
  title: string;
  anchorRect: DOMRect;
  onClose: () => void;
  onSave?: () => void;
  children: ReactNode;
  width?: number;
}

/**
 * Floating edit popup anchored below a target element.
 * Styled like a compact bottom-sheet with grab handle, matching
 * the Durable editor reference.
 */
export function EditPopup({ title, anchorRect, onClose, onSave, children, width = 340 }: Props) {
  const popupRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Close on click outside (delayed to avoid instant close)
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClick);
    }, 150);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [onClose]);

  // Position: centered below the anchor element
  const centerX = anchorRect.left + anchorRect.width / 2;
  const top = anchorRect.bottom + 16;

  // Keep within viewport
  let left = centerX - width / 2;
  left = Math.max(12, Math.min(left, window.innerWidth - width - 12));

  // If not enough space below, show above
  const spaceBelow = window.innerHeight - anchorRect.bottom;
  const useAbove = spaceBelow < 320;
  const finalTop = useAbove ? anchorRect.top - 16 : top;

  return createPortal(
    <div
      ref={popupRef}
      data-editor-ui
      style={{
        position: "fixed",
        top: finalTop,
        left,
        width,
        zIndex: 99999,
        ...(useAbove ? { transform: "translateY(-100%)" } : {}),
      }}
    >
      <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
        {/* Grab handle */}
        <div className="flex justify-center pt-2 pb-0">
          <div className="h-1 w-8 rounded-full bg-slate-300" />
        </div>

        {/* Header */}
        <div className="px-5 pt-3 pb-3">
          <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        </div>

        {/* Body */}
        <div className="px-5 pb-4">{children}</div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-5 py-3">
          <button
            onClick={onClose}
            className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave?.();
              onClose();
            }}
            className="rounded-lg bg-slate-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
