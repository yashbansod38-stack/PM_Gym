

// lib/questions.js

export const QUESTIONS = {
  Guesstimates: [
    {
      id: "g1",
      text: "Estimate the number of WhatsApp messages sent in India per day.",
      evaluationNote: `For this specific question, the correct ambiguity is the definition of "messages."
A complete correct answer identifies ALL message types — text, voice notes, media files, and group messages — and names the group vs individual distinction as the primary reason.
Group vs individual is the most impactful distinction because one group message reaches multiple recipients but counts as a single send, which changes the decomposition significantly.

SCORING GUIDE FOR THIS QUESTION:
- Asks about all types AND names group vs individual with specific reason → 9/10
- Asks about all types but gives generic reason → 7.5/10
- Asks about text vs voice notes only → incomplete, deduct 1, max 7/10
- Asks about group vs individual only without covering all types → incomplete, deduct 0.5
- Asks about platform (Android vs iOS) → filter fails, cap at 6
- Asks about age group or profession → filter fails, cap at 6
- Asks about geography → filter fails, cap at 6
- No reason given → deduct 1 additional`,
    },
    {
      id: "g2",
      text: "Estimate the number of Uber rides taken in Mumbai in a day.",
      evaluationNote: `For this specific question, the correct ambiguity is product scope.
"Rides" could mean passenger transportation only (cab, auto, bike) or include all Uber services including Uber Connect parcel delivery and Uber Intercity.
Each has fundamentally different frequency and volume patterns, which changes the decomposition baseline.

SCORING GUIDE FOR THIS QUESTION:
- Identifies passenger transport vs all Uber services 
  (including delivery) with specific reason → 9/10
- Correctly scopes passenger transport ambiguity 
  with specific reason, even without naming every 
  vertical → 8/10
- Asks only about cab vs auto without broader 
  scope awareness → 6/10
- Identifies scope ambiguity but gives generic reason → 7/10
- Asks about user segments, peak hours, or ride distance → filter fails, cap at 6
- Asks about geography (already defined as Mumbai) → filter fails, cap at 6
- No reason given → deduct 1 additional`,
    },
    {
      id: "g3",
      text: "Estimate the number of YouTube videos uploaded per day in India.",
      evaluationNote: `For this specific question, the correct ambiguity is content type.
"Videos" is not one homogenous category — Shorts, long-form videos, and live streams have significantly different upload frequencies and volume patterns.
A creator posting 5 Shorts daily behaves completely differently from one posting one long-form video weekly.

SCORING GUIDE FOR THIS QUESTION:
- Identifies all three content types (Shorts, long-form, live streams) with specific reason about upload frequency difference → 9/10
- Identifies content type ambiguity but lists only two types → 7.5/10
- Asks about who uploads (individual vs enterprise vs influencer) → filter fails, cap at 6
- Asks about geography (already defined as India) → filter fails, cap at 6
- No reason given → deduct 1 additional`,
    },
    {
      id: "g4",
      text: "Estimate the number of Swiggy orders placed in Mumbai on a weekday.",
      evaluationNote: `For this specific question, the correct ambiguity is service scope.
Swiggy has multiple verticals — food delivery, Instamart grocery delivery, and Genie hyperlocal delivery.
Each vertical has different order frequency patterns and requires a different baseline.

SCORING GUIDE FOR THIS QUESTION:
- Identifies all three Swiggy verticals with specific reason about frequency difference → 9/10
- Identifies food vs other services with clear reason → 8/10
- Asks about weekday vs weekend (already defined) → filter fails, cap at 6
- Asks about specific areas within Mumbai (already defined) → filter fails, cap at 6
- Asks about orders vs users → filter fails, cap at 6
- Asks about delivery radius, user segments, or restaurant types → filter fails, cap at 6
- No reason given → deduct 1 additional`,
    },
  ],
  RCA: [],
  "Product Sense": [],
};





export const MENTAL_MODELS = {
  Guesstimates: {
    title: "Guesstimate Mental Model",
    full: `## What a Guesstimate Is Actually Testing

Not your math. Your thinking structure.

Three things the interviewer watches:
1. Do you break down a complex unknown into logical parts?
2. Do you know which variables drive the estimate vs. which are noise?
3. Can you make assumptions confidently and defend them?

---

## The First 60–90 Seconds — What You Do

Your job is not to start estimating. Your job is to do one thing:

**Find the one ambiguity that would change your entire approach — and ask it.**

That's it. One question. Sharp. With a reason.

---

## How to Open — The Pattern

You don't need a script. You need a thinking sequence:

**Step 1 — What exactly am I estimating?**
Identify the unit. Users? Messages? Revenue? Volume?

**Step 2 — What is the scope?**
Geography, time period, product definition — are these clear or ambiguous?

**Step 3 — Does any ambiguity genuinely change my decomposition?**
If yes → ask it. If no → state your assumptions and go.

---

## The Opening Line

Keep it simple. These all work:

- "Before I structure this — one quick clarification."
- "Just to make sure I'm solving the right problem —"
- "One thing I want to confirm before I begin —"

No script. No memorization. Pick whatever feels natural and move immediately to your question.

---

## The Filter — Run Every Question Through This

Ask yourself: **"If the interviewer answers X instead of Y — does my entire approach change?"**

✅ YES → Ask it. Include why it matters.
❌ NO → Drop it. Do not ask it.

---

## Strong vs Weak — Side by Side

Question: "Estimate the number of Google Photos storage 
used globally."

❌ Weak: "Should I consider free tier or paid users?"
Why it fails: Total storage includes both. 
This doesn't change your decomposition. Filter fails.

❌ Weak: "Should I focus on mobile users only?"
Why it fails: Device is a segmentation variable, 
not an ambiguity. Handled inside decomposition.

✅ Strong: "When you say storage — are we estimating 
total storage currently consumed, or net new storage 
being added per day? These are fundamentally different 
decomposition paths."
Why it works: Correct ambiguity, filter passes, 
specific reason tied to how the math changes.

---

## The Rule

Most guesstimates need one clarifying question. Sometimes zero. Never three.

If the question is clean and well-scoped — say so confidently and proceed with stated assumptions. That is not a weakness. That is good judgment.`,

    cheatSheet: `
    
    ① What am I estimating? (the unit)
    ② Is scope clear? (time, geography, product)
    ③ Does this ambiguity change my decomposition?
    Yes → ask it.  No → drop it.

Filter test: "If answer is X not Y — does my approach change?"

How to ask: [What you need] + [why it changes your approach]

One question. One reason. Move.
    
    
    
    `,
  },

  RCA: {
    title: "RCA Mental Model",
    full: `## Root Cause Analysis — Coming Soon\n\nRCA questions are locked in V1. Complete Guesstimates Level 1 first.`,
    cheatSheet: `RCA — Locked`,
  },

  "Product Sense": {
    title: "Product Sense Mental Model",
    full: `## Product Sense — Coming Soon\n\nProduct Sense questions are locked in V1. Complete Guesstimates Level 1 first.`,
    cheatSheet: `Product Sense — Locked`,
  },
};















export const SYSTEM_PROMPT = `You are a strict PM interview coach evaluating a candidate's 
ability to open a PM interview question correctly — specifically 
their first 60–90 seconds and their clarifying questions.

Your only job is to evaluate what the candidate submitted. 
You are not a conversational assistant. You do not encourage. 
You do not soften. You evaluate, score, and correct.

TONE — ENFORCE THIS WITHOUT EXCEPTION:
You are talking directly to the candidate, not writing 
a report about them. Use "you" not "the candidate."
Use plain, direct language. No bullet point headers with 
bold dimension names. No corporate feedback language.
Talk like a strict instructor sitting across the table.
Wrong: "The candidate identified relevant demographic segments."
Right: "You asked about age groups and urban vs rural. 
Neither of these passes the filter."
Every sentence should feel like it was said out loud 
to a real person.

SCOPE BOUNDARY — ENFORCE THIS WITHOUT EXCEPTION
You evaluate only two things:
1. How you opened your answer (first 60–90 seconds)
2. The clarifying questions you asked — which ones, 
   why, and how you phrased them

You do NOT evaluate or comment on:
- How the problem was solved
- Estimation structure or decomposition
- Frameworks or conclusions
- Anything that happens after the clarifying phase ends

If the candidate goes beyond the clarifying phase into 
solving — note it once as a scope error, do not evaluate 
the solving portion.

WHAT YOU ARE EVALUATING AGAINST
You evaluate against the Easy Level rubric. This is the 
entry-level bar. It rewards correct thinking and penalizes 
genuine errors. It does not demand depth, market fluency, 
or perfect articulation.

THE FOUR DIMENSIONS:

1. AMBIGUITY IDENTIFICATION — Did you find the right 
thing to clarify?
- Full credit: correct ambiguity identified, even if 
  loosely framed
- Partial credit: directionally right but imprecise
- No credit: wrong ambiguity, manufactured, or secondary 
  while primary is missed

2. FILTER APPLICATION — Does your question pass the filter?
- The filter test: would the answer to your question 
  genuinely change your decomposition or approach?
- Passes: meaningful change to estimation structure 
  or starting assumptions
- Fails: automatic cap at 6/10, regardless of everything else
- This is binary. No gradient. No exceptions.

IMPORTANT DISTINCTION: A filter failure requires that 
the question adds zero value to the approach. A question 
that slightly misreads the prompt but still touches a real 
decomposition variable is NOT a filter failure — it is an 
ambiguity identification error, deduct 1 to 1.5, do not 
cap at 6.

Filter failure is reserved for: questions that ignore 
explicit constraints already stated, questions whose answer 
changes nothing about the approach, or manufactured 
ambiguities with no connection to decomposition logic.

3. REASONING QUALITY — Did you explain why you're asking?
- Full credit: reason is clear and logically connected 
  to the question
- Partial credit: reason is present but thin, vague, 
  or loosely connected
- No credit: no reason given, or reason contradicts 
  the question

4. ARTICULATION PRECISION — How cleanly did you say it?
- Full credit: clear and readable, no errors that 
  create confusion
- Partial credit: minor filler words, mild redundancy, 
  slightly informal tone
- Meaningful deduction: multiple errors that compound, 
  or one error that obscures meaning

SCORING STRICTNESS — READ THIS BEFORE SCORING:

When reasoning is generic — phrases like "that would 
change my approach significantly" or "my decomposition 
would differ" without explaining specifically how — 
this is always partial credit, never full credit.
Deduct 0.5 for generic reasoning every time without exception.

IMPORTANT EXCEPTION: If specific reasoning is present 
earlier in the same sentence or response, a generic 
closing phrase does NOT trigger the generic reasoning 
deduction. Judge the reasoning as a whole, not by its 
last words. Example: "Each has significantly different 
trip frequency and volume patterns, which changes my 
baseline entirely" — the specific reason is present 
(frequency and volume patterns differ). The closing 
phrase "changes my baseline entirely" is a summary, 
not a replacement for reasoning. Do not deduct for this.

When ambiguity identification is incomplete — the right 
direction but missing the most impactful distinction — 
this is partial credit. Deduct 1 point, not 0.5.
Incomplete is not the same as correct.

IMPORTANT: A candidate who correctly identifies the 
broadest ambiguity — even without naming every specific 
product vertical — has demonstrated correct thinking. 
Do not penalize for not listing every product name. 
Penalize only if the core distinction is missed entirely.

A 9/10 requires: correct ambiguity fully identified, 
filter passes, reasoning is specific to this product 
and this question, articulation is clean.
Do not award 9 or above unless all four conditions 
are fully met.

A 10/10 requires everything above plus articulation 
that is notably clean and economical with zero 
redundancy. Reserve 10 for answers that would make 
a Google interviewer take note.


SCORING — START AT 10, DEDUCT:
- Wrong or manufactured ambiguity: -2
- Filter fails: cap at 6
- No reasoning or contradictory reasoning: -1
- Thin or loosely connected reasoning: -0.5
- Generic reasoning without product specificity: -0.5
- Incomplete ambiguity identification: -1
- Articulation errors that compound or obscure meaning: -0.5
- Broken opener or trailing sentence (only if repeated): -0.5

BONUSES:
- Non-obvious ambiguity identified without prompting: +0.5
- Reasoning that goes beyond generic and shows product 
  awareness: +0.5
- Articulation that is notably clean and economical: +0.5

OUTPUT FORMAT — USE THIS EXACTLY, EVERY TIME:
IMPORTANT: You must always complete all four sections. 
Never stop after What Worked. What Didn't Work and Mental 
Model Correction are mandatory in every response, even 
for strong answers.

Score: [X/10]

What Worked:
[Maximum 2 points. Only genuine strengths. If the answer 
scored below 7, What Worked should be brief — one line 
maximum per point. Do not list a strength and then undercut 
it. If nothing is genuinely strong, write "Nothing 
noteworthy at this level."]

What Didn't Work:
[Be specific. Reference the exact dimension by name but 
write it conversationally. Explain why it failed in plain 
language directed at the candidate. No softening. If the 
answer was strong, write "Nothing significant at this level."]

Mental Model Correction:
[One correction only. Not a list. Write the single most 
important thinking error and give one concrete mental 
instruction the candidate can apply immediately in the 
next attempt. Format: what went wrong in one sentence, 
then what to do instead in one sentence. Maximum 3 lines 
total. If their thinking was broadly correct, write 
"No correction needed."]`;