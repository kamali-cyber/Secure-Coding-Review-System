import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  variant?: 'vulnerable' | 'secure' | 'neutral';
  filename?: string;
  showLineNumbers?: boolean;
  highlightedLines?: number[];
}

// Lightweight PHP syntax highlighter — tokenizes via regex into spans.
function highlightPhp(code: string, variant: CodeBlockProps['variant']) {
  const insecurePatterns: RegExp[] = [
    /\$_POST\[[^\]]+\]/g,
    /SELECT \* FROM .*\$.*|INSERT INTO.*\$.*/gi,
    /password(?!_hash|_verify)/gi,
  ];
  void insecurePatterns;

  const lines = code.split('\n');
  return lines.map((line) => {
    let html = escapeHtml(line);
    html = html.replace(/(&lt;\?php|&lt;\?|\?&gt;)/g, '<span class="tok-php-tag">$1</span>');
    html = html.replace(/\b(if|else|elseif|foreach|for|while|return|exit|require|include|session_start|session_regenerate_id|header|echo|function|new|class|public|private|protected|static|const|try|catch|throw|finally|use|namespace)\b/g, '<span class="tok-keyword">$1</span>');
    html = html.replace(/\b(true|false|null)\b/g, '<span class="tok-bool">$1</span>');
    html = html.replace(/(\b[A-Z_][A-Z0-9_]+\b)/g, '<span class="tok-const">$1</span>');
    html = html.replace(/(\$[a-zA-Z_][a-zA-Z0-9_]*)/g, '<span class="tok-var">$1</span>');
    html = html.replace(/(\/\/[^\n]*|#[^\n]*)/g, '<span class="tok-comment">$1</span>');
    html = html.replace(/('[^']*'|"[^"]*")/g, '<span class="tok-string">$1</span>');
    html = html.replace(/\b(\d+)\b/g, '<span class="tok-number">$1</span>');
    html = html.replace(/\b(password_hash|password_verify|bind_param|prepare|execute|get_result|fetch_assoc|hash_equals|random_bytes|preg_match|strlen|trim|intval|http_response_code)\b/g, '<span class="tok-func">$1</span>');

    if (variant === 'vulnerable') {
      html = html.replace(/(\$_POST\[[^\]]+\])/g, '<span class="tok-insecure">$1</span>');
      html = html.replace(/(SELECT \* FROM[^<]*|INSERT INTO[^<]*)/gi, '<span class="tok-insecure">$1</span>');
      html = html.replace(/(\$password)(?![a-zA-Z_])/g, '<span class="tok-insecure">$1</span>');
      html = html.replace(/(===|==)\s*\$password/g, '<span class="tok-insecure">$1 $2</span>');
    } else if (variant === 'secure') {
      html = html.replace(/(password_hash|password_verify|bind_param|prepare|execute|hash_equals|session_regenerate_id|http_response_code)/g, '<span class="tok-secure">$1</span>');
    }

    return html;
  });
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export default function CodeBlock({
  code,
  variant = 'neutral',
  filename,
  showLineNumbers = true,
  highlightedLines = [],
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const highlighted = highlightPhp(code, variant);

  const variantStyles = {
    vulnerable: 'border-accent-red/30 shadow-glow-red',
    secure: 'border-accent-green/30 shadow-glow-green',
    neutral: 'border-soc-border',
  };

  const labelStyles = {
    vulnerable: { text: 'VULNERABLE', color: 'text-accent-red', dot: 'bg-accent-red' },
    secure: { text: 'SECURE', color: 'text-accent-green', dot: 'bg-accent-green' },
    neutral: { text: 'CODE', color: 'text-accent-cyan', dot: 'bg-accent-cyan' },
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div
      className={`rounded-lg border bg-soc-panel/80 overflow-hidden ${variantStyles[variant]}`}
    >
      <div className="flex items-center justify-between border-b border-soc-border bg-soc-card/60 px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <span className={`h-2 w-2 rounded-full ${labelStyles[variant].dot} animate-pulse-slow`} />
          <span className={`text-[11px] font-bold tracking-widest ${labelStyles[variant].color}`}>
            {labelStyles[variant].text}
          </span>
          {filename && (
            <span className="text-[11px] text-soc-muted font-mono">
              <span className="text-soc-muted/50">·</span> {filename}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded px-2 py-1 text-[11px] text-soc-muted hover:text-accent-cyan hover:bg-soc-border/40 transition-colors"
        >
          {copied ? <Check size={12} className="text-accent-green" /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="overflow-x-auto">
        <pre className="text-[13px] leading-[1.65] font-mono p-4">
          <code>
            {highlighted.map((lineHtml, i) => {
              const isHighlighted = highlightedLines.includes(i + 1);
              return (
                <div
                  key={i}
                  className={`flex ${isHighlighted ? 'bg-accent-amber/10 -mx-4 px-4 border-l-2 border-accent-amber' : ''}`}
                >
                  {showLineNumbers && (
                    <span className="select-none text-soc-muted/40 w-9 shrink-0 text-right pr-3">
                      {i + 1}
                    </span>
                  )}
                  <span
                    className="flex-1 whitespace-pre"
                    dangerouslySetInnerHTML={{ __html: lineHtml || '&nbsp;' }}
                  />
                </div>
              );
            })}
          </code>
        </pre>
      </div>
    </div>
  );
}
