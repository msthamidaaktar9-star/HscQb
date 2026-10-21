# Uddvash-Style Physics Question Bank & Exam Paper Generator

An interactive, production-ready Question Bank System with authentic **Uddvash publication styling**, MathJax 3 LaTeX rendering, real-time ID selector, interactive practice mode, and A4 PDF exam generator.

---

## 🌟 Features

1. **🔴 Uddvash 2-Column Style (Default Print/Read View):**
   - Deep Red (`#c0392b`) header banner.
   - 2-Column grid with middle vertical red divider line (`1px solid #c0392b`).
   - Topic ribbon badge, orange question numbering badges (`01.`, `02.`), and red board tags (`[Ctg.B'24; RB'21]`).
   - Soft pink Concept Box (`#fdedec`) with formula summaries.
   - Solution panel with step-by-step LaTeX vertical fractions (`\frac{a}{b}`).
   - Authentic footer branding: *"পদার্থবিজ্ঞান ১ম পত্র | পরিবর্তনের প্রত্যয়ে নিরন্তর পথচলা..."*.

2. **💡 Interactive Practice Mode:**
   - Single-column card layout.
   - Solutions hidden by default with a `💡 উত্তর দেখুন / Hide Solution` toggle.
   - Interactive MCQ options that immediately highlight **green** for correct answers and **red** for wrong answers.
   - Live score tracker and reset button.

3. **📝 Exam Paper Generator Mode:**
   - Shows **only** Question Stems, Vector SVG Diagrams, and Question parts (গ, ঘ / MCQ options).
   - Solutions and explanations are completely stripped.
   - Clean institutional exam header with student Name, Roll, Marks, and Time fields.

4. **🔍 Search & Filter System:**
   - **ID Selector**: Type IDs like `q01, mcq01` to filter questions instantly, or click the quick ID chips.
   - Real-time search across stems, topics, chapters, and board tags.
   - Dropdown filters for Chapter, Topic, Board, and Question Type (CQ / MCQ).

5. **🖨️ A4 PDF Print Optimization:**
   - Strict `@media print` rules: `@page { size: A4 portrait; margin: 10mm; }`.
   - `break-inside: avoid;` ensures question cards are never awkwardly split across pages.
   - Automatically hides navigation bars, filters, and buttons during printing.

---

## ⚡ 100% Offline Capability (কোনো ইন্টারনেট সংযোগ ছাড়া ব্যবহার)

This application is engineered for **complete offline usage**:
1. **Zero External Assets for Content:** All physics vector diagrams (inclined plane, cylindrical water well, screw gauge) are embedded as inline SVG.
2. **Built-in Offline LaTeX Engine:** When running offline, the built-in parser automatically converts LaTeX equations, vertical fractions (`\frac{a}{b}`), roots (`\sqrt{x}`), exponents, and Greek symbols into clean typography without needing internet or CDNs.
3. **Standalone Single-File (`standalone-question-bank.html`):** Double-click on PC or tap in Android file manager (Files by Google) under Airplane Mode.
4. **Offline PWA:** Once installed to your Android home screen or PC desktop, the Service Worker serves the entire application cache-first.

---

## 🚀 How to Run Locally

```bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/uddvash-question-bank.git
cd uddvash-question-bank

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 📦 Standalone Single-File Version (Zero Setup)

You can also open `standalone-question-bank.html` directly in **any web browser** without installing Node.js or any build tools! It is 100% self-contained with embedded HTML, CSS, JavaScript, MathJax 3, and questions.

---

## 🌐 Deploy to GitHub Repository & GitHub Pages

1. **Initialize Git & Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Uddvash Question Bank"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/uddvash-question-bank.git
   git push -u origin main
   ```

2. **Enable Free GitHub Pages:**
   - Go to your GitHub repository > **Settings** > **Pages**.
   - Under **Build and deployment > Source**, choose **Deploy from a branch**.
   - Select branch **`main`** and folder **`/ (root)`** (or configure GitHub Actions for Vite build).
   - Click **Save**. Your site will be live at `https://YOUR_USERNAME.github.io/uddvash-question-bank/standalone-question-bank.html`!

---

## 📱 How to Get the App on Android

### Method 1: Instant PWA Install (Fastest & Recommended)
1. Open the hosted web link in **Google Chrome** on your Android phone.
2. Tap the **three-dot menu (⋮)** in the top right corner.
3. Tap **"Add to Home screen"** or **"Install app"**.
4. The Uddvash Question Bank icon will appear on your phone's app drawer and run in full-screen standalone mode like a native app.

### Method 2: Convert to Standalone Android APK (.apk)
1. Go to [PWABuilder.com](https://www.pwabuilder.com/).
2. Enter your live web app URL (from GitHub Pages or Cloud Run).
3. Click **Start** > **Package for Android**.
4. Download the generated signed **.apk** file and install it directly on any Android device!
