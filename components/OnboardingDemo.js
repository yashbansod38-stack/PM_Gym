"use client";
import { useState, useRef, useEffect } from "react";
import styles from "./OnboardingDemo.module.css";

const DEMO_QUESTION =
  "Estimate the number of cups of chai sold in Mumbai in a day.";

const STEPS = [
  {
    id: 1,
    color: "#F5C842",
    colorDim: "rgba(245, 200, 66, 0.10)",
    title: "Open with intent",
    instruction:
      "Type this to start:\n'Before I structure this —\none quick clarification.'",
  },
  {
    id: 2,
    color: "#2E5FA3",
    colorDim: "rgba(46, 95, 163, 0.10)",
    title: "Find the ambiguity",
    instruction:
      "What is genuinely unclear about this question? What would change your entire approach if answered differently?",
  },
  {
    id: 3,
    color: "#2D7A4F",
    colorDim: "rgba(45, 122, 79, 0.10)",
    title: "State your reason",
    instruction:
      "Why does this ambiguity matter? One sentence. What changes if the answer is X not Y?",
  },
];

const BREAKDOWN_PARTS = [
  {
    id: 1,
    color: "#F5C842",
    colorDim: "rgba(245, 200, 66, 0.07)",
    label: "OPENING LINE",
    text: "Before I structure this — one quick clarification.",
    subtext:
      "Short. Direct. Signals you are thinking before speaking.",
  },
  {
    id: 2,
    color: "#2E5FA3",
    colorDim: "rgba(46, 95, 163, 0.07)",
    label: "AMBIGUITY FOUND",
    text: "When you say chai — should I include all formats: roadside stalls, packaged brands, and restaurant chai? Or a specific type?",
    subtext:
      "One question. Covers the full scope of what is genuinely unclear.",
  },
  {
    id: 3,
    color: "#2D7A4F",
    colorDim: "rgba(45, 122, 79, 0.07)",
    label: "REASON",
    text: "Each has a completely different volume and frequency pattern — roadside chai alone would 10x the estimate compared to packaged only.",
    subtext:
      "Specific. Shows you understand why it matters. This is what passes the filter.",
  },
];

function checkSteps(text, currentSteps) {
  const lower = text.toLowerCase();
  const next = { ...currentSteps };

  // Step 1: must contain the opening intent phrase
  if (!next[1]) {
    if (lower.includes("before i structure") || lower.includes("one quick clarification") || lower.includes("just to make sure")) {
      next[1] = true;
    }
  }

  // Step 2: must actually ask something (question mark) after step 1 done
  // BUG-8 fix: content-signal check instead of pure length
  if (next[1] && !next[2]) {
    if (text.includes("?") && text.length > 60) {
      next[2] = true;
    }
  }

  // Step 3: must show reasoning — causal language after step 2 done
  // BUG-8 fix: check for reasoning keywords, not just character count
  if (next[2] && !next[3]) {
    const reasoningKeywords = ["because", "change", "different", "pattern", "vary", "impact", "affect", "depends", "significantly", "each", "that would"];
    const hasReasoning = reasoningKeywords.some((kw) => lower.includes(kw));
    if (hasReasoning && text.length > 120) {
      next[3] = true;
    }
  }

  return next;
}

function getActiveStep(stepsComplete) {
  if (!stepsComplete[1]) return 1;
  if (!stepsComplete[2]) return 2;
  if (!stepsComplete[3]) return 3;
  return null; // all done
}

export default function OnboardingDemo({ onComplete }) {
  const [screen, setScreen] = useState("demo"); // 'demo' | 'breakdown'
  const [answer, setAnswer] = useState("");
  const [stepsComplete, setStepsComplete] = useState({
    1: false,
    2: false,
    3: false,
  });
  const [partsVisible, setPartsVisible] = useState({
    1: false,
    2: false,
    3: false,
  });
  const [ctaVisible, setCtaVisible] = useState(false);
  const [noteVisible, setNoteVisible] = useState(false);
  const [didPulse, setDidPulse] = useState(false);
  const textareaRef = useRef(null);
  const allDone = stepsComplete[1] && stepsComplete[2] && stepsComplete[3];
  const activeStep = getActiveStep(stepsComplete);
  // BUG-7 fix: require Step 1 to be done before submit is enabled
  const canSubmit = stepsComplete[1] && answer.trim().length >= 15;

  // Pulse submit button once when all steps done
  useEffect(() => {
    if (allDone && !didPulse) {
      setDidPulse(true);
    }
  }, [allDone, didPulse]);

  function handleAnswerChange(e) {
    const val = e.target.value;
    setAnswer(val);
    const updated = checkSteps(val, stepsComplete);
    setStepsComplete(updated);
  }

  function handleSubmit() {
    if (!canSubmit) return;
    setScreen("breakdown");
    setTimeout(() => setPartsVisible((p) => ({ ...p, 1: true })), 300);
    setTimeout(() => setPartsVisible((p) => ({ ...p, 2: true })), 900);
    setTimeout(() => setPartsVisible((p) => ({ ...p, 3: true })), 1500);
    setTimeout(() => setNoteVisible(true), 2150);
    setTimeout(() => setCtaVisible(true), 2400);
  }

  // ── Breakdown Screen ─────────────────────────────────────────────────────
  if (screen === "breakdown") {
    return (
      <div className={styles.root}>
        {/* Top bar */}
        <header className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <span className={styles.demoTag}>GUIDED DEMO — Not scored</span>
          </div>
          <div className={styles.topBarCenter}>
            <span className={styles.logoText}>PM Interview Gym</span>
          </div>
          <div className={styles.topBarRight} />
        </header>

        {/* Breakdown content */}
        <div className={styles.breakdownWrapper}>
          <div className={styles.breakdownCard}>
            {/* Score */}
            <div className={styles.scoreRow}>
              <span className={styles.scoreNum}>7.5</span>
              <span className={styles.scoreDen}>&nbsp;/ 10</span>
            </div>
            <div className={styles.scoreStatus}>
              Good first attempt. Here is what a strong version looks like.
            </div>

            {/* Section heading */}
            <div className={styles.breakdownHeading}>
              A STRONG OPENING — BROKEN DOWN
            </div>

            {/* Parts */}
            <div className={styles.partsList}>
              {BREAKDOWN_PARTS.map((part) => (
                <div
                  key={part.id}
                  className={`${styles.part} ${
                    partsVisible[part.id] ? styles.partVisible : ""
                  }`}
                  style={{
                    borderLeftColor: part.color,
                    background: part.colorDim,
                  }}
                >
                  <div className={styles.partLabel} style={{ color: part.color }}>
                    {part.label}
                  </div>
                  <div className={styles.partText}>{part.text}</div>
                  <div className={styles.partSubtext}>{part.subtext}</div>
                </div>
              ))}
            </div>

            {/* Note */}
            {noteVisible && (
              <div className={`${styles.breakdownNote} ${styles.fadeIn}`}>
                Notice: three parts. Under 60 words total. No solving. No
                frameworks. Just a clean opening move.
              </div>
            )}

            {/* CTA */}
            {ctaVisible && (
              <div className={`${styles.ctaBlock} ${styles.fadeIn}`}>
                <button
                  id="onboarding-start-practice-btn"
                  className={styles.ctaBtn}
                  onClick={onComplete}
                >
                  I'm ready — Start Practice →
                </button>
                <div className={styles.ctaNote}>
                  You can always open the Mental Model from the top-right
                  corner during practice.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Demo Screen ──────────────────────────────────────────────────────────
  return (
    <div className={styles.root}>
      {/* Top bar */}
      <header className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <span className={styles.demoTag}>GUIDED DEMO — Not scored</span>
        </div>
        <div className={styles.topBarCenter}>
          <span className={styles.logoText}>PM Interview Gym</span>
        </div>
        <div className={styles.topBarRight}>
          <button
            id="onboarding-skip-btn"
            className={styles.skipBtn}
            onClick={onComplete}
          >
            Skip →
          </button>
        </div>
      </header>

      {/* Main layout */}
      <div className={styles.layout}>
        {/* Left column */}
        <main className={styles.leftCol}>
          {/* Header */}
          <div className={styles.questionHeader}>
            <div className={styles.questionLabel}>DEMO QUESTION</div>
            <div className={styles.questionSubtext}>
              This is a practice question. No score. No pressure. Just try the
              format.
            </div>
          </div>

          {/* Question */}
          <div className={styles.questionText}>{DEMO_QUESTION}</div>

          {/* Answer area */}
          <div className={styles.answerArea}>
            <textarea
              ref={textareaRef}
              id="onboarding-answer-textarea"
              className={styles.textarea}
              value={answer}
              onChange={handleAnswerChange}
              placeholder="Start with your opening line..."
              rows={8}
              autoFocus
            />

            {/* Step progress bar */}
            <div className={styles.progressBar}>
              {[1, 2, 3].map((n) => {
                const step = STEPS.find((s) => s.id === n);
                const isActive = activeStep === n;
                const isDone = stepsComplete[n];
                return (
                  <div
                    key={n}
                    className={`${styles.progressSegment} ${
                      isDone
                        ? styles.progressDone
                        : isActive
                        ? styles.progressActive
                        : ""
                    }`}
                    style={
                      isDone || isActive
                        ? { background: step.color }
                        : {}
                    }
                  />
                );
              })}
            </div>

            {/* Submit row */}
            <div className={styles.submitRow}>
              <span className={styles.charCount}>{answer.length} chars</span>
              <button
                id="onboarding-submit-btn"
                className={`${styles.submitBtn} ${
                  allDone && didPulse ? styles.submitPulse : ""
                }`}
                onClick={handleSubmit}
                disabled={!canSubmit}
              >
                See how I did →
              </button>
            </div>

            {allDone && (
              <div className={`${styles.allDoneHint} ${styles.fadeIn}`}>
                Good. Now submit and see what happens.
              </div>
            )}
          </div>
        </main>

        {/* Right column — Step Coach */}
        <aside className={styles.rightCol}>
          <div className={styles.coachPanel}>
            <div className={styles.coachTitle}>YOUR MOVE</div>

            <div className={styles.stepsList}>
              {STEPS.map((step) => {
                const isDone = stepsComplete[step.id];
                const isActive = activeStep === step.id;
                const isLocked = !isDone && !isActive;

                return (
                  <div
                    key={step.id}
                    className={`${styles.stepCard} ${
                      isDone
                        ? styles.stepDone
                        : isActive
                        ? styles.stepActive
                        : styles.stepLocked
                    }`}
                    style={
                      isActive
                        ? {
                            borderLeftColor: step.color,
                            background: step.colorDim,
                          }
                        : isDone
                        ? { borderLeftColor: step.color, opacity: 0.7 }
                        : {}
                    }
                  >
                    <div className={styles.stepHeader}>
                      <div className={styles.stepNumber}>{step.id}</div>
                      <div className={styles.stepTitleRow}>
                        <span
                          className={styles.stepTitle}
                          style={isActive ? { color: step.color } : {}}
                        >
                          {step.title}
                        </span>
                        <span className={styles.stepIcon}>
                          {isDone ? "✓" : isActive ? "→" : "🔒"}
                        </span>
                      </div>
                    </div>

                    {(isActive || isDone) && (
                      <div className={styles.stepInstruction}>
                        {step.instruction}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
