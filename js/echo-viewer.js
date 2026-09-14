(() => {
  const viewer = document.querySelector("#echo-model");
  const shell = document.querySelector("[data-echo-viewer]");
  if (!viewer || !shell) return;

  const hotspots = window.ECHO_HOTSPOTS || [];
  const filterNames = window.ECHO_HOTSPOT_FILTERS || [];
  const status = shell.querySelector("[data-echo-model-status]");
  const toolbar = shell.querySelector("[data-echo-toolbar]");
  const infoCard = shell.querySelector("[data-echo-info]");
  const drawer = shell.querySelector("[data-echo-drawer]");
  const drawerList = shell.querySelector("[data-echo-drawer-list]");
  const morePanel = shell.querySelector("[data-echo-more]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobileQuery = window.matchMedia("(max-width: 720px)");

  // Idle auto-rotate wait (ms). Default model-viewer delay is 3000.
  const AUTO_ROTATE_DELAY_MS = 28000;

  let activeFilter = "all";
  let pinsVisible = true;
  let showSecondary = false;
  let selectedId = null;

  const parsePosition = (value) =>
    String(value || "0 0 0")
      .trim()
      .split(/\s+/)
      .map(Number);

  const setAutoRotate = () => {
    if (reducedMotion.matches) {
      viewer.removeAttribute("auto-rotate");
      return;
    }
    viewer.setAttribute("auto-rotate", "");
    viewer.setAttribute("auto-rotate-delay", String(AUTO_ROTATE_DELAY_MS));
    viewer.setAttribute("rotation-per-second", "10deg");
  };

  const isPinActive = (spot) => {
    if (!pinsVisible) return false;
    if (activeFilter !== "all" && !(spot.filters || []).includes(activeFilter)) {
      return false;
    }
    if (spot.priority === "primary") return true;
    if (spot.priority === "detail") return false;
    return showSecondary;
  };

  const focusHotspot = (spot) => {
    const [x, y, z] = parsePosition(spot.position);
    if ([x, y, z].some((n) => Number.isNaN(n))) return;
    const target = `${x}m ${y}m ${z}m`;
    try {
      viewer.cameraTarget = target;
      if (!reducedMotion.matches) {
        viewer.cameraOrbit = "auto auto 65%";
      }
    } catch {
      /* Older model-viewer builds may ignore camera setters. */
    }
  };

  const renderInfo = (spot) => {
    if (!infoCard) return;
    if (!spot) {
      infoCard.hidden = true;
      infoCard.innerHTML = "";
      return;
    }

    const component = spot.component
      ? `<p class="echo-info-component"><span>Component</span> ${spot.component}</p>`
      : "";
    const note = spot.note ? `<p class="echo-info-note">${spot.note}</p>` : "";

    infoCard.hidden = false;
    infoCard.dataset.accent = spot.accent || "blue";
    infoCard.innerHTML = `
      <button type="button" class="echo-info-close" data-echo-close aria-label="Close component details">×</button>
      <p class="echo-info-kicker">${spot.category}</p>
      <h3>${spot.title}</h3>
      ${component}
      <p>${spot.description}</p>
      ${note}
      <p class="echo-info-status"><span>Status</span> ${spot.status}</p>
    `;
  };

  const syncPins = () => {
    hotspots.forEach((spot) => {
      const pin = viewer.querySelector(`[data-hotspot-id="${spot.id}"]`);
      if (!pin) return;
      const active = isPinActive(spot);
      pin.hidden = !active;
      pin.classList.toggle("is-selected", spot.id === selectedId);
      pin.setAttribute("aria-pressed", spot.id === selectedId ? "true" : "false");
    });

    if (morePanel) {
      morePanel.hidden = !pinsVisible || activeFilter !== "all";
    }
    if (drawer) {
      drawer.querySelectorAll("[data-drawer-id]").forEach((btn) => {
        const spot = hotspots.find((item) => item.id === btn.dataset.drawerId);
        const show = spot && (spot.priority === "primary" || showSecondary || spot.priority === "detail");
        const filterOk =
          !spot || activeFilter === "all" || (spot.filters || []).includes(activeFilter);
        btn.hidden = !(pinsVisible && show && filterOk && spot.priority !== "detail");
        btn.classList.toggle("is-selected", spot && spot.id === selectedId);
      });
    }
  };

  const selectHotspot = (id) => {
    const spot = hotspots.find((item) => item.id === id);
    if (!spot) return;
    selectedId = id;
    if (spot.priority === "secondary") showSecondary = true;
    renderInfo(mobileQuery.matches ? null : spot);
    if (mobileQuery.matches && drawer) {
      drawer.dataset.open = "true";
      const detail = drawer.querySelector("[data-echo-drawer-detail]");
      if (detail) {
        detail.hidden = false;
        detail.innerHTML = `
          <p class="echo-info-kicker">${spot.category}</p>
          <h3>${spot.title}</h3>
          ${
            spot.component
              ? `<p class="echo-info-component"><span>Component</span> ${spot.component}</p>`
              : ""
          }
          <p>${spot.description}</p>
          ${spot.note ? `<p class="echo-info-note">${spot.note}</p>` : ""}
          <p class="echo-info-status"><span>Status</span> ${spot.status}</p>
        `;
      }
    }
    focusHotspot(spot);
    syncPins();
  };

  const clearSelection = () => {
    selectedId = null;
    renderInfo(null);
    const detail = drawer?.querySelector("[data-echo-drawer-detail]");
    if (detail) {
      detail.hidden = true;
      detail.innerHTML = "";
    }
    syncPins();
  };

  const buildPins = () => {
    hotspots.forEach((spot) => {
      const existing = viewer.querySelector(`[data-hotspot-id="${spot.id}"]`);
      if (existing) existing.remove();

      const button = document.createElement("button");
      button.type = "button";
      button.className = `echo-hotspot accent-${spot.accent || "blue"}`;
      button.slot = `hotspot-${spot.id}`;
      button.dataset.hotspotId = spot.id;
      button.dataset.position = spot.position;
      button.dataset.normal = spot.normal || "0 1 0";
      button.dataset.visibilityAttribute = "visible";
      button.setAttribute("aria-label", spot.title);
      button.innerHTML = `
        <span class="echo-hotspot-dot" aria-hidden="true"></span>
        <span class="echo-hotspot-title">${spot.title}</span>
      `;
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        if (selectedId === spot.id) clearSelection();
        else selectHotspot(spot.id);
      });
      viewer.append(button);
    });
  };

  const buildToolbar = () => {
    if (!toolbar) return;
    const filters = ["all", ...filterNames]
      .map((name) => {
        const label = name === "all" ? "All" : name;
        const pressed = activeFilter === name ? "true" : "false";
        return `<button type="button" class="echo-chip" data-echo-filter="${name}" aria-pressed="${pressed}">${label}</button>`;
      })
      .join("");

    toolbar.innerHTML = `
      <div class="echo-chip-row" role="toolbar" aria-label="Subsystem filters">
        ${filters}
      </div>
      <div class="echo-chip-row">
        <button type="button" class="echo-chip" data-echo-toggle-pins aria-pressed="true">Hide pins</button>
        <button type="button" class="echo-chip" data-echo-toggle-more aria-pressed="false">Explore more components</button>
      </div>
    `;
  };

  const buildDrawerList = () => {
    if (!drawerList) return;
    drawerList.innerHTML = hotspots
      .filter((spot) => spot.priority === "primary" || spot.priority === "secondary")
      .map(
        (spot) => `
        <button type="button" class="echo-drawer-item accent-${spot.accent || "blue"}" data-drawer-id="${spot.id}">
          <span class="echo-drawer-dot" aria-hidden="true"></span>
          <span>
            <strong>${spot.title}</strong>
            <small>${spot.category}${spot.component ? ` · ${spot.component}` : ""}</small>
          </span>
        </button>`
      )
      .join("");
  };

  toolbar?.addEventListener("click", (event) => {
    const target = event.target.closest("button");
    if (!target) return;

    if (target.matches("[data-echo-filter]")) {
      activeFilter = target.dataset.echoFilter;
      toolbar.querySelectorAll("[data-echo-filter]").forEach((btn) => {
        btn.setAttribute("aria-pressed", btn === target ? "true" : "false");
      });
      clearSelection();
      syncPins();
      return;
    }

    if (target.matches("[data-echo-toggle-pins]")) {
      pinsVisible = !pinsVisible;
      target.setAttribute("aria-pressed", pinsVisible ? "true" : "false");
      target.textContent = pinsVisible ? "Hide pins" : "Show pins";
      if (!pinsVisible) clearSelection();
      syncPins();
      return;
    }

    if (target.matches("[data-echo-toggle-more]")) {
      showSecondary = !showSecondary;
      target.setAttribute("aria-pressed", showSecondary ? "true" : "false");
      target.textContent = showSecondary ? "Show fewer components" : "Explore more components";
      syncPins();
    }
  });

  infoCard?.addEventListener("click", (event) => {
    if (event.target.closest("[data-echo-close]")) clearSelection();
  });

  drawer?.addEventListener("click", (event) => {
    const item = event.target.closest("[data-drawer-id]");
    if (item) {
      selectHotspot(item.dataset.drawerId);
      return;
    }
    if (event.target.closest("[data-echo-drawer-close]")) {
      drawer.dataset.open = "false";
      clearSelection();
    }
  });

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
      status.textContent =
        "Drag to orbit · scroll or pinch to zoom · tap a pin for component details. Pin positions are editable in js/echo-hotspots.js.";
    }
  });

  fetch(viewer.getAttribute("src") || "", { method: "HEAD", cache: "no-store" })
    .then((response) => {
      if (!response.ok) markMissing();
    })
    .catch(markMissing);

  setAutoRotate();
  reducedMotion.addEventListener("change", setAutoRotate);
  buildPins();
  buildToolbar();
  buildDrawerList();
  syncPins();
  renderInfo(null);
})();
