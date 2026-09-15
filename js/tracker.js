(() => {
  const ENDPOINT = "/api/traffic";
  const VID_KEY = "cd_vid";
  const HIT_KEY = "cd_hit";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (navigator.doNotTrack === "1" || window.doNotTrack === "1") return;

  const visitorId = () => {
    try {
      let id = localStorage.getItem(VID_KEY);
      if (!id) {
        id = crypto.randomUUID ? crypto.randomUUID() : `v-${Date.now()}-${Math.random().toString(16).slice(2)}`;
        localStorage.setItem(VID_KEY, id);
      }
      return id;
    } catch {
      return undefined;
    }
  };

  const path = () => {
    const raw = `${location.pathname}${location.search || ""}`;
    return raw || "/";
  };

  const send = (payload) => {
    const body = JSON.stringify({ ...payload, vid: visitorId(), path: path() });
    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: "application/json" });
        if (navigator.sendBeacon(ENDPOINT, blob)) return;
      }
    } catch {
      /* fall through */
    }
    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
      cache: "no-store",
    }).catch(() => {});
  };

  const alreadyHit = () => {
    try {
      const key = `${HIT_KEY}:${path()}:${new Date().toISOString().slice(0, 10)}`;
      if (sessionStorage.getItem(key)) return true;
      sessionStorage.setItem(key, "1");
      return false;
    } catch {
      return false;
    }
  };

  if (!alreadyHit()) {
    send({ type: "pageview" });
  }

  const track = (name, meta) => {
    if (!name) return;
    send({ type: "action", name: String(name).slice(0, 80), meta });
  };

  window.cdTrack = track;

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target.closest("[data-track], a, button");
      if (!target) return;

      const explicit = target.getAttribute("data-track");
      if (explicit) {
        track(explicit);
        return;
      }

      if (target.matches("a[href]")) {
        const href = target.getAttribute("href") || "";
        if (href.startsWith("mailto:")) {
          track("email_click");
          return;
        }
        if (href.includes("linkedin.com")) {
          track("linkedin_click");
          return;
        }
        if (href.includes("resume")) {
          track("resume_click");
          return;
        }
        if (href.includes("project-echo")) {
          track("open_project_echo");
          return;
        }
        if (href.includes("fitness-rack")) {
          track("open_fitness_rack");
          return;
        }
        if (href.includes("bike-horn")) {
          track("open_bike_horn");
          return;
        }
        if (href.includes("pull-up")) {
          track("open_pull_up_bar");
          return;
        }
        if (href.includes("double-wall-mug")) {
          track("open_mug");
          return;
        }
        if (/^https?:/i.test(href) && !href.includes(location.hostname)) {
          track("outbound_click");
        }
      }
    },
    { capture: true }
  );

  // Light engagement signal: scrolled past ~50% once per page.
  let depthSent = false;
  const onScroll = () => {
    if (depthSent) return;
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    if (max <= 0) return;
    if (window.scrollY / max >= 0.5) {
      depthSent = true;
      track("scroll_50");
      window.removeEventListener("scroll", onScroll);
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  if (reduced.matches) {
    /* still track clicks/views; no extra motion hooks */
  }
})();
