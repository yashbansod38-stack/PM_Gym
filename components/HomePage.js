"use client";
import { useRef } from "react";
import styles from "./HomePage.module.css";

const UNIVERSAL_MENTAL_MODEL = [
  {
    type: "heading",
    text: "What's actually happening in the first 60–90 seconds"
  },
  {
    type: "body",
    text: "When an interviewer asks you a question, they are not just waiting for your answer. They are watching how you receive the question. Do you jump? Do you panic? Do you ask smart questions or dumb ones? Do you sound like someone who has thought about problems before — or someone who memorized a playbook?"
  },
  {
    type: "body",
    text: "The first move you make signals everything."
  },
  {
    type: "body",
    text: "Most candidates fail here in one of three ways:"
  },
  {
    type: "fail",
    text: "Zero questions — They just start answering. This tells the interviewer: \"I don't know what I don't know.\""
  },
  {
    type: "fail",
    text: "Wrong questions — They ask things that don't actually change their answer. Wasted time, wasted signal."
  },
  {
    type: "fail",
    text: "Right questions, phrased poorly — They have good instincts but communicate badly. The interviewer hears noise, not precision."
  },
  {
    type: "heading",
    text: "The Mental Model: The Two-Step Before You Speak"
  },
  {
    type: "body",
    text: "Before you ask a single clarifying question, your brain must do two things silently and fast:"
  },
  {
    type: "step",
    label: "Step 1 — Decode the question",
    text: "What type of question is this? What is it actually asking me to do? What is ambiguous? What assumptions am I being forced to make right now?"
  },
  {
    type: "step",
    label: "Step 2 — Identify what changes your answer",
    text: "Not every ambiguity matters. The only clarifying questions worth asking are ones where the answer would genuinely change the direction or scope of your response. If the answer doesn't change anything meaningful — don't ask it."
  },
  {
    type: "rule",
    text: "Ask only what changes your answer. Ask nothing else."
  },
  {
    type: "body",
    text: "Every question you ask must pass this test: \"If the interviewer answers X vs. Y — does my entire approach shift?\" If yes — ask it. If no — drop it."
  },
  {
    type: "heading",
    text: "Strong vs. Weak Clarifying Questions"
  },
  {
    type: "body",
    text: "Question: \"Estimate the number of Google Maps users in India.\""
  },
  {
    type: "fail",
    text: "\"Can I use approximations?\" — You just wasted 5 seconds and signaled you're nervous."
  },
  {
    type: "fail",
    text: "\"Are we talking about mobile or desktop users?\" — In India, the answer is overwhelmingly mobile. This shows you haven't thought about context."
  },
  {
    type: "pass",
    text: "\"When you say 'users' — are we estimating monthly active users or daily active users? That changes my baseline significantly.\" — Sharp, specific, explains why you're asking."
  },
  {
    type: "pass",
    text: "\"Are we scoping this to Google Maps as a navigation product, or should I include all use cases — transit, local search, Street View?\" — Changes your segmentation logic entirely."
  },
  {
    type: "heading",
    text: "How to Compress an Overthought Question Into One Crisp Question"
  },
  {
    type: "fail",
    text: "\"So I was thinking, like, should I consider just the urban areas, or should I also include rural areas, because in India there are a lot of rural users too...\" — Too long. Interviewer loses you at word 20."
  },
  {
    type: "pass",
    text: "\"Should I scope this to urban India, or include rural as well? Urban-only gives me a cleaner estimate.\" — Same information. One-fifth the words. Twice the signal."
  },
  {
    type: "rule",
    text: "The formula: What you're deciding + why it matters to your answer. Nothing else."
  }
];

export default function HomePage({ onStartPractice, onContinuePractice, hasSavedSession }) {
  const mentalModelRef = useRef(null);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>

        {/* Header */}
        <header className={styles.header}>
          <div className={styles.logo}>
            <span className={styles.logoMark}>▲</span>
            <span className={styles.logoText}>PM Interview Gym</span>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.tagline}>
              Strict feedback. Earned confidence.
            </div>
            <button
              className={styles.mentalModelNavBtn}
              onClick={() => mentalModelRef.current?.scrollIntoView({ behavior: 'smooth' })}
            >
              Mental Model ↓
            </button>
          </div>
        </header>

        {/* Hero */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            Practice like you're<br />already in the room.
          </h1>
          <p className={styles.heroSub}>
            Most PM interview tools tell you what's weak. This one tells you
            exactly why — and won't let you move forward until you fix it.
          </p>
        </section>

        {/* CTA */}
        <section className={styles.ctaSection}>
          <button
            id="start-practice-btn"
            className={styles.ctaPrimary}
            onClick={onStartPractice}
          >
            Start Practice →
          </button>
          {hasSavedSession && (
            <button
              id="continue-practice-btn"
              className={styles.ctaSecondary}
              onClick={onContinuePractice}
            >
              Continue Practice
            </button>
          )}
        </section>

        {/* How it works */}
        <section className={styles.howItWorks}>
          <div className={styles.sectionLabel}>How it works</div>
          <div className={styles.steps}>
            <div className={styles.step}>
              <span className={styles.stepNum}>01</span>
              <div>
                <div className={styles.stepTitle}>Start your session</div>
                <div className={styles.stepDesc}>
                  Jump straight into a question. Access the full mental model
                  anytime via the button in the top-right corner.
                </div>
              </div>
            </div>
            <div className={styles.stepDivider} />
            <div className={styles.step}>
              <span className={styles.stepNum}>02</span>
              <div>
                <div className={styles.stepTitle}>Attempt Level 1</div>
                <div className={styles.stepDesc}>
                  Practice your opening 60–90 seconds. Score 7/10 or above to clear the threshold
                  and move to the next question.
                </div>
              </div>
            </div>
            <div className={styles.stepDivider} />
            <div className={styles.step}>
              <span className={styles.stepNum}>03</span>
              <div>
                <div className={styles.stepTitle}>Get evaluated</div>
                <div className={styles.stepDesc}>
                  Receive structured feedback across 4 dimensions. Mistakes carry
                  forward to your next attempt.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Universal Mental Model */}
        <section
          id="mental-model-section"
          ref={mentalModelRef}
          className={styles.mentalModelSection}
        >
          <div className={styles.sectionLabel}>The Mental Model</div>
          <h2 className={styles.mentalModelTitle}>
            How to Open Any PM Interview Question
          </h2>
          <div className={styles.mentalModelContent}>
            {UNIVERSAL_MENTAL_MODEL.map((block, i) => {
              if (block.type === "heading") return (
                <div key={i} className={styles.mmHeading}>{block.text}</div>
              );
              if (block.type === "step") return (
                <div key={i} className={styles.mmStep}>
                  <span className={styles.mmStepLabel}>{block.label}</span>
                  <span className={styles.mmStepText}>{block.text}</span>
                </div>
              );
              if (block.type === "pass") return (
                <div key={i} className={styles.mmPass}>✅ {block.text}</div>
              );
              if (block.type === "fail") return (
                <div key={i} className={styles.mmFail}>❌ {block.text}</div>
              );
              if (block.type === "rule") return (
                <div key={i} className={styles.mmRule}>{block.text}</div>
              );
              return (
                <div key={i} className={styles.mmBody}>{block.text}</div>
              );
            })}
          </div>
        </section>

        {/* Footer note */}
        <footer className={styles.footer}>
          <div className={styles.footerNote}>
            V1 evaluates your opening 60–90 seconds and clarifying questions only.
            Full question solving is out of scope until Level 3.
          </div>
        </footer>

      </div>
    </div>
  );
}
