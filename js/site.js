const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});

const markHost = async (el) => {
  const hostname = location.hostname;
  let host = "";
  if (/(^|\.)github\.io$/i.test(hostname)) host = "g";
  else if (/(^|\.)vercel\.(app|sh)$/i.test(hostname)) host = "v";
  else {
    try {
      const response = await fetch(location.href, { method: "HEAD", cache: "no-store" });
      const server = response.headers.get("server") || "";
      if (response.headers.get("x-vercel-id") || /vercel/i.test(server)) host = "v";
      else if (response.headers.get("x-github-request-id") || /github/i.test(server)) host = "g";
    } catch {
      host = "";
    }
  }

  if (host === "v") {
    el.textContent = ".v";
    el.title = "Served by Vercel";
    el.setAttribute("aria-label", "Served by Vercel");
  } else if (host === "g") {
    el.textContent = ".g";
    el.title = "Served by GitHub Pages";
    el.setAttribute("aria-label", "Served by GitHub Pages");
  } else {
    el.textContent = ".g / .v";
    el.title = "Host not identified";
    el.setAttribute("aria-label", "Host not identified");
  }
};

document.querySelectorAll("[data-host-mark]").forEach((el) => {
  void markHost(el);
});

const gallery = document.querySelector(".hero-gallery");
const dots = document.querySelector(".gallery-dots");

if (gallery && dots) {
  const slides = [...gallery.querySelectorAll(".thumb")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobileGallery = window.matchMedia("(max-width: 860px)");

  const slideWidth = () => gallery.clientWidth || 1;

  const currentIndex = () => {
    const width = slideWidth();
    const max = Math.max(0, slides.length - 1);
    return Math.min(max, Math.max(0, Math.round(gallery.scrollLeft / width)));
  };

  const slideHeight = (slide) => {
    const img = slide.querySelector("img");
    const caption = slide.querySelector("span");
    if (!img) return 0;
    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;
    if (!naturalW || !naturalH) return 0;
    const photo = slideWidth() * (naturalH / naturalW);
    const label = caption ? caption.offsetHeight : 0;
    return photo + label;
  };

  const interpolatedHeight = () => {
    const width = slideWidth();
    const progress = gallery.scrollLeft / width;
    const max = Math.max(0, slides.length - 1);
    const clamped = Math.max(0, Math.min(max, progress));
    const from = Math.floor(clamped);
    const to = Math.min(from + 1, max);
    const t = clamped - from;
    const start = slideHeight(slides[from]);
    const end = slideHeight(slides[to]);
    if (!start || !end) return start || end || 0;
    return start + (end - start) * t;
  };

  const applyMobileHeight = (animate) => {
    if (!mobileGallery.matches) {
      gallery.style.height = "";
      gallery.style.transition = "";
      return;
    }
    const next = interpolatedHeight();
    if (!next) return;
    const ease = "height 0.42s cubic-bezier(0.22, 1, 0.36, 1)";
    gallery.style.transition = animate && !reducedMotion.matches ? ease : "none";
    gallery.style.height = `${next}px`;
  };

  const scrollToSlide = (index, behavior) => {
    const max = Math.max(0, slides.length - 1);
    const next = Math.min(max, Math.max(0, index));
    const smooth = behavior ?? (reducedMotion.matches ? "auto" : "smooth");
    gallery.scrollTo({ left: next * slideWidth(), behavior: smooth });
    applyMobileHeight(smooth === "smooth");
  };

  dots.replaceChildren(
    ...slides.map((_, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("aria-label", `Show preview ${index + 1}`);
      button.addEventListener("click", () => {
        scrollToSlide(index);
      });
      return button;
    })
  );

  const syncDots = () => {
    const index = currentIndex();
    [...dots.children].forEach((button, i) => {
      button.toggleAttribute("aria-current", i === index);
    });
  };

  gallery.addEventListener(
    "scroll",
    () => {
      syncDots();
      applyMobileHeight(false);
    },
    { passive: true }
  );
  window.addEventListener("resize", () => {
    scrollToSlide(currentIndex(), "auto");
    syncDots();
    applyMobileHeight(false);
  });
  mobileGallery.addEventListener("change", () => {
    applyMobileHeight(false);
  });
  slides.forEach((slide) => {
    const img = slide.querySelector("img");
    if (img && !img.complete) {
      img.addEventListener("load", () => applyMobileHeight(false), { once: true });
    }
  });
  syncDots();
  applyMobileHeight(false);
}

const hexColor = ([r, g, b]) =>
  `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;

const medianColor = (pixels) => {
  if (!pixels.length) return [232, 232, 232];
  const pick = (index) => {
    const values = pixels.map((pixel) => pixel[index]).sort((a, b) => a - b);
    return values[Math.floor(values.length / 2)];
  };
  return [pick(0), pick(1), pick(2)];
};

const samplePhotoGrade = (img) => {
  const srcW = img.naturalWidth;
  const srcH = img.naturalHeight;
  if (!srcW || !srcH) return null;

  const canvas = document.createElement("canvas");
  const width = 48;
  const height = Math.max(24, Math.round((width * srcH) / srcW));
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0, width, height);

  let data;
  try {
    data = ctx.getImageData(0, 0, width, height).data;
  } catch {
    return null;
  }

  const at = (x, y) => {
    const i = (y * width + x) * 4;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const chroma = ([r, g, b]) => Math.max(r, g, b) - Math.min(r, g, b);
  const isBackdrop = (pixel) => chroma(pixel) < 26;

  const stopCount = 7;
  const stops = [];
  for (let s = 0; s < stopCount; s += 1) {
    const y = Math.round((s / (stopCount - 1)) * (height - 1));
    const collected = [];
    const y0 = Math.max(0, y - 1);
    const y1 = Math.min(height - 1, y + 1);
    const edge = Math.max(2, Math.floor(width * 0.08));
    for (let yy = y0; yy <= y1; yy += 1) {
      for (let x = 0; x < edge; x += 1) {
        const pixel = at(x, yy);
        if (isBackdrop(pixel)) collected.push(pixel);
      }
    }
    if (s === 0 || s === stopCount - 1) {
      const yy = s === 0 ? 0 : height - 1;
      for (let x = Math.floor(width * 0.06); x < Math.floor(width * 0.82); x += 1) {
        const pixel = at(x, yy);
        if (isBackdrop(pixel)) collected.push(pixel);
      }
    }
    stops.push(medianColor(collected));
  }

  const gradient = `linear-gradient(180deg, ${stops
    .map((color, index) => `${hexColor(color)} ${Math.round((index / (stops.length - 1)) * 100)}%`)
    .join(", ")})`;
  return { gradient, mat: hexColor(stops[stops.length - 1]) };
};

const paintPhotoMat = (img) => {
  const host = img.closest(".figure, .hero-figure, .thumb, .work-card");
  if (!host || host.className.includes("photo-mat-")) return;
  const sampled = samplePhotoGrade(img);
  if (!sampled) return;
  host.style.setProperty("--photo-grade", sampled.gradient);
  host.style.setProperty("--photo-mat", sampled.mat);
};

document.querySelectorAll(".figure img, .hero-figure img, .thumb img, .work-card img").forEach((img) => {
  const apply = () => paintPhotoMat(img);
  if (img.complete && img.naturalWidth) apply();
  else img.addEventListener("load", apply, { once: true });
});
