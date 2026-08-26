"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  trigger: React.ReactNode;
  title: string;
  children: React.ReactNode;
  triggerClassName?: string;
}

/**
 * "Show your work" popover, rendered via portal so it escapes any
 * overflow-hidden ancestors. Positions itself above or below the trigger
 * based on available viewport space.
 */
export default function MethodologyPopover({
  trigger,
  title,
  children,
  triggerClassName,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    placement: "top" | "bottom";
  } | null>(null);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const POPOVER_WIDTH = 320;
    const POPOVER_HEIGHT_ESTIMATE = 220;
    const GAP = 8;
    const viewportH = window.innerHeight;
    const viewportW = window.innerWidth;

    // Decide vertical placement
    const spaceBelow = viewportH - rect.bottom;
    const spaceAbove = rect.top;
    const placement: "top" | "bottom" =
      spaceBelow >= POPOVER_HEIGHT_ESTIMATE + GAP || spaceBelow > spaceAbove
        ? "bottom"
        : "top";

    // Horizontal: right-align with trigger, but keep within viewport
    let left = rect.right - POPOVER_WIDTH;
    if (left < 16) left = 16;
    if (left + POPOVER_WIDTH > viewportW - 16) {
      left = viewportW - POPOVER_WIDTH - 16;
    }

    const top =
      placement === "bottom"
        ? rect.bottom + GAP
        : rect.top - GAP - POPOVER_HEIGHT_ESTIMATE;

    setCoords({ top, left, placement });
  };

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();
    const handler = () => updatePosition();
    window.addEventListener("scroll", handler, true);
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler, true);
      window.removeEventListener("resize", handler);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        popoverRef.current?.contains(target)
      ) {
        return;
      }
      setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex items-center gap-1 hover:text-navy transition-colors cursor-pointer group",
          triggerClassName
        )}
        aria-expanded={isOpen}
      >
        {trigger}
        <svg
          className="w-3 h-3 text-slate-300 group-hover:text-navy transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && coords && (
              <motion.div
                ref={popoverRef}
                initial={{ opacity: 0, y: coords.placement === "bottom" ? -4 : 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  y: coords.placement === "bottom" ? -4 : 4,
                }}
                transition={{ duration: 0.15 }}
                style={{
                  position: "fixed",
                  top: coords.top,
                  left: coords.left,
                  width: 320,
                  zIndex: 100,
                }}
                className="bg-white rounded-xl border border-slate-200 shadow-xl p-4"
                role="dialog"
                aria-label={title}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-bold text-slate-900">{title}</p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-slate-300 hover:text-slate-600 transition-colors flex-shrink-0"
                    aria-label="Close"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="text-xs text-slate-600 leading-relaxed space-y-2">
                  {children}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
