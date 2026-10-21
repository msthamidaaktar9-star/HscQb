export interface QuestionItem {
  id: string;
  subject: string;
  chapter: string;
  topic: string;
  type: 'CQ' | 'MCQ';
  boardTag: string;
  stem: string;
  svgDiagram?: string;
  conceptSummary?: string;
  questionText: string;
  options?: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  correctOption?: 'a' | 'b' | 'c' | 'd';
  solution: string;
  marks?: number;
}

export const questionDatabase: QuestionItem[] = [
  {
    id: 'q01',
    subject: 'HSC Physics 1st Paper',
    chapter: 'Chapter 05: Work, Energy & Power',
    topic: 'T-05: Power & Work along Inclined Plane',
    type: 'CQ',
    boardTag: "[Ctg.B'24; RB'21; DB'19]",
    stem: `\\(50\\text{ kg}\\) ভরের একজন শ্রমিক \\(100\\text{ m}\\) দীর্ঘ ও \\(30^\\circ\\) আনত একটি ঘর্ষণযুক্ত ঢালু তলে \\(20\\text{ kg}\\) ভরের একটি বোঝা সমবেগে ঠেলে উপরে তুলছে। তল ও বোঝার মধ্যবর্তী ঘর্ষণ গুণাঙ্ক \\(\\mu = 0.1\\)। অপর একজন শ্রমিক একই ভরের বোঝা একটি সুষম কপিকলের সাহায্যে সরাসরি খাড়াভাবে \\(h = 50\\text{ m}\\) উচ্চতায় উঠাল। উভয় শ্রমিকেরই কাজটি সম্পন্ন করতে \\(2\\text{ min}\\) সময় লাগল। \\([g = 9.8\\text{ ms}^{-2}]\\)`,
    svgDiagram: `<svg viewBox="0 0 360 180" class="w-full max-w-xs mx-auto drop-shadow-sm select-none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="slopeGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f8fafc" />
      <stop offset="100%" stop-color="#e2e8f0" />
    </linearGradient>
    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#c0392b" />
    </marker>
    <marker id="arrowBlue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#2980b9" />
    </marker>
  </defs>
  <!-- Ground -->
  <line x1="20" y1="150" x2="330" y2="150" stroke="#475569" stroke-width="2" />
  <path d="M 20 150 L 300 150 L 300 30 Z" fill="url(#slopeGrad)" stroke="#334155" stroke-width="2" />
  <!-- Angle Arc -->
  <path d="M 70 150 A 50 50 0 0 0 63 131" fill="none" stroke="#c0392b" stroke-width="1.8" />
  <text x="75" y="142" font-size="12" font-weight="bold" fill="#c0392b">30°</text>
  <!-- Height and Length Labels -->
  <line x1="310" y1="30" x2="310" y2="150" stroke="#2563eb" stroke-dasharray="3,3" stroke-width="1.5" />
  <text x="318" y="95" font-size="11" font-weight="600" fill="#2563eb">h = 50m</text>
  <text x="140" y="70" font-size="12" font-weight="bold" fill="#1e293b" transform="rotate(-23 140 70)">L = 100 m</text>
  <!-- Block on slope -->
  <g transform="translate(170, 85) rotate(-23)">
    <rect x="-15" y="-18" width="30" height="20" rx="2" fill="#d35400" stroke="#962d22" stroke-width="1.5" />
    <text x="-9" y="-4" font-size="10" font-weight="bold" fill="#ffffff">20kg</text>
    <!-- Applied Force F -->
    <line x1="16" y1="-8" x2="45" y2="-8" stroke="#c0392b" stroke-width="2" marker-end="url(#arrow)" />
    <text x="48" y="-4" font-size="10" font-weight="bold" fill="#c0392b">F</text>
    <!-- Friction Force fk -->
    <line x1="-16" y1="-8" x2="-40" y2="-8" stroke="#475569" stroke-width="1.8" marker-end="url(#arrow)" />
    <text x="-52" y="-4" font-size="9" fill="#475569">fk</text>
  </g>
  <!-- Points P and Q -->
  <circle cx="20" cy="150" r="3" fill="#0f172a" />
  <text x="12" y="165" font-size="12" font-weight="bold" fill="#0f172a">P</text>
  <circle cx="300" cy="30" r="3" fill="#0f172a" />
  <text x="305" y="25" font-size="12" font-weight="bold" fill="#0f172a">Q</text>
</svg>`,
    conceptSummary: '💡 মূল সূত্রাবলী: আনত তলে ঘর্ষণযুক্ত গতির ক্ষেত্রে প্রযুক্ত বল \\(F = mg\\sin\\theta + \\mu mg\\cos\\theta\\)। কৃতকাজ \\(W = F \\cdot s\\) এবং গড় ক্ষমতা \\(P = \\frac{W}{t}\\)। উল্লম্ব ক্ষেত্রে কৃতকাজ \\(W = mgh\\)।',
    questionText: `(গ) আনত তল বরাবর বোঝাটি টেনে তুলতে ১ম শ্রমিকের প্রযুক্ত বলের মান \\(F\\) নির্ণয় কর। [৩ নম্বর]
(ঘ) উভয় শ্রমিকের মধ্যে কোন জন কম ক্ষমতা ব্যয়ে \\(Q\\) বিন্দুতে পৌঁছাতে পারবে? গাণিতিক বিশ্লেষণের মাধ্যমে মতামত দাও। [৪ নম্বর]`,
    solution: `\\(\\underline{\\textbf{(গ) এর সমাধান:}}\\\\
\\) দেওয়া আছে,
বোঝার ভর, \\(m = 20\\text{ kg}\\)
আনতি কোণ, \\(\\theta = 30^\\circ\\)
ঘর্ষণ গুণাঙ্ক, \\(\\mu = 0.1\\)
অভিকর্ষজ ত্বরণ, \\(g = 9.8\\text{ ms}^{-2}\\)

যেহেতু বোঝাটিকে সমবেগে উপরে তোলা হচ্ছে, তাই প্রযুক্ত বল \\(F\\) হবে আনত তল বরাবর ওজনের উপাংশ এবং গতীয় ঘর্ষণ বলের সমষ্টির সমান।
\\[ F = mg\\sin\\theta + f_k = mg\\sin\\theta + \\mu mg\\cos\\theta \\]
\\[ F = mg(\\sin\\theta + \\mu\\cos\\theta) \\]
\\[ F = 20 \\times 9.8 \\times (\\sin 30^\\circ + 0.1 \\times \\cos 30^\\circ) \\]
\\[ F = 196 \\times (0.5 + 0.1 \\times 0.866) = 196 \\times 0.5866 = 114.97\\text{ N} \\]
\\(\\therefore\\) আনত তল বরাবর প্রযুক্ত বল \\(\\mathbf{114.97\\text{ N}}\\) (বা \\(115\\text{ N}\\))।

\\(\\underline{\\textbf{(ঘ) এর সমাধান:}}\\\\
\\) সময়, \\(t = 2\\text{ min} = 2 \\times 60\\text{ s} = 120\\text{ s}\\)

\\(\\textbf{১ম শ্রমিকের ক্ষেত্রে (আনত তল বরাবর):}\\\\
\\) ১ম শ্রমিক নিজে সহ মোট ভর বহন করছে: \\(M_1 = 50\\text{ kg} + 20\\text{ kg} = 70\\text{ kg}\\)।
আনত তলে মোট বল,
\\[ F_1 = M_1 g(\\sin 30^\\circ + \\mu\\cos 30^\\circ) = 70 \\times 9.8 \\times 0.5866 = 402.41\\text{ N} \\]
সম্পাদিত কাজ,
\\[ W_1 = F_1 \\times L = 402.41 \\times 100 = 40241\\text{ J} \\]
১ম শ্রমিকের ব্যয়িত ক্ষমতা,
\\[ P_1 = \\frac{W_1}{t} = \\frac{40241}{120} = \\mathbf{335.34\\text{ W}} \\]

\\(\\textbf{২য় শ্রমিকের ক্ষেত্রে (উল্লম্ব কপিকল দ্বারা):}\\\\
\\) ২য় শ্রমিক কপিকলে দাঁড়িয়ে শুধুমাত্র বোঝাটিকে সরাসরি উল্লম্ব উচ্চতায় উঠায় (নিজে উপরে ওঠেনি):
সম্পাদিত কাজ,
\\[ W_2 = mgh = 20 \\times 9.8 \\times 50 = 9800\\text{ J} \\]
২য় শ্রমিকের ব্যয়িত ক্ষমতা,
\\[ P_2 = \\frac{W_2}{t} = \\frac{9800}{120} = \\mathbf{81.67\\text{ W}} \\]

যেহেতু \\(P_2 < P_1\\), অতএব ২য় শ্রমিক কপিকলের সাহায্যে উল্লম্বভাবে বোঝা তুলে অনেক কম ক্ষমতা ব্যয়ে \\(Q\\) বিন্দুতে পৌঁছাতে সক্ষম হয়েছিল।`,
    marks: 10
  },
  {
    id: 'q02',
    subject: 'HSC Physics 1st Paper',
    chapter: 'Chapter 05: Work, Energy & Power',
    topic: 'T-03: Work Done in Emptying a Well & Efficiency',
    type: 'CQ',
    boardTag: "[Dhaka B'23; Dinaj.B'22; JB'19]",
    stem: `\\(20\\text{ m}\\) গভীর এবং \\(2\\text{ m}\\) ব্যাসবিশিষ্ট একটি কুয়া পানি দ্বারা পূর্ণ আছে। একটি \\(5\\text{ HP}\\) ক্ষমতার পাম্প দিয়ে কুয়াটির উপরের অর্ধেক পানি \\(20\\text{ minute}\\)-এ খালি করা যায়। অতঃপর পাম্পটি নষ্ট হওয়ায় অন্য একটি পাম্প লাগিয়ে বাকি অর্ধেক পানি খালি করতে আরও \\(25\\text{ minute}\\) সময় লাগল। \\([1\\text{ HP} = 746\\text{ W},\\, \\rho = 1000\\text{ kg/m}^3,\\, g = 9.8\\text{ ms}^{-2}]\\)`,
    svgDiagram: `<svg viewBox="0 0 320 200" class="w-full max-w-xs mx-auto drop-shadow-sm select-none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="waterGrad1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#93c5fd" />
      <stop offset="100%" stop-color="#60a5fa" />
    </linearGradient>
    <linearGradient id="waterGrad2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3b82f6" />
      <stop offset="100%" stop-color="#1d4ed8" />
    </linearGradient>
  </defs>
  <!-- Ground surface -->
  <line x1="20" y1="30" x2="300" y2="30" stroke="#334155" stroke-width="3" />
  <!-- Well Cylindrical outline -->
  <rect x="100" y="30" width="120" height="150" fill="#f8fafc" stroke="#475569" stroke-width="2" />
  <!-- Upper half water -->
  <rect x="101" y="31" width="118" height="74" fill="url(#waterGrad1)" opacity="0.85" />
  <!-- Lower half water -->
  <rect x="101" y="105" width="118" height="74" fill="url(#waterGrad2)" opacity="0.9" />
  <!-- Center of mass markers -->
  <circle cx="160" cy="68" r="3.5" fill="#c0392b" />
  <text x="170" y="72" font-size="10" font-weight="bold" fill="#c0392b">h₁ = 5m</text>
  <circle cx="160" cy="142" r="3.5" fill="#f59e0b" />
  <text x="170" y="146" font-size="10" font-weight="bold" fill="#78350f">h₂ = 15m</text>
  <!-- Dimensions -->
  <line x1="75" y1="30" x2="75" y2="180" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3,3" />
  <text x="32" y="110" font-size="11" font-weight="bold" fill="#334155">H = 20m</text>
  <line x1="100" y1="20" x2="220" y2="20" stroke="#0284c7" stroke-width="1.5" />
  <text x="140" y="15" font-size="11" font-weight="bold" fill="#0284c7">d = 2m</text>
</svg>`,
    conceptSummary: '💡 মূল সূত্রাবলী: কুয়ার পানি তোলার কৃতকাজ \\(W = m g h_{\\text{avg}}\\), যেখানে \\(h_{\\text{avg}} = \\frac{\\text{আদি উচ্চতা} + \\text{শেষ উচ্চতা}}{2}\\)। কর্মদক্ষতা \\(\\eta = \\frac{P_{\\text{out}}}{P_{\\text{in}}} \\times 100\\%\\)।',
    questionText: `(গ) প্রথম পাম্পটির কর্মদক্ষতা (\\(\\eta\\)) নির্ণয় কর। [৩ নম্বর]
(ঘ) দ্বিতীয় পাম্পটির কার্যকর ক্ষমতা প্রথম পাম্পের তুলনায় বেশি না কম ছিল? গাণিতিক বিশ্লেষণের মাধ্যমে মন্তব্য কর। [৪ নম্বর]`,
    solution: `\\(\\underline{\\textbf{(গ) এর সমাধান:}}\\\\
\\) দেওয়া আছে,
কুয়ার গভীরতা, \\(H = 20\\text{ m}\\)
কুয়ার ব্যাসার্ধ, \\(r = \\frac{2}{2} = 1\\text{ m}\\)
পানির ঘনত্ব, \\(\\rho = 1000\\text{ kg/m}^3\\)
১ম পাম্পের প্রদত্ত ক্ষমতা, \\(P_{\\text{in}} = 5\\text{ HP} = 5 \\times 746\\text{ W} = 3730\\text{ W}\\)
১ম পাম্পের সময়, \\(t_1 = 20\\text{ min} = 20 \\times 60\\text{ s} = 1200\\text{ s}\\)

কুয়ার অর্ধেক পানির ভর,
\\[ m_1 = \\pi r^2 \\left(\\frac{H}{2}\\right) \\rho = \\pi \\times (1)^2 \\times 10 \\times 1000 = 31415.93\\text{ kg} \\]
উপরের অর্ধেক পানি খালি করতে পানির ভরকেন্দ্রের সরণ:
\\[ h_1 = \\frac{0 + 10}{2} = 5\\text{ m} \\]
১ম পাম্প দ্বারা সম্পাদিত কাজ,
\\[ W_1 = m_1 g h_1 = 31415.93 \\times 9.8 \\times 5 = 1{,}539{,}380.57\\text{ J} \\]
১ম পাম্পের লভ্য কার্যকর ক্ষমতা,
\\[ P_{\\text{out},1} = \\frac{W_1}{t_1} = \\frac{1539380.57}{1200} = 1282.82\\text{ W} \\]
\\(\\therefore\\) ১ম পাম্পের কর্মদক্ষতা,
\\[ \\eta = \\frac{P_{\\text{out},1}}{P_{\\text{in}}} \\times 100\\% = \\frac{1282.82}{3730} \\times 100\\% = \\mathbf{34.39\\%} \\]

\\(\\underline{\\textbf{(ঘ) এর সমাধান:}}\\\\
\\) বাকি অর্ধেক পানির ভর, \\(m_2 = m_1 = 31415.93\\text{ kg}\\)
বাকি অর্ধেক পানি খালি করতে পানির ভরকেন্দ্রের সরণ:
\\[ h_2 = \\frac{10 + 20}{2} = 15\\text{ m} \\]
২য় ক্ষেত্রে সম্পাদিত কাজ,
\\[ W_2 = m_2 g h_2 = 31415.93 \\times 9.8 \\times 15 = 4{,}618{,}141.7\\text{ J} \\]
২য় পাম্পের সময়, \\(t_2 = 25\\text{ min} = 25 \\times 60\\text{ s} = 1500\\text{ s}\\)
২য় পাম্পের কার্যকর ক্ষমতা,
\\[ P_{\\text{out},2} = \\frac{W_2}{t_2} = \\frac{4618141.7}{1500} = \\mathbf{3078.76\\text{ W}} \\]

যেহেতু \\(P_{\\text{out},2} (3078.76\\text{ W}) > P_{\\text{out},1} (1282.82\\text{ W})\\),
অতএব দ্বিতীয় পাম্পটির কার্যকর ক্ষমতা প্রথম পাম্পের অপেক্ষা \\((3078.76 - 1282.82) = 1795.94\\text{ W}\\) বেশি ছিল।`,
    marks: 10
  },
  {
    id: 'mcq01',
    subject: 'HSC Physics 1st Paper',
    chapter: 'Chapter 01: Physical World & Measurement',
    topic: 'T-02: Vernier & Screw Gauge Precision',
    type: 'MCQ',
    boardTag: "[All Board'22; CB'23]",
    stem: `একটি স্ক্রু গজের বৃত্তাকার স্কেলের মোট ভাগ সংখ্যা \\(100\\) এবং পিচ \\(1\\text{ mm}\\)। একটি ধাতব তারের ব্যাস পরিমাপের সময় রৈখিক স্কেল পাঠ পাওয়া গেল \\(3\\text{ mm}\\) এবং বৃত্তাকার স্কেলের দাগ পাঠ \\(52\\)। যন্ত্রটিতে কোনো শূন্য ত্রুটি (Zero Error) নেই। তারটির ব্যাস কত?`,
    svgDiagram: `<svg viewBox="0 0 300 110" class="w-full max-w-xs mx-auto drop-shadow-sm select-none" xmlns="http://www.w3.org/2000/svg">
  <rect x="20" y="35" width="130" height="40" rx="3" fill="#f1f5f9" stroke="#334155" stroke-width="2" />
  <!-- Main scale baseline -->
  <line x1="25" y1="55" x2="150" y2="55" stroke="#0f172a" stroke-width="1.5" />
  <!-- Marks on main scale -->
  <line x1="35" y1="45" x2="35" y2="55" stroke="#0f172a" stroke-width="1.5" /><text x="32" y="42" font-size="8">0</text>
  <line x1="60" y1="45" x2="60" y2="55" stroke="#0f172a" stroke-width="1.5" /><text x="57" y="42" font-size="8">1</text>
  <line x1="85" y1="45" x2="85" y2="55" stroke="#0f172a" stroke-width="1.5" /><text x="82" y="42" font-size="8">2</text>
  <line x1="110" y1="45" x2="110" y2="55" stroke="#0f172a" stroke-width="1.5" /><text x="107" y="42" font-size="8">3</text>
  <!-- Circular scale / thimble -->
  <path d="M 125 25 L 210 25 L 210 85 L 125 85 Z" fill="#e2e8f0" stroke="#334155" stroke-width="2" />
  <!-- Thimble markings -->
  <line x1="125" y1="55" x2="145" y2="55" stroke="#c0392b" stroke-width="2" />
  <text x="150" y="58" font-size="10" font-weight="bold" fill="#c0392b">52</text>
  <line x1="125" y1="40" x2="140" y2="40" stroke="#475569" stroke-width="1" />
  <text x="145" y="43" font-size="9" fill="#475569">55</text>
  <line x1="125" y1="70" x2="140" y2="70" stroke="#475569" stroke-width="1" />
  <text x="145" y="73" font-size="9" fill="#475569">50</text>
</svg>`,
    conceptSummary: '💡 মূল সূত্র: লঘিষ্ঠ গণন বা নূনাঙ্ক \\(LC = \\frac{\\text{Pitch}}{\\text{Circular Scale Division}}\\) এবং তারের মোট ব্যাস \\(d = L + (CS \\times LC)\\)।',
    questionText: `সঠিক উত্তরটি নির্বাচন কর:`,
    options: {
      a: `3.52\\text{ cm}`,
      b: `3.52\\text{ mm}`,
      c: `3.052\\text{ mm}`,
      d: `0.352\\text{ mm}`
    },
    correctOption: 'b',
    solution: `স্ক্রু গজের লঘিষ্ঠ গণন (Least Count, \\(LC\\)):
\\[ LC = \\frac{\\text{পিচ (Pitch)}}{\\text{বৃত্তাকার স্কেলের মোট ভাগ সংখ্যা}} = \\frac{1\\text{ mm}}{100} = 0.01\\text{ mm} \\]

মোট পরিমাপ বা ব্যাস:
\\[ d = \\text{রৈখিক স্কেল পাঠ } (L) + (\\text{বৃত্তাকার স্কেল পাঠ } (CS) \\times LC) \\]
\\[ d = 3\\text{ mm} + (52 \\times 0.01\\text{ mm}) = 3\\text{ mm} + 0.52\\text{ mm} = \\mathbf{3.52\\text{ mm}} \\]
সঠিক উত্তর: **(b) 3.52 mm**।`,
    marks: 1
  },
  {
    id: 'q03',
    subject: 'HSC Physics 1st Paper',
    chapter: 'Chapter 05: Work, Energy & Power',
    topic: 'T-04: Conservation of Mechanical Energy',
    type: 'CQ',
    boardTag: "[Rajshahi B'23; BB'20; Dinaj.B'19]",
    stem: `\\(200\\text{ kg}\\) ভরের একটি রোলার কোস্টার কার ঘর্ষণহীন ট্র্যাকে \\(A\\) বিন্দু (ভূমি হতে উচ্চতা \\(h_A = 60\\text{ m}\\)) থেকে স্থির অবস্থা থেকে যাত্রা শুরু করে। ট্র্যাকটি পর্যায়ক্রমে \\(C\\) বিন্দু (ভূমি লেভেল \\(h_C = 0\\text{ m}\\)) এবং একটি লুপের চূড়া \\(B\\) বিন্দু (উচ্চতা \\(h_B = 25\\text{ m}\\)) দিয়ে অতিক্রম করে। \\([g = 9.8\\text{ ms}^{-2}]\\)`,
    svgDiagram: `<svg viewBox="0 0 340 180" class="w-full max-w-xs mx-auto drop-shadow-sm select-none" xmlns="http://www.w3.org/2000/svg">
  <!-- Ground -->
  <line x1="10" y1="150" x2="330" y2="150" stroke="#64748b" stroke-width="2" />
  <!-- Track curve -->
  <path d="M 30 30 C 70 30, 90 150, 160 150 C 220 150, 230 80, 280 80 C 310 80, 320 140, 330 150" fill="none" stroke="#dc2626" stroke-width="3" />
  <!-- Point A -->
  <circle cx="30" cy="30" r="5" fill="#c0392b" />
  <text x="20" y="20" font-size="12" font-weight="bold" fill="#c0392b">A (60m)</text>
  <!-- Point C -->
  <circle cx="160" cy="150" r="4" fill="#0284c7" />
  <text x="150" y="170" font-size="12" font-weight="bold" fill="#0284c7">C (0m)</text>
  <!-- Point B -->
  <circle cx="280" cy="80" r="4" fill="#16a34a" />
  <text x="270" y="70" font-size="12" font-weight="bold" fill="#16a34a">B (25m)</text>
  <!-- Roller car on track -->
  <rect x="22" y="22" width="16" height="8" rx="2" fill="#1e293b" />
</svg>`,
    conceptSummary: '💡 মূল সূত্রাবলী: ঘর্ষণহীন তলে মোট যান্ত্রিক শক্তি সংরক্ষিত থাকে: \\(E = E_p + E_k = mgh + \\frac{1}{2}mv^2 = \\text{ধ্রুবক}\\)।',
    questionText: `(গ) \\(B\\) বিন্দুতে রোলার কোস্টার কারটির বেগ নির্ণয় কর। [৩ নম্বর]
(ঘ) উদ্দীপকের কারটির ক্ষেত্রে \\(A\\) এবং \\(B\\) উভয় বিন্দুতেই যান্ত্রিক শক্তির নিত্যতা সূত্র পালিত হয় কি না— গাণিতিকভাবে বিশ্লেষণ কর। [৪ নম্বর]`,
    solution: `\\(\\underline{\\textbf{(গ) এর সমাধান:}}\\\\
\\) দেওয়া আছে,
কারটির ভর, \\(m = 200\\text{ kg}\\)
\\(A\\) বিন্দুর উচ্চতা, \\(h_A = 60\\text{ m}\\)
\\(A\\) বিন্দুতে আদিবেগ, \\(u = 0\\text{ ms}^{-1}\\)
\\(B\\) বিন্দুর উচ্চতা, \\(h_B = 25\\text{ m}\\)
উচ্চতার পার্থক্য, \\(h = h_A - h_B = 60 - 25 = 35\\text{ m}\\)

ঘর্ষণহীন ট্র্যাকে \\(A\\) থেকে \\(B\\) তে পৌঁছাতে বিভব শক্তির হ্রাস = গতিশক্তির বৃদ্ধি:
\\[ \\frac{1}{2} m v_B^2 = mg(h_A - h_B) \\]
\\[ v_B^2 = 2g(h_A - h_B) = 2 \\times 9.8 \\times 35 = 686 \\]
\\[ v_B = \\sqrt{686} = \\mathbf{26.19\\text{ ms}^{-1}} \\]
\\(\\therefore B\\) বিন্দুতে কারটির বেগ \\(\\mathbf{26.19\\text{ ms}^{-1}}\\)।

\\(\\underline{\\textbf{(ঘ) এর সমাধান:}}\\\\
\\) \\(\\textbf{A বিন্দুতে মোট শক্তি:}\\\\
\\) বিভব শক্তি,
\\[ E_{p,A} = mgh_A = 200 \\times 9.8 \\times 60 = 117{,}600\\text{ J} \\]
গতিশক্তি,
\\[ E_{k,A} = \\frac{1}{2} m u^2 = 0\\text{ J} \\]
\\(\\therefore A\\) বিন্দুতে মোট যান্ত্রিক শক্তি,
\\[ E_A = E_{p,A} + E_{k,A} = 117{,}600 + 0 = \\mathbf{117{,}600\\text{ J}} \\]

\\(\\textbf{B বিন্দুতে মোট শক্তি:}\\\\
\\) বিভব শক্তি,
\\[ E_{p,B} = mgh_B = 200 \\times 9.8 \\times 25 = 49{,}000\\text{ J} \\]
গতিশক্তি,
\\[ E_{k,B} = \\frac{1}{2} m v_B^2 = \\frac{1}{2} \\times 200 \\times (26.19)^2 = 100 \\times 686 = 68{,}600\\text{ J} \\]
\\(\\therefore B\\) বিন্দুতে মোট যান্ত্রিক শক্তি,
\\[ E_B = E_{p,B} + E_{k,B} = 49{,}000 + 68{,}600 = \\mathbf{117{,}600\\text{ J}} \\]

যেহেতু \\(E_A = E_B = 117{,}600\\text{ J}\\),
সুতরাং \\(A\\) ও \\(B\\) উভয় বিন্দুতেই শক্তির সংরক্ষণশীলতা নীতি যথাযথভাবে সংরক্ষিত থাকে।`,
    marks: 10
  },
  {
    id: 'mcq02',
    subject: 'HSC Physics 1st Paper',
    chapter: 'Chapter 05: Work, Energy & Power',
    topic: 'T-01: Concept of Zero Work',
    type: 'MCQ',
    boardTag: "[Dhaka B'24; SB'21]",
    stem: `\\(M\\) ভরের পৃথিবীকে কেন্দ্র করে \\(m\\) ভরের একটি কৃত্রিম উপগ্রহ \\(r\\) ব্যাসার্ধের বৃত্তাকার কক্ষপথে একবার সম্পূর্ণ আবর্তন সম্পন্ন করলে কেন্দ্রমুখী অভিকর্ষ বল দ্বারা সম্পাদিত কাজের পরিমাণ কত?`,
    svgDiagram: `<svg viewBox="0 0 240 120" class="w-full max-w-xs mx-auto drop-shadow-sm select-none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="120" cy="60" r="18" fill="#2563eb" />
  <text x="115" y="64" font-size="10" font-weight="bold" fill="#ffffff">M</text>
  <!-- Orbit -->
  <circle cx="120" cy="60" r="45" fill="none" stroke="#94a3b8" stroke-dasharray="3,3" stroke-width="1.5" />
  <!-- Satellite -->
  <circle cx="165" cy="60" r="6" fill="#475569" />
  <text x="175" y="63" font-size="9" font-weight="bold" fill="#0f172a">m</text>
  <!-- Force vector towards center -->
  <line x1="160" y1="60" x2="135" y2="60" stroke="#c0392b" stroke-width="2" marker-end="url(#arrow)" />
  <text x="140" y="52" font-size="9" font-weight="bold" fill="#c0392b">F_g</text>
  <!-- Velocity vector tangent -->
  <line x1="165" y1="55" x2="165" y2="30" stroke="#16a34a" stroke-width="2" marker-end="url(#arrow)" />
  <text x="170" y="40" font-size="9" font-weight="bold" fill="#16a34a">v</text>
  <path d="M 158 52 L 158 60 L 165 60" fill="none" stroke="#0f172a" stroke-width="1" />
  <text x="148" y="75" font-size="9" fill="#0f172a">90°</text>
</svg>`,
    conceptSummary: '💡 মূল সূত্র: যখন প্রযুক্ত বল ও সরণের মধ্যবর্তী কোণ \\(\\theta = 90^\\circ\\) হয়, তখন সম্পাদিত কাজ \\(W = F s \\cos 90^\\circ = 0\\) হয়। একে কাজহীন বল বলে।',
    questionText: `সঠিক উত্তরটি নির্বাচন কর:`,
    options: {
      a: `\\frac{GMm}{r}`,
      b: `2\\pi r \\cdot mg`,
      c: `0\\text{ Joule}`,
      d: `\\frac{GMm}{2r}`
    },
    correctOption: 'c',
    solution: `উপগ্রহের বৃত্তাকার কক্ষপথে অভিকর্ষ বল কেন্দ্রমুখী বল হিসেবে কেন্দ্রের দিকে ক্রিয়া করে এবং যেকোনো মুহূর্তে সরণের দিক হয় কক্ষপথের স্পর্শক বরাবর।
ফলে বল ও সরণের মধ্যবর্তী কোণ \\(\\theta = 90^\\circ\\)।

সম্পাদিত কাজ,
\\[ W = \\vec{F} \\cdot \\vec{s} = F s \\cos(90^\\circ) = 0\\text{ Joule} \\]
সুতরাং কোনো কাজ সম্পন্ন হয় না। সঠিক উত্তর: **(c) 0 Joule**।`,
    marks: 1
  },
  {
    id: 'mcq03',
    subject: 'HSC Physics 1st Paper',
    chapter: 'Chapter 05: Work, Energy & Power',
    topic: 'T-05: Power',
    type: 'MCQ',
    boardTag: "[Chittagong B'23; JB'22]",
    stem: `একটি গাড়ির ইঞ্জিন \\(1000\\text{ N}\\) ঘর্ষণ বলের বিরুদ্ধে \\(20\\text{ ms}^{-1}\\) সমবেগে সরলরেখা বরাবর চলমান থাকে। ইঞ্জিনটির তাৎক্ষণিক ক্ষমতা কত?`,
    conceptSummary: '💡 মূল সূত্র: ধ্রুব বল ও সমবেগে চলমান বস্তুর ক্ষেত্রে ক্ষমতা \\(P = \\vec{F} \\cdot \\vec{v} = F v \\cos\\theta\\)।',
    questionText: `সঠিক উত্তরটি নির্বাচন কর:`,
    options: {
      a: `50\\text{ W}`,
      b: `20\\text{ kW}`,
      c: `200\\text{ kW}`,
      d: `2000\\text{ W}`
    },
    correctOption: 'b',
    solution: `সমবেগে সচল রাখার জন্য ইঞ্জিনের প্রযুক্ত বল ঘর্ষণ বলের সমান ও বিপরীতমুখী হবে:
\\[ F = 1000\\text{ N} \\]
বেগ, \\(v = 20\\text{ ms}^{-1}\\)
ক্ষমতা,
\\[ P = F \\times v = 1000\\text{ N} \\times 20\\text{ ms}^{-1} = 20{,}000\\text{ W} = \\mathbf{20\\text{ kW}} \\]
সঠিক উত্তর: **(b) 20 kW**।`,
    marks: 1
  }
];
