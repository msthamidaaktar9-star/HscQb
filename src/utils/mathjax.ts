// MathJax 3 rendering helper with offline fallback and debouncing

declare global {
  interface Window {
    MathJax?: {
      typesetPromise?: (elements?: (HTMLElement | null)[]) => Promise<void>;
      typeset?: (elements?: (HTMLElement | null)[]) => void;
      startup?: {
        promise?: Promise<void>;
      };
    };
  }
}

let timeoutId: number | null = null;

/**
 * Pure client-side offline LaTeX parser & renderer.
 * Converts LaTeX formulas, fractions, roots, and Greek symbols into HTML
 * when running offline without internet connection or CDN access.
 */
export function renderLatexOffline(latexStr: string): string {
  if (!latexStr) return '';
  let str = latexStr;

  // Newlines \\ -> <br/>
  str = str.replace(/\\\\/g, '<br/>');

  // Text formatting
  str = str.replace(/\\textbf\{([^{}]+)\}/g, '<strong>$1</strong>');
  str = str.replace(/\\underline\{([^{}]+)\}/g, '<u>$1</u>');
  str = str.replace(/\\text\{([^{}]+)\}/g, '$1');

  // Greek letters
  str = str.replace(/\\theta/g, 'θ');
  str = str.replace(/\\mu/g, 'μ');
  str = str.replace(/\\pi/g, 'π');
  str = str.replace(/\\rho/g, 'ρ');
  str = str.replace(/\\eta/g, 'η');
  str = str.replace(/\\alpha/g, 'α');
  str = str.replace(/\\beta/g, 'β');
  str = str.replace(/\\gamma/g, 'γ');
  str = str.replace(/\\lambda/g, 'λ');
  str = str.replace(/\\omega/g, 'ω');
  str = str.replace(/\\Omega/g, 'Ω');
  str = str.replace(/\\Delta/g, 'Δ');
  str = str.replace(/\\Sigma/g, 'Σ');

  // Math symbols
  str = str.replace(/\\times/g, ' × ');
  str = str.replace(/\\cdot/g, ' · ');
  str = str.replace(/\\pm/g, ' ± ');
  str = str.replace(/\\approx/g, ' ≈ ');
  str = str.replace(/\\le/g, ' ≤ ');
  str = str.replace(/\\ge/g, ' ≥ ');
  str = str.replace(/\\ne/g, ' ≠ ');
  str = str.replace(/\\implies/g, ' ⇒ ');
  str = str.replace(/\\therefore/g, ' ∴ ');
  str = str.replace(/\\circ/g, '°');
  str = str.replace(/\\vec\{([A-Za-z]+)\}/g, '$1⃗');

  // Square roots \sqrt{...}
  str = str.replace(/\\sqrt\{([^{}]+)\}/g, '√<span class="radicand">$1</span>');

  // Vertical Fractions \frac{A}{B} (nested loop handles complex fractions)
  let loopCount = 0;
  while (/\\frac\{([^{}]+)\}\{([^{}]+)\}/.test(str) && loopCount < 8) {
    str = str.replace(
      /\\frac\{([^{}]+)\}\{([^{}]+)\}/g,
      '<span class="vfrac"><span class="vnum">$1</span><span class="vden">$2</span></span>'
    );
    loopCount++;
  }

  // Superscripts & Subscripts
  str = str.replace(/\^\{([^{}]+)\}/g, '<sup>$1</sup>');
  str = str.replace(/\^([0-9a-zA-Z°]+)/g, '<sup>$1</sup>');
  str = str.replace(/_\{([^{}]+)\}/g, '<sub>$1</sub>');
  str = str.replace(/_([0-9a-zA-Z]+)/g, '<sub>$1</sub>');

  // Display math \[ ... \]
  str = str.replace(/\\\[([\s\S]*?)\\\]/g, '<div class="my-2 text-center overflow-x-auto">$1</div>');
  // Inline math \( ... \)
  str = str.replace(/\\\(([\s\S]*?)\\\)/g, '<span>$1</span>');

  return str;
}

export function triggerMathJax(targetElement?: HTMLElement | null): void {
  if (typeof window === 'undefined') return;

  if (timeoutId) {
    window.clearTimeout(timeoutId);
  }

  timeoutId = window.setTimeout(() => {
    // If MathJax is loaded and functional
    if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
      try {
        const targets = targetElement ? [targetElement] : undefined;
        window.MathJax.typesetPromise(targets).catch((err: unknown) => {
          console.warn('MathJax typesetting notice:', err);
        });
      } catch (e) {
        console.warn('MathJax exception:', e);
      }
    } else {
      // Offline fallback: if MathJax script is not present (offline mode)
      if (targetElement) {
        applyOfflineMathFallback(targetElement);
      }
    }
  }, 60);
}

function applyOfflineMathFallback(container: HTMLElement): void {
  // Find all elements that contain LaTeX patterns
  const mathContainers = container.querySelectorAll('.mathjax-container, .stem-text, .question-prompts, .concept-box');
  mathContainers.forEach((el) => {
    if (el instanceof HTMLElement && !el.dataset.offlineRendered) {
      if (el.innerHTML.includes('\\(') || el.innerHTML.includes('\\[') || el.innerHTML.includes('\\frac')) {
        el.innerHTML = renderLatexOffline(el.innerHTML);
        el.dataset.offlineRendered = 'true';
      }
    }
  });
}

