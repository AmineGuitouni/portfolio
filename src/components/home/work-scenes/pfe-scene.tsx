"use client";

import { AnimatePresence, motion } from "motion/react";
import { LuCheck, LuFileText, LuLock, LuMail, LuMic, LuTrophy } from "react-icons/lu";
import { Stage, during, useSceneClock } from "./stage";

// Palette from the project's designSheet.md / tailwind.config.ts and the agent's STYLING constants
const C = {
  bg: "#081e25", // dark_blue
  panel: "#212c30", // modal_bg
  light: "#8ab0e0", // light_blue
  accent: "#7dd5de", // light_blue-500
  border: "rgba(138,176,224,0.2)", // border-light_blue/20
  aiMsg: "rgba(138,176,224,0.1)", // bg-light_blue/10
  userMsg: "rgba(125,213,222,0.8)", // bg-light_blue-500/80
};
const GOLD = "linear-gradient(100deg,#e2b04a 0%,#fff3c4 45%,#f6d27a 55%,#c9932f 100%)";
const LOOP = 14;

type Tool = { id: string; at: number; acceptAt: number; name: string; params: [string, string][] };
const TOOLS: Tool[] = [
  { id: "t1", at: 1.6, acceptAt: 2.3, name: "create_project", params: [["name", "Mobile Banking App"]] },
  { id: "t2", at: 2.8, acceptAt: 3.3, name: "generate_tasks_for_project", params: [["project", "Mobile Banking App"]] },
  { id: "t3", at: 4.7, acceptAt: 5.3, name: "generate_task_assignments", params: [["source", "cv_informations"]] },
  { id: "t4", at: 8.6, acceptAt: 9.1, name: "send_email", params: [["to", "3 assignees"]] },
];

const PEOPLE = [
  { id: "lm", name: "Lina M.", role: "Frontend", skills: ["React", "Figma", "UX"], parsedAt: 1.0, y: 64 },
  { id: "yb", name: "Youssef B.", role: "Mobile", skills: ["Flutter", "Dart", "Firebase"], parsedAt: 1.4, y: 126 },
  { id: "sk", name: "Sara K.", role: "Backend", skills: ["Node.js", "PostgreSQL", "Auth"], parsedAt: 1.8, y: 188 },
];
const TASKS = [
  { id: "a", title: "Design onboarding flow", level: "Medium", at: 3.4, y: 64 },
  { id: "b", title: "Build Flutter screens", level: "Hard", at: 3.7, y: 112 },
  { id: "c", title: "Payments API", level: "Hard", at: 4.0, y: 160 },
  { id: "d", title: "Auth & RBAC", level: "Medium", at: 4.3, y: 208 },
];
// generate_task_assignments output: confidenceScore (1–100) + matchingSkills
const MATCHES = [
  { person: "lm", task: "a", score: 92, skill: "Figma", at: 5.7 },
  { person: "yb", task: "b", score: 95, skill: "Flutter", at: 6.3 },
  { person: "sk", task: "c", score: 88, skill: "Node.js", at: 6.9 },
  { person: "sk", task: "d", score: 84, skill: "Auth", at: 7.5 },
];
const LEVEL: Record<string, string> = { Medium: "#e8c66b", Hard: "#f08a7e" };

// Board geometry (right half of the stage)
const PX = 220; // people column x
const PW = 104;
const TX = 368; // task column x
const TW = 100;
const PH = 54;
const TH = 40;

function ToolCard({ tool, t }: { tool: Tool; t: number }) {
  const accepted = t >= tool.acceptAt;
  const pressing = during(t, tool.acceptAt - 0.25, tool.acceptAt);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border p-1.5 text-[6.5px] shadow-md"
      style={{ borderColor: C.border, background: C.aiMsg, color: "rgba(138,176,224,0.8)" }}
    >
      <p className="font-semibold" style={{ color: C.light }}>Tool Call: <span className="font-mono">{tool.name}</span></p>
      <p className="mt-0.5">Parameters:</p>
      {tool.params.map(([k, v]) => (
        <p key={k} className="pl-1.5">• <strong style={{ color: C.light }}>{k}:</strong> {v}</p>
      ))}
      <div className="mt-1 flex h-4 items-center gap-1">
        {accepted ? (
          <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-1 font-semibold" style={{ color: C.accent }}>
            <LuCheck className="size-2.5" /> Accepted · executed
          </motion.span>
        ) : (
          <>
            <motion.span animate={{ scale: pressing ? 0.9 : 1 }} className="rounded px-1.5 py-0.5 font-semibold" style={{ background: C.accent, color: C.bg }}>Accept</motion.span>
            <span className="rounded border px-1.5 py-0.5" style={{ borderColor: C.border, color: C.light }}>Reject</span>
          </>
        )}
      </div>
    </motion.div>
  );
}

/** The award-winning final-year project: a voice-driven, tool-calling agent that staffs projects from CVs. */
export default function PfeScene() {
  const { ref, t } = useSceneClock(LOOP, 9.4);

  const listening = during(t, 0.2, 1.3);
  const userText = t >= 1.3;
  const tools = TOOLS.filter((x) => t >= x.at);
  const aiDone = t >= 9.8;
  const project = t >= 2.4;
  const emailed = t >= 9.2;
  const fade = t >= 13.2;
  const audit = [...TOOLS].reverse().find((x) => t >= x.acceptAt);

  const personY = (id: string) => PEOPLE.find((p) => p.id === id)!.y + PH / 2;
  const taskY = (id: string) => TASKS.find((x) => x.id === id)!.y + TH / 2;

  return (
    <div ref={ref}>
      <Stage>
        <motion.div className="absolute inset-0 font-sans" style={{ background: C.bg, color: C.light }} animate={{ opacity: fade ? 0.4 : 1 }} transition={{ duration: 0.5 }}>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_75%_35%,rgba(125,213,222,0.12),transparent)]" />

          {/* Award + tenant header */}
          <div className="absolute inset-x-3 top-2.5 flex items-center justify-between">
            <span className="relative flex items-center gap-1.5 overflow-hidden rounded-full px-2.5 py-1 text-[7.5px] font-bold text-[#3a2a06] shadow-[0_0_18px_rgba(246,210,122,0.35)]" style={{ background: GOLD }}>
              <LuTrophy className="size-3" /> Best PFE Project · Ranked 1st · ISIMA 2025
              <motion.span
                className="absolute inset-y-0 w-8 -skew-x-12 bg-white/60 blur-[2px]"
                animate={{ left: ["-20%", "120%"] }}
                transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" }}
              />
            </span>
            <span className="flex items-center gap-1 rounded-full border px-2 py-0.5 text-[6.5px]" style={{ borderColor: C.border }}>
              <LuLock className="size-2.5" style={{ color: C.accent }} /> tenant: <strong>acme</strong> · role: Admin
            </span>
          </div>

          {/* Command Center chat */}
          <div className="absolute bottom-3 left-3 top-[34px] flex w-[196px] flex-col rounded-xl border" style={{ background: C.panel, borderColor: C.border, boxShadow: "0 20px 40px rgba(8,30,37,0.5)" }}>
            <div className="flex items-center justify-between border-b px-2 py-1.5" style={{ borderColor: C.border }}>
              <span className="text-[8.5px] font-bold">Command Center</span>
              <span className="flex items-center gap-1 text-[6px]" style={{ color: "rgba(138,176,224,0.7)" }}>
                Auto-accept
                <span className="relative h-2.5 w-4 rounded-full" style={{ background: "rgba(138,176,224,0.25)" }}>
                  <span className="absolute left-0.5 top-0.5 size-1.5 rounded-full" style={{ background: C.light }} />
                </span>
              </span>
            </div>

            {/* Messages: fixed window, newest anchored to the bottom */}
            <div className="relative min-h-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_18%)]">
              <div className="absolute inset-x-2 bottom-1.5 flex flex-col gap-1.5">
                <motion.div layout className="self-end rounded-xl rounded-br-sm px-2 py-1.5 text-[7px] font-medium" style={{ background: C.userMsg, color: C.bg, maxWidth: "88%" }}>
                  {userText ? (
                    <span>Create “Mobile Banking App”, generate its tasks and assign the best people.</span>
                  ) : (
                    <span className="flex h-3 items-center gap-[2px]">
                      <LuMic className="mr-1 size-2.5" />
                      {Array.from({ length: 18 }).map((_, i) => (
                        <motion.span key={i} className="w-[2px] rounded-full" style={{ background: C.bg }} animate={listening ? { height: [2, 3 + ((i * 5) % 8), 2] } : { height: 2 }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.04 }} />
                      ))}
                    </span>
                  )}
                </motion.div>
                <AnimatePresence initial={false}>
                  {tools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} t={t} />
                  ))}
                  {t >= 3.9 && t < 4.7 && (
                    <motion.p key="r2" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[6.5px]" style={{ color: C.accent }}>
                      ✓ 4 tasks generated with difficulty levels
                    </motion.p>
                  )}
                  {aiDone && (
                    <motion.div key="ai" layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl rounded-bl-sm px-2 py-1.5 text-[7px]" style={{ background: C.aiMsg, maxWidth: "92%" }}>
                      Done — 4 tasks assigned by CV match (avg. 90% confidence). The team has been emailed.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Input with live-listening mic */}
            <div className="m-2 mt-1 flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-[6.5px]" style={{ borderColor: C.border, color: "rgba(138,176,224,0.6)" }}>
              <span className="flex-1">{listening ? "Listening…" : "Ask the agent anything…"}</span>
              <span className="relative flex size-4 items-center justify-center rounded-full" style={{ background: listening ? C.accent : "rgba(138,176,224,0.15)", color: listening ? C.bg : C.light }}>
                {listening && <motion.span className="absolute inset-0 rounded-full" style={{ border: `1px solid ${C.accent}` }} animate={{ scale: [1, 1.8], opacity: [0.8, 0] }} transition={{ duration: 1, repeat: Infinity }} />}
                <LuMic className="size-2.5" />
              </span>
            </div>
          </div>

          {/* Project board: CVs → people, generated tasks, CV-based matching */}
          <AnimatePresence>
            {project && (
              <motion.div className="absolute left-[220px] top-[36px] flex w-[248px] items-center justify-between text-[7px]" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <span className="font-bold" style={{ color: "#e6f1ff" }}>Mobile Banking App</span>
                <span style={{ color: "rgba(138,176,224,0.7)" }}>team ⟷ tasks</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Assignment links with confidence scores */}
          <svg className="pointer-events-none absolute inset-0" width={480} height={300}>
            {MATCHES.map((m) => {
              if (t < m.at) return null;
              const y1 = personY(m.person);
              const y2 = taskY(m.task);
              const x1 = PX + PW;
              const x2 = TX;
              const mx = (x1 + x2) / 2;
              return (
                <g key={m.person + m.task}>
                  <motion.path
                    d={`M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`}
                    fill="none"
                    stroke={C.accent}
                    strokeWidth="1.6"
                    initial={{ pathLength: 0, opacity: 0.4 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{ filter: `drop-shadow(0 0 4px ${C.accent})` }}
                  />
                </g>
              );
            })}
          </svg>
          {MATCHES.map((m) =>
            t >= m.at + 0.3 ? (
              <motion.span
                key={`s-${m.person}${m.task}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-1.5 py-0.5 font-mono text-[7px] font-bold"
                style={{ left: (PX + PW + TX) / 2, top: (personY(m.person) + taskY(m.task)) / 2, background: C.bg, color: C.accent, border: `1px solid ${C.accent}` }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 380, damping: 16 }}
              >
                {m.score}%
              </motion.span>
            ) : null,
          )}

          {/* People: CV.pdf parsed into structured skills */}
          {PEOPLE.map((p) => {
            const parsed = t >= p.parsedAt;
            const scanning = during(t, 0.3, p.parsedAt);
            const matchedSkills = MATCHES.filter((m) => m.person === p.id && t >= m.at).map((m) => m.skill);
            return (
              <div key={p.id} className="absolute overflow-hidden rounded-lg border" style={{ left: PX, top: p.y, width: PW, height: PH, borderColor: C.border, background: C.panel }}>
                <AnimatePresence mode="wait" initial={false}>
                  {!parsed ? (
                    <motion.div key="cv" className="flex h-full items-center gap-2 px-2 text-[7px]" exit={{ opacity: 0, rotateX: 90 }} transition={{ duration: 0.25 }}>
                      <LuFileText className="size-5" style={{ color: C.light }} />
                      <span>
                        <span className="block font-semibold">cv_{p.id}.pdf</span>
                        <span style={{ color: "rgba(138,176,224,0.6)" }}>{scanning ? "extracting…" : "uploaded"}</span>
                      </span>
                      {scanning && <motion.span className="absolute inset-x-0 h-4 bg-gradient-to-b from-transparent via-[#7dd5de55] to-transparent" animate={{ top: [-16, PH] }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} />}
                    </motion.div>
                  ) : (
                    <motion.div key="profile" className="h-full p-1.5" initial={{ opacity: 0, rotateX: -90 }} animate={{ opacity: 1, rotateX: 0 }} transition={{ duration: 0.3 }}>
                      <div className="flex min-w-0 items-center gap-1.5">
                        <span className="flex size-4 shrink-0 items-center justify-center rounded-full text-[6px] font-bold" style={{ background: C.accent, color: C.bg }}>{p.name[0]}</span>
                        <span className="whitespace-nowrap text-[7px] font-semibold" style={{ color: "#e6f1ff" }}>{p.name}</span>
                        <span className="min-w-0 truncate text-[6px]" style={{ color: "rgba(138,176,224,0.6)" }}>{p.role}</span>
                        {emailed && (
                          <motion.span className="ml-auto" initial={{ scale: 0, y: -6 }} animate={{ scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 400, damping: 14 }}>
                            <LuMail className="size-2.5" style={{ color: C.accent }} />
                          </motion.span>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-0.5">
                        {p.skills.map((s, i) => {
                          const hot = matchedSkills.includes(s);
                          return (
                            <motion.span
                              key={s}
                              className="rounded px-1 py-[1px] text-[6px]"
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0, backgroundColor: hot ? "rgba(125,213,222,0.9)" : "rgba(138,176,224,0.12)", color: hot ? C.bg : C.light }}
                              transition={{ delay: i * 0.08 }}
                            >
                              {s}
                            </motion.span>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* Generated tasks */}
          {TASKS.map((task) =>
            t >= task.at ? (
              <motion.div
                key={task.id}
                className="absolute rounded-lg border px-1.5 py-1"
                style={{ left: TX, top: task.y, width: TW, height: TH, borderColor: C.border, background: C.panel }}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              >
                <p className="text-[7px] font-semibold leading-tight" style={{ color: "#e6f1ff" }}>{task.title}</p>
                <span className="mt-1 inline-block rounded px-1 text-[6px] font-semibold" style={{ color: LEVEL[task.level], background: "rgba(0,0,0,0.25)" }}>{task.level}</span>
              </motion.div>
            ) : (
              <div key={task.id} className="absolute rounded-lg border border-dashed" style={{ left: TX, top: task.y, width: TW, height: TH, borderColor: "rgba(138,176,224,0.12)" }} />
            ),
          )}

          {/* Audit log ticker */}
          <div className="absolute bottom-3 left-[220px] flex w-[248px] items-center justify-between rounded-md border px-2 py-1 font-mono text-[6.5px]" style={{ borderColor: C.border, background: "rgba(33,44,48,0.6)" }}>
            <span style={{ color: "rgba(138,176,224,0.6)" }}>audit_log</span>
            <AnimatePresence mode="wait">
              <motion.span key={audit?.id ?? "none"} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} style={{ color: audit ? C.accent : "rgba(138,176,224,0.4)" }}>
                {audit ? `admin · ${audit.name} · ok` : "waiting for actions…"}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>
      </Stage>
    </div>
  );
}
