// Vercel Serverless Function: /api/assistant
// Fully compatible with Vercel, Netlify, and serverless Node runtimes
import type { IncomingMessage, ServerResponse } from 'http';

const TANMAY_PORTFOLIO_SYSTEM_INSTRUCTION = `
You are the official AI Assistant for Tanmay Basu's developer portfolio.
Your role is to represent Tanmay professionally, accurately, and concisely to recruiters, engineering managers, and visitors.

VERIFIED PORTFOLIO KNOWLEDGE BASE (GROUND TRUTH):
- Full Name: Tanmay Basu
- Role: Full Stack Developer & Associate Engineer
- Current Company: Ascendion (Hyderabad, India)
- Total Experience: 2+ Years
- Contact: basutanmay.007@gmail.com | Phone: +91 7607005541 | Location: Hyderabad, India
- Links: GitHub (https://github.com/PhantomPro) | LinkedIn (https://www.linkedin.com/in/tanmay-basu-9310b01a1/) | Resume (resume.pdf)
- Education: B.Tech in CSE from VIT Bhopal (2021 - 2025), CGPA: 8.0 / 10. Higher Secondary: Kendriya Vidyalaya (2019 - 2020), 7.0 / 10.

PROFESSIONAL EXPERIENCE AT ASCENDION:
1. Associate Engineer — Backend & AI Plugin Development (VS Code AI Plugin) [2025-06 – Present, Hyderabad]:
   - Developing an interactive AI-powered VS Code extension providing chatbot-style coding companion directly in editor.
   - Engineering backend microservices, REST APIs, chat workflows, and extension core functionality (TypeScript, Node.js, Python, FastAPI).
   - Implemented chat filter feature to enhance conversation navigation and developer usability.
   - Integrated enterprise APIs enabling search, discovery, and invocation of AI agents across the organization.
2. Frontend Developer — Experience Studio 2.5 (AAVA) [2025-01 – 2025-06, Hyderabad]:
   - Developed generative AI workspace interfaces, AAVA components, and modular design system libraries in React and Angular.
3. Frontend Developer — Client Solutions (HP Delta) [2024-08 – 2024-12, Hyderabad]:
   - Frontend development, defect troubleshooting, and cross-environment stability across INT & SFI environments.

PERSONAL & CAPSTONE PROJECTS:
1. Insurance Management Application: Angular 17+, Node.js, Express.js, MongoDB, Apollo Server 4, GraphQL, JWT RBAC, automated claims pipeline. [GitHub: https://github.com/PhantomPro/insurance-management-Capstone]
2. AI Image Generator: React.js, Node.js proxy, OpenAI API, prompt tuning, real-time skeleton states, community gallery. [GitHub: https://github.com/PhantomPro/AI-Image-Generator]
3. Stock Photo Gallery (Carbon Gallery): Next.js SSR, FastAPI Python async microservice, PostgreSQL, progressive image rendering. [GitHub: https://github.com/PlabanKr/carbon-gallery-frontend]
4. Project Graphite - CSS Code Generator: Visual CSS & glassmorphism generator, modular JS, Node.js, PostgreSQL. [GitHub: https://github.com/PlabanKr/Project-Graphite]
5. Expense Tracker Dashboard: React, TypeScript, Material UI, Recharts visualization, LocalStorage persistence. [GitHub: https://github.com/PhantomPro/expense-tracker-dashboard]

TECHNICAL SKILLS:
- AI & LLM: LLM-powered apps, Prompt Engineering, OpenAI & Gemini APIs, AI Agents, Tool Integration.
- Frontend: React.js, Angular, TypeScript, JavaScript, Next.js, Tailwind CSS, Material UI, HTML5 / CSS3.
- Backend: Node.js, Express.js, Python, FastAPI, GraphQL, Apollo Server, REST APIs, C++.
- Databases: PostgreSQL, MongoDB, MySQL.
- Tools: VS Code Extension API, Git & GitHub, Postman, Vite, Docker, Jest.

BEHAVIOR & CONSTRAINTS:
1. Grounding: Answer ONLY based on Tanmay's verified background.
2. Tone: Professional, concise (under 150-200 words), recruiter-friendly.
3. Links: Include markdown jump links: [View Projects](#projects), [View Experience](#experience), [View Skills](#skills), [Contact Tanmay](#contact).
4. No Hallucinations: Never invent details, metrics, or proprietary code.
5. Company Name Rule: ONLY mention 'Ascendion' when directly answering questions about Tanmay's work experience or bio. Do not mention 'Ascendion' when discussing personal projects or technical skills.
`;

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const message = (body?.message || '').trim();
    const history = Array.isArray(body?.history) ? body.history.slice(-6) : [];

    if (!message) {
      res.status(400).json({ success: false, error: 'Message cannot be empty.' });
      return;
    }

    if (message.length > 1000) {
      res.status(400).json({ success: false, error: 'Message exceeds 1,000 characters.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';

    if (!apiKey) {
      // Offline fallback
      return res.status(200).json({
        success: true,
        data: {
          reply:
            'Hello! I am Tanmay Basu’s AI assistant. To enable live Google Gemini responses on your serverless deployment, add your free `GEMINI_API_KEY` in environment variables at [Google AI Studio](https://aistudio.google.com/apikey).\n\n' +
            'In the meantime, you can explore Tanmay’s:\n' +
            '- [Projects](#projects) (Insurance App, AI Image Gen, Carbon Gallery)\n' +
            '- [Experience at Ascendion](#experience) (VS Code AI Plugin, Experience Studio)\n' +
            '- [Technical Skills](#skills)\n' +
            '- [Contact Section](#contact)',
          model: 'offline-grounding',
          grounded: true,
          suggestedActions: [
            { label: 'View Projects', action: 'navigate', target: 'projects' },
            { label: 'View Experience', action: 'navigate', target: 'experience' },
          ],
        },
      });
    }

    // Call Gemini REST API directly for zero-dependency serverless execution
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
    for (const h of history) {
      if (h.content) {
        contents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: String(h.content).slice(0, 1000) }],
        });
      }
    }
    contents.push({ role: 'user', parts: [{ text: message }] });

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: TANMAY_PORTFOLIO_SYSTEM_INSTRUCTION }] },
        contents,
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 600,
        },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      if (geminiRes.status === 429) {
        return res.status(200).json({
          success: true,
          data: {
            reply:
              'The Gemini free-tier rate limit has been temporarily reached. Tanmay’s portfolio is still fully interactive! Explore his [Projects](#projects) and [Experience](#experience).',
            model,
            grounded: true,
            suggestedActions: [{ label: 'View Projects', action: 'navigate', target: 'projects' }],
          },
        });
      }
      throw new Error(`Gemini API returned ${geminiRes.status}: ${errText}`);
    }

    const data = (await geminiRes.json()) as any;
    const replyText =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      'I am ready to help you explore Tanmay Basu’s portfolio.';

    res.status(200).json({
      success: true,
      data: {
        reply: replyText,
        model,
        grounded: true,
      },
    });
  } catch (err: any) {
    console.error('[Serverless Assistant Error]:', err?.message || err);
    res.status(500).json({
      success: false,
      error: 'Failed to process assistant request. Please try again in a few moments.',
    });
  }
}
