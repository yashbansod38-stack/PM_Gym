"use client";
import { MENTAL_MODELS } from "@/lib/questions";
import styles from "./MentalModelPage.module.css";

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

// Now a modal overlay — no standalone page, no question selection, no CTA
// Props: { questionType, onClose }
export default function MentalModelPage({ questionType, onClose }) {
  const model = MENTAL_MODELS[questionType];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.modal} fade-in`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerLeft}>
            <span className={styles.headerTag}>{questionType}</span>
            <span className={styles.headerSep}>/</span>
            <span className={styles.headerTitle}>Mental Model</span>
          </div>
          <button
            id="mental-model-close-btn"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close mental model"
          >
            ×
          </button>
        </div>

        {/* Model title */}
        <div className={styles.titleBlock}>
          <h2 className={styles.title}>{model?.title}</h2>
          <p className={styles.titleSub}>
            Reference this anytime during practice. Your question and progress are saved.
          </p>
        </div>

        {/* Mental model content */}
        <div className={styles.modelCard}>
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(model?.full) }}
          />
        </div>
      </div>
    </div>
  );
}
