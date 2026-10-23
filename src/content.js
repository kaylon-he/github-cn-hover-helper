(function () {
  const termSources = window.GitHubCnHoverTermSources || [];
  const activeSources = termSources.filter((source) => {
    if (!source.matches || source.matches.length === 0) return true;
    return source.matches.some((pattern) => pattern.test(window.location.pathname));
  });
  const terms = Object.assign({}, ...activeSources.map((source) => source.terms || {}));
  const pathRules = activeSources.flatMap((source) => source.pathRules || []);
  const interactiveSelector = [
    "button",
    "a[href]",
    "h1",
    "h2",
    "h3",
    "h4",
    "[role='button']",
    "[aria-label]",
    "[title]",
    "summary",
    "input:not([type])",
    "input[type='search']",
    "input[type='text']",
    "textarea",
    "input[type='submit']",
    "input[type='button']"
  ].join(",");

  let currentElement = null;
  let currentTerm = null;
  let tooltip = null;
  let hideTimer = 0;

  function normalize(value) {
    return String(value || "")
      .replace(/\s+/g, " ")
      .replace(/\d[\d,.]*\s*$/, "")
      .trim()
      .toLowerCase();
  }

  function trimButtonText(value) {
    return String(value || "")
      .replace(/\b\d[\d,.]*\b/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function isTextField(element) {
    if (element instanceof HTMLTextAreaElement) return true;
    if (!(element instanceof HTMLInputElement)) return false;
    return ["", "search", "text"].includes(element.type);
  }

  function collectQueryTokens(value) {
    return String(value || "")
      .split(/\s+/)
      .flatMap((token) => {
        const normalized = token.trim().toLowerCase();
        if (!normalized) return [];

        const parts = [normalized];
        const [, key, rawValue] = normalized.match(/^([a-z-]+):(.+)$/) || [];
        if (key && rawValue) {
          parts.push(key, rawValue);
          if (key === "is") parts.push(`is:${rawValue}`);
          if (key === "state") parts.push(`state:${rawValue}`);
        }
        return parts;
      });
  }

  function buildTerm(raw) {
    const parts = terms[raw];
    if (!parts) return null;
    return {
      title: parts[0],
      name: parts[1],
      description: parts[2]
    };
  }

  function findPathTerm(element) {
    if (!(element instanceof HTMLAnchorElement)) return null;
    let url;
    try {
      url = new URL(element.href);
    } catch (_) {
      return null;
    }

    if (url.hostname !== "github.com") return null;
    const matched = pathRules.find(([pattern]) => pattern.test(url.pathname));
    return matched ? buildTerm(matched[1]) : null;
  }

  function collectCandidates(element) {
    const values = [
      element.getAttribute("aria-label"),
      element.getAttribute("title"),
      element.getAttribute("data-hovercard-type"),
      element.getAttribute("data-ga-click"),
      trimButtonText(element.innerText),
      trimButtonText(element.textContent)
    ];

    if (isTextField(element)) {
      values.push(element.value);
      values.push(...collectQueryTokens(element.value));
    }

    const labelledBy = element.getAttribute("aria-labelledby");
    if (labelledBy) {
      labelledBy.split(/\s+/).forEach((id) => {
        const label = document.getElementById(id);
        if (label) values.push(trimButtonText(label.textContent));
      });
    }

    return values
      .map(normalize)
      .filter(Boolean)
      .flatMap((value) => {
        const lower = value.toLowerCase();
        return [
          lower,
          lower.replace(/^open /, ""),
          lower.replace(/^view /, ""),
          lower.replace(/^go to /, ""),
          lower.replace(/^new /, ""),
          lower.replace(/ repository$/, ""),
          lower.replace(/ tab$/, ""),
          lower.replace(/\s+menu$/, "")
        ];
      });
  }

  function findTerm(element) {
    const pathTerm = findPathTerm(element);
    if (pathTerm) return pathTerm;

    const candidates = collectCandidates(element);
    for (const candidate of candidates) {
      if (terms[candidate]) return buildTerm(candidate);
    }

    for (const candidate of candidates) {
      const key = Object.keys(terms).find((term) => {
        return candidate === term || candidate.startsWith(`${term} `) || candidate.endsWith(` ${term}`);
      });
      if (key) return buildTerm(key);
    }

    return null;
  }

  function ensureTooltip() {
    if (tooltip) return tooltip;

    tooltip = document.createElement("div");
    tooltip.className = "github-cn-hover-tooltip";
    tooltip.setAttribute("role", "tooltip");
    tooltip.innerHTML = [
      "<div class='github-cn-hover-title'></div>",
      "<div class='github-cn-hover-name'></div>",
      "<div class='github-cn-hover-desc'></div>"
    ].join("");
    document.documentElement.appendChild(tooltip);
    return tooltip;
  }

  function showTooltip(term, event, element) {
    const tip = ensureTooltip();
    tip.querySelector(".github-cn-hover-title").textContent = term.title;
    tip.querySelector(".github-cn-hover-name").textContent = term.name;
    tip.querySelector(".github-cn-hover-desc").textContent = term.description;
    tip.classList.add("is-visible");
    positionTooltip(event, element);
  }

  function positionTooltip(event, element = currentElement) {
    if (!tooltip || !tooltip.classList.contains("is-visible")) return;

    const gap = 14;
    const margin = 12;
    const rect = tooltip.getBoundingClientRect();
    let left = event.clientX + gap;
    let top = event.clientY + gap;

    if (element && isTextField(element)) {
      const targetRect = element.getBoundingClientRect();
      left = targetRect.left;
      top = targetRect.bottom + 8;

      if (top + rect.height > window.innerHeight - margin) {
        top = targetRect.top - rect.height - 8;
      }
    }

    if (left + rect.width > window.innerWidth - margin) {
      left = element && isTextField(element)
        ? window.innerWidth - rect.width - margin
        : event.clientX - rect.width - gap;
    }
    if (top + rect.height > window.innerHeight - margin) {
      top = event.clientY - rect.height - gap;
    }

    tooltip.style.left = `${Math.max(margin, left)}px`;
    tooltip.style.top = `${Math.max(margin, top)}px`;
  }

  function hideTooltip() {
    currentElement = null;
    currentTerm = null;
    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(() => {
      if (tooltip) tooltip.classList.remove("is-visible");
    }, 80);
  }

  function onMouseOver(event) {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    const element = target.closest(interactiveSelector);
    if (!element || element === currentElement || element.closest(".github-cn-hover-tooltip")) return;

    const term = findTerm(element);
    if (!term) {
      hideTooltip();
      return;
    }

    currentElement = element;
    currentTerm = term;
    window.clearTimeout(hideTimer);
    showTooltip(term, event, element);
  }

  function onMouseMove(event) {
    if (currentTerm) positionTooltip(event);
  }

  function onMouseOut(event) {
    if (!currentElement) return;
    const related = event.relatedTarget instanceof Node ? event.relatedTarget : null;
    if (related && currentElement.contains(related)) return;
    hideTooltip();
  }

  document.addEventListener("mouseover", onMouseOver, true);
  document.addEventListener("mousemove", onMouseMove, true);
  document.addEventListener("mouseout", onMouseOut, true);
  window.addEventListener("scroll", hideTooltip, true);
  window.addEventListener("blur", hideTooltip);
})();
