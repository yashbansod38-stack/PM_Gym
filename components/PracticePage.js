"use client";
import { useState, useRef } from "react";
import { MENTAL_MODELS, QUESTIONS } from "@/lib/questions";
import { parseFeedback } from "@/lib/parser";
import styles from "./PracticePage.module.css";

const LEVEL_THRESHOLD = 7; // Score needed to unlock Level 2
const LEVEL_1_LABEL = "Opening (60–90s)";
const LEVEL_2_LABEL = "Clarifying Questions";

export default function PracticePage({
  session,
  onUpdateSession,
  onNextQuestion,
  onBackToHome,
  onOpenMentalModel,
}) {
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // parsed feedback object
  const [error, setError] = useState(null);
  const [panelTab, setPanelTab] = useState("cheatsheet"); // 'cheatsheet' | 'correction'
  const [levelUpModal, setLevelUpModal] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1); // 1 or 2
  const textareaRef = useRef(null);

  const questionType = session.questionType || "Guesstimates";
  const model = MENTAL_MODELS[questionType];
  const questions = QUESTIONS[questionType] || [];
  const activeQuestion = session.activeQuestion;
  const questionIndex = session.questionIndex ?? 0;
  const attemptNumber = session.attemptNumber || 0;
  const lastScore = session.lastScore;
  const bestScore = session.bestScore;
  const isSessionComplete = !activeQuestion || questionIndex >= questions.length;

  async function handleSubmit() {
    if (!answer.trim() || answer.trim().length < 10) return;
    setIsLoading(true);
    setError(null);
    setFeedback(null);

    const newAttemptNumber = attemptNumber + 1;

    // Build session state JSON per architecture spec
    const sessionState = {
      session_state: {
        question_type: questionType,
        current_level: currentLevel === 1 ? "Easy" : "Easy-Level2",
        attempt_number: newAttemptNumber,
        last_score: lastScore,
        active_question: activeQuestion?.text || "",
        mental_model_correction_previous: session.mentalModelCorrectionPrevious || null,
        mental_model_correction_previous_attempt: attemptNumber || null,
        evaluation_note: activeQuestion?.evaluationNote || "",
      },
    };

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionState, userAnswer: answer }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Evaluation failed. Please try again.");
        setIsLoading(false);
        return;
      }

      // Parse feedback by label (per arch spec — never by position)
      const parsed = parseFeedback(data.feedback);
      setFeedback(parsed);

      // Update session state in memory + localStorage
      const newScore = parsed.score;
      const newBestScore = bestScore === null ? newScore : Math.max(bestScore, newScore || 0);
      const levelCleared = newScore !== null && newScore >= LEVEL_THRESHOLD;

      onUpdateSession({
        attemptNumber: newAttemptNumber,
        lastScore: newScore,
        bestScore: newBestScore,
        totalAttempts: (session.totalAttempts || 0) + 1,
        mentalModelCorrectionPrevious: parsed.mentalModelCorrection,
        level1Cleared: levelCleared || session.level1Cleared,
      });

      // Show correction tab if there's new correction
      if (parsed.mentalModelCorrection && parsed.mentalModelCorrection !== "No correction needed.") {
        setPanelTab("correction");
      }

      // Level up modal
      if (levelCleared && currentLevel === 1 && !session.level1Cleared) {
        setLevelUpModal(true);
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleRetry() {
    setAnswer("");
    setFeedback(null);
    setError(null);
    setPanelTab(session.mentalModelCorrectionPrevious ? "correction" : "cheatsheet");
    if (textareaRef.current) textareaRef.current.focus();
  }

  function handleNextQuestion() {
    // Reset local component state for the new question
    setAnswer("");
    setFeedback(null);
    setError(null);
    setCurrentLevel(1);
    setPanelTab("cheatsheet");
    // Delegate index increment + question selection to parent
    onNextQuestion();
    if (textareaRef.current) textareaRef.current.focus();
  }

  const scoreVal = feedback?.score ?? null;
  const scoreColor = scoreVal !== null
    ? scoreVal >= 8 ? "var(--green)"
      : scoreVal >= 6 ? "var(--accent)"
        : "var(--red)"
    : "var(--text-muted)";

  // ── Session Complete Screen ──────────────────────────────────────────────
  if (isSessionComplete) {
    return (
      <div className={styles.wrapper}>
        <header className={styles.topBar}>
          <div className={styles.topLeft}>
            <span className={styles.topType}>{questionType}</span>
          </div>
          <div className={styles.topRight}>
            <button
              id="mental-model-btn-complete"
              className={styles.mentalModelBtn}
              onClick={onOpenMentalModel}
            >
              Mental Model ↗
            </button>
          </div>
        </header>
        <div className={styles.completionWrapper}>
          <div className={`${styles.completionCard} fade-in`}>
            <div className={styles.completionIcon}>✓</div>
            <h2 className={styles.completionTitle}>Session Complete</h2>
            <p className={styles.completionBody}>
              You've worked through all {questions.length} questions in this session.
              Strong reps build muscle memory — come back for another round.
            </p>
            <div className={styles.completionActions}>
              <button
                className={styles.restartBtn}
                onClick={() => {
                  // Restart from Q[0]
                  onUpdateSession({
                    questionIndex: 0,
                    activeQuestion: questions[0] || null,
                    attemptNumber: 0,
                    lastScore: null,
                    mentalModelCorrectionPrevious: null,
                    level1Cleared: false,
                  });
                  setAnswer("");
                  setFeedback(null);
                  setError(null);
                  setCurrentLevel(1);
                  setPanelTab("cheatsheet");
                }}
              >
                Restart Session →
              </button>
              <button className={styles.homeBtn} onClick={onBackToHome}>
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Practice UI ─────────────────────────────────────────────────────
  return (
    <div className={styles.wrapper}>

      {/* Top bar */}
      <header className={styles.topBar}>
        <div className={styles.topLeft}>
          <div className={styles.topDivider} />
          <span className={styles.topType}>{questionType}</span>
          <span className={styles.topSep}>/</span>
          <span className={styles.topLevel}>
            Level {currentLevel} — {currentLevel === 1 ? LEVEL_1_LABEL : LEVEL_2_LABEL}
          </span>
        </div>
        <div className={styles.topRight}>
          {attemptNumber > 0 && (
            <>
              <span className={styles.statLabel}>Attempt</span>
              <span className={styles.statValue}>{attemptNumber}</span>
              <div className={styles.topDivider} />
              <span className={styles.statLabel}>Best</span>
              <span className={styles.statValue} style={{ color: scoreColor }}>
                {bestScore !== null ? `${bestScore}/10` : "—"}
              </span>
              <div className={styles.topDivider} />
            </>
          )}
          <button
            id="mental-model-btn"
            className={styles.mentalModelBtn}
            onClick={onOpenMentalModel}
          >
            Mental Model ↗
          </button>
        </div>
      </header>

      {/* Main layout */}
      <div className={styles.layout}>

        {/* Left: Practice area */}
        <main className={styles.main}>

          {/* Question */}
          <div className={styles.questionBlock}>
            <div className={styles.questionMeta}>
              <span className={styles.qLabel}>Question {questionIndex + 1}</span>
              {currentLevel === 1 && (
                <span className={styles.qScope}>
                  Answer your opening 60–90 seconds
                </span>
              )}
            </div>
            <div className={styles.questionText}>
              {activeQuestion?.text}
            </div>
          </div>

          {/* Answer area — show if no feedback yet */}
          {!feedback && (
            <div className={`${styles.answerBlock} fade-in`}>
              <div className={styles.answerHeader}>
                <label className={styles.answerLabel}>Your Answer</label>
                <span className={styles.answerHint}>
                  {currentLevel === 1
                    ? "Write your opening statement (restate + clarify)"
                    : "Write your opening + all clarifying questions"}
                </span>
              </div>
              <textarea
                ref={textareaRef}
                className={styles.textarea}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder={
                  currentLevel === 1
                    ? "Start by restating the question in your own words, then ask your clarifying question with reasoning..."
                    : "Write your full opening and all clarifying questions you'd ask..."
                }
                rows={8}
                disabled={isLoading}
                autoFocus
              />
              <div className={styles.submitRow}>
                <span className={styles.charCount}>{answer.length} chars</span>
                <button
                  className={styles.submitBtn}
                  onClick={handleSubmit}
                  disabled={isLoading || answer.trim().length < 10}
                >
                  {isLoading ? (
                    <span className="pulsing">Evaluating...</span>
                  ) : (
                    "Submit for Evaluation →"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className={`${styles.errorBlock} fade-in`}>
              <span className={styles.errorIcon}>⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Feedback */}
          {feedback && (
            <div className={`${styles.feedbackBlock} fade-in`}>

              {/* Score header */}
              <div className={styles.scoreRow}>
                <div className={styles.scoreDisplay} style={{ color: scoreColor }}>
                  <span className={styles.scoreNum}>{feedback?.scoreRaw ?? "—"}</span>
                  <span className={styles.scoreDen}>/10</span>
                </div>
                <div className={styles.scoreBar}>
                  <div
                    className={styles.scoreBarFill}
                    style={{
                      width: `${((scoreVal ?? 0) / 10) * 100}%`,
                      background: scoreColor,
                    }}
                  />
                </div>
                <div className={styles.scoreMeta}>
                  {scoreVal !== null && scoreVal >= LEVEL_THRESHOLD && currentLevel === 1
                    ? <span style={{ color: "var(--green)" }}>✓ Level 1 threshold cleared</span>
                    : scoreVal !== null && scoreVal < LEVEL_THRESHOLD
                      ? <span style={{ color: "var(--text-muted)" }}>Need {LEVEL_THRESHOLD}/10 to advance</span>
                      : null}
                </div>
              </div>

              {/* Feedback sections */}
              <div className={styles.feedbackSections}>
                {feedback.whatWorked && (
                  <div className={`${styles.feedbackSection} ${styles.sectionGreen}`}>
                    <div className={styles.sectionTitle}>What Worked</div>
                    <div className={styles.sectionBody}>{feedback.whatWorked}</div>
                  </div>
                )}
                {feedback.whatDidntWork && (
                  <div className={`${styles.feedbackSection} ${styles.sectionRed}`}>
                    <div className={styles.sectionTitle}>What Didn't Work</div>
                    <div className={styles.sectionBody}>{feedback.whatDidntWork}</div>
                  </div>
                )}
                {feedback.mentalModelCorrection && (
                  <div className={`${styles.feedbackSection} ${styles.sectionBlue}`}>
                    <div className={styles.sectionTitle}>Mental Model Correction</div>
                    <div className={styles.sectionBody}>{feedback.mentalModelCorrection}</div>
                    {feedback.mentalModelCorrection !== "No correction needed." && (
                      <div className={styles.correctionNote}>
                        ↑ Stored in side panel for your next attempt
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Your submitted answer */}
              <div className={styles.yourAnswer}>
                <div className={styles.yourAnswerLabel}>Your answer</div>
                <div className={styles.yourAnswerText}>{answer}</div>
              </div>

              {/* Action buttons */}
              <div className={styles.actionRow}>
                <button className={styles.retryBtn} onClick={handleRetry}>
                  Try Again
                </button>
                {/* Next Question — always visible after feedback */}
                {questionIndex + 1 < questions.length ? (
                  <button
                    id="next-question-btn"
                    className={styles.nextQuestionBtn}
                    onClick={handleNextQuestion}
                  >
                    Next Question →
                  </button>
                ) : (
                  <button
                    id="finish-session-btn"
                    className={styles.nextQuestionBtn}
                    onClick={handleNextQuestion}
                  >
                    Finish Session →
                  </button>
                )}
                <button className={styles.homeBtn} onClick={onBackToHome}>
                  Back to Home
                </button>
              </div>
            </div>
          )}

        </main>

        {/* Right: Side panel */}
        <aside className={styles.sidePanel}>
          <div className={styles.panelTabs}>
            <button
              className={`${styles.panelTab} ${panelTab === "cheatsheet" ? styles.activeTab : ""}`}
              onClick={() => setPanelTab("cheatsheet")}
            >
              Cheat Sheet
            </button>
            <button
              className={`${styles.panelTab} ${panelTab === "correction" ? styles.activeTab : ""} ${session.mentalModelCorrectionPrevious ? styles.hasCorrection : styles.noCorrection}`}
              onClick={() => setPanelTab("correction")}
            >
              Correction
              {session.mentalModelCorrectionPrevious && (
                <span className={styles.correctionDot} />
              )}
            </button>
          </div>

          <div className={styles.panelContent}>
            {panelTab === "cheatsheet" && (
              <div className={styles.cheatSheet}>
                <div className={styles.cheatTitle}>Quick Reference</div>
                <div className={styles.cheatText}>

                  {/* Block 1 — Sequence */}
                  <div className={styles.cheatHeading}>Before You Speak</div>
                  <div className={styles.cheatLine}>① What am I estimating? <span style={{ color: "var(--text-muted)" }}>(the unit)</span></div>
                  <div className={styles.cheatLine}>② Is scope clear? <span style={{ color: "var(--text-muted)" }}>(time, geography, product)</span></div>
                  <div className={styles.cheatLine}>③ Does this ambiguity change my decomposition?</div>
                  <div style={{ display: "flex", gap: "12px", marginTop: "4px", marginLeft: "14px" }}>
                    <span className={styles.cheatGreen}>Yes → ask it</span>
                    <span className={styles.cheatRed}>No → drop it</span>
                  </div>

                  <div className={styles.cheatSpacer} />
                  <div style={{ height: "1px", background: "var(--border)", margin: "8px 0" }} />

                  {/* Block 2 — Filter */}
                  <div className={styles.cheatHeading}>Filter Test</div>
                  <div className={styles.cheatLine} style={{ color: "var(--text-primary)" }}>
                    "If answer is X not Y — does my approach change?"
                  </div>
                  <div style={{ marginTop: "6px" }}>
                    <div className={styles.cheatGreen}>✅ Changes approach → ask it</div>
                    <div className={styles.cheatRed}>❌ Changes nothing → drop it</div>
                  </div>

                  <div className={styles.cheatSpacer} />
                  <div style={{ height: "1px", background: "var(--border)", margin: "8px 0" }} />

                  {/* Block 3 — How to ask */}
                  <div className={styles.cheatHeading}>How to Ask</div>
                  <div className={styles.cheatLine} style={{ color: "var(--text-primary)" }}>
                    [What you need] + [why it changes your approach]
                  </div>

                  <div className={styles.cheatSpacer} />
                  <div style={{ height: "1px", background: "var(--border)", margin: "8px 0" }} />

                  {/* Block 4 — Rule */}
                  <div className={styles.cheatHeading}>The Rule</div>
                  <div className={styles.cheatLine} style={{
                    color: "var(--accent)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    letterSpacing: "0.03em"
                  }}>
                    One question. One reason. Move.
                  </div>

                </div>
              </div>
            )}

            {panelTab === "correction" && (
              <div className={styles.correctionPanel}>
                {session.mentalModelCorrectionPrevious ? (
                  <>
                    <div className={styles.correctionHeader}>
                      <span className={styles.correctionIcon}>↩</span>
                      From your last attempt
                    </div>
                    <div className={styles.correctionText}>
                      {session.mentalModelCorrectionPrevious}
                    </div>
                    {session.lastScore && (
                      <div className={styles.correctionScore}>
                        Previous score: <strong>{session.lastScore}/10</strong>
                      </div>
                    )}
                  </>
                ) : (
                  <div className={styles.correctionEmpty}>
                    <div className={styles.emptyIcon}>○</div>
                    <div className={styles.emptyText}>
                      No correction yet. Submit your first answer to see what you need to fix.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Level up modal */}
      {levelUpModal && (
        <div className={styles.modalOverlay} onClick={() => setLevelUpModal(false)}>
          <div className={`${styles.modal} fade-in`} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.modalClose}
              onClick={() => setLevelUpModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <div className={styles.modalIcon}>✓</div>
            <h2 className={styles.modalTitle}>Threshold Cleared</h2>
            <p className={styles.modalBody}>
              You scored {scoreVal ?? feedback?.scoreRaw ?? "—"}/10 — above the 7/10 bar.
              Close this to read your feedback and decide what to do next.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
