const config = window.CAMPBELL_SITE || {};
const sheet = document.querySelector("[data-resume-sheet]");
const download = document.querySelector("[data-resume-actions] a.btn-primary");
const overleafUrl = (config.resumeOverleaf || "").trim();
const pdfUrl = (config.resumePdf || "").trim() || "assets/resume.pdf";

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
if (download) download.href = pdfUrl;

const renderPdf = async () => {
  if (!sheet || !window.pdfjsLib) return;

  window.pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

  const pdf = await window.pdfjsLib.getDocument(pdfUrl).promise;
  const width = sheet.clientWidth || 800;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  sheet.replaceChildren();

  for (let n = 1; n <= pdf.numPages; n += 1) {
    const page = await pdf.getPage(n);
    const unscaled = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({ scale: (width / unscaled.width) * pixelRatio });
    const canvas = document.createElement("canvas");
    canvas.className = "resume-page";
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    canvas.style.width = "100%";
    canvas.style.height = "auto";
    canvas.setAttribute("aria-label", `Resume page ${n}`);
    await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
    sheet.append(canvas);
  }
};

void renderPdf().catch(() => {
  /* Keep the static PNG if PDF.js cannot run. */
});
