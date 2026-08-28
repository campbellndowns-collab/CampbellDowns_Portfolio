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

const hrefFromAnnotation = (annot) => {
  const raw = annot.url || annot.unsafeUrl || annot.fileName || "";
  if (!raw) return "";
  if (/^(https?:|mailto:|tel:)/i.test(raw)) return raw;
  if (/^www\./i.test(raw) || raw.includes("campbelldowns.com")) {
    return `https://${raw.replace(/^\/\//, "")}`;
  }
  return raw;
};

const addOverlayLink = (layer, href, box, pageWidth, pageHeight) => {
  const x1 = Math.min(box[0], box[2]);
  const x2 = Math.max(box[0], box[2]);
  const y1 = Math.min(box[1], box[3]);
  const y2 = Math.max(box[1], box[3]);
  const pad = 1.2;
  const link = document.createElement("a");
  link.className = "resume-hotspot";
  link.href = href;
  if (/^https?:/i.test(href)) {
    link.target = "_blank";
    link.rel = "noopener";
  }
  link.setAttribute("aria-label", href.replace(/^mailto:/i, ""));
  link.style.left = `${(x1 / pageWidth) * 100 - pad * 0.15}%`;
  link.style.top = `${((pageHeight - y2) / pageHeight) * 100 - pad * 0.1}%`;
  link.style.width = `${((x2 - x1) / pageWidth) * 100 + pad * 0.3}%`;
  link.style.height = `${((y2 - y1) / pageHeight) * 100 + pad * 0.2}%`;
  layer.append(link);
};

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
    const wrap = document.createElement("div");
    wrap.className = "resume-page-wrap";
    const canvas = document.createElement("canvas");
    canvas.className = "resume-page";
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    canvas.style.width = "100%";
    canvas.style.height = "auto";
    canvas.setAttribute("aria-label", `Resume page ${n}`);
    await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
    const layer = document.createElement("div");
    layer.className = "resume-link-layer";
    const annotations = await page.getAnnotations();
    annotations.forEach((annot) => {
      if (annot.subtype !== "Link") return;
      const href = hrefFromAnnotation(annot);
      if (!href || !annot.rect) return;
      addOverlayLink(layer, href, annot.rect, unscaled.width, unscaled.height);
    });
    wrap.append(canvas, layer);
    sheet.append(wrap);
  }
};

void renderPdf().catch(() => {
  /* Keep the static PNG and HTML hotspots if PDF.js cannot run. */
});
