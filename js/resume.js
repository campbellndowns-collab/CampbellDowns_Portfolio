const config = window.CAMPBELL_SITE || {};
const wrap = document.querySelector("[data-resume-frame-wrap]");
const frame = document.querySelector("[data-resume-frame]");
const fallback = document.querySelector("[data-resume-fallback]");
const download = document.querySelector("[data-resume-actions] a.btn-primary");
const overleafUrl = (config.resumeOverleaf || "").trim();
const configuredPdf = (config.resumePdf || "").trim();

const addAction = (href, label) => {
  const actions = document.querySelector("[data-resume-actions]");
  if (!actions) return;
  const link = document.createElement("a");
  link.className = "btn btn-secondary";
  link.href = href;
  link.textContent = label;
  link.target = "_blank";
  link.rel = "noopener";
  actions.append(link);
};

if (overleafUrl) addAction(overleafUrl, "Overleaf source");

if (configuredPdf) {
  if (frame) frame.src = configuredPdf;
  if (download) download.href = configuredPdf;
  if (wrap) wrap.hidden = false;
  if (fallback) fallback.hidden = true;
}
