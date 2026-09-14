(() => {
  const viewer = document.querySelector("#echo-model");
  const shell = document.querySelector("[data-echo-viewer]");
  if (!viewer || !shell) return;

  const hotspots = window.ECHO_HOTSPOTS || [];
  const status = shell.querySelector("[data-echo-model-status]");
  const toolbar = shell.querySelector("[data-echo-toolbar]");
  const infoCard = shell.querySelector("[data-echo-info]");
  const drawer = shell.querySelector("[data-echo-drawer]");
  const drawerList = shell.querySelector("[data-echo-drawer-list]");
  const morePanel = shell.querySelector("[data-echo-more]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobileQuery = window.matchMedia("(max-width: 720px)");

  const AUTO_ROTATE_DELAY_MS = 28000;

  let pinsVisible = true;
  let selectedId = null;

  const parsePosition = (value) =>
    String(value || "0 0 0")
      .trim()
      .split(/\s+/)
      .map(Number);

  const escapeHtml = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  const setAutoRotate = () => {
    if (reducedMotion.matches) {
      viewer.removeAttribute("auto-rotate");
      return;
    }
    viewer.setAttribute("auto-rotate", "");
    viewer.setAttribute("auto-rotate-delay", String(AUTO_ROTATE_DELAY_MS));
    viewer.setAttribute("rotation-per-second", "10deg");
  };

  const focusHotspot = (spot) => {
    const [x, y, z] = parsePosition(spot.position);
    if ([x, y, z].some((n) => Number.isNaN(n))) return;
    try {
      viewer.cameraTarget = `${x}m ${y}m ${z}m`;
      if (!reducedMotion.matches) viewer.cameraOrbit = "auto auto 65%";
    } catch {
      /* ignore */
    }
  };

  const componentMeta = (item) => {
    const bits = [];
    if (item.quantity != null) bits.push(`Qty ${item.quantity}`);
    if (item.purchaseQuantity) bits.push(item.purchaseQuantity);
    if (item.aircraftQuantity != null && item.totalSystemQuantity != null) {
      bits.push(`Aircraft ${item.aircraftQuantity} · System ${item.totalSystemQuantity}`);
    }
    if (item.integration) bits.push(item.integration);
    return bits.join(" · ");
  };

  const componentDetails = (item) => {
    const specs = (item.specifications || [])
      .map((spec) => `<li>${escapeHtml(spec)}</li>`)
      .join("");
    const extras = [
      item.integration ? `<p><strong>Integration:</strong> ${escapeHtml(item.integration)}</p>` : "",
      specs ? `<ul class="echo-spec-list">${specs}</ul>` : "",
    ].join("");
    return extras;
  };

  const renderCardBody = (spot) => {
    const components = (spot.components || [])
      .map((item, index) => {
        const meta = componentMeta(item);
        const details = componentDetails(item);
        return `
          <details class="echo-component" ${index === 0 ? "" : ""}>
            <summary>
              <span class="echo-component-type">${escapeHtml(item.type)}</span>
              <span class="echo-component-product">${escapeHtml(item.product)}</span>
              ${meta ? `<span class="echo-component-meta">${escapeHtml(meta)}</span>` : ""}
            </summary>
            <p>${escapeHtml(item.purpose || "")}</p>
            ${details}
          </details>`;
      })
      .join("");

    return `
      <p class="echo-info-kicker">${escapeHtml(spot.category)}</p>
      <h3>${escapeHtml(spot.title)}</h3>
      <p class="echo-info-summary">${escapeHtml(spot.summary || "")}</p>
      <div class="echo-component-list">
        <p class="echo-info-kicker">Components</p>
        ${components}
      </div>
      <p class="echo-info-description">${escapeHtml(spot.description || "")}</p>
      <p class="echo-info-status"><span>Status</span> ${escapeHtml(spot.status)}</p>
    `;
  };

  const renderInfo = (spot) => {
    if (!infoCard) return;
    if (!spot || mobileQuery.matches) {
      infoCard.hidden = true;
      infoCard.innerHTML = "";
      return;
    }
    infoCard.hidden = false;
    infoCard.dataset.accent = spot.accent || "blue";
    infoCard.innerHTML = `
      <button type="button" class="echo-info-close" data-echo-close aria-label="Close subsystem details">×</button>
      ${renderCardBody(spot)}
    `;
  };

  const clearHighlights = () => {
    viewer.querySelectorAll("[data-echo-highlight]").forEach((node) => node.remove());
  };

  const showHighlights = (spot) => {
    clearHighlights();
    (spot.highlights || []).forEach((mark) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className = `echo-highlight accent-${spot.accent || "blue"}`;
      el.slot = `hotspot-hl-${spot.id}-${mark.id}`;
      el.dataset.echoHighlight = mark.id;
      el.dataset.position = mark.position;
      el.dataset.normal = mark.normal || "0 1 0";
      el.dataset.visibilityAttribute = "visible";
      el.setAttribute("tabindex", "-1");
      el.setAttribute("aria-hidden", "true");
      el.innerHTML = `<span class="echo-highlight-dot"></span><span class="echo-highlight-label">${escapeHtml(
        mark.label || ""
      )}</span>`;
      viewer.append(el);
    });
  };

  const syncPins = () => {
    hotspots.forEach((spot) => {
      const pin = viewer.querySelector(`[data-hotspot-id="${spot.id}"]`);
      if (!pin) return;
      pin.hidden = !pinsVisible;
      pin.classList.toggle("is-selected", spot.id === selectedId);
      pin.setAttribute("aria-pressed", spot.id === selectedId ? "true" : "false");
    });
    if (drawer) {
      drawer.querySelectorAll("[data-drawer-id]").forEach((btn) => {
        btn.hidden = !pinsVisible;
        btn.classList.toggle("is-selected", btn.dataset.drawerId === selectedId);
      });
    }
  };

  const selectHotspot = (id) => {
    const spot = hotspots.find((item) => item.id === id);
    if (!spot) return;
    selectedId = id;
    renderInfo(spot);
    showHighlights(spot);
    if (mobileQuery.matches && drawer) {
      drawer.dataset.open = "true";
      const detail = drawer.querySelector("[data-echo-drawer-detail]");
      if (detail) {
        detail.hidden = false;
        detail.innerHTML = renderCardBody(spot);
      }
    }
    focusHotspot(spot);
    syncPins();
  };

  const clearSelection = () => {
    selectedId = null;
    renderInfo(null);
    clearHighlights();
    const detail = drawer?.querySelector("[data-echo-drawer-detail]");
    if (detail) {
      detail.hidden = true;
      detail.innerHTML = "";
    }
    if (drawer) drawer.dataset.open = "false";
    syncPins();
  };

  const buildPins = () => {
    hotspots.forEach((spot) => {
      viewer.querySelector(`[data-hotspot-id="${spot.id}"]`)?.remove();
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
        <span class="echo-hotspot-title">${escapeHtml(spot.title)}</span>
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
    toolbar.innerHTML = `
      <div class="echo-chip-row">
        <button type="button" class="echo-chip" data-echo-toggle-pins aria-pressed="true">Hide pins</button>
      </div>
    `;
  };

  const buildDrawerList = () => {
    if (!drawerList) return;
    drawerList.innerHTML = hotspots
      .map(
        (spot) => `
        <button type="button" class="echo-drawer-item accent-${spot.accent || "blue"}" data-drawer-id="${spot.id}">
          <span class="echo-drawer-dot" aria-hidden="true"></span>
          <span>
            <strong>${escapeHtml(spot.title)}</strong>
            <small>${escapeHtml(spot.category)}</small>
          </span>
        </button>`
      )
      .join("");
  };

  toolbar?.addEventListener("click", (event) => {
    const target = event.target.closest("[data-echo-toggle-pins]");
    if (!target) return;
    pinsVisible = !pinsVisible;
    target.setAttribute("aria-pressed", pinsVisible ? "true" : "false");
    target.textContent = pinsVisible ? "Hide pins" : "Show pins";
    if (!pinsVisible) clearSelection();
    syncPins();
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
    if (event.target.closest("[data-echo-drawer-close]")) clearSelection();
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
        "Four subsystem pins · tap to inspect components · edit positions in js/echo-hotspots.js.";
    }
  });

  fetch(viewer.getAttribute("src") || "", { method: "HEAD", cache: "no-store" })
    .then((response) => {
      if (!response.ok) markMissing();
    })
    .catch(markMissing);

  if (morePanel) morePanel.hidden = true;

  setAutoRotate();
  reducedMotion.addEventListener("change", setAutoRotate);
  buildPins();
  buildToolbar();
  buildDrawerList();
  syncPins();
  renderInfo(null);
})();
