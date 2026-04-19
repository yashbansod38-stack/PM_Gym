// // app/api/evaluate/route.js
// import { SYSTEM_PROMPT } from "@/lib/questions";

// export async function POST(request) {
//   try {
//     const { sessionState, userAnswer } = await request.json();

//     if (!userAnswer || userAnswer.trim().length < 10) {
//       return Response.json(
//         { error: "Answer is too short. Please write at least a sentence." },
//         { status: 400 }
//       );
//     }

//     const apiKey = process.env.GEMINI_API_KEY;
//     if (!apiKey || apiKey === "your_gemini_api_key_here") {
//       return Response.json(
//         { error: "Gemini API key not configured. Add GEMINI_API_KEY to .env.local" },
//         { status: 500 }
//       );
//     }

//     const userMessage = `[Session Context]
// ${JSON.stringify(sessionState, null, 2)}

// [Candidate Answer]
// ${userAnswer}

// Evaluate this answer now.`;

//     const requestBody = {
//       contents: [
//         {
//           role: "user",
//           parts: [{
//             text: `SYSTEM INSTRUCTIONS:\n${SYSTEM_PROMPT}\n\n---\n\n${userMessage}`
//           }],
//         },
//       ],
//       generationConfig: {
//         temperature: 0.3,
//         maxOutputTokens: 1024,
//       },
//     };

//     console.log("SYSTEM PROMPT LENGTH:", SYSTEM_PROMPT.length);

//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(requestBody),
//       }
//     );

//     if (!response.ok) {
//       const errData = await response.json().catch(() => ({}));
//       const errMsg = errData?.error?.message || `Gemini API error: ${response.status}`;
//       return Response.json({ error: errMsg }, { status: response.status });
//     }

//     const data = await response.json();
//     const feedbackText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

//     if (!feedbackText) {
//       return Response.json(
//         { error: "No feedback returned from Gemini. Please try again." },
//         { status: 500 }
//       );
//     }

//     return Response.json({ feedback: feedbackText });

//   } catch (err) {
//     console.error("Evaluate API error:", err);
//     return Response.json(
//       { error: "Something went wrong. Please try again." },
//       { status: 500 }
//     );
//   }
// }





// app/api/evaluate/route.js
import { SYSTEM_PROMPT } from "@/lib/questions";

async function callGeminiWithRetry(url, requestBody, retries = 3) {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (response.status === 429 || response.status === 503) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      continue;
    }

    return response;
  }
  throw new Error("Gemini API unavailable after retries");
}

export async function POST(request) {
  try {
    const { sessionState, userAnswer } = await request.json();

    if (!userAnswer || userAnswer.trim().length < 10) {
      return Response.json(
        { error: "Answer is too short. Please write at least a sentence." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return Response.json(
        { error: "Gemini API key not configured. Add GEMINI_API_KEY to .env.local" },
        { status: 500 }
      );
    }

    // Pull evaluation note from session state
    const evaluationNote = sessionState?.session_state?.evaluation_note || "";

    // Build user message with evaluation note injected
    const userMessage = `[Session Context]
${JSON.stringify(sessionState, null, 2)}

[Question-Specific Evaluation Criteria]
Use this to anchor your scoring for this specific question.
${evaluationNote}

[Candidate Answer]
${userAnswer}

Evaluate this answer now. Follow the question-specific 
scoring guide above. Do not invent different criteria.`;

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `SYSTEM INSTRUCTIONS:\n${SYSTEM_PROMPT}\n\n---\n\n${userMessage}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2048,
      },
    };

    console.log("SYSTEM PROMPT LENGTH:", SYSTEM_PROMPT.length);
    console.log("EVALUATION NOTE:", evaluationNote.substring(0, 100));

    const response = await callGeminiWithRetry(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
      requestBody
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errMsg =
        errData?.error?.message || `Gemini API error: ${response.status}`;
      return Response.json({ error: errMsg }, { status: response.status });
    }

    const data = await response.json();
    const feedbackText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!feedbackText) {
      return Response.json(
        { error: "No feedback returned from Gemini. Please try again." },
        { status: 500 }
      );
    }

    return Response.json({ feedback: feedbackText });

  } catch (err) {
    console.error("Evaluate API error:", err);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}