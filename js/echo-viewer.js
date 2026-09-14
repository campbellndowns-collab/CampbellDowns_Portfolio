(() => {
  const viewer = document.querySelector("#echo-model");
  if (!viewer) return;

  const status = document.querySelector("[data-echo-model-status]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const setAutoRotate = () => {
    if (reducedMotion.matches) {
      viewer.removeAttribute("auto-rotate");
      return;
    }
    viewer.setAttribute("auto-rotate", "");
    viewer.setAttribute("rotation-per-second", "12deg");
  };

  setAutoRotate();
  reducedMotion.addEventListener("change", setAutoRotate);

  const markMissing = () => {
    if (status) {
      status.innerHTML =
        '3D model not loaded yet. Export your SolidWorks assembly to <code>assets/models/project-echo.glb</code>, then refresh. Hotspot <code>data-position</code> values in <code>work/project-echo.html</code> can be tuned after the GLB is in place.';
    }
    viewer.classList.add("is-missing-model");
  };

  viewer.addEventListener("error", markMissing);
  viewer.addEventListener("load", () => {
    viewer.classList.remove("is-missing-model");
    if (status) {
      status.textContent =
        "Drag to orbit · scroll or pinch to zoom · tap markers for subsystem notes.";
    }
  });

  // Probe whether the GLB exists so we can surface a clear message early.
  fetch(viewer.getAttribute("src") || "", { method: "HEAD", cache: "no-store" })
    .then((response) => {
      if (!response.ok) markMissing();
    })
    .catch(markMissing);
})();
