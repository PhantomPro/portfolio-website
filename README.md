# 🌌 Tanmay Basu — AI & Full Stack Developer Portfolio

[![Live Demo](https://img.shields.io/badge/Live-Portfolio-6366F1?style=for-the-badge&logo=vercel&logoColor=white)](#-live-deployment-options)
[![Stack](https://img.shields.io/badge/Stack-Angular_17_•_Node_•_Express_•_MongoDB-06B6D4?style=for-the-badge)](#-tech-stack)
[![Role](https://img.shields.io/badge/Role-Full_Stack_Developer_@_Ascendion-A855F7?style=for-the-badge)](https://ascendion.com/)

A modern, recruiter-focused personal portfolio website featuring a **Cybernetic AI Neural Theme**, interactive **VS Code agent terminal**, real-time **scrollspy navigation**, verified **Ascendion enterprise experience**, detailed **project case studies with high-fidelity UI templates**, and **cross-platform mobile responsiveness**.

---

## 🌟 Key Highlights

- **3-Way Theme Architecture**:
  - 🌌 **AI Neural Mode** (Default): Deep obsidian space (`#05050A`), quantum cyan (`#06B6D4`), neural indigo (`#818CF8`), generative fuchsia (`#EC4899`), neon rim lighting, and ambient floating neural synapse particles.
  - 🌙 **Classic Dark Mode**: Minimalist midnight palette for classic developer aesthetics.
  - ☀️ **Porcelain Light Mode**: Refined high-contrast slate porcelain with dark IDE terminal and blueprint grid.
- **Whole-Page Neural Mesh & Cyber Grid**: Fixed background with proximity synapse connections, interactive cursor glow, and Retina/high-DPI DPR scaling.
- **Enterprise Experience**: Showcases full-stack and AI engineering work at **Ascendion** (VS Code AI Plugin, Experience Studio 2.5 AAVA, Client Solutions).
- **Featured Case Studies**:
  - **Insurance Management Application**: Enterprise RBAC, automated claims pipeline, Apollo GraphQL, and MongoDB.
  - **AI Image Generator**: Real-time generative AI studio integrating OpenAI API.
  - **Carbon Stock Photo Gallery**: SSR photo catalog with Next.js, FastAPI, and PostgreSQL.
  - **Project Graphite**: CSS code workbench with single-click exports.
  - **Expense Tracker Dashboard**: Personal finance dashboard with Recharts visualizations.
- **Zero-Latency Resilience**: Frontend includes self-contained verified fallback data; if backend services are offline or sleeping, the entire portfolio loads in **< 0.5s** with 100% data fidelity.
- **Recruiter Ready**: WCAG AAA contrast, keyboard accessible, mobile notch safe-area handling, and touch-optimized (44px hit-targets).

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Angular 17+ (Standalone Components, Signals, Reactive Forms) |
| **Styling** | Vanilla SCSS, CSS Custom Properties, Glassmorphism, Responsive Grid/Flexbox |
| **Canvas** | Vanilla HTML5 2D Canvas with Proximity Synapse Algorithms & Battery Throttling |
| **Backend** | Node.js, Express.js, TypeScript |
| **Data Layer** | MongoDB, Mongoose, Resilient Offline Client Fallback |
| **Deployment** | Vercel, GitHub Pages, Docker |

---

## 🚀 Live Deployment Options (For Your Resume Link)

### Option 1: Vercel (Recommended — 2 Minutes, Zero Maintenance)

Vercel provides instant global CDN hosting, automatic HTTPS, and 100% uptime with zero cold starts:

1. Push this repository to your GitHub account (see instructions below).
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository (`portfolio-web` or `portfolio`).
4. Keep the default settings (the included `vercel.json` automatically configures the Angular build and SPA routing).
5. Click **Deploy**.
6. You will receive a permanent live URL (e.g., `https://tanmaybasu.vercel.app`), which you can put on your resume!

---

### Option 2: GitHub Pages (Free via Automated GitHub Actions)

This repository includes a pre-configured GitHub Actions workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

1. Create a repository on GitHub named `portfolio` (or `portfolio-web`).
2. Push your code to the `main` branch.
3. In your GitHub repository:
   - Go to **Settings** ➔ **Pages**.
   - Under **Build and deployment** ➔ **Source**, select **GitHub Actions**.
4. The workflow will automatically build the Angular application and publish it to:
   `https://<your-github-username>.github.io/<repo-name>/`

---

## 💻 Local Development

### 1. Start the Backend API

```bash
cd backend
npm install
npm run seed   # Populates MongoDB with verified data
npm run dev    # Runs API on http://localhost:3000
```

### 2. Start the Frontend Application

```bash
cd frontend
npm install
npm run start  # Serves Angular on http://localhost:4200
```

---

## 📦 Pushing to GitHub

To link and push this codebase to your GitHub account:

```bash
# 1. Stage all files
git add .

# 2. Create initial commit
git commit -m "feat: complete portfolio with AI theme, Ascendion experience, and live hosting setup"

# 3. Rename branch to main
git branch -M main

# 4. Link your remote repository (replace with your actual GitHub repo URL)
git remote add origin https://github.com/PhantomPro/<your-repo-name>.git

# 5. Push code
git push -u origin main
```

---

## 📬 Contact & Links

- **Developer**: Tanmay Basu
- **Email**: [basutanmay.007@gmail.com](mailto:basutanmay.007@gmail.com)
- **LinkedIn**: [linkedin.com/in/tanmay-basu-9310b01a1](https://www.linkedin.com/in/tanmay-basu-9310b01a1/)
- **GitHub**: [github.com/PhantomPro](https://github.com/PhantomPro)
- **Company**: [Ascendion](https://ascendion.com/)
