import { QuestionItem } from '../data/questionDatabase';

/**
 * Generates an ANSI / SQLite compatible SQL script for the question database.
 * Can be imported into SQLite, MySQL, PostgreSQL, or used with .db files.
 */
export function generateSqlScript(questions: QuestionItem[]): string {
  const tableDefinition = `-- ====================================================================
-- Uddvash Physics Question Bank - SQLite & SQL Database Schema
-- Generated automatically for offline and production database usage
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

-- ====================================================================
-- Data Inserts
-- ====================================================================
BEGIN TRANSACTION;
`;

  const escapeSql = (str: string | undefined): string => {
    if (str === undefined || str === null) return 'NULL';
    return `'${str.replace(/'/g, "''")}'`;
  };

  const inserts = questions.map((q) => {
    const optA = q.options?.a;
    const optB = q.options?.b;
    const optC = q.options?.c;
    const optD = q.options?.d;

    return `INSERT OR REPLACE INTO questions (
  id, subject, chapter, topic, type, board_tag, stem, svg_diagram,
  concept_summary, question_text, option_a, option_b, option_c, option_d,
  correct_option, solution, marks
) VALUES (
  ${escapeSql(q.id)},
  ${escapeSql(q.subject)},
  ${escapeSql(q.chapter)},
  ${escapeSql(q.topic)},
  ${escapeSql(q.type)},
  ${escapeSql(q.boardTag)},
  ${escapeSql(q.stem)},
  ${escapeSql(q.svgDiagram)},
  ${escapeSql(q.conceptSummary)},
  ${escapeSql(q.questionText)},
  ${escapeSql(optA)},
  ${escapeSql(optB)},
  ${escapeSql(optC)},
  ${escapeSql(optD)},
  ${escapeSql(q.correctOption)},
  ${escapeSql(q.solution)},
  ${q.marks || (q.type === 'CQ' ? 10 : 1)}
);`;
  }).join('\n\n');

  return `${tableDefinition}\n${inserts}\n\nCOMMIT;\n`;
}
