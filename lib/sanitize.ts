import "server-only";
import sanitizeHtml from "sanitize-html";

/**
 * Cleans HTML that comes from WordPress before it is put on the page.
 * Only normal content markup is kept (text, headings, lists, tables, links, images);
 * scripts, iframes, event handlers (onclick=…), forms and javascript: links are removed.
 */
const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "br", "hr", "span", "div", "strong", "b", "em", "i", "u", "s", "sup", "sub", "small", "mark",
    "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "code", "pre",
    "ul", "ol", "li", "dl", "dt", "dd",
    "a", "img", "figure", "figcaption",
    "table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption", "colgroup", "col",
  ],
  allowedAttributes: {
    "*": ["class", "id", "style", "title", "dir", "lang"],
    a: ["href", "target", "rel", "name"],
    img: ["src", "srcset", "sizes", "alt", "width", "height", "loading", "decoding"],
    th: ["colspan", "rowspan", "scope"],
    td: ["colspan", "rowspan"],
    ol: ["start", "type", "reversed"],
    col: ["span"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["http", "https"] },
  allowProtocolRelative: false,
  // Inline styles used in the WordPress content; anything else is dropped.
  allowedStyles: {
    "*": {
      "text-align": [/^(left|right|center|justify)$/],
      width: [/^\d+(\.\d+)?(px|%|em|rem)$/],
      "border-left": [/^[\w\s#.(),%-]+$/],
      "border-radius": [/^[\d\s.]+(px|%|em|rem)?(\s[\d.]+(px|%|em|rem)?)*$/],
      "background-color": [/^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\)|[a-z]+)$/i],
      color: [/^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\)|[a-z]+)$/i],
    },
  },
  transformTags: {
    // Links opening a new tab must not get access to this page (reverse tabnabbing).
    a: (tagName, attribs) => {
      if (attribs.target === "_blank") attribs.rel = "noopener noreferrer";
      return { tagName, attribs };
    },
  },
};

export function sanitizeWpHtml(html: string | null | undefined): string {
  return html ? sanitizeHtml(html, OPTIONS) : "";
}
