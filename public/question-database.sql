-- ====================================================================
-- Uddvash Physics Question Bank - SQLite & SQL Database Schema
-- Compatible with SQLite (.db), PostgreSQL, MySQL, and Android Room DB
-- ====================================================================

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  chapter TEXT NOT NULL,
  topic TEXT NOT NULL,
  type TEXT CHECK(type IN ('CQ', 'MCQ')) NOT NULL,
  board_tag TEXT,
  stem TEXT NOT NULL,
  svg_diagram TEXT,
  concept_summary TEXT,
  question_text TEXT NOT NULL,
  option_a TEXT,
  option_b TEXT,
  option_c TEXT,
  option_d TEXT,
  correct_option TEXT,
  solution TEXT NOT NULL,
  marks INTEGER DEFAULT 10,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_questions_chapter ON questions(chapter);
CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions(topic);
CREATE INDEX IF NOT EXISTS idx_questions_type ON questions(type);

BEGIN TRANSACTION;

-- Question 1 (q01): Creative Question on Inclined Plane & Power
INSERT OR REPLACE INTO questions (
  id, subject, chapter, topic, type, board_tag, stem, svg_diagram,
  concept_summary, question_text, option_a, option_b, option_c, option_d,
  correct_option, solution, marks
) VALUES (
  'q01',
  'HSC Physics 1st Paper',
  'Chapter 05: Work, Energy & Power',
  'T-05: Power & Work along Inclined Plane',
  'CQ',
  '[Ctg.B''24; RB''21; DB''19]',
  '\(50\text{ kg}\) ভরের একজন শ্রমিক \(100\text{ m}\) দীর্ঘ ও \(30^\circ\) আনত একটি ঘর্ষণযুক্ত ঢালু তলে \(20\text{ kg}\) ভরের একটি বোঝা সমবেগে ঠেলে উপরে তুলছে। তল ও বোঝার মধ্যবর্তী ঘর্ষণ গুণাঙ্ক \(\mu = 0.1\)। অপর একজন শ্রমিক একই ভরের বোঝা একটি সুষম কপিকলের সাহায্যে সরাসরি খাড়াভাবে \(h = 50\text{ m}\) উচ্চতায় উঠাল। উভয় শ্রমিকেরই কাজটি সম্পন্ন করতে \(2\text{ min}\) সময় লাগল। \([g = 9.8\text{ ms}^{-2}]\)',
  '<svg viewBox="0 0 360 180" style="width:100%;max-width:300px;display:block;margin:auto;" xmlns="http://www.w3.org/2000/svg"><line x1="20" y1="150" x2="330" y2="150" stroke="#475569" stroke-width="2" /><path d="M 20 150 L 300 150 L 300 30 Z" fill="#f1f5f9" stroke="#334155" stroke-width="2" /><path d="M 70 150 A 50 50 0 0 0 63 131" fill="none" stroke="#c0392b" stroke-width="1.8" /><text x="75" y="142" font-size="12" font-weight="bold" fill="#c0392b">30°</text><line x1="310" y1="30" x2="310" y2="150" stroke="#2563eb" stroke-dasharray="3,3" stroke-width="1.5" /><text x="318" y="95" font-size="11" font-weight="bold" fill="#2563eb">h = 50m</text><text x="140" y="70" font-size="12" font-weight="bold" fill="#1e293b" transform="rotate(-23 140 70)">L = 100 m</text><g transform="translate(170, 85) rotate(-23)"><rect x="-15" y="-18" width="30" height="20" rx="2" fill="#d35400" stroke="#962d22" stroke-width="1.5" /><text x="-9" y="-4" font-size="10" font-weight="bold" fill="#ffffff">20kg</text><line x1="16" y1="-8" x2="45" y2="-8" stroke="#c0392b" stroke-width="2" /><polygon points="45,-11 51,-8 45,-5" fill="#c0392b" /><text x="48" y="-4" font-size="10" font-weight="bold" fill="#c0392b">F</text></g><circle cx="20" cy="150" r="3" fill="#0f172a" /><text x="12" y="165" font-size="12" font-weight="bold" fill="#0f172a">P</text><circle cx="300" cy="30" r="3" fill="#0f172a" /><text x="305" y="25" font-size="12" font-weight="bold" fill="#0f172a">Q</text></svg>',
  '💡 মূল সূত্রাবলী: আনত তলে ঘর্ষণযুক্ত গতির ক্ষেত্রে প্রযুক্ত বল \(F = mg\sin\theta + \mu mg\cos\theta\)। কৃতকাজ \(W = F \cdot s\) এবং গড় ক্ষমতা \(P = \frac{W}{t}\)।',
  '(গ) আনত তল বরাবর বোঝাটি টেনে তুলতে ১ম শ্রমিকের প্রযুক্ত বলের মান F নির্ণয় কর। [৩ নম্বর]
(ঘ) উভয় শ্রমিকের মধ্যে কোন জন কম ক্ষমতা ব্যয়ে Q বিন্দুতে পৌঁছাতে পারবে? গাণিতিক বিশ্লেষণের মাধ্যমে মতামত দাও। [৪ নম্বর]',
  NULL, NULL, NULL, NULL,
  NULL,
  '\(\underline{\textbf{(গ) এর সমাধান:}}\\
\) দেওয়া আছে,
বোঝার ভর, \(m = 20\text{ kg}\)
আনতি কোণ, \(\theta = 30^\circ\), ঘর্ষণ গুণাঙ্ক, \(\mu = 0.1\)
\[ F = mg(\sin\theta + \mu\cos\theta) = 20 \times 9.8 \times (\sin 30^\circ + 0.1 \cos 30^\circ) = 196 \times 0.5866 = \mathbf{114.97\text{ N}} \]
\(\therefore\) আনত তল বরাবর প্রযুক্ত বল \(\mathbf{114.97\text{ N}}\)।

\(\underline{\textbf{(ঘ) এর সমাধান:}}\\
\) সময় \(t = 2\text{ min} = 120\text{ s}\)
১ম শ্রমিকের ক্ষেত্রে: মোট ভর \(M_1 = 50 + 20 = 70\text{ kg}\)
\[ F_1 = 70 \times 9.8 \times 0.5866 = 402.41\text{ N} \]
\[ W_1 = 402.41 \times 100 = 40241\text{ J} \implies P_1 = \frac{40241}{120} = \mathbf{335.34\text{ W}} \]
২য় শ্রমিকের ক্ষেত্রে: কপিকলে শুধু বোঝা তোলা হয়
\[ W_2 = mgh = 20 \times 9.8 \times 50 = 9800\text{ J} \implies P_2 = \frac{9800}{120} = \mathbf{81.67\text{ W}} \]
যেহেতু \(P_2 < P_1\), ২য় শ্রমিক অনেক কম ক্ষমতা ব্যয়ে পৌঁছাতে পেরেছিল।',
  10
);

-- Question 2 (q02): Creative Question on Well & Pump Efficiency
INSERT OR REPLACE INTO questions (
  id, subject, chapter, topic, type, board_tag, stem, svg_diagram,
  concept_summary, question_text, option_a, option_b, option_c, option_d,
  correct_option, solution, marks
) VALUES (
  'q02',
  'HSC Physics 1st Paper',
  'Chapter 05: Work, Energy & Power',
  'T-03: Work Done in Emptying a Well & Efficiency',
  'CQ',
  '[Dhaka B''23; Dinaj.B''22; JB''19]',
  '\(20\text{ m}\) গভীর এবং \(2\text{ m}\) ব্যাসবিশিষ্ট একটি কুয়া পানি দ্বারা পূর্ণ আছে। একটি \(5\text{ HP}\) ক্ষমতার পাম্প দিয়ে কুয়াটির উপরের অর্ধেক পানি \(20\text{ minute}\)-এ খালি করা যায়। অতঃপর পাম্পটি নষ্ট হওয়ায় অন্য একটি পাম্প লাগিয়ে বাকি অর্ধেক পানি খালি করতে আরও \(25\text{ minute}\) সময় লাগল। \([1\text{ HP} = 746\text{ W},\, \rho = 1000\text{ kg/m}^3,\, g = 9.8\text{ ms}^{-2}]\)',
  '<svg viewBox="0 0 320 180" style="width:100%;max-width:280px;display:block;margin:auto;" xmlns="http://www.w3.org/2000/svg"><line x1="20" y1="25" x2="300" y2="25" stroke="#334155" stroke-width="3" /><rect x="100" y="25" width="120" height="140" fill="#f8fafc" stroke="#475569" stroke-width="2" /><rect x="101" y="26" width="118" height="69" fill="#93c5fd" opacity="0.85" /><rect x="101" y="95" width="118" height="69" fill="#3b82f6" opacity="0.9" /><circle cx="160" cy="60" r="3.5" fill="#c0392b" /><text x="170" y="64" font-size="10" font-weight="bold" fill="#c0392b">h₁ = 5m</text><circle cx="160" cy="130" r="3.5" fill="#f59e0b" /><text x="170" y="134" font-size="10" font-weight="bold" fill="#78350f">h₂ = 15m</text><text x="35" y="100" font-size="11" font-weight="bold" fill="#334155">H = 20m</text><text x="140" y="15" font-size="11" font-weight="bold" fill="#0284c7">d = 2m</text></svg>',
  '💡 মূল সূত্রাবলী: কুয়ার পানি তোলার কাজ \(W = m g h_{\text{avg}}\), যেখানে \(h_{\text{avg}} = \frac{\text{আদি} + \text{শেষ}}{2}\)। কর্মদক্ষতা \(\eta = \frac{P_{\text{out}}}{P_{\text{in}}} \times 100\%\)।',
  '(গ) প্রথম পাম্পটির কর্মদক্ষতা (\(\eta\)) নির্ণয় কর। [৩ নম্বর]
(ঘ) দ্বিতীয় পাম্পটির কার্যকর ক্ষমতা প্রথম পাম্পের তুলনায় বেশি না কম ছিল? গাণিতিক বিশ্লেষণের মাধ্যমে মন্তব্য কর। [৪ নম্বর]',
  NULL, NULL, NULL, NULL,
  NULL,
  '\(\underline{\textbf{(গ) এর সমাধান:}}\\
\) অর্ধ কুয়ার পানির ভর,
\[ m_1 = \pi r^2 \left(\frac{H}{2}\right) \rho = \pi (1)^2 (10) (1000) = 31415.93\text{ kg} \]
ভরকেন্দ্রের সরণ \(h_1 = \frac{0 + 10}{2} = 5\text{ m}\)
\[ W_1 = 31415.93 \times 9.8 \times 5 = 1{,}539{,}380.57\text{ J} \]
\[ P_{\text{out},1} = \frac{W_1}{1200} = 1282.82\text{ W} \]
\[ \eta = \frac{1282.82}{5 \times 746} \times 100\% = \mathbf{34.39\%} \]

\(\underline{\textbf{(ঘ) এর সমাধান:}}\\
\) বাকি অর্ধের ভরকেন্দ্রের সরণ \(h_2 = \frac{10 + 20}{2} = 15\text{ m}\)
\[ W_2 = 31415.93 \times 9.8 \times 15 = 4{,}618{,}141.7\text{ J} \]
\[ P_{\text{out},2} = \frac{4618141.7}{25 \times 60} = \frac{4618141.7}{1500} = \mathbf{3078.76\text{ W}} \]
যেহেতু \(3078.76\text{ W} > 1282.82\text{ W}\), দ্বিতীয় পাম্পটির কার্যকর ক্ষমতা \(1795.94\text{ W}\) বেশি ছিল।',
  10
);

-- Question 3 (mcq01): Screw Gauge Precision MCQ
INSERT OR REPLACE INTO questions (
  id, subject, chapter, topic, type, board_tag, stem, svg_diagram,
  concept_summary, question_text, option_a, option_b, option_c, option_d,
  correct_option, solution, marks
) VALUES (
  'mcq01',
  'HSC Physics 1st Paper',
  'Chapter 01: Physical World & Measurement',
  'T-02: Vernier & Screw Gauge Precision',
  'MCQ',
  '[All Board''22; CB''23]',
  'একটি স্ক্রু গজের বৃত্তাকার স্কেলের মোট ভাগ সংখ্যা \(100\) এবং পিচ \(1\text{ mm}\)। একটি ধাতব তারের ব্যাস পরিমাপের সময় রৈখিক স্কেল পাঠ পাওয়া গেল \(3\text{ mm}\) এবং বৃত্তাকার স্কেলের দাগ পাঠ \(52\)। যন্ত্রটিতে কোনো শূন্য ত্রুটি নেই। তারটির ব্যাস কত?',
  '<svg viewBox="0 0 280 90" style="width:100%;max-width:260px;display:block;margin:auto;" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="25" width="120" height="36" rx="3" fill="#f1f5f9" stroke="#334155" stroke-width="2" /><line x1="25" y1="43" x2="140" y2="43" stroke="#0f172a" stroke-width="1.5" /><line x1="35" y1="35" x2="35" y2="43" stroke="#0f172a" stroke-width="1.5" /><text x="32" y="32" font-size="8">0</text><line x1="60" y1="35" x2="60" y2="43" stroke="#0f172a" stroke-width="1.5" /><text x="57" y="32" font-size="8">1</text><line x1="85" y1="35" x2="85" y2="43" stroke="#0f172a" stroke-width="1.5" /><text x="82" y="32" font-size="8">2</text><line x1="110" y1="35" x2="110" y2="43" stroke="#0f172a" stroke-width="1.5" /><text x="107" y="32" font-size="8">3</text><path d="M 120 18 L 190 18 L 190 68 L 120 68 Z" fill="#e2e8f0" stroke="#334155" stroke-width="2" /><line x1="120" y1="43" x2="140" y2="43" stroke="#c0392b" stroke-width="2" /><text x="145" y="46" font-size="10" font-weight="bold" fill="#c0392b">52</text></svg>',
  '💡 মূল সূত্র: লঘিষ্ঠ গণন \(LC = \frac{\text{Pitch}}{\text{CSD}}\) এবং মোট পাঠ \(d = L + (CS \times LC)\)।',
  'সঠিক উত্তরটি নির্বাচন কর:',
  '3.52\text{ cm}',
  '3.52\text{ mm}',
  '3.052\text{ mm}',
  '0.352\text{ mm}',
  'b',
  'লঘিষ্ঠ গণন \(LC = \frac{1\text{ mm}}{100} = 0.01\text{ mm}\)
মোট ব্যাস \(d = 3\text{ mm} + (52 \times 0.01\text{ mm}) = \mathbf{3.52\text{ mm}}\)
সঠিক উত্তর: **(b) 3.52 mm**।',
  1
);

COMMIT;
