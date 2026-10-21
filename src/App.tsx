/**
 * @license
 * Uddvash-Style Physics Question Bank & Exam Paper Generator
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Printer,
  Download,
  BookOpen,
  Search,
  RotateCcw,
  Plus,
  Smartphone,
  Github,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  FileText,
  Check,
  Copy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Layers,
  Sparkles,
  Edit3
} from 'lucide-react';
import { questionDatabase as initialDatabase, QuestionItem } from './data/questionDatabase';
import { triggerMathJax } from './utils/mathjax';

type DisplayTheme = 'uddvash' | 'practice' | 'exam';

export default function App() {
  // Questions database state (can be extended with user added questions)
  const [questions, setQuestions] = useState<QuestionItem[]>(() => {
    const saved = localStorage.getItem('uddvash_custom_questions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse saved questions', e);
      }
    }
    return initialDatabase;
  });

  // UI state
  const [currentTheme, setCurrentTheme] = useState<DisplayTheme>('uddvash');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [idInputText, setIdInputText] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedBoard, setSelectedBoard] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'CQ' | 'MCQ'>('all');

  // Online / Offline status
  const [isOnline, setIsOnline] = useState<boolean>(() => typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isAppInstalled, setIsAppInstalled] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsAppInstalled(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsAppInstalled(true);
      setInstallPrompt(null);
    }
  };

  // Interactive Practice State
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [openSolutions, setOpenSolutions] = useState<Record<string, boolean>>({});

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isAndroidGuideOpen, setIsAndroidGuideOpen] = useState<boolean>(false);
  const [isExportHtmlModalOpen, setIsExportHtmlModalOpen] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Exam details customizable
  const [examTitle, setExamTitle] = useState<string>('সাপ্তাহিক মূল্যায়ন ও অধ্যায়ভিত্তিক পরীক্ষা');
  const [institutionName, setInstitutionName] = useState<string>('উদ্ভাস একাডেমি ও ভর্তি কোচিং');

  // Form state for adding question
  const [newQ, setNewQ] = useState<Partial<QuestionItem>>({
    id: '',
    subject: 'HSC Physics 1st Paper',
    chapter: 'Chapter 05: Work, Energy & Power',
    topic: 'T-05: Power',
    type: 'CQ',
    boardTag: "[Dhaka B'24]",
    stem: '',
    questionText: '',
    solution: '',
    conceptSummary: '',
    options: { a: '', b: '', c: '', d: '' },
    correctOption: 'a',
    marks: 10
  });

  const contentRef = useRef<HTMLDivElement>(null);

  // Save questions to localStorage
  useEffect(() => {
    localStorage.setItem('uddvash_custom_questions', JSON.stringify(questions));
  }, [questions]);

  // Retrigger MathJax on DOM updates
  useEffect(() => {
    triggerMathJax(contentRef.current);
  }, [questions, currentTheme, selectedIds, searchQuery, selectedChapter, selectedTopic, selectedBoard, selectedType, openSolutions]);

  // Derive unique filter options
  const chapters = useMemo(() => {
    return Array.from(new Set(questions.map((q) => q.chapter)));
  }, [questions]);

  const topics = useMemo(() => {
    const list = selectedChapter === 'all'
      ? questions
      : questions.filter((q) => q.chapter === selectedChapter);
    return Array.from(new Set(list.map((q) => q.topic)));
  }, [questions, selectedChapter]);

  const boards = useMemo(() => {
    return Array.from(new Set(questions.map((q) => q.boardTag).filter(Boolean)));
  }, [questions]);

  // Parse ID input
  const handleIdInputChange = (val: string) => {
    setIdInputText(val);
    const parsed = val
      .split(/[\s,]+/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    setSelectedIds(parsed);
  };

  const toggleQuickId = (id: string) => {
    const lowerId = id.toLowerCase();
    let updated: string[];
    if (selectedIds.includes(lowerId)) {
      updated = selectedIds.filter((item) => item !== lowerId);
    } else {
      updated = [...selectedIds, lowerId];
    }
    setSelectedIds(updated);
    setIdInputText(updated.join(', '));
  };

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      // ID check
      if (selectedIds.length > 0) {
        const matchesId = selectedIds.some((id) => q.id.toLowerCase() === id);
        if (!matchesId) return false;
      }

      // Chapter check
      if (selectedChapter !== 'all' && q.chapter !== selectedChapter) {
        return false;
      }

      // Topic check
      if (selectedTopic !== 'all' && q.topic !== selectedTopic) {
        return false;
      }

      // Board check
      if (selectedBoard !== 'all' && q.boardTag !== selectedBoard) {
        return false;
      }

      // Type check
      if (selectedType !== 'all' && q.type !== selectedType) {
        return false;
      }

      // Search keyword
      if (searchQuery.trim() !== '') {
        const kw = searchQuery.toLowerCase();
        const matchesStem = q.stem.toLowerCase().includes(kw);
        const matchesText = q.questionText.toLowerCase().includes(kw);
        const matchesTopic = q.topic.toLowerCase().includes(kw);
        const matchesChapter = q.chapter.toLowerCase().includes(kw);
        const matchesId = q.id.toLowerCase().includes(kw);
        const matchesBoard = q.boardTag.toLowerCase().includes(kw);
        if (!matchesStem && !matchesText && !matchesTopic && !matchesChapter && !matchesId && !matchesBoard) {
          return false;
        }
      }

      return true;
    });
  }, [questions, selectedIds, selectedChapter, selectedTopic, selectedBoard, selectedType, searchQuery]);

  // Reset filters
  const resetFilters = () => {
    setSelectedIds([]);
    setIdInputText('');
    setSearchQuery('');
    setSelectedChapter('all');
    setSelectedTopic('all');
    setSelectedBoard('all');
    setSelectedType('all');
  };

  // Toggle single solution
  const toggleSolution = (id: string) => {
    setOpenSolutions((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Toggle all solutions
  const toggleAllSolutions = (open: boolean) => {
    const next: Record<string, boolean> = {};
    filteredQuestions.forEach((q) => {
      next[q.id] = open;
    });
    setOpenSolutions(next);
  };

  // MCQ Selection handler
  const handleMcqSelect = (qId: string, optionKey: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: optionKey
    }));
  };

  // Practice score calculation
  const mcqQuestions = useMemo(() => filteredQuestions.filter((q) => q.type === 'MCQ'), [filteredQuestions]);
  const answeredCount = useMemo(() => {
    return mcqQuestions.filter((q) => userAnswers[q.id] !== undefined).length;
  }, [mcqQuestions, userAnswers]);

  const correctCount = useMemo(() => {
    return mcqQuestions.filter((q) => userAnswers[q.id] === q.correctOption).length;
  }, [mcqQuestions, userAnswers]);

  // Print trigger
  const handlePrint = () => {
    window.print();
  };

  // Standalone Single HTML generator with 100% Offline Engine
  const generateStandaloneHtmlString = () => {
    const jsonString = JSON.stringify(questions, null, 2);
    return `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>উদ্ভাস ফিজিক্স প্রশ্নব্যাংক (অফলাইন সংস্করণ)</title>
  <!-- Bengali System Fonts with Google Fonts Fallback -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap" rel="stylesheet">
  <!-- MathJax (Online CDN - automatically falls back to offline renderer if unavailable) -->
  <script>
    window.MathJax = {
      tex: { inlineMath: [['\\\\(', '\\\\)'], ['$', '$']], displayMath: [['\\\\[', '\\\\]'], ['$$', '$$']], processEscapes: true },
      options: { skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'] },
      svg: { fontCache: 'global' },
      startup: { typeset: false }
    };
  </script>
  <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
  <style>
    :root {
      --uddvash-red: #c0392b; --uddvash-dark-red: #962d22; --uddvash-pink: #fdedec; --uddvash-pink-border: #f5b7b1; --uddvash-orange: #d35400;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Hind Siliguri', 'Kalpurush', 'SolaimanLipi', 'Siyam Rupali', 'Vrinda', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f8fafc; color: #1e293b; padding: 16px; line-height: 1.5;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    .top-bar { background: #fff; padding: 12px 18px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .offline-badge { background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
    .uddvash-banner { background: linear-gradient(135deg, #c0392b, #962d22); color: #fff; padding: 14px 18px; border-radius: 4px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
    .uddvash-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; position: relative; }
    .uddvash-column { display: flex; flex-direction: column; gap: 20px; }
    .uddvash-divider { position: absolute; top: 0; bottom: 0; left: 50%; width: 1px; background: #c0392b; }
    .card { background: #fff; border: 1px solid #f1f5f9; padding: 14px; border-radius: 4px; break-inside: avoid; page-break-inside: avoid; }
    .topic-badge { display: inline-block; background: #c0392b; color: #fff; padding: 2px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; margin-bottom: 8px; }
    .badge-num { background: #d35400; color: #fff; font-weight: 700; font-size: 0.85rem; padding: 2px 6px; border-radius: 4px; }
    .board-tag { color: #c0392b; font-weight: 700; font-size: 0.8rem; }
    .concept-box { background: #fdedec; border: 1px solid #f5b7b1; padding: 8px 12px; border-radius: 4px; font-size: 0.85rem; margin: 10px 0; color: #78281f; }
    .solution-box { background: #fdedec; border: 1px solid #f5b7b1; padding: 10px 12px; border-radius: 4px; margin-top: 10px; font-size: 0.85rem; }
    .mcq-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin: 8px 0; font-size: 0.85rem; }
    .mcq-item { background: #f8fafc; padding: 4px 8px; border: 1px solid #e2e8f0; border-radius: 4px; }
    /* Offline Math Vertical Fractions & Equations */
    .vfrac { display: inline-flex; flex-direction: column; text-align: center; vertical-align: middle; font-size: 0.88em; line-height: 1.1; margin: 0 3px; }
    .vnum { border-bottom: 1.5px solid currentColor; padding: 0 3px 1px 3px; }
    .vden { padding: 1px 3px 0 3px; }
    .radicand { border-top: 1.5px solid currentColor; padding: 0 2px; }
    @media print {
      @page { size: A4 portrait; margin: 10mm; }
      body { background: #fff; }
      .no-print { display: none !important; }
      .uddvash-grid { display: grid !important; grid-template-columns: 1fr 1fr !important; }
      .uddvash-divider { display: block !important; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="top-bar no-print">
      <div style="display:flex;align-items:center;gap:10px;">
        <h2 style="color: #c0392b; font-size: 1.2rem; margin:0;">উদ্ভাস ফিজিক্স প্রশ্নব্যাংক</h2>
        <span class="offline-badge">⚡ ১০০% অফলাইন উপযোগী</span>
      </div>
      <button onclick="window.print()" style="background:#c0392b;color:#fff;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;font-weight:600;">🖨️ A4 PDF প্রিন্ট</button>
    </div>
    <div class="uddvash-banner">
      <div>
        <h3 style="font-size: 1.2rem; font-weight: 700;">পদার্থবিজ্ঞান ১ম পত্র • প্রশ্নব্যাংক সংকলন</h3>
        <p style="font-size: 0.85rem; opacity: 0.9;">বোর্ড প্রশ্ন, সমাধান ও ধারণা</p>
      </div>
      <div style="font-size: 0.85rem; font-weight: bold; border: 1px solid rgba(255,255,255,0.4); padding: 4px 8px; border-radius: 4px;">উদ্ভাসের বিশেষ সংকলন</div>
    </div>
    <div id="renderArea" class="uddvash-grid"></div>
  </div>
  <script>
    const database = ${jsonString};
    const renderArea = document.getElementById('renderArea');
    const leftCol = []; const rightCol = [];
    database.forEach((q, i) => { if (i % 2 === 0) leftCol.push(q); else rightCol.push(q); });
    function renderCard(q, idx) {
      return \`
        <div class="card">
          <div class="topic-badge">\${q.topic}</div>
          <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
            <span class="badge-num">\${String(idx+1).padStart(2,'0')}.</span>
            <span class="board-tag">\${q.boardTag}</span>
          </div>
          <div class="stem-el" style="margin-bottom:8px;">\${q.stem}</div>
          \${q.svgDiagram ? \`<div style="text-align:center;margin:8px 0;">\${q.svgDiagram}</div>\` : ''}
          \${q.conceptSummary ? \`<div class="concept-box">\${q.conceptSummary}</div>\` : ''}
          <div class="q-prompts-el" style="font-weight:600;margin:8px 0;white-space:pre-line;">\${q.questionText}</div>
          \${q.type === 'MCQ' && q.options ? \`
            <div class="mcq-grid">
              <div class="mcq-item"><b>(ক)</b> \\(\${q.options.a}\\)</div>
              <div class="mcq-item"><b>(খ)</b> \\(\${q.options.b}\\)</div>
              <div class="mcq-item"><b>(গ)</b> \\(\${q.options.c}\\)</div>
              <div class="mcq-item"><b>(ঘ)</b> \\(\${q.options.d}\\)</div>
            </div>\` : ''}
          <div class="solution-box">
            <div style="font-weight:700;color:#962d22;margin-bottom:4px;">📌 সমাধান ও ব্যাখ্যা:</div>
            <div class="sol-el">\${q.solution}</div>
          </div>
        </div>\`;
    }
    renderArea.innerHTML = \`
      <div class="uddvash-column">\${leftCol.map((q, i) => renderCard(q, i * 2)).join('')}</div>
      <div class="uddvash-divider"></div>
      <div class="uddvash-column">\${rightCol.map((q, i) => renderCard(q, i * 2 + 1)).join('')}</div>\`;

    // Offline LaTeX fallback engine: if user is offline and MathJax CDN did not load
    function parseLatexOffline(str) {
      if (!str) return '';
      str = str.replace(/\\\\\\\\/g, '<br/>');
      str = str.replace(/\\\\textbf\\{([^{}]+)\\}/g, '<strong>$1</strong>');
      str = str.replace(/\\\\underline\\{([^{}]+)\\}/g, '<u>$1</u>');
      str = str.replace(/\\\\text\\{([^{}]+)\\}/g, '$1');
      str = str.replace(/\\\\theta/g, 'θ').replace(/\\\\mu/g, 'μ').replace(/\\\\pi/g, 'π').replace(/\\\\rho/g, 'ρ').replace(/\\\\eta/g, 'η');
      str = str.replace(/\\\\times/g, ' × ').replace(/\\\\cdot/g, ' · ').replace(/\\\\pm/g, ' ± ').replace(/\\\\approx/g, ' ≈ ');
      str = str.replace(/\\\\implies/g, ' ⇒ ').replace(/\\\\therefore/g, ' ∴ ').replace(/\\\\circ/g, '°');
      str = str.replace(/\\\\sqrt\\{([^{}]+)\\}/g, '√<span class="radicand">$1</span>');
      let loop = 0;
      while (/\\\\frac\\{([^{}]+)\\}\\{([^{}]+)\\}/.test(str) && loop < 6) {
        str = str.replace(/\\\\frac\\{([^{}]+)\\}\\{([^{}]+)\\}/g, '<span class="vfrac"><span class="vnum">$1</span><span class="vden">$2</span></span>');
        loop++;
      }
      str = str.replace(/\\^\\{([^{}]+)\\}/g, '<sup>$1</sup>').replace(/\\^([0-9a-zA-Z°]+)/g, '<sup>$1</sup>');
      str = str.replace(/_\\{([^{}]+)\\}/g, '<sub>$1</sub>').replace(/_([0-9a-zA-Z]+)/g, '<sub>$1</sub>');
      str = str.replace(/\\\\\\[([\\s\\S]*?)\\\\\\]/g, '<div style="margin:6px 0;text-align:center;">$1</div>');
      str = str.replace(/\\\\\\(([\\s\\S]*?)\\\\\\)/g, '<span>$1</span>');
      return str;
    }

    function runOfflineFallback() {
      document.querySelectorAll('.stem-el, .q-prompts-el, .concept-box, .sol-el, .mcq-item').forEach(el => {
        el.innerHTML = parseLatexOffline(el.innerHTML);
      });
    }

    // Try MathJax first; if unavailable within 200ms (offline), run offline parser
    if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
      window.MathJax.typesetPromise().catch(runOfflineFallback);
    } else {
      setTimeout(() => {
        if (!window.MathJax || typeof window.MathJax.typesetPromise !== 'function') {
          runOfflineFallback();
        } else {
          window.MathJax.typesetPromise();
        }
      }, 150);
    }
  </script>
</body>
</html>`;
  };

  const handleDownloadStandaloneHtml = async () => {
    try {
      const response = await fetch('/standalone-question-bank.html');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'uddvash-physics-question-bank.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open('/standalone-question-bank.html', '_blank');
    }
  };

  const handleDownloadJson = async () => {
    try {
      const response = await fetch('/question-database.json');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'question-database.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open('/question-database.json', '_blank');
    }
  };

  const handleDownloadSql = async () => {
    try {
      const response = await fetch('/question-database.sql');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'question-database.sql';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open('/question-database.sql', '_blank');
    }
  };

  const handleCopyStandaloneCode = async () => {
    try {
      const response = await fetch('/standalone-question-bank.html');
      const text = await response.text();
      await navigator.clipboard.writeText(text);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (e) {
      console.error('Copy failed:', e);
    }
  };

  // Add question handler
  const handleAddQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQ.id || !newQ.stem || !newQ.questionText || !newQ.solution) {
      alert('অনুগ্রহ করে ID, উদ্দীপক, প্রশ্ন এবং সমাধান সঠিকভাবে পূরণ করুন।');
      return;
    }

    const created: QuestionItem = {
      id: newQ.id.trim(),
      subject: newQ.subject || 'HSC Physics 1st Paper',
      chapter: newQ.chapter || 'Chapter 05: Work, Energy & Power',
      topic: newQ.topic || 'T-Custom: সাধারণ সমস্যা',
      type: (newQ.type as 'CQ' | 'MCQ') || 'CQ',
      boardTag: newQ.boardTag || "[Custom'26]",
      stem: newQ.stem || '',
      questionText: newQ.questionText || '',
      solution: newQ.solution || '',
      conceptSummary: newQ.conceptSummary || '💡 মূল সূত্র: প্রয়োজনীয় সূত্রাবলী অনুসরণ কর।',
      options: newQ.type === 'MCQ' ? newQ.options : undefined,
      correctOption: newQ.type === 'MCQ' ? (newQ.correctOption as any) : undefined,
      marks: newQ.type === 'CQ' ? 10 : 1
    };

    setQuestions((prev) => [created, ...prev]);
    setIsAddModalOpen(false);
    // Reset form
    setNewQ({
      id: '',
      subject: 'HSC Physics 1st Paper',
      chapter: 'Chapter 05: Work, Energy & Power',
      topic: 'T-05: Power',
      type: 'CQ',
      boardTag: "[Dhaka B'24]",
      stem: '',
      questionText: '',
      solution: '',
      conceptSummary: '',
      options: { a: '', b: '', c: '', d: '' },
      correctOption: 'a',
      marks: 10
    });
  };

  // Split questions for 2-column Uddvash layout
  const { leftColQuestions, rightColQuestions } = useMemo(() => {
    const left: QuestionItem[] = [];
    const right: QuestionItem[] = [];
    filteredQuestions.forEach((q, idx) => {
      if (idx % 2 === 0) left.push(q);
      else right.push(q);
    });
    return { leftColQuestions: left, rightColQuestions: right };
  }, [filteredQuestions]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-16 selection:bg-red-200">
      
      {/* ======================================================================
          TOP NAVIGATION BAR (Zone 1: Brand, Zone 2: Links/Modes, Zone 3: Actions)
          ====================================================================== */}
      <header className="no-print sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          
          {/* Brand Wordmark (Zone 1) */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#c0392b] to-[#962d22] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              উ
            </div>
            <div>
              <span className="text-base font-bold text-[#962d22] tracking-tight block leading-tight">
                উদ্ভাস ফিজিক্স প্রশ্নব্যাংক
              </span>
              <span className="text-xs text-slate-500 font-medium hidden sm:block">
                HSC & Admission • Question Bank & Exam Maker
              </span>
            </div>
          </div>

          {/* Theme Switcher Segmented Control (Zone 2) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 overflow-x-auto shrink-0">
            <button
              onClick={() => setCurrentTheme('uddvash')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
                currentTheme === 'uddvash'
                  ? 'bg-white text-[#c0392b] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>উদ্ভাস ২-কলাম ভিউ</span>
            </button>

            <button
              onClick={() => setCurrentTheme('practice')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
                currentTheme === 'practice'
                  ? 'bg-white text-[#c0392b] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>অনুশীলন মোড (Practice)</span>
            </button>

            <button
              onClick={() => setCurrentTheme('exam')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
                currentTheme === 'exam'
                  ? 'bg-white text-[#c0392b] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>পরীক্ষা প্রশ্নপত্র (Exam Paper)</span>
            </button>
          </div>

          {/* Action CTAs (Zone 3) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Live Online / Offline Status Badge */}
            {!isOnline ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300 rounded-lg shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span>অফলাইন মোড</span>
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>ক্যাশড ও অফলাইন প্রস্তুত</span>
              </span>
            )}

            {/* PWA Install Button (if available and not installed) */}
            {installPrompt && !isAppInstalled && (
              <button
                onClick={handleInstallClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-lg hover:bg-emerald-100 transition-colors whitespace-nowrap shadow-2xs"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                <span>অফলাইনে ইনস্টল করুন</span>
              </button>
            )}

            <button
              onClick={() => setIsAndroidGuideOpen(true)}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
              title="Android PWA & GitHub নির্দেশিকা"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Android & GitHub</span>
            </button>

            <button
              onClick={() => setIsExportHtmlModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap shadow-2xs"
              title="একক অফলাইন এইচটিএমএল ফাইল ডাউনলোড করুন"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>ফাইল ডাউনলোড (Offline HTML)</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#c0392b] hover:bg-[#962d22] rounded-lg shadow-xs transition-colors whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>A4 PDF প্রিন্ট</span>
            </button>
          </div>

        </div>
      </header>

      {/* ======================================================================
          FILTER & CONTROL PANEL (ID Selector, Search, Filter Dropdowns)
          ====================================================================== */}
      <section className="no-print max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-2">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
            
            {/* ID Selector Input */}
            <div className="lg:col-span-2 space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>প্রশ্ন ID দ্বারা সিলেক্ট (e.g. q01, mcq01)</span>
                {selectedIds.length > 0 && (
                  <span className="text-[#c0392b] font-mono lowercase">
                    {selectedIds.length} টি সিলেক্টেড
                  </span>
                )}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={idInputText}
                  onChange={(e) => handleIdInputChange(e.target.value)}
                  placeholder="যেমন: q01, mcq01, q02 (কমা দিয়ে একাধিক)"
                  className="w-full pl-3 pr-8 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-[#c0392b] focus:ring-1 focus:ring-[#c0392b] outline-none font-mono"
                />
                {idInputText && (
                  <button
                    onClick={() => handleIdInputChange('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    ×
                  </button>
                )}
              </div>
              
              {/* Quick ID Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400 font-medium">দ্রুত নির্বাচন:</span>
                {questions.map((q) => {
                  const isSelected = selectedIds.includes(q.id.toLowerCase());
                  return (
                    <button
                      key={q.id}
                      onClick={() => toggleQuickId(q.id)}
                      className={`text-[11px] font-mono px-2 py-0.5 rounded border transition-colors ${
                        isSelected
                          ? 'bg-[#c0392b] text-white border-[#962d22]'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {q.id}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Keyword Search */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                প্রশ্ন বা টপিক সার্চ
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="শব্দ দিয়ে সার্চ..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-[#c0392b] focus:ring-1 focus:ring-[#c0392b] outline-none"
                />
              </div>
            </div>

            {/* Chapter Filter */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                অধ্যায় (Chapter)
              </label>
              <select
                value={selectedChapter}
                onChange={(e) => {
                  setSelectedChapter(e.target.value);
                  setSelectedTopic('all');
                }}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-[#c0392b] outline-none"
              >
                <option value="all">সকল অধ্যায় (All Chapters)</option>
                {chapters.map((ch) => (
                  <option key={ch} value={ch}>
                    {ch}
                  </option>
                ))}
              </select>
            </div>

            {/* Type & Reset Filter */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                প্রশ্নের ধরন (Type)
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-[#c0392b] outline-none"
                >
                  <option value="all">সব ধরন (CQ + MCQ)</option>
                  <option value="CQ">সৃজনশীল (CQ)</option>
                  <option value="MCQ">বহুনির্বাচনি (MCQ)</option>
                </select>

                <button
                  onClick={resetFilters}
                  title="রিসেট ফিল্টার"
                  className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors shrink-0"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Secondary bar: Filter status & quick actions */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-3">
              <span>
                প্রদর্শিত প্রশ্ন: <strong className="text-slate-900 font-bold tabular-nums">{filteredQuestions.length}</strong> টি
                (মোট {questions.length} টির মধ্যে)
              </span>
              <span className="text-slate-300">|</span>
              <span>
                সৃজনশীল (CQ): <strong className="text-slate-800 font-semibold">{filteredQuestions.filter(q => q.type === 'CQ').length}</strong>
              </span>
              <span>
                MCQ: <strong className="text-slate-800 font-semibold">{filteredQuestions.filter(q => q.type === 'MCQ').length}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              {currentTheme === 'practice' && (
                <>
                  <button
                    onClick={() => toggleAllSolutions(true)}
                    className="text-[11px] font-semibold text-slate-700 hover:text-[#c0392b] px-2 py-1 rounded bg-slate-100 hover:bg-slate-200"
                  >
                    সব সমাধান খুলুন
                  </button>
                  <button
                    onClick={() => toggleAllSolutions(false)}
                    className="text-[11px] font-semibold text-slate-700 hover:text-[#c0392b] px-2 py-1 rounded bg-slate-100 hover:bg-slate-200"
                  >
                    সব সমাধান লুকান
                  </button>
                  <span className="text-slate-300">|</span>
                </>
              )}

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#c0392b] hover:text-[#962d22] px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>নতুন প্রশ্ন যোগ করুন</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================================
          MAIN CONTENT AREA (Renders based on selected Theme)
          ====================================================================== */}
      <main ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 print-area">
        
        {filteredQuestions.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-xl p-12 text-center my-6">
            <HelpCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800 mb-1">কোনো প্রশ্ন পাওয়া যায়নি</h3>
            <p className="text-sm text-slate-500 mb-4">
              আপনার নির্বাচিত ID বা ফিল্টার শর্ত অনুযায়ী কোনো প্রশ্ন মিলছে না।
            </p>
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#c0392b] rounded-lg hover:bg-[#962d22] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ফিল্টার রিসেট করুন</span>
            </button>
          </div>
        ) : (
          <>
            {/* 🔴 THEME 1: UDDVASH 2-COLUMN VIEW */}
            {currentTheme === 'uddvash' && (
              <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-7 shadow-xs">
                
                {/* Uddvash Header Banner */}
                <div className="bg-gradient-to-r from-[#c0392b] to-[#962d22] text-white p-4 sm:p-5 rounded-md mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 shadow-xs bg-print-red">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold tracking-wide">
                      পদার্থবিজ্ঞান ১ম পত্র • প্রশ্নব্যাংক ও গাণিতিক সমাধান
                    </h2>
                    <p className="text-xs sm:text-sm font-medium opacity-90 mt-0.5">
                      {filteredQuestions[0]?.chapter || 'এইচএসসি পদার্থবিজ্ঞান'} • বোর্ড প্রশ্ন ও বিস্তারিত সলভ
                    </p>
                  </div>
                  <div className="text-xs font-bold border border-white/40 px-3 py-1 rounded bg-white/10 uppercase tracking-wider shrink-0">
                    উদ্ভাসের বিশেষ প্রকাশনা
                  </div>
                </div>

                {/* 2-Column Grid Layout with Middle Divider Line */}
                <div className="relative uddvash-columns">
                  
                  {/* Left Column */}
                  <div className="flex flex-col gap-6">
                    {leftColQuestions.map((q, idx) => (
                      <UddvashQuestionCard
                        key={q.id}
                        question={q}
                        index={idx * 2}
                      />
                    ))}
                  </div>

                  {/* Middle Vertical Divider Line (c0392b) */}
                  <div className="hidden lg:block uddvash-divider" />

                  {/* Right Column */}
                  <div className="flex flex-col gap-6">
                    {rightColQuestions.map((q, idx) => (
                      <UddvashQuestionCard
                        key={q.id}
                        question={q}
                        index={idx * 2 + 1}
                      />
                    ))}
                  </div>

                </div>

                {/* Footer Branding */}
                <div className="mt-8 pt-4 border-t border-dashed border-slate-300 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 font-medium gap-2">
                  <span>পদার্থবিজ্ঞান ১ম পত্র | পরিবর্তনের প্রত্যয়ে নিরন্তর পথচলা...</span>
                  <span>পৃষ্ঠা নং: ০১ • উদ্ভাস অ্যাকাডেমিক অ্যান্ড অ্যাডমিশন কেয়ার</span>
                </div>

              </div>
            )}

            {/* 💡 THEME 2: INTERACTIVE PRACTICE MODE */}
            {currentTheme === 'practice' && (
              <div className="space-y-4">
                
                {/* Practice Score Ticker */}
                {mcqQuestions.length > 0 && (
                  <div className="no-print bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          ইন্টারঅ্যাক্টিভ অনুশীলন অগ্রগতি
                        </h4>
                        <p className="text-xs text-slate-500">
                          MCQ উত্তর নির্বাচন করে তাৎক্ষণিক সঠিকতা যাচাই করুন।
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <div className="px-3 py-1 rounded-md bg-slate-100 text-slate-700">
                        উত্তর দেওয়া হয়েছে: <span className="text-slate-900 font-bold tabular-nums">{answeredCount}</span> / {mcqQuestions.length}
                      </div>
                      <div className="px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                        সঠিক: <span className="font-bold tabular-nums">{correctCount}</span>
                      </div>
                      {answeredCount > 0 && (
                        <button
                          onClick={() => setUserAnswers({})}
                          className="text-[11px] text-slate-500 hover:text-red-600 underline font-normal"
                        >
                          উত্তর রিসেট
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Question Cards List */}
                <div className="flex flex-col gap-4">
                  {filteredQuestions.map((q, idx) => (
                    <InteractivePracticeCard
                      key={q.id}
                      question={q}
                      index={idx}
                      isSolOpen={!!openSolutions[q.id]}
                      onToggleSolution={() => toggleSolution(q.id)}
                      userAnswer={userAnswers[q.id]}
                      onSelectOption={(opt) => handleMcqSelect(q.id, opt)}
                    />
                  ))}
                </div>

              </div>
            )}

            {/* 📝 THEME 3: EXAM PAPER GENERATOR MODE */}
            {currentTheme === 'exam' && (
              <div className="bg-white border border-slate-300 rounded-lg p-6 sm:p-10 shadow-xs print:p-0 print:border-none print:shadow-none">
                
                {/* Exam Paper Header */}
                <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
                  <div className="flex items-center justify-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-wide">
                      {institutionName}
                    </h2>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-700 mt-1">
                    {examTitle}
                  </h3>
                  
                  <div className="flex flex-wrap justify-between items-center text-xs sm:text-sm font-semibold text-slate-600 mt-3 px-2 border-t border-slate-200 pt-2">
                    <span>বিষয়: {filteredQuestions[0]?.subject || 'পদার্থবিজ্ঞান ১ম পত্র'}</span>
                    <span>
                      পূর্ণমান: {filteredQuestions.reduce((sum, q) => sum + (q.type === 'CQ' ? 10 : 1), 0)} নম্বর
                    </span>
                    <span>
                      সময়: {Math.max(15, filteredQuestions.length * 15)} মিনিট
                    </span>
                  </div>
                </div>

                {/* Student Credentials Box */}
                <div className="bg-slate-50 border border-slate-300 rounded-md p-3 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-700 font-medium">
                  <div>শিক্ষার্থীর নাম: _______________</div>
                  <div>রোল নং: _______________</div>
                  <div>শাখা/ব্যাচ: _______________</div>
                  <div>তারিখ: _______________</div>
                </div>

                {/* Instructions */}
                <div className="text-xs italic text-slate-500 mb-6 bg-slate-50/60 p-2.5 rounded border border-slate-200">
                  বিশেষ দ্রষ্টব্য: ডান পাশের সংখ্যা প্রশ্নের পূর্ণমান জ্ঞাপক। প্রতিটি প্রশ্নের উদ্দীপক মনোযোগ দিয়ে পড়ে উত্তর প্রদান কর। ক্যালকুলেটর ব্যবহারযোগ্য।
                </div>

                {/* Question List (Only Stem, SVG, and Question Text; Solutions completely hidden!) */}
                <div className="space-y-7">
                  {filteredQuestions.map((q, idx) => (
                    <div key={q.id} className="border-b border-dashed border-slate-300 pb-6 break-inside-avoid">
                      
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-bold text-sm sm:text-base text-slate-900">
                          {String(idx + 1).padStart(2, '0')}. ({q.type}) <span className="text-xs font-normal text-slate-400 font-mono">[{q.id}]</span>
                        </div>
                        <div className="text-xs font-bold text-[#c0392b] border border-red-200 bg-red-50 px-2 py-0.5 rounded">
                          {q.type === 'CQ' ? '১০ নম্বর' : '১ নম্বর'}
                        </div>
                      </div>

                      {/* Stem */}
                      <div className="text-xs sm:text-sm text-slate-800 text-justify mb-3 leading-relaxed">
                        {q.stem}
                      </div>

                      {/* Diagram if any */}
                      {q.svgDiagram && (
                        <div
                          className="my-3 p-2 bg-slate-50 border border-slate-200 rounded text-center max-w-sm mx-auto"
                          dangerouslySetInnerHTML={{ __html: q.svgDiagram }}
                        />
                      )}

                      {/* Question parts */}
                      <div className="text-xs sm:text-sm font-semibold text-slate-900 whitespace-pre-line leading-relaxed">
                        {q.questionText}
                      </div>

                      {/* MCQ Options if applicable */}
                      {q.type === 'MCQ' && q.options && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-xs">
                          <div className="p-2 border border-slate-200 rounded bg-slate-50">
                            <strong>(ক)</strong> \( {q.options.a} \)
                          </div>
                          <div className="p-2 border border-slate-200 rounded bg-slate-50">
                            <strong>(খ)</strong> \( {q.options.b} \)
                          </div>
                          <div className="p-2 border border-slate-200 rounded bg-slate-50">
                            <strong>(গ)</strong> \( {q.options.c} \)
                          </div>
                          <div className="p-2 border border-slate-200 rounded bg-slate-50">
                            <strong>(ঘ)</strong> \( {q.options.d} \)
                          </div>
                        </div>
                      )}

                    </div>
                  ))}
                </div>

                {/* Exam End Marker */}
                <div className="text-center text-xs font-bold text-slate-400 mt-8 tracking-widest uppercase">
                  --- পরীক্ষা সমাপ্ত ---
                </div>

              </div>
            )}
          </>
        )}

      </main>

      {/* ======================================================================
          MODAL 1: ADD NEW QUESTION DIALOG
          ====================================================================== */}
      {isAddModalOpen && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 border border-slate-200">
            
            <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-4">
              <h3 className="text-base font-bold text-[#962d22] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#c0392b]" />
                <span>নতুন প্রশ্ন ডাটাবেজে যুক্ত করুন</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddQuestionSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    প্রশ্ন ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newQ.id || ''}
                    onChange={(e) => setNewQ({ ...newQ, id: e.target.value })}
                    placeholder="যেমন: q04 অথবা mcq04"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    ধরন (Type)
                  </label>
                  <select
                    value={newQ.type}
                    onChange={(e) => setNewQ({ ...newQ, type: e.target.value as any })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md"
                  >
                    <option value="CQ">CQ (সৃজনশীল)</option>
                    <option value="MCQ">MCQ (বহুনির্বাচনি)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    অধ্যায় (Chapter)
                  </label>
                  <input
                    type="text"
                    value={newQ.chapter || ''}
                    onChange={(e) => setNewQ({ ...newQ, chapter: e.target.value })}
                    placeholder="Chapter 05: Work, Energy & Power"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    টপিক (Topic)
                  </label>
                  <input
                    type="text"
                    value={newQ.topic || ''}
                    onChange={(e) => setNewQ({ ...newQ, topic: e.target.value })}
                    placeholder="T-05: Power"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  বোর্ড ট্যাগ (Board Tag)
                </label>
                <input
                  type="text"
                  value={newQ.boardTag || ''}
                  onChange={(e) => setNewQ({ ...newQ, boardTag: e.target.value })}
                  placeholder="[Dhaka B'24; RB'22]"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  উদ্দীপক / Stem (LaTeX কোড সহ) <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={newQ.stem || ''}
                  onChange={(e) => setNewQ({ ...newQ, stem: e.target.value })}
                  placeholder="\(50\text{ kg}\) ভরের একটি বস্তু..."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  কনসেপ্ট ও মূল সূত্র (Concept Summary)
                </label>
                <input
                  type="text"
                  value={newQ.conceptSummary || ''}
                  onChange={(e) => setNewQ({ ...newQ, conceptSummary: e.target.value })}
                  placeholder="💡 মূল সূত্রাবলী: W = Fs, P = W/t"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  প্রশ্ন অংশ (Question Prompts) <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={newQ.questionText || ''}
                  onChange={(e) => setNewQ({ ...newQ, questionText: e.target.value })}
                  placeholder="(গ) বল নির্ণয় কর। [৩ নম্বর]&#10;(ঘ) বিশ্লেষণ কর। [৪ নম্বর]"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md"
                />
              </div>

              {newQ.type === 'MCQ' && (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-800">MCQ অপশনসমূহ (LaTeX প্রযোজ্য):</div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Option (a)"
                      value={newQ.options?.a || ''}
                      onChange={(e) => setNewQ({ ...newQ, options: { ...newQ.options!, a: e.target.value } })}
                      className="px-2 py-1 border rounded bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Option (b)"
                      value={newQ.options?.b || ''}
                      onChange={(e) => setNewQ({ ...newQ, options: { ...newQ.options!, b: e.target.value } })}
                      className="px-2 py-1 border rounded bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Option (c)"
                      value={newQ.options?.c || ''}
                      onChange={(e) => setNewQ({ ...newQ, options: { ...newQ.options!, c: e.target.value } })}
                      className="px-2 py-1 border rounded bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Option (d)"
                      value={newQ.options?.d || ''}
                      onChange={(e) => setNewQ({ ...newQ, options: { ...newQ.options!, d: e.target.value } })}
                      className="px-2 py-1 border rounded bg-white"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="font-semibold">সঠিক উত্তর:</span>
                    {(['a', 'b', 'c', 'd'] as const).map((opt) => (
                      <label key={opt} className="inline-flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="correctOpt"
                          checked={newQ.correctOption === opt}
                          onChange={() => setNewQ({ ...newQ, correctOption: opt })}
                        />
                        <span>({opt})</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  বিস্তারিত সমাধান (LaTeX Solution with Vertical Fractions) <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={newQ.solution || ''}
                  onChange={(e) => setNewQ({ ...newQ, solution: e.target.value })}
                  placeholder="\[ F = mg(\sin\theta + \mu\cos\theta) \]"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-1.5 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#c0392b] text-white rounded-md font-semibold hover:bg-[#962d22]"
                >
                  প্রশ্ন সংরক্ষণ করুন
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL 2: ANDROID & GITHUB ACTION FLOW GUIDE
          ====================================================================== */}
      {isAndroidGuideOpen && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 border border-slate-200 text-xs">
            
            <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Android & GitHub ডিপ্লয়মেন্ট সম্পূর্ণ অ্যাকশন ফ্লো
                </h3>
              </div>
              <button
                onClick={() => setIsAndroidGuideOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 text-slate-700 leading-relaxed">
              
              {/* Method 1: Android PWA */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                <h4 className="font-bold text-emerald-900 text-sm flex items-center gap-1.5 mb-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>১. Android ফোনে সরাসরি ইনস্টল করার নিয়ম (PWA Method - সবচেয়ে সহজ)</span>
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-emerald-950">
                  <li>আপনার Android ফোনে <strong>Google Chrome</strong> দিয়ে এই ওয়েবসাইটটির লিংকে যান।</li>
                  <li>ব্রাউজারের ডানদিকের কোণার ৩টি ডট মেনুতে (<strong>⋮</strong>) চাপুন।</li>
                  <li><strong>"Add to Home screen"</strong> অথবা <strong>"Install app"</strong> বাটনে চাপ দিন।</li>
                  <li>আপনার ফোনের হোমস্ক্রিনে উদ্ভাস অ্যাপের মতো একটি আইকন তৈরি হবে এবং ইন্টারনেট ছাড়া বা ফুলস্ক্রিনে চলবে!</li>
                </ol>
              </div>

              {/* Method 2: GitHub Repository Setup */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 mb-1.5">
                  <Github className="w-4 h-4 text-slate-800" />
                  <span>২. GitHub Repository-তে আপলোড করার ধাপসমূহ</span>
                </h4>
                <p className="mb-2 text-slate-600">
                  এই প্রজেক্টের কোড আপনার নিজস্ব GitHub একাউন্টে সংরক্ষণ ও GitHub Pages-এ হোস্ট করতে নিচের কমান্ডগুলো চালান:
                </p>
                <div className="bg-slate-900 text-slate-100 p-2.5 rounded font-mono text-[11px] space-y-1">
                  <div>git init</div>
                  <div>git add .</div>
                  <div>git commit -m "Initial commit: Uddvash Question Bank App"</div>
                  <div>git branch -M main</div>
                  <div>git remote add origin https://github.com/YOUR_USERNAME/physics-question-bank.git</div>
                  <div>git push -u origin main</div>
                </div>
                <p className="mt-2 text-slate-600">
                  ফ্রি হোস্টিংয়ের জন্য: GitHub Repo-র <strong>Settings &gt; Pages &gt; Source</strong> এ <em>Deploy from a branch</em> সিলেক্ট করে <em>main</em> দিন।
                </p>
              </div>

              {/* Method 3: APK Generation */}
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-bold text-blue-900 text-sm flex items-center gap-1.5 mb-1.5">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>৩. সরাসরি Android .APK ফাইল তৈরি করার উপায়</span>
                </h4>
                <p className="text-blue-950 mb-1">
                  যদি আপনি বন্ধুদের পাঠানোর জন্য আসল <strong>.apk</strong> ফাইল চান:
                </p>
                <ul className="list-disc list-inside space-y-1 text-blue-950">
                  <li><strong>PWABuilder (ফ্রি ও কোডিং ছাড়া):</strong> <a href="https://www.pwabuilder.com" target="_blank" rel="noreferrer" className="underline font-bold text-blue-700">pwabuilder.com</a> এ গিয়ে আপনার ডিপ্লয় করা সাইটের URL পেস্ট করুন এবং "Package for Android" বাটনে ক্লিক করে এক ক্লিকে Signed APK বা AAB ফাইল ডাউনলোড করুন।</li>
                  <li><strong>Capacitor / Android Studio:</strong> এই রিপোজিটরিতে <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">npm install @capacitor/core @capacitor/android</code> চালিয়ে Android Studio দিয়ে সহজেই APK বিল্ড করা যায়।</li>
                </ul>
              </div>

              {/* Action buttons */}
              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={handleDownloadStandaloneHtml}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#c0392b] text-white rounded-md font-semibold hover:bg-[#962d22]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Standalone HTML ডাউনলোড করুন</span>
                </button>
                <button
                  onClick={() => setIsAndroidGuideOpen(false)}
                  className="px-4 py-1.5 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-100"
                >
                  ঠিক আছে, বুঝেছি
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL 3: EXPORT STANDALONE HTML MODAL
          ====================================================================== */}
      {isExportHtmlModalOpen && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl p-6 border border-slate-200 text-xs">
            
            <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  একক স্বয়ংসম্পূর্ণ HTML ফাইল এক্সপোর্ট
                </h3>
              </div>
              <button
                onClick={() => setIsExportHtmlModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ×
              </button>
            </div>

            <p className="text-slate-600 mb-4 leading-relaxed">
              এই ফাইলটিতে আপনার ডাটাবেজের সমস্ত প্রশ্ন, MathJax ৩, সম্পূর্ণ CSS স্টাইল এবং জাভাস্ক্রিপ্ট কোড একটি মাত্র <strong>.html</strong> ফাইলের ভেতরে অন্তর্ভুক্ত থাকে। এটি চালাতে কোনো নোডজেএস বা সার্ভার লাগে না— যেকোনো ব্রাউজার বা মোবাইলে ডাবল-ক্লিক করলেই সরাসরি চলবে!
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4">
              <div className="font-semibold text-slate-800 mb-1">অফলাইন ও ডাটাবেস এক্সপোর্ট:</div>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                <li><strong>HTML:</strong> স্বয়ংসম্পূর্ণ অফলাইন অ্যাপ্লিকেশন (কোনো সার্ভার লাগে না)।</li>
                <li><strong>JSON:</strong> ব্রাউজার এবং জাভাস্ক্রিপ্ট অ্যাপের জন্য দ্রুততম ফাইল ফরম্যাট।</li>
                <li><strong>SQL / DB:</strong> SQLite (.db), Room Database ও রিলেশনাল ডেটাবেসের উপযোগী স্ক্রিপ্ট।</li>
                <li><strong>GitHub Actions:</strong> কোড পুশ করলেই কোনো টার্মিনাল ছাড়া ক্লাউডে সরাসরি Android APK তৈরি হয়।</li>
              </ul>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-2.5">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleDownloadJson}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 rounded-md font-semibold text-slate-700 hover:bg-slate-100"
                  title="প্রশ্ন ডেটাবেস JSON ফাইল ডাউনলোড করুন"
                >
                  <Download className="w-3.5 h-3.5 text-amber-600" />
                  <span>JSON (.json)</span>
                </button>

                <button
                  onClick={handleDownloadSql}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 rounded-md font-semibold text-slate-700 hover:bg-slate-100"
                  title="SQLite ও SQL ডাটাবেস স্ক্রিপ্ট ডাউনলোড করুন"
                >
                  <Download className="w-3.5 h-3.5 text-purple-600" />
                  <span>SQLite (.sql / .db)</span>
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCopyStandaloneCode}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-slate-300 rounded-md font-semibold text-slate-700 hover:bg-slate-100"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'কপি হয়েছে' : 'কোড কপি'}</span>
                </button>
                <button
                  onClick={handleDownloadStandaloneHtml}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#c0392b] text-white rounded-md font-semibold hover:bg-[#962d22] shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>HTML ডাউনলোড (.html)</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

/**
 * 🔴 SUBCOMPONENT: UDDVASH STYLE QUESTION CARD
 */
function UddvashQuestionCard({ question, index }: { question: QuestionItem; index: number }) {
  return (
    <div className="uddvash-card bg-white border border-slate-100 rounded p-3.5 shadow-2xs break-inside-avoid">
      
      {/* Topic Ribbon Badge */}
      <div className="inline-block bg-[#c0392b] text-white text-[11px] font-bold px-3 py-0.5 rounded-full mb-2 tracking-wide">
        {question.topic}
      </div>

      {/* Header Row: Question Number & Board Tag */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="inline-flex items-center justify-center bg-[#d35400] text-white font-bold text-xs px-2 py-0.5 rounded">
          {String(index + 1).padStart(2, '0')}.
        </span>
        <span className="text-[#c0392b] font-bold text-xs tracking-tight">
          {question.boardTag}
        </span>
      </div>

      {/* Stem Text */}
      <div className="text-xs text-slate-800 text-justify mb-2.5 leading-relaxed">
        {question.stem}
      </div>

      {/* SVG Vector Diagram if any */}
      {question.svgDiagram && (
        <div
          className="my-2.5 p-2 bg-white border border-dashed border-slate-300 rounded text-center"
          dangerouslySetInnerHTML={{ __html: question.svgDiagram }}
        />
      )}

      {/* Pink Concept Box */}
      {question.conceptSummary && (
        <div className="bg-[#fdedec] border border-[#f5b7b1] rounded p-2.5 my-2.5 text-xs text-[#78281f] leading-normal bg-print-pink">
          {question.conceptSummary}
        </div>
      )}

      {/* Question Prompts (e.g. গ, ঘ) */}
      <div className="text-xs font-semibold text-slate-900 my-2 whitespace-pre-line leading-relaxed">
        {question.questionText}
      </div>

      {/* MCQ Options Display */}
      {question.type === 'MCQ' && question.options && (
        <div className="grid grid-cols-2 gap-1.5 my-2 text-xs">
          <div className="p-1.5 bg-slate-50 border border-slate-200 rounded">
            <strong>(ক)</strong> \( {question.options.a} \)
          </div>
          <div className="p-1.5 bg-slate-50 border border-slate-200 rounded">
            <strong>(খ)</strong> \( {question.options.b} \)
          </div>
          <div className="p-1.5 bg-slate-50 border border-slate-200 rounded">
            <strong>(গ)</strong> \( {question.options.c} \)
          </div>
          <div className="p-1.5 bg-slate-50 border border-slate-200 rounded">
            <strong>(ঘ)</strong> \( {question.options.d} \)
          </div>
        </div>
      )}

      {/* Solution Panel in Soft Pink Box */}
      <div className="bg-[#fdedec] border border-[#f5b7b1] rounded p-3 mt-2.5 text-xs leading-relaxed bg-print-pink">
        <div className="font-bold text-[#962d22] mb-1.5 flex items-center gap-1">
          <span>📌 সমাধান ও বিস্তারিত ব্যাখ্যা:</span>
        </div>
        <div className="mathjax-container overflow-x-auto text-slate-900">
          {question.solution}
        </div>
      </div>

    </div>
  );
}

/**
 * 💡 SUBCOMPONENT: INTERACTIVE PRACTICE CARD
 */
function InteractivePracticeCard({
  question,
  index,
  isSolOpen,
  onToggleSolution,
  userAnswer,
  onSelectOption
}: {
  question: QuestionItem;
  index: number;
  isSolOpen: boolean;
  onToggleSolution: () => void;
  userAnswer?: string;
  onSelectOption: (opt: string) => void;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-colors">
      
      {/* Top Meta */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="bg-[#c0392b] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            {question.topic}
          </span>
          <span className="text-[11px] font-mono text-slate-400 font-semibold">
            ID: {question.id}
          </span>
        </div>
        <span className="text-xs font-bold text-[#c0392b]">
          {question.boardTag}
        </span>
      </div>

      <h3 className="text-sm font-bold text-slate-900 mb-2">
        প্রশ্ন {index + 1} ({question.type})
      </h3>

      {/* Stem */}
      <div className="text-xs sm:text-sm text-slate-800 text-justify mb-3 leading-relaxed">
        {question.stem}
      </div>

      {/* Diagram */}
      {question.svgDiagram && (
        <div
          className="my-3 p-2 bg-slate-50 border border-slate-200 rounded-lg text-center max-w-sm mx-auto"
          dangerouslySetInnerHTML={{ __html: question.svgDiagram }}
        />
      )}

      {/* Question Prompts */}
      <div className="text-xs sm:text-sm font-semibold text-slate-900 mb-3 whitespace-pre-line leading-relaxed">
        {question.questionText}
      </div>

      {/* Interactive MCQ Options */}
      {question.type === 'MCQ' && question.options && (
        <div className="my-3 space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(['a', 'b', 'c', 'd'] as const).map((key) => {
              const isSelected = userAnswer === key;
              const isCorrect = key === question.correctOption;
              let styleClass = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800';

              if (userAnswer) {
                if (isCorrect) {
                  styleClass = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold ring-1 ring-emerald-500';
                } else if (isSelected && !isCorrect) {
                  styleClass = 'border-rose-400 bg-rose-50 text-rose-900 font-semibold';
                } else {
                  styleClass = 'border-slate-200 bg-slate-50 opacity-60 text-slate-600';
                }
              }

              const banglaLabels = { a: 'ক', b: 'খ', c: 'গ', d: 'ঘ' };

              return (
                <button
                  key={key}
                  disabled={!!userAnswer}
                  onClick={() => onSelectOption(key)}
                  className={`text-left p-2.5 border-2 rounded-lg text-xs flex items-center justify-between gap-2 transition-all ${styleClass}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold">({banglaLabels[key]})</span>
                    <span>\( {question.options![key]} \)</span>
                  </div>
                  {userAnswer && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                  {userAnswer && isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {userAnswer && (
            <div className={`p-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
              userAnswer === question.correctOption
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {userAnswer === question.correctOption ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>চমৎকার! আপনার উত্তরটি সঠিক হয়েছে।</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>
                    ভুল উত্তর। সঠিক উত্তর ছিল: ({question.correctOption === 'a' ? 'ক' : question.correctOption === 'b' ? 'খ' : question.correctOption === 'c' ? 'গ' : 'ঘ'})
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Solution Toggle Button */}
      <div className="pt-2">
        <button
          onClick={onToggleSolution}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
        >
          {isSolOpen ? (
            <>
              <EyeOff className="w-3.5 h-3.5 text-slate-500" />
              <span>উত্তর ও ব্যাখ্যা লুকান</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 text-[#c0392b]" />
              <span>💡 উত্তর দেখুন / Show Solution</span>
            </>
          )}
        </button>
      </div>

      {/* Solution Panel */}
      {isSolOpen && (
        <div className="mt-3 p-4 bg-[#fdedec] border border-[#f5b7b1] rounded-lg text-xs leading-relaxed">
          <div className="font-bold text-[#962d22] mb-2 flex items-center gap-1.5">
            <span>📌 বিস্তারিত সমাধান ও বিশ্লেষণ:</span>
          </div>
          <div className="mathjax-container text-slate-900">
            {question.solution}
          </div>
        </div>
      )}

    </div>
  );
}
