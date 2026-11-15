"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import type { IconType } from "react-icons";
import { LuBookOpen, LuCalendarDays, LuClipboardList, LuFiles, LuListChecks, LuMessageCircle, LuPhone, LuTimer } from "react-icons/lu";
import { VscChromeClose, VscChromeMaximize, VscChromeMinimize } from "react-icons/vsc";
import { EASE } from "@/components/home/shared";
import { C } from "./tokens";

export const WIN_W = 680;
export const WIN_H = 470;

export type TabId = "timer" | "tracking" | "phone" | "runner" | "wissen";

const TABS: { id: TabId | string; Icon: IconType }[] = [
  { id: "timer", Icon: LuTimer },
  { id: "tracking", Icon: LuListChecks },
  { id: "phone", Icon: LuPhone },
  { id: "runner", Icon: LuClipboardList },
  { id: "wissen", Icon: LuBookOpen },
  { id: "calendar", Icon: LuCalendarDays },
  { id: "chat", Icon: LuMessageCircle },
  { id: "docs", Icon: LuFiles },
];
const TAB_STEP = 42; // icon size + gap in the sidebar

/** The Windows desktop app's frame: title bar, sidebar rail and a page area. */
export function AppWindow({ tab, title, children }: { tab: TabId; title: string; children: React.ReactNode }) {
  const index = TABS.findIndex((t) => t.id === tab);
  return (
    <div
      className="flex flex-col overflow-hidden rounded-xl border"
      style={{
        width: WIN_W,
        height: WIN_H,
        background: C.canvas,
        borderColor: C.borderStrong,
        boxShadow: "0 50px 90px -40px rgba(67,42,23,0.45), 0 18px 40px -20px rgba(67,42,23,0.25)",
        color: C.text,
      }}
    >
      <div className="flex h-8 shrink-0 items-center justify-between border-b pl-3" style={{ background: C.chrome, borderColor: C.border }}>
        <div className="flex items-center gap-2 text-[11px]" style={{ color: C.muted }}>
          <Image src="/work/megatel-mark.png" alt="" width={18} height={13} />
          <span className="font-semibold" style={{ color: C.text }}>MegaTel</span>
          <span style={{ color: C.faint }}>/</span>
          <span className="relative inline-flex h-4 w-40 overflow-hidden">
            <AnimatePresence initial={false}>
              <motion.span
                key={title}
                className="absolute left-0"
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -12, opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                {title}
              </motion.span>
            </AnimatePresence>
          </span>
        </div>
        <div className="flex h-full items-center" style={{ color: C.muted }}>
          {[VscChromeMinimize, VscChromeMaximize, VscChromeClose].map((Icon, i) => (
            <span key={i} className="flex h-full w-10 items-center justify-center">
              <Icon className="size-3" />
            </span>
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="relative flex w-14 shrink-0 flex-col items-center border-r pt-3" style={{ background: C.chrome, borderColor: C.border }}>
          <motion.span
            className="absolute left-[10px] top-3 size-9 rounded-xl"
            style={{ background: C.accentSoft }}
            animate={{ y: index * TAB_STEP, opacity: index < 0 ? 0 : 1 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
          />
          <motion.span
            className="absolute left-0 top-3 h-9 w-[3px] rounded-r-full"
            style={{ background: C.brand }}
            animate={{ y: index * TAB_STEP, opacity: index < 0 ? 0 : 1 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
          />
          <div className="flex flex-col gap-1.5">
            {TABS.map(({ id, Icon }) => (
              <span
                key={id}
                className="relative flex size-9 items-center justify-center transition-colors duration-300"
                style={{ color: id === tab ? C.brand : C.faint }}
              >
                <Icon className="size-[17px]" />
              </span>
            ))}
          </div>
          <span className="mt-auto mb-3 flex size-8 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ background: C.brand }}>
            SK
          </span>
        </div>
        <div className="relative min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

/** A white card in the app's style. */
export function Panel({ className = "", style, children }: { className?: string; style?: React.CSSProperties; children: React.ReactNode }) {
  return (
    <div className={`rounded-2xl border bg-white ${className}`} style={{ borderColor: C.border, boxShadow: C.shadow, ...style }}>
      {children}
    </div>
  );
}

/** Small uppercase label used across the app. */
export function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-[9px] font-bold uppercase tracking-[0.14em] ${className}`} style={{ color: C.muted }}>
      {children}
    </p>
  );
}

export function Kbd({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <kbd
      className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-[5px] border px-1 font-mono text-[9px] font-semibold"
      style={dark ? { borderColor: "rgba(255,255,255,0.3)", color: "white" } : { borderColor: C.borderStrong, color: C.muted, background: C.chrome }}
    >
      {children}
    </kbd>
  );
}
