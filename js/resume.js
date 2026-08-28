const config = window.CAMPBELL_SITE || {};
const frame = document.querySelector("[data-resume-frame]");
const fallback = document.querySelector("[data-resume-fallback]");
const actions = document.querySelector("[data-resume-actions]");
const localPdf = new URL("assets/resume.pdf", document.baseURI).href;
const configuredPdf = (config.resumePdf || "").trim();
const overleafUrl = (config.resumeOverleaf || "").trim();

const addAction = (href, label, primary = false) => {
  if (!actions) return;
  const link = document.createElement("a");
    link.className = primary ? "btn btn-primary" : "btn btn-secondary";
  link.href = href;
  link.textContent = label;
  if (/^https?:/i.test(href)) link.target = "_blank";
  link.rel = "noopener";
  actions.append(link);
};

const showPdf = (url) => {
  if (frame) {
    frame.src = url;
    frame.hidden = false;
  }
  if (fallback) fallback.hidden = true;
  addAction(url, "Download PDF", true);
};

const fileLooksAvailable = async (url) => {
  try {
    const response = await fetch(url, { method: "HEAD", cache: "no-store" });
    return response.ok;
  } catch {
    return false;
  }
};

const start = async () => {
  if (overleafUrl) addAction(overleafUrl, "Overleaf source");

  if (configuredPdf) {
    showPdf(configuredPdf);
    return;
  }

  if (await fileLooksAvailable(localPdf)) {
    showPdf(localPdf);
    return;
  }

  if (frame) frame.hidden = true;
  if (fallback) fallback.hidden = false;
};

void start();
