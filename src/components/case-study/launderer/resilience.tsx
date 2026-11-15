"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { LuCloud, LuPlug, LuPower, LuRotateCcw, LuServer, LuWifi, LuWifiOff } from "react-icons/lu";
import { TbDoor, TbWashMachine, TbWashTumbleDry } from "react-icons/tb";
import { EASE, Eyebrow, Reveal, serif, usePrefersReducedMotion } from "@/components/home/shared";
import { Canvas } from "../canvas";
import { ACCENT, usd } from "./tokens";

const W = 860;
const H = 410;

const KIOSKS = { 1: { cx: 240, cy: 206 }, 2: { cx: 620, cy: 206 } } as const;
const CLOUD = { cx: 430, cy: 44 };
const READERS = [
  { id: "W1", Icon: TbWashMachine, price: 350 },
  { id: "W2", Icon: TbWashMachine, price: 375 },
  { id: "W3", Icon: TbWashMachine, price: 350 },
  { id: "D1", Icon: TbWashTumbleDry, price: 125 },
  { id: "DR", Icon: TbDoor, price: 100 },
].map((r, i) => ({ ...r, cx: 90 + i * 170, cy: 370 }));

type KioskId = 1 | 2;
type Tone = "ok" | "warn" | "bad" | "info";
type Packet = { id: number; from: [number, number]; to: [number, number]; color: string; delay?: number };
type LogLine = { id: number; at: string; text: string; tone: Tone };

type Sim = {
  tick: number;
  k1: boolean;
  net: boolean;
  primary: KioskId;
  serving: KioskId;
  promoteAt: number | null;
  sales: number;
  outbox: number;
  synced: number;
  packets: Packet[];
  log: LogLine[];
};

const INITIAL: Sim = { tick: 0, k1: true, net: true, primary: 1, serving: 1, promoteAt: null, sales: 41250, outbox: 0, synced: 118, packets: [], log: [] };

const COLORS = { ok: ACCENT, warn: "#f59e0b", bad: "#f43f5e", info: "#9ca3af" };

let seq = 0;
const nextId = () => ++seq;

const clock = (tick: number) => {
  const s = 18 * 3600 + 2 * 60 + tick * 7;
  return `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor(s / 60) % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

const top = (k: KioskId): [number, number] => [KIOSKS[k].cx, KIOSKS[k].cy - 48];
const bottom = (k: KioskId): [number, number] => [KIOSKS[k].cx, KIOSKS[k].cy + 48];
const cloudPort = (k: KioskId): [number, number] => [CLOUD.cx + (k === 1 ? -70 : 70), CLOUD.cy + 34];

function addLog(sim: Sim, text: string, tone: Tone): LogLine[] {
  return [{ id: nextId(), at: clock(sim.tick), text, tone }, ...sim.log].slice(0, 6);
}

/** One second of store life: maybe a promotion, a customer tap, a sync. */
function step(prev: Sim, rand: number): Sim {
  let sim: Sim = { ...prev, tick: prev.tick + 1, packets: [...prev.packets] };

  // The standby's watchdog promotes it once the main database has been gone long enough,
  // and only while the store network still answers (so a cut cable can't make two mains).
  if (!sim.k1 && sim.primary === 1 && sim.promoteAt !== null && sim.tick >= sim.promoteAt) {
    sim = { ...sim, primary: 2, promoteAt: null };
    sim.log = addLog(sim, "Kiosk 2: main database unreachable, network fine → promoted itself to main", "info");
  }

  // A customer taps a card about two seconds in three.
  if (rand < 0.66) {
    const r = READERS[Math.floor((rand / 0.66) * READERS.length) % READERS.length];
    const from: [number, number] = [r.cx, r.cy - 30];
    let target = sim.serving;
    if (target === 1 && !sim.k1) {
      sim.packets.push({ id: nextId(), from, to: bottom(1), color: COLORS.bad });
      sim.log = addLog(sim, `${r.id}: kiosk 1 not answering → trying kiosk 2`, "bad");
      sim.serving = 2;
      target = 2;
    }
    const delay = sim.packets.length && sim.packets[sim.packets.length - 1].color === COLORS.bad ? 0.55 : 0;
    // Kiosk 2 writes to the main database. While kiosk 1's is gone and kiosk 2's isn't promoted yet, it can't take money.
    const dbReady = sim.k1 || sim.primary === 2;
    if (dbReady) {
      sim.packets.push({ id: nextId(), from, to: bottom(target), color: COLORS.ok, delay });
      sim = { ...sim, sales: sim.sales + r.price, outbox: sim.outbox + 1 };
      sim.log = addLog(sim, `${r.id}: card ••${4000 + Math.floor(rand * 999)} paid ${usd(r.price)} via kiosk ${target}`, "ok");
    } else {
      sim.packets.push({ id: nextId(), from, to: bottom(target), color: COLORS.warn, delay });
      sim.log = addLog(sim, `${r.id}: kiosk 2 waiting for its database → reader shows "Try again"`, "warn");
    }
  }

  // The main kiosk's sync worker ships the outbox whenever the internet is there.
  if (sim.net && sim.outbox > 0) {
    const main = sim.primary;
    sim.packets.push({ id: nextId(), from: top(main), to: cloudPort(main), color: "#ffffff", delay: 0.3 });
    if (sim.outbox > 2) sim.log = addLog(sim, `Back online: ${sim.outbox} queued events synced, none lost`, "info");
    sim = { ...sim, synced: sim.synced + sim.outbox, outbox: 0 };
  }

  return sim;
}

function KioskNode({ id, sim }: { id: KioskId; sim: Sim }) {
  const on = id === 2 || sim.k1;
  const main = sim.primary === id;
  const promoting = id === 2 && !sim.k1 && sim.primary === 1;
  const role = !on ? "no power" : promoting ? "promoting…" : main ? "main database" : "standby replica";
  return (
    <motion.div
      className="absolute rounded-2xl border p-4"
      style={{ left: KIOSKS[id].cx - 120, top: KIOSKS[id].cy - 48, width: 240, height: 96 }}
      animate={{
        opacity: on ? 1 : 0.4,
        borderColor: main && on ? "rgba(46,107,255,0.7)" : "rgba(255,255,255,0.12)",
        background: main && on ? "rgba(46,107,255,0.12)" : "rgba(255,255,255,0.04)",
      }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-xl bg-white/10">{on ? <LuServer className="size-4" /> : <LuPower className="size-4 text-rose-400" />}</span>
        <div className="leading-tight">
          <p className="text-[15px] font-semibold">Kiosk {id}</p>
          <p className="font-mono text-[10.5px] text-white/50">Raspberry Pi · 10.0.0.1{id}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <AnimatePresence mode="wait">
          <motion.span
            key={role}
            className={`rounded-full px-2 py-0.5 font-mono text-[10.5px] ${!on ? "bg-rose-500/15 text-rose-300" : promoting ? "bg-amber-400/15 text-amber-300" : main ? "text-white" : "bg-white/10 text-white/60"}`}
            style={main && on ? { background: ACCENT } : undefined}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
          >
            {role}
          </motion.span>
          {main && on && <span className="font-mono text-[10.5px] text-white/50">runs sync</span>}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function Diagram({ sim, onPacketDone, reduced }: { sim: Sim; onPacketDone: (id: number) => void; reduced: boolean }) {
  return (
    <Canvas width={W} height={H}>
      <svg className="absolute inset-0 overflow-visible" width={W} height={H}>
        {/* Readers to kiosks: the one each reader uses now is solid. */}
        {READERS.map((r) =>
          ([1, 2] as const).map((k) => {
            const used = sim.serving === k;
            return (
              <line
                key={`${r.id}-${k}`}
                x1={r.cx}
                y1={r.cy - 30}
                x2={KIOSKS[k].cx}
                y2={KIOSKS[k].cy + 48}
                stroke="#fff"
                strokeOpacity={used ? 0.28 : 0.07}
                strokeWidth={used ? 1.4 : 1}
                strokeDasharray={used ? undefined : "3 5"}
                style={{ transition: "stroke-opacity .5s" }}
              />
            );
          }),
        )}
        {/* Replication between the two databases. */}
        <line x1={360} y1={206} x2={500} y2={206} stroke="#fff" strokeOpacity={sim.k1 ? 0.35 : 0.08} strokeDasharray="4 5" className={sim.k1 ? "[animation:mt-dash_1.2s_linear_infinite]" : ""} />
        {/* Kiosks to cloud. */}
        {([1, 2] as const).map((k) => {
          const [x1, y1] = top(k);
          const [x2, y2] = cloudPort(k);
          const main = sim.primary === k;
          return (
            <path
              key={k}
              d={`M${x1} ${y1} C${x1} ${y1 - 40} ${x2} ${y2 + 40} ${x2} ${y2}`}
              fill="none"
              stroke={sim.net ? "#fff" : "#f43f5e"}
              strokeOpacity={sim.net ? (main ? 0.35 : 0.1) : 0.5}
              strokeDasharray={sim.net && main ? undefined : "4 5"}
              style={{ transition: "stroke-opacity .5s, stroke .5s" }}
            />
          );
        })}
        {!reduced &&
          sim.packets.map((p) => (
            <motion.circle
              key={p.id}
              r={4.5}
              fill={p.color}
              initial={{ cx: p.from[0], cy: p.from[1], opacity: 0 }}
              animate={{ cx: p.to[0], cy: p.to[1], opacity: [0, 1, 1, p.color === COLORS.ok || p.color === "#ffffff" ? 1 : 0] }}
              transition={{ duration: 0.7, ease: "easeInOut", delay: p.delay ?? 0 }}
              onAnimationComplete={() => onPacketDone(p.id)}
              style={{ filter: `drop-shadow(0 0 6px ${p.color})` }}
            />
          ))}
      </svg>

      <span className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-[#0E1116] px-2 py-0.5 font-mono text-[10px] text-white/50" style={{ left: 430, top: 206 }}>
        {sim.k1 ? "replication" : "replica lost"}
      </span>

      {/* Cloud */}
      <div className="absolute flex items-center gap-3 rounded-2xl border border-white/12 bg-white/[0.06] px-4" style={{ left: CLOUD.cx - 150, top: CLOUD.cy - 34, width: 300, height: 68 }}>
        <span className="flex size-9 items-center justify-center rounded-xl bg-white text-[#111]">
          <LuCloud className="size-4" />
        </span>
        <div className="leading-tight">
          <p className="text-[15px] font-semibold">Launderer cloud</p>
          <p className="font-mono text-[10.5px] text-white/50">{sim.synced} events received</p>
        </div>
        <span className={`ml-auto flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] ${sim.net ? "bg-emerald-400/15 text-emerald-300" : "bg-rose-500/15 text-rose-300"}`}>
          {sim.net ? <LuWifi className="size-3" /> : <LuWifiOff className="size-3" />}
          {sim.net ? "online" : "offline"}
        </span>
      </div>

      <KioskNode id={1} sim={sim} />
      <KioskNode id={2} sim={sim} />

      {READERS.map((r) => (
        <div key={r.id} className="absolute flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3" style={{ left: r.cx - 64, top: r.cy - 30, width: 128, height: 60 }}>
          <r.Icon className="size-5 text-white/70" />
          <div className="leading-tight">
            <p className="text-[13px] font-semibold">{r.id}</p>
            <p className="font-mono text-[10px] text-white/45">{usd(r.price)}</p>
          </div>
        </div>
      ))}
    </Canvas>
  );
}

export default function Resilience() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { margin: "-15% 0px" });
  const reduced = usePrefersReducedMotion();
  const [sim, setSim] = useState<Sim>(INITIAL);

  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => {
      const rand = Math.random();
      // Without motion there are no packets to animate, so none are kept.
      setSim((s) => (reduced ? { ...step(s, rand), packets: [] } : step(s, rand)));
    }, 1100);
    return () => clearInterval(id);
  }, [visible, reduced]);

  const removePacket = (id: number) => setSim((s) => ({ ...s, packets: s.packets.filter((p) => p.id !== id) }));

  const togglePower = () =>
    setSim((s) => {
      if (s.k1) {
        const next = { ...s, k1: false, promoteAt: s.primary === 1 ? s.tick + 4 : null };
        return { ...next, log: addLog(next, "Kiosk 1 lost power", "bad") };
      }
      const next = { ...s, k1: true, promoteAt: null };
      const text = s.primary === 2 ? "Kiosk 1 back: rejoins as a standby of kiosk 2" : "Kiosk 1 back";
      return { ...next, log: addLog(next, text, "info") };
    });

  const toggleNet = () =>
    setSim((s) => {
      const next = { ...s, net: !s.net };
      return { ...next, log: addLog(next, s.net ? "Internet down: the store keeps selling, sync waits" : "Internet back", s.net ? "warn" : "info") };
    });

  const broken = !sim.k1 || !sim.net;

  return (
    <section id="resilience" className="px-2 pt-24 md:px-4 md:pt-36">
      <div ref={ref} className="relative mx-auto max-w-[88rem] overflow-hidden rounded-[2.25rem] bg-[#0E1116] px-4 py-20 text-white md:rounded-[3rem] md:px-8 md:py-28">
        <div className="pointer-events-none absolute -left-32 top-0 size-[30rem] rounded-full opacity-20 blur-[120px]" style={{ background: ACCENT }} />
        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <Eyebrow index="03" dark accent={ACCENT}>
                Resilience
              </Eyebrow>
              <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-6xl">
                <Reveal>
                  Built to <span className={serif}>keep selling.</span>
                </Reveal>
              </h2>
            </div>
            <p className="max-w-sm text-white/60">A laundromat can&apos;t close because a Pi died or the internet dropped. This is a live model of one store. Break it and watch it recover.</p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_290px]">
            <div className="flex items-center rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-4 md:p-6">
              <Diagram sim={sim} onPacketDone={removePacket} reduced={reduced} />
            </div>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={togglePower}
                  className={`flex flex-col items-start gap-3 rounded-2xl border p-4 text-left text-[13px] font-medium transition-colors ${sim.k1 ? "border-white/10 bg-white/[0.04] hover:bg-white/[0.08]" : "border-rose-400/40 bg-rose-500/10"}`}
                >
                  {sim.k1 ? <LuPower className="size-5 text-rose-300" /> : <LuPlug className="size-5 text-emerald-300" />}
                  {sim.k1 ? "Pull the plug on kiosk 1" : "Plug kiosk 1 back in"}
                </button>
                <button
                  type="button"
                  onClick={toggleNet}
                  className={`flex flex-col items-start gap-3 rounded-2xl border p-4 text-left text-[13px] font-medium transition-colors ${sim.net ? "border-white/10 bg-white/[0.04] hover:bg-white/[0.08]" : "border-amber-400/40 bg-amber-500/10"}`}
                >
                  {sim.net ? <LuWifiOff className="size-5 text-amber-300" /> : <LuWifi className="size-5 text-emerald-300" />}
                  {sim.net ? "Cut the internet" : "Reconnect"}
                </button>
              </div>

              <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 text-center">
                {[
                  { k: "Sales", v: usd(sim.sales) },
                  { k: "Outbox", v: String(sim.outbox), warn: sim.outbox > 0 && !sim.net },
                  { k: "Synced", v: String(sim.synced) },
                ].map((m) => (
                  <div key={m.k} className="bg-[#0E1116] px-2 py-3">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">{m.k}</dt>
                    <dd className={`mt-1 font-mono text-[15px] font-semibold tabular-nums ${m.warn ? "text-amber-300" : ""}`}>{m.v}</dd>
                  </div>
                ))}
              </dl>

              <div className="min-h-[200px] flex-1 rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">Store log</p>
                  {broken || sim.primary === 2 ? (
                    <button type="button" onClick={() => setSim(INITIAL)} className="flex items-center gap-1 font-mono text-[10px] text-white/50 transition-colors hover:text-white">
                      <LuRotateCcw className="size-3" /> reset
                    </button>
                  ) : null}
                </div>
                <ul className="mt-3 space-y-2">
                  <AnimatePresence initial={false}>
                    {sim.log.map((l) => (
                      <motion.li
                        key={l.id}
                        className="flex gap-2.5 text-[12px] leading-snug"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                      >
                        <span className="mt-[5px] size-1.5 shrink-0 rounded-full" style={{ background: COLORS[l.tone] === ACCENT ? "#6f98ff" : COLORS[l.tone] }} />
                        <span className="text-white/75">
                          <span className="font-mono text-[10.5px] text-white/35">{l.at}</span> {l.text}
                        </span>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                  {sim.log.length === 0 && <li className="text-[12px] text-white/35">Customers are tapping cards…</li>}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 text-sm text-white/60 md:grid-cols-3">
            {[
              { t: "Readers fail over", b: "Each reader knows every kiosk's address. When its kiosk stops answering, it moves to the next one on its own." },
              { t: "Databases promote themselves", b: "A watchdog on each standby promotes it when the main database is gone, but only if the store network still answers, so a cut cable can't make two mains." },
              { t: "Nothing is lost offline", b: "Sales are recorded at the store. The outbox waits for the internet, and the cloud ignores anything it already has." },
            ].map((x) => (
              <div key={x.t} className="border-t border-white/10 pt-4">
                <p className="font-medium text-white">{x.t}</p>
                <p className="mt-1.5 leading-relaxed">{x.b}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
