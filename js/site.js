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
  dots.replaceChildren(
    ...slides.map((_, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("aria-label", `Show preview ${index + 1}`);
      button.addEventListener("click", () => {
        slides[index].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      });
      return button;
    })
  );

  const syncDots = () => {
    const x = gallery.scrollLeft;
    const width = gallery.clientWidth || 1;
    const index = Math.round(x / width);
    [...dots.children].forEach((button, i) => {
      button.toggleAttribute("aria-current", i === index);
    });
  };

  gallery.addEventListener("scroll", syncDots, { passive: true });
  window.addEventListener("resize", syncDots);
  syncDots();
}
