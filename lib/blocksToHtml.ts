export function blocksToHtml(blocks = []) {
  if (!Array.isArray(blocks)) return '';
  return blocks.map(b => {
    switch (b.type) {
      case 'paragraph':
        return `<p>${inline(b.children)}</p>`;
      case 'heading':
        const lvl = Math.min(Math.max(b.level || 2, 2), 4);
        return `<h${lvl}>${inline(b.children)}</h${lvl}>`;
      case 'list':
        const tag = b.format === 'ordered' ? 'ol' : 'ul';
        return `<${tag}>${(b.children||[]).map(li => `<li>${inline(li.children)}</li>`).join('')}</${tag}>`;
      case 'quote':
        return `<blockquote>${inline(b.children)}</blockquote>`;
      default:
        return '';
    }
  }).join('');
}

function inline(nodes = []) {
  return (nodes||[]).map(n => {
    let t = (n.text || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    if (n.bold)   t = `<strong>${t}</strong>`;
    if (n.italic) t = `<em>${t}</em>`;
    if (n.underline) t = `<u>${t}</u>`;
    if (n.code)   t = `<code>${t}</code>`;
    if (n.type === 'link' && n.url) t = `<a href="${n.url}" target="_blank" rel="noopener">${inline(n.children)}</a>`;
    return t;
  }).join('');
}
