"use client";
import { useState, useEffect } from "react";
import { QUESTIONS } from "@/lib/questions";
import HomePage from "@/components/HomePage";
import MentalModelPage from "@/components/MentalModelPage";
import PracticePage from "@/components/PracticePage";
import GuestimatePopup from "@/components/GuestimatePopup";

// App states: 'home' | 'practice'

const STORAGE_KEY = "pmgym_session";
const DEFAULT_QUESTION_TYPE = "Guesstimates";

function getQuestions(type) {
  return QUESTIONS[type] || [];
}

function loadSavedSession() {
  try {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistSession(session) {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // ignore
  }
}

const INITIAL_SESSION = {
  questionType: DEFAULT_QUESTION_TYPE,
  questionIndex: 0,
  currentLevel: "Easy",
  attemptNumber: 0,
  lastScore: null,
  activeQuestion: null,
  mentalModelCorrectionPrevious: null,
  bestScore: null,
  totalAttempts: 0,
  level1Cleared: false,
};

export default function Page() {
  const [appState, setAppState] = useState("home"); // 'home' | 'practice'
  const [session, setSession] = useState(INITIAL_SESSION);
  const [mentalModelOpen, setMentalModelOpen] = useState(false);
  const [hasSavedSession, setHasSavedSession] = useState(false);
  const [showGuestimatePopup, setShowGuestimatePopup] = useState(false);

  // Check localStorage on mount to decide whether to show "Continue Practice"
  useEffect(() => {
    const saved = loadSavedSession();
    if (saved && saved.activeQuestion) {
      setHasSavedSession(true);
    }
  }, []);

  function handleStartPractice() {
    const questions = getQuestions(DEFAULT_QUESTION_TYPE);
    const firstQuestion = questions[0] || null;
    const newSession = {
      ...INITIAL_SESSION,
      activeQuestion: firstQuestion,
      questionIndex: 0,
    };
    setSession(newSession);
    persistSession(newSession);

    // First-time check: show mental model popup before entering practice
    const hasSeenModel = localStorage.getItem("pmgym_seen_guesstimate_model");
    if (!hasSeenModel) {
      setShowGuestimatePopup(true);
    } else {
      setAppState("practice");
    }
  }

  function handleContinuePractice() {
    const saved = loadSavedSession();
    if (saved && saved.activeQuestion) {
      setSession(saved);
      setAppState("practice");
    } else {
      // Fallback: start fresh if saved state is corrupt
      handleStartPractice();
    }
  }

  function handleUpdateSession(updates) {
    setSession((prev) => {
      const next = { ...prev, ...updates };
      persistSession(next);
      return next;
    });
  }

  function handleNextQuestion() {
    const questions = getQuestions(session.questionType || DEFAULT_QUESTION_TYPE);
    const nextIndex = (session.questionIndex ?? 0) + 1;
    const nextQuestion = questions[nextIndex] ?? null;

    setSession((prev) => {
      const next = {
        ...prev,
        questionIndex: nextIndex,
        activeQuestion: nextQuestion,
        // Reset per-question state; keep cross-session stats
        attemptNumber: 0,
        lastScore: null,
        mentalModelCorrectionPrevious: null,
        level1Cleared: false,
      };
      persistSession(next);
      return next;
    });
  }

  function handleBackToHome() {
    setAppState("home");
    setMentalModelOpen(false);
    // Refresh "Continue Practice" visibility
    const saved = loadSavedSession();
    if (saved && saved.activeQuestion) {
      setHasSavedSession(true);
    }
  }

  function handleOpenMentalModel() {
    setMentalModelOpen(true);
  }

  function handleCloseMentalModel() {
    setMentalModelOpen(false);
  }

  function handleGuestimatePopupDone() {
    localStorage.setItem("pmgym_seen_guesstimate_model", "true");
    setShowGuestimatePopup(false);
    setAppState("practice");
  }

  return (
    <>
      {appState === "home" && (
        <HomePage
          onStartPractice={handleStartPractice}
          onContinuePractice={handleContinuePractice}
          hasSavedSession={hasSavedSession}
        />
      )}

      {appState === "practice" && (
        <>
          <PracticePage
            session={session}
            onUpdateSession={handleUpdateSession}
            onNextQuestion={handleNextQuestion}
            onBackToHome={handleBackToHome}
            onOpenMentalModel={handleOpenMentalModel}
          />
          {mentalModelOpen && (
            <MentalModelPage
              questionType={session.questionType || DEFAULT_QUESTION_TYPE}
              onClose={handleCloseMentalModel}
            />
          )}
        </>
      )}

      {showGuestimatePopup && (
        <GuestimatePopup onContinue={handleGuestimatePopupDone} />
      )}
    </>
  );
}
