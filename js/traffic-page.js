(() => {
  const root = document.querySelector("[data-traffic]");
  if (!root) return;

  const statusEl = root.querySelector("[data-traffic-status]");
  const totalsEl = root.querySelector("[data-traffic-totals]");
  const chartEl = root.querySelector("[data-traffic-chart]");
  const pagesEl = root.querySelector("[data-traffic-pages]");
  const actionsEl = root.querySelector("[data-traffic-actions]");
  const rangeButtons = [...root.querySelectorAll("[data-traffic-range]")];

  let days = 30;

  const escapeHtml = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  const formatLabel = (name) =>
    String(name || "")
      .replaceAll("_", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const renderTotals = (totals) => {
    totalsEl.innerHTML = [
      ["Pageviews", totals.views],
      ["Visitors", totals.visitors],
      ["Interactions", totals.actions],
      ["Events", totals.events],
    ]
      .map(
        ([label, value]) => `
        <article class="card traffic-stat">
          <span class="num">${escapeHtml(label)}</span>
          <strong>${Number(value || 0).toLocaleString()}</strong>
        </article>`
      )
      .join("");
  };

  const renderChart = (series) => {
    const max = Math.max(1, ...series.map((row) => row.views + row.actions));
    chartEl.innerHTML = series
      .map((row) => {
        const viewsH = Math.round((row.views / max) * 100);
        const actionsH = Math.round((row.actions / max) * 100);
        const label = row.day.slice(5);
        return `
          <div class="traffic-bar" title="${escapeHtml(row.day)} · ${row.views} views · ${row.actions} interactions">
            <div class="traffic-bar-stack">
              <span class="traffic-bar-actions" style="height:${actionsH}%"></span>
              <span class="traffic-bar-views" style="height:${viewsH}%"></span>
            </div>
            <small>${escapeHtml(label)}</small>
          </div>`;
      })
      .join("");
  };

  const renderList = (el, rows, empty) => {
    if (!rows.length) {
      el.innerHTML = `<p class="traffic-empty">${escapeHtml(empty)}</p>`;
      return;
    }
    const max = Math.max(1, ...rows.map((row) => row.count));
    el.innerHTML = rows
      .map((row) => {
        const label = row.path || formatLabel(row.name);
        const width = Math.round((row.count / max) * 100);
        return `
          <div class="traffic-row">
            <div class="traffic-row-label">
              <span>${escapeHtml(label)}</span>
              <strong>${row.count}</strong>
            </div>
            <div class="traffic-row-track" aria-hidden="true">
              <span style="width:${width}%"></span>
            </div>
          </div>`;
      })
      .join("");
  };

  const setStatus = (data) => {
    if (!data.configured) {
      statusEl.innerHTML = `
        <strong>Storage not connected yet.</strong>
        Events are accepted in-memory on warm serverless instances only.
        To keep durable stats: Vercel project → Storage → create a KV database
        (Upstash). It sets <code>KV_REST_API_URL</code> and
        <code>KV_REST_API_TOKEN</code> automatically.
      `;
      statusEl.dataset.state = "warn";
      return;
    }
    statusEl.innerHTML = `
      Durable KV storage connected · last ${data.days} days ·
      updated ${escapeHtml(new Date(data.updatedAt).toLocaleString())}
    `;
    statusEl.dataset.state = "ok";
  };

  const load = async () => {
    statusEl.textContent = "Loading…";
    statusEl.dataset.state = "loading";
    try {
      const response = await fetch(`/api/traffic?days=${days}`, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setStatus(data);
      renderTotals(data.totals || {});
      renderChart(data.series || []);
      renderList(pagesEl, data.topPages || [], "No pageviews in this range yet.");
      renderList(actionsEl, data.topActions || [], "No interactions in this range yet.");
    } catch (error) {
      statusEl.dataset.state = "error";
      statusEl.innerHTML = `
        Could not load traffic data (${escapeHtml(error.message)}).
        The tracker still works once <code>/api/traffic</code> is deployed on Vercel.
      `;
      totalsEl.innerHTML = "";
      chartEl.innerHTML = "";
      pagesEl.innerHTML = "";
      actionsEl.innerHTML = "";
    }
  };

  rangeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      days = Number(button.dataset.trafficRange) || 30;
      rangeButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      void load();
    });
  });

  void load();
})();
