"use client";
import { MENTAL_MODELS } from "@/lib/questions";
import styles from "./GuestimatePopup.module.css";

function renderMarkdown(text) {
  if (!text) return "";
  return text
    .replace(/## (.+)/g, '<h2>$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n---\n/g, '<hr/>')
    .replace(/✅ (.+)/g, '<li style="list-style:none;color:#4caf7d">✅ $1</li>')
    .replace(/❌ (.+)/g, '<li style="list-style:none;color:#e05252">❌ $1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
}

export default function GuestimatePopup({ onContinue }) {
  const model = MENTAL_MODELS["Guesstimates"];

  return (
    <div className={styles.overlay} onClick={onContinue}>
      <div
        className={`${styles.panel} fade-in`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.chip}>Guesstimates</span>
            <span className={styles.headerSep}>/</span>
            <span className={styles.headerLabel}>Mental Model</span>
          </div>
          <button
            id="guesstimate-popup-close"
            className={styles.closeBtn}
            onClick={onContinue}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Scrollable content */}
        <div className={styles.body}>
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>Guesstimates — The Mental Model</h1>
            <p className={styles.subtitle}>
              Read this before your first attempt. It takes 3 minutes.
            </p>
          </div>

          <div className={styles.modelCard}>
            <div
              className="content"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(model?.full) }}
            />
          </div>
        </div>

        {/* Fixed bottom bar */}
        <div className={styles.footer}>
          <button
            id="guesstimate-popup-cta"
            className={styles.ctaBtn}
            onClick={onContinue}
          >
            I've Read This — Start Practice →
          </button>
        </div>
      </div>
    </div>
  );
}
