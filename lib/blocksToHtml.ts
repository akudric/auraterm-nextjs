// ---- Types ---------------------------------------------------------------

type TextNode = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
};

type LinkNode = {
  type: 'link';
  url: string;
  children?: InlineNode[];
};

type InlineNode = TextNode | LinkNode;

type ParagraphBlock = {
  type: 'paragraph';
  children?: InlineNode[];
};

type HeadingBlock = {
  type: 'heading';
  level?: number; // we’ll clamp to 2..4
  children?: InlineNode[];
};

type ListItem = {
  // many serializers don’t set a type on li; we only need children
  children?: InlineNode[];
};

type ListBlock = {
  type: 'list';
  format?: 'ordered' | 'unordered';
  children?: ListItem[];
};

type QuoteBlock = {
  type: 'quote';
  children?: InlineNode[];
};

type Block = ParagraphBlock | HeadingBlock | ListBlock | QuoteBlock;

// ---- Type guards ---------------------------------------------------------

function isObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object';
}

function isTextNode(n: unknown): n is TextNode {
  return isObject(n) && typeof (n as any).text === 'string';
}

function isLinkNode(n: unknown): n is LinkNode {
  return isObject(n) && (n as any).type === 'link' && typeof (n as any).url === 'string';
}

// ---- Utils ---------------------------------------------------------------

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function sanitizeHref(url: string): string {
  // allow http(s) and mailto; everything else becomes '#'
  return /^(https?:|mailto:)/i.test(url) ? url : '#';
}

function clampHeading(level: unknown): 2 | 3 | 4 {
  const n = typeof level === 'number' ? level : Number(level);
  const clamped = Math.min(Math.max(Number.isFinite(n) ? n : 2, 2), 4);
  return clamped as 2 | 3 | 4;
}

// ---- Inline renderer ------------------------------------------------------

function inline(nodes: InlineNode[] = []): string {
  return nodes.map((n) => {
    if (isLinkNode(n)) {
      const inner = inline(n.children ?? []);
      const href = sanitizeHref(n.url);
      return `<a href="${href}" target="_blank" rel="noopener">${inner}</a>`;
    }

    // Treat anything else as text-ish
    const text = isTextNode(n) ? n.text : '';
    let t = escapeHtml(text);

    if (isTextNode(n)) {
      if (n.bold) t = `<strong>${t}</strong>`;
      if (n.italic) t = `<em>${t}</em>`;
      if (n.underline) t = `<u>${t}</u>`;
      if (n.code) t = `<code>${t}</code>`;
    }

    return t;
  }).join('');
}

// ---- Block renderer -------------------------------------------------------

export function blocksToHtml(blocks: Block[] = []): string {
  if (!Array.isArray(blocks)) return '';

  return blocks.map((b) => {
    if (!isObject(b)) return '';

    switch ((b as any).type) {
      case 'paragraph': {
        const children = (b as ParagraphBlock).children ?? [];
        return `<p>${inline(children)}</p>`;
      }
      case 'heading': {
        const hb = b as HeadingBlock;
        const lvl = clampHeading(hb.level);
        return `<h${lvl}>${inline(hb.children ?? [])}</h${lvl}>`;
      }
      case 'list': {
        const lb = b as ListBlock;
        const tag = lb.format === 'ordered' ? 'ol' : 'ul';
        const items = (lb.children ?? []).map((li) => `<li>${inline(li?.children ?? [])}</li>`).join('');
        return `<${tag}>${items}</${tag}>`;
      }
      case 'quote': {
        const qb = b as QuoteBlock;
        return `<blockquote>${inline(qb.children ?? [])}</blockquote>`;
      }
      default:
        return '';
    }
  }).join('');
}