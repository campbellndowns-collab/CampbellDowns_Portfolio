(() => {
  const viewer = document.querySelector("#echo-model");
  const shell = document.querySelector("[data-echo-viewer]");
  if (!viewer || !shell) return;

  const status = shell.querySelector("[data-echo-model-status]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const AUTO_ROTATE_DELAY_MS = 28000;

  const setAutoRotate = () => {
    if (reducedMotion.matches) {
      viewer.removeAttribute("auto-rotate");
      return;
    }
    viewer.setAttribute("auto-rotate", "");
    viewer.setAttribute("auto-rotate-delay", String(AUTO_ROTATE_DELAY_MS));
    viewer.setAttribute("rotation-per-second", "10deg");
  };

  const markMissing = () => {
    if (status) {
      status.innerHTML =
        "3D model not loaded. Confirm <code>assets/models/project-echo.glb</code> is present.";
    }
    viewer.classList.add("is-missing-model");
  };

  viewer.addEventListener("error", markMissing);
  viewer.addEventListener("load", () => {
    viewer.classList.remove("is-missing-model");
    if (status) {
      status.textContent = "Drag to orbit · scroll or pinch to zoom.";
    }
  });

  fetch(viewer.getAttribute("src") || "", { method: "HEAD", cache: "no-store" })
    .then((response) => {
      if (!response.ok) markMissing();
    })
    .catch(markMissing);

  setAutoRotate();
  reducedMotion.addEventListener("change", setAutoRotate);
})();
