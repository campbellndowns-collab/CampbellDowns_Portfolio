const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
}

document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = String(new Date().getFullYear());
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
