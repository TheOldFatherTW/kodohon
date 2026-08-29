(function () {
  const hall = document.getElementById("hall");
  const statusEl = document.getElementById("status");
  const invitePanel = document.getElementById("invite-panel");
  const goBtn = document.getElementById("invite-go");
  const nameForm = document.getElementById("invite-name-form");
  const nameInput = document.getElementById("invite-name");
  const nameErr = document.getElementById("invite-name-err");
  const waitEl = document.getElementById("invite-wait");
  const waitBar = document.getElementById("invite-wait-bar");
  const safariNote = document.getElementById("invite-safari");
  const homeInstall = document.getElementById("home-install");
  const feed = document.getElementById("feed");
  const tagBoard = document.getElementById("tag-board");
  const cabHud = document.getElementById("cab-hud");
  const faceImg = document.getElementById("face-img");
  const readerName = document.getElementById("reader-name");
  const coverInput = document.getElementById("cover-input");
  const backdropInput = document.getElementById("backdrop-input");
  const stageBg = document.getElementById("stage-bg");
  const homeHead = document.getElementById("home-head");
  const micBtn = document.getElementById("mic-btn");
  const rail = document.getElementById("photo-rail");
  const GEAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.6 3.8l.6-1.3h3.6l.6 1.3 1.6.7 1.4-.5 2.5 2.5-.5 1.4.7 1.6 1.3.6v3.6l-1.3.6-.7 1.6.5 1.4-2.5 2.5-1.4-.5-1.6.7-.6 1.3h-3.6l-.6-1.3-1.6-.7-1.4.5-2.5-2.5.5-1.4-.7-1.6-1.3-.6v-3.6l1.3-.6.7-1.6-.5-1.4L6.6 4l1.4.5 1.6-.7z" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linejoin="round"/><circle cx="12" cy="11.9" r="3.2" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
  const CAMERA = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="8" width="17" height="11.5" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M8 8l1.4-2.4h5.2L16 8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="13.6" r="3" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>';
  const SCENE = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M5.5 16.2l4.2-4.6 3 3.2 2.2-2.4 3.6 3.8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="9" cy="9.2" r="1.3" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
  const HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20C10.5 18.4 7.3 15.8 5.4 11.9C4 9.1 5.2 6 8.4 6c1.8 0 3 1.1 3.6 2.2C12.6 7.1 13.8 6 15.6 6c3.2 0 4.4 3.1 3 5.9C16.7 15.8 13.5 18.4 12 20Z"/></svg>';
  let key = "";
  let busy = false;
  let settingsWrap = null;
  let settingsCatch = null;
  let backdropUrl = "";
  let catalog = {};
  let hostTab = "all";
  let waitBusy = false;
  let waitTimer = 0;
  let ready = false;
  let booting = false;
  let bootTimer = 0;
  let selecting = false;
  let selected = {};
  let nightPicks = {};
  let shuffleOn = true;
  let loopOn = false;
  let lastSearchQ = "";
  let readerOpen = false;
  let readerStaySeq = 0;
  let holdTimer = 0;
  let holdId = "";

  function setBoot(on, text) {
    if (!hall) return;
    hall.classList.toggle("is-booting", !!on);
    hall.classList.toggle("with-feed", true);
    if (statusEl && text != null) statusEl.textContent = text;
  }

  function setCabRun(on) {
    const cover = document.querySelector("#cab-hud .cab-cover");
    if (cover) cover.classList.toggle("is-run", !!on);
  }

  function layoutStage() {
    if (!stageBg || !hall || stageBg.hidden) return;
    const hallBox = hall.getBoundingClientRect();
    const tags = document.getElementById("tag-board");
    const startBox = tags && !tags.hidden ? tags.getBoundingClientRect() : (feed ? feed.getBoundingClientRect() : null);
    const endBox = feed ? feed.getBoundingClientRect() : startBox;
    const start = startBox ? Math.max(0, startBox.top - hallBox.top) : 180;
    const end = endBox ? Math.max(start + 24, endBox.top - hallBox.top) : start + 80;
    const fade = "linear-gradient(to bottom, #000 0, #000 " + Math.round(start) + "px, transparent " + Math.round(end) + "px)";
    stageBg.style.height = Math.round(end) + "px";
    stageBg.style.webkitMaskImage = fade;
    stageBg.style.maskImage = fade;
  }

  function paintStage(reader) {
    if (!stageBg || !hall) return;
    if (reader && reader.has_backdrop && reader.id) {
      backdropUrl = window.FamiGate.origin() + "/backdrop?person=" + encodeURIComponent(reader.id) + "&k=" + encodeURIComponent(key) + "&r=" + (reader.backdrop_rev || 0);
      hall.classList.add("has-backdrop");
      stageBg.style.backgroundImage = "url(" + backdropUrl + ")";
      stageBg.hidden = false;
      if (readerName) readerName.classList.add("is-on-dark");
      requestAnimationFrame(layoutStage);
    } else {
      backdropUrl = "";
      hall.classList.remove("has-backdrop");
      if (readerName) readerName.classList.remove("is-on-light", "is-on-dark");
      stageBg.hidden = true;
      stageBg.style.backgroundImage = "";
    }
  }

  function insButton(className, svg, label) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ins-icon " + className;
    btn.setAttribute("aria-label", label);
    btn.title = label;
    const ring = document.createElement("span");
    ring.className = "ins-ring";
    const face = document.createElement("span");
    face.className = "ins-face";
    face.innerHTML = svg;
    btn.appendChild(ring);
    btn.appendChild(face);
    return btn;
  }

  function jobBadge(svg) {
    const badge = document.createElement("span");
    badge.className = "ins-icon job-icon";
    badge.setAttribute("aria-hidden", "true");
    const ring = document.createElement("span");
    ring.className = "ins-ring";
    const face = document.createElement("span");
    face.className = "ins-face";
    face.innerHTML = svg;
    badge.appendChild(ring);
    badge.appendChild(face);
    return badge;
  }

  function setJobRun(entry, on) {
    if (!entry) return;
    entry.classList.toggle("is-run", !!on);
    entry.disabled = !!on;
  }

  function showWaitCard(title) {
    const mask = document.getElementById("waitMask");
    const head = document.getElementById("waitTitle");
    const pct = document.getElementById("waitPct");
    if (head) head.textContent = title || "更換背景中";
    if (pct) pct.textContent = "0%";
    if (mask) mask.hidden = false;
  }

  function setWaitPct(n) {
    const pct = document.getElementById("waitPct");
    if (pct) pct.textContent = Math.max(0, Math.min(100, Math.round(n))) + "%";
  }

  function hideWaitCard() {
    const mask = document.getElementById("waitMask");
    if (mask) mask.hidden = true;
    if (waitTimer) {
      window.clearInterval(waitTimer);
      waitTimer = 0;
    }
  }

  function closeSettings() {
    const wrap = settingsWrap || document.getElementById("album-settings");
    if (!wrap) return;
    const menu = wrap.querySelector(".settings-menu") || document.querySelector(".settings-menu");
    const toggle = wrap.querySelector(".settings-toggle");
    if (menu) {
      menu.hidden = true;
      if (menu.parentNode !== wrap) wrap.appendChild(menu);
    }
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.classList.remove("is-live");
    }
    if (settingsCatch) settingsCatch.hidden = true;
    document.documentElement.classList.remove("settings-open");
  }

  function ensureSettingsCatch() {
    if (settingsCatch && settingsCatch.isConnected) return settingsCatch;
    const catcher = document.createElement("div");
    catcher.className = "settings-catch";
    catcher.hidden = true;
    catcher.addEventListener("click", function (ev) {
      ev.preventDefault();
      closeSettings();
    });
    document.body.appendChild(catcher);
    settingsCatch = catcher;
    return catcher;
  }

  function placeSettingsMenu(toggle, menu) {
    if (!toggle || !menu || menu.hidden) return;
    const box = toggle.getBoundingClientRect();
    const pad = 10;
    const vv = window.visualViewport;
    const vw = vv ? vv.width : window.innerWidth;
    const vh = vv ? vv.height : window.innerHeight;
    const vo = vv ? vv.offsetTop : 0;
    const vl = vv ? vv.offsetLeft : 0;
    const mw = menu.offsetWidth || 220;
    const mh = menu.offsetHeight || 200;
    let left = box.right - mw;
    if (left < vl + pad) left = vl + pad;
    if (left + mw > vl + vw - pad) left = Math.max(vl + pad, vl + vw - mw - pad);
    let top = box.bottom + 8;
    if (top + mh > vo + vh - pad) top = box.top - mh - 8;
    if (top < vo + pad) top = vo + pad;
    menu.style.position = "fixed";
    menu.style.left = Math.round(left) + "px";
    menu.style.top = Math.round(top) + "px";
  }

  function ensureSettings() {
    const host = document.querySelector("#cab-hud .cab-wrap");
    const existing = document.getElementById("album-settings");
    if (settingsWrap && settingsWrap.isConnected) {
      if (host && settingsWrap.parentNode !== host) host.appendChild(settingsWrap);
      return settingsWrap;
    }
    settingsWrap = existing && existing.isConnected ? existing : document.createElement("div");
    const wrap = settingsWrap;
    wrap.id = "album-settings";
    wrap.className = "album-settings";
    wrap.hidden = true;
    wrap.innerHTML = "";
    const toggle = insButton("settings-toggle", GEAR, "設定");
    toggle.setAttribute("aria-expanded", "false");
    const menu = document.createElement("div");
    menu.className = "settings-menu";
    menu.setAttribute("role", "menu");
    menu.hidden = true;
    function gearRow(svg, label, job, onClick) {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "settings-entry";
      row.dataset.job = job;
      row.appendChild(jobBadge(svg));
      const text = document.createElement("span");
      text.textContent = label;
      row.appendChild(text);
      row.addEventListener("click", function () {
        closeSettings();
        onClick();
      });
      return row;
    }
    menu.appendChild(gearRow(CAMERA, "更換頭像", "cover", function () { if (coverInput) coverInput.click(); }));
    menu.appendChild(gearRow(SCENE, "更換背景", "backdrop", function () { if (backdropInput) backdropInput.click(); }));
    toggle.addEventListener("click", function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      const open = menu.hidden;
      if (open) {
        const catcher = ensureSettingsCatch();
        catcher.hidden = false;
        document.body.appendChild(menu);
        menu.hidden = false;
        document.documentElement.classList.add("settings-open");
        requestAnimationFrame(function () { placeSettingsMenu(toggle, menu); });
      } else closeSettings();
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.classList.toggle("is-live", open);
    });
    wrap.appendChild(toggle);
    wrap.appendChild(menu);
    if (host) host.appendChild(wrap);
    return wrap;
  }

  function showInvite() {
    if (!hall) return;
    hall.classList.add("is-invite");
    hall.classList.remove("is-booting");
    if (invitePanel) invitePanel.hidden = false;
    if (window.FamiGate.needsSafari()) {
      if (safariNote) safariNote.hidden = false;
      if (goBtn) goBtn.hidden = true;
    }
  }

  function hideInvite() {
    if (hall) hall.classList.remove("is-invite");
    if (invitePanel) invitePanel.hidden = true;
  }

  function startWait() {
    goBtn.hidden = true;
    nameForm.hidden = true;
    waitEl.hidden = false;
    if (window.StoryMark) window.StoryMark.mountBar(waitBar);
  }

  function renderMe(reader) {
    if (!reader || !cabHud) return;
    if (readerName) readerName.textContent = reader.display_name || "";
    if (faceImg) {
      faceImg.src = reader.has_cover
        ? window.FamiGate.origin() + "/cover?person=" + encodeURIComponent(reader.id) + "&k=" + encodeURIComponent(key) + "&r=" + (reader.cover_rev || 0)
        : "./face-default.jpg?v=2";
      faceImg.hidden = false;
    }
    cabHud.hidden = false;
    if (homeHead) homeHead.hidden = false;
    const settings = ensureSettings();
    settings.hidden = false;
    if (micBtn) micBtn.hidden = false;
    paintStage(reader);
  }

  function thumbUrl(item) {
    return window.FamiGate.origin() + "/thumb?id=" + encodeURIComponent(item.id) + "&k=" + encodeURIComponent(key);
  }

  function clearSelect() {
    selecting = false;
    selected = {};
    if (feed) feed.querySelectorAll(".tile.is-on").forEach(function (el) { el.classList.remove("is-on"); });
    paintRail();
  }

  function selectedIds() {
    return Object.keys(selected);
  }

  function paintRail() {
    if (!rail) return;
    const ids = selectedIds();
    if (!ids.length) {
      rail.hidden = true;
      rail.innerHTML = "";
      return;
    }
    rail.hidden = false;
    rail.innerHTML = "";
    const heart = insButton("rail-heart", HEART, "愛心");
    heart.addEventListener("click", async function () {
      for (const id of ids) {
        await window.FamiGate.api("/api/fav", key, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: id, on: true }),
        });
      }
      clearSelect();
      loadShelf();
    });
    rail.appendChild(heart);
    const go = document.createElement("button");
    go.type = "button";
    go.className = "tag-apply";
    go.innerHTML = '<span class="tag-apply-face">加入今晚</span>';
    go.addEventListener("click", function () {
      ids.forEach(function (id) {
        nightPicks[id] = nightPicks[id] || { id: id, loops: 1 };
      });
      clearSelect();
      openNightCard();
    });
    rail.appendChild(go);
  }

  function tileEl(item) {
    catalog[item.id] = item;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tile";
    btn.dataset.id = item.id;
    if (item.has_cover) {
      const img = document.createElement("img");
      img.alt = item.title || "";
      img.decoding = "async";
      img.src = thumbUrl(item);
      img.addEventListener("load", function () { img.classList.add("is-on"); });
      img.addEventListener("error", function () { img.hidden = true; });
      if (img.complete && img.naturalWidth) img.classList.add("is-on");
      btn.appendChild(img);
    }
    const shield = document.createElement("span");
    shield.className = "tile-shield";
    btn.appendChild(shield);
    if (item.favorite) {
      const heart = document.createElement("span");
      heart.className = "tile-heart";
      heart.innerHTML = HEART;
      btn.appendChild(heart);
    }
    if (item.ep) {
      const ep = document.createElement("span");
      ep.className = "tile-ep";
      ep.textContent = item.ep;
      btn.appendChild(ep);
    }
    const name = document.createElement("span");
    name.className = "tile-pct";
    name.textContent = item.title || "";
    btn.appendChild(name);
    btn.addEventListener("pointerdown", function (ev) {
      if (ev.button && ev.button !== 0) return;
      holdId = item.id;
      holdTimer = window.setTimeout(function () {
        selecting = true;
        selected[item.id] = true;
        btn.classList.add("is-on");
        paintRail();
      }, 480);
    });
    function cancelHold() {
      window.clearTimeout(holdTimer);
      holdTimer = 0;
    }
    btn.addEventListener("pointerup", cancelHold);
    btn.addEventListener("pointercancel", cancelHold);
    btn.addEventListener("click", function (ev) {
      ev.preventDefault();
      if (selecting) {
        if (selected[item.id]) {
          delete selected[item.id];
          btn.classList.remove("is-on");
        } else {
          selected[item.id] = true;
          btn.classList.add("is-on");
        }
        if (!selectedIds().length) selecting = false;
        paintRail();
        return;
      }
      if (!item.ready) return;
      openListen(item.id);
    });
    return btn;
  }

  function pickTab(tab) {
    hostTab = tab || "all";
    const bar = document.getElementById("mode-bar");
    if (bar) {
      bar.querySelectorAll(".mode-btn").forEach(function (el) {
        el.classList.toggle("is-on", el.dataset.mode === hostTab);
      });
    }
    clearSelect();
    loadShelf();
    if (tab === "night") openNightCard();
  }

  function ensureModes() {
    const bar = document.getElementById("mode-bar");
    if (!bar || bar.dataset.ready) return;
    bar.dataset.ready = "1";
    bar.hidden = false;
    if (tagBoard) tagBoard.hidden = false;
    [["fav", "最愛"], ["all", "全部"], ["night", "今晚"]].forEach(function (pair) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "mode-btn" + (hostTab === pair[0] ? " is-on" : "");
      btn.dataset.mode = pair[0];
      btn.textContent = pair[1];
      btn.addEventListener("click", function () { pickTab(pair[0]); });
      bar.appendChild(btn);
    });
  }

  function closeFind() {
    const mask = document.getElementById("findMask");
    if (mask) mask.hidden = true;
  }

  function closeAct() {
    const mask = document.getElementById("actMask");
    if (mask) mask.hidden = true;
  }

  function bindMaskClose(maskId, closeFn) {
    const mask = document.getElementById(maskId);
    if (!mask) return;
    let down = false;
    mask.addEventListener("pointerdown", function (ev) {
      down = ev.target === mask;
    });
    mask.addEventListener("pointerup", function (ev) {
      if (down && ev.target === mask) closeFn();
      down = false;
    });
  }

  function showHits(result, query) {
    lastSearchQ = query || result.q || "";
    const mask = document.getElementById("findMask");
    const body = document.getElementById("findBody");
    const title = document.getElementById("findTitle");
    if (title) title.textContent = lastSearchQ ? "是這個嗎" : "找故事";
    if (!body || !mask) return;
    body.innerHTML = "";
    const hits = result.hits || [];
    if (!hits.length) {
      const p = document.createElement("p");
      p.textContent = "沒對到，再講一次";
      body.appendChild(p);
    }
    hits.forEach(function (hit) {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "tag-chip";
      row.textContent = hit.title;
      row.addEventListener("click", async function () {
        if (lastSearchQ) {
          await window.FamiGate.api("/api/alias", key, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ q: lastSearchQ, id: hit.id }),
          });
        }
        closeFind();
        openHitChoice(hit);
      });
      body.appendChild(row);
    });
    mask.hidden = false;
  }

  function openHitChoice(hit) {
    const mask = document.getElementById("actMask");
    const body = document.getElementById("actBody");
    const title = document.getElementById("actTitle");
    if (title) title.textContent = hit.title;
    if (!body || !mask) return;
    body.innerHTML = "";
    const now = document.createElement("button");
    now.type = "button";
    now.className = "tag-apply";
    now.innerHTML = '<span class="tag-apply-face">現在聽</span>';
    now.addEventListener("click", async function () {
      await window.FamiGate.api("/api/night/play", key, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: hit.id }),
      });
      closeAct();
      openListen(hit.id);
    });
    const add = document.createElement("button");
    add.type = "button";
    add.className = "tag-apply";
    add.innerHTML = '<span class="tag-apply-face">加入今晚</span>';
    add.addEventListener("click", function () {
      nightPicks[hit.id] = nightPicks[hit.id] || { id: hit.id, loops: 1 };
      openNightCard();
    });
    body.appendChild(now);
    body.appendChild(add);
    mask.hidden = false;
  }

  function switchRow(label, on, onChange) {
    const wrap = document.createElement("label");
    wrap.className = "ask-skip";
    const text = document.createElement("span");
    text.textContent = label;
    const input = document.createElement("input");
    input.type = "checkbox";
    input.role = "switch";
    input.checked = !!on;
    const sw = document.createElement("span");
    sw.className = "ask-sw";
    input.addEventListener("change", function () { onChange(input.checked); });
    wrap.appendChild(text);
    wrap.appendChild(input);
    wrap.appendChild(sw);
    return wrap;
  }

  function openNightCard() {
    const mask = document.getElementById("actMask");
    const body = document.getElementById("actBody");
    const title = document.getElementById("actTitle");
    if (title) title.textContent = "今晚";
    if (!body || !mask) return;
    body.innerHTML = "";
    const ids = Object.keys(nightPicks);
    if (!ids.length) {
      const p = document.createElement("p");
      p.textContent = "還沒選。長押格子，或說話找。沒選就全部隨機。";
      body.appendChild(p);
    }
    ids.forEach(function (id) {
      const item = catalog[id] || { id: id, title: id };
      const pick = nightPicks[id];
      const row = document.createElement("div");
      row.className = "night-row";
      const name = document.createElement("span");
      name.textContent = item.title || id;
      const minus = document.createElement("button");
      minus.type = "button";
      minus.className = "mode-btn";
      minus.textContent = "−";
      const count = document.createElement("span");
      count.textContent = String(pick.loops || 1);
      const plus = document.createElement("button");
      plus.type = "button";
      plus.className = "mode-btn";
      plus.textContent = "+";
      minus.addEventListener("click", function () {
        pick.loops = Math.max(1, (pick.loops || 1) - 1);
        count.textContent = String(pick.loops);
      });
      plus.addEventListener("click", function () {
        pick.loops = Math.min(20, (pick.loops || 1) + 1);
        count.textContent = String(pick.loops);
      });
      row.appendChild(name);
      row.appendChild(minus);
      row.appendChild(count);
      row.appendChild(plus);
      body.appendChild(row);
    });
    body.appendChild(switchRow("隨機", shuffleOn, function (v) { shuffleOn = v; }));
    body.appendChild(switchRow("循環", loopOn, function (v) { loopOn = v; }));
    const go = document.createElement("button");
    go.type = "button";
    go.className = "tag-apply";
    go.innerHTML = '<span class="tag-apply-face">開始聽</span>';
    go.addEventListener("click", async function () {
      const picks = Object.keys(nightPicks).map(function (id) {
        return { id: id, loops: nightPicks[id].loops || 1 };
      });
      const x = await window.FamiGate.api("/api/night", key, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ picks: picks, shuffle: shuffleOn, loop: loopOn }),
        timeout: 15000,
      });
      closeAct();
      const first = x.j && x.j.queue && x.j.queue[0];
      if (first) openListen(first);
    });
    body.appendChild(go);
    mask.hidden = false;
  }

  function stayOverlayUrl(n) {
    const raw = (location.hash || "").replace(/^#/, "").replace(/&?stay=\d+/g, "").replace(/&$/, "");
    return location.pathname + location.search + "#" + (raw ? raw + "&stay=" + n : "stay=" + n);
  }

  function cleanOverlayUrl() {
    const raw = (location.hash || "").replace(/^#/, "").replace(/&?stay=\d+/g, "").replace(/&$/, "");
    return location.pathname + location.search + (raw ? "#" + raw : "");
  }

  function padOverlay() {
    if (!readerOpen) return;
    try {
      readerStaySeq += 1;
      history.pushState({ famiReader: 1, n: readerStaySeq }, "", stayOverlayUrl(readerStaySeq));
      readerStaySeq += 1;
      history.pushState({ famiReader: 1, n: readerStaySeq }, "", stayOverlayUrl(readerStaySeq));
    } catch (e) {}
  }

  function closeReader() {
    const layer = document.getElementById("reader-layer");
    const frame = document.getElementById("reader-frame");
    readerOpen = false;
    document.documentElement.classList.remove("is-reading");
    if (layer) {
      layer.hidden = true;
      layer.classList.remove("is-live");
    }
    if (frame) {
      try { frame.src = "about:blank"; } catch (e) {}
    }
    try { sessionStorage.removeItem("kodohon.listening"); } catch (e) {}
    try { history.replaceState({}, "", cleanOverlayUrl()); } catch (e) {}
  }

  function showReaderLive() {
    const layer = document.getElementById("reader-layer");
    if (layer && readerOpen) layer.classList.add("is-live");
  }

  function openListen(id) {
    const item = catalog[id] || { id: id };
    const layer = document.getElementById("reader-layer");
    const frame = document.getElementById("reader-frame");
    if (!layer || !frame) {
      location.href = "./listen.html?id=" + encodeURIComponent(id) + "&k=" + encodeURIComponent(key) + "#k=" + encodeURIComponent(key);
      return;
    }
    try {
      sessionStorage.setItem("kodohon.listening", JSON.stringify({ id: id, k: key }));
    } catch (e) {}
    document.documentElement.classList.add("is-reading");
    layer.hidden = false;
    layer.classList.remove("is-live");
    const wasOpen = readerOpen;
    readerOpen = true;
    if (!wasOpen) padOverlay();
    const url = "./listen.html?id=" + encodeURIComponent(item.id) + "&k=" + encodeURIComponent(key) + "#k=" + encodeURIComponent(key);
    frame.src = url;
    window.setTimeout(showReaderLive, 400);
  }

  async function loadShelf() {
    if (!feed) return;
    const x = await window.FamiGate.api("/api/shelf?tab=" + encodeURIComponent(hostTab), key, { timeout: 20000 });
    if (!x.j) return;
    const night = x.j.night || {};
    if (night.picks) {
      nightPicks = {};
      night.picks.forEach(function (p) { nightPicks[p.id] = { id: p.id, loops: p.loops || 1 }; });
    }
    if (night.shuffle != null) shuffleOn = !!night.shuffle;
    if (night.loop != null) loopOn = !!night.loop;
    feed.innerHTML = "";
    catalog = {};
    (x.j.items || []).forEach(function (it) { feed.appendChild(tileEl(it)); });
    if (tagBoard) tagBoard.hidden = false;
    layoutStage();
  }

  async function searchText(q) {
    const x = await window.FamiGate.api("/api/search", key, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: q }),
      timeout: 20000,
    });
    if (!x.j) return;
    if (x.j.auto && x.j.hits && x.j.hits[0]) {
      openListen(x.j.hits[0].id);
      return;
    }
    showHits(x.j, q);
  }

  async function searchBlob(blob, name) {
    const fd = new FormData();
    fd.append("file", blob, name || "speech.webm");
    const x = await window.FamiGate.api("/api/search", key, { method: "POST", body: fd, timeout: 45000 });
    if (!x.j) return;
    if (x.j.auto && x.j.hits && x.j.hits[0]) {
      openListen(x.j.hits[0].id);
      return;
    }
    showHits(x.j, x.j.q || "");
  }

  function listenVoice() {
    if (busy) return;
    busy = true;
    if (micBtn) micBtn.classList.add("is-run");
    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
        const rec = new MediaRecorder(stream);
        const chunks = [];
        rec.ondataavailable = function (ev) { if (ev.data && ev.data.size) chunks.push(ev.data); };
        rec.onstop = function () {
          stream.getTracks().forEach(function (t) { t.stop(); });
          const blob = new Blob(chunks, { type: rec.mimeType || "audio/webm" });
          searchBlob(blob, "speech.webm").finally(function () {
            busy = false;
            if (micBtn) micBtn.classList.remove("is-run");
          });
        };
        rec.start();
        window.setTimeout(function () { if (rec.state === "recording") rec.stop(); }, 3200);
      }).catch(function () {
        if (Speech) webSpeech(Speech);
        else {
          busy = false;
          if (micBtn) micBtn.classList.remove("is-run");
        }
      });
      return;
    }
    if (Speech) webSpeech(Speech);
    else {
      busy = false;
      if (micBtn) micBtn.classList.remove("is-run");
    }
  }

  function webSpeech(Speech) {
    const rec = new Speech();
    rec.lang = "zh-TW";
    rec.interimResults = false;
    rec.onresult = function (ev) {
      const q = ev.results && ev.results[0] && ev.results[0][0] ? ev.results[0][0].transcript : "";
      searchText(q).finally(function () {
        busy = false;
        if (micBtn) micBtn.classList.remove("is-run");
      });
    };
    rec.onerror = function () {
      busy = false;
      if (micBtn) micBtn.classList.remove("is-run");
    };
    rec.start();
  }

  function refreshOrigin() {
    return fetch("./config.js?t=" + Date.now(), { cache: "no-store" })
      .then(function (r) { return r.text(); })
      .then(function (text) {
        const m = /VAULT_ORIGIN\s*=\s*"(https?:\/\/[^"]+)"/.exec(text);
        if (m) window.VAULT_ORIGIN = m[1];
      })
      .catch(function () {});
  }

  function scheduleReconnect() {
    if (ready || bootTimer) return;
    bootTimer = window.setTimeout(function () {
      bootTimer = 0;
      refreshOrigin().then(boot);
    }, 12000);
  }

  async function boot() {
    if (booting || ready) return;
    booting = true;
    window.FamiGate.blockWebChrome();
    window.FamiGate.bindKeyboard();
    setBoot(true, "正在連接故事櫃…");
    key = window.FAMILY_VIEW_KEY || window.FamiGate.currentKey();
    if (window.FAMILY_FORCE_INVITE) key = window.FAMILY_URL_KEY || "";
    try {
      if (!window.FamiGate.origin()) {
        if (statusEl) statusEl.textContent = "維護中,請5分鐘後再試";
        scheduleReconnect();
        return;
      }
      await window.FamiGate.api("/api/public", "", { timeout: 8000 }).catch(function () { return null; });
      if (!key) {
        setBoot(false);
        if (window.FAMILY_FORCE_INVITE || window.FAMILY_URL_KEY) showInvite();
        else if (statusEl) statusEl.textContent = "請用邀請連結打開";
        return;
      }
      const x = await window.FamiGate.api("/api/door", key, { timeout: 20000 });
      if (!x.res || !x.res.ok || !x.j) {
        if (statusEl) statusEl.textContent = "維護中,請5分鐘後再試";
        scheduleReconnect();
        return;
      }
      if (x.j.kind === "invite") {
        setBoot(false);
        showInvite();
        if (statusEl) statusEl.textContent = "";
        return;
      }
      hideInvite();
      const blobs = document.querySelector(".blobs");
      if (blobs) blobs.hidden = true;
      window.FamiGate.savePersonal(key);
      window.FamiGate.pinKey(key);
      renderMe(x.j.reader);
      ensureModes();
      setBoot(false, "");
      if (statusEl) statusEl.textContent = "";
      await loadShelf();
      ready = true;
      if (typeof navigator.standalone === "boolean" && !navigator.standalone) {
        const seen = localStorage.getItem("kodohon.installed");
        if (!seen && homeInstall) homeInstall.hidden = false;
      }
    } catch (e) {
      if (statusEl) statusEl.textContent = "維護中,請5分鐘後再試";
      scheduleReconnect();
    } finally {
      booting = false;
    }
  }

  if (goBtn) goBtn.addEventListener("click", function () {
    if (busy) return;
    if (window.FamiGate.needsSafari()) return;
    goBtn.hidden = true;
    if (!nameForm || !nameInput) return;
    nameForm.hidden = false;
    nameInput.readOnly = true;
    nameInput.addEventListener("touchend", function once(ev) {
      if (Math.hypot(ev.changedTouches[0].clientX - (this._x || 0), ev.changedTouches[0].clientY - (this._y || 0)) > 12) return;
      nameInput.readOnly = false;
      nameInput.focus();
    });
    nameInput.addEventListener("touchstart", function (ev) {
      this._x = ev.touches[0].clientX;
      this._y = ev.touches[0].clientY;
    });
    setTimeout(function () {
      nameInput.readOnly = false;
      nameInput.focus();
    }, 50);
  });

  if (nameForm) nameForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (busy) return;
    const inviteKey = window.FAMILY_URL_KEY || window.FamiGate.currentKey();
    if (!inviteKey) {
      if (nameErr) nameErr.textContent = "請用邀請連結打開";
      return;
    }
    busy = true;
    startWait();
    const name = (nameInput.value || "").trim();
    try {
      const x = await window.FamiGate.api("/api/invite/name", inviteKey, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name }),
        timeout: 20000,
      });
      if (!x.res.ok || !x.j || !x.j.token) {
        nameErr.textContent = (x.j && x.j.error) || "請再試一次";
        waitEl.hidden = true;
        nameForm.hidden = false;
        busy = false;
        return;
      }
      window.FamiGate.savePersonal(x.j.token);
      location.href = "./index.html?k=" + encodeURIComponent(x.j.token) + "#k=" + encodeURIComponent(x.j.token);
    } catch (err) {
      nameErr.textContent = "家裡還沒開";
      waitEl.hidden = true;
      nameForm.hidden = false;
      busy = false;
    }
  });

  const homeInstalled = document.getElementById("home-installed");
  if (homeInstalled) homeInstalled.addEventListener("click", function () {
    try { localStorage.setItem("kodohon.installed", "1"); } catch (e) {}
    if (homeInstall) homeInstall.hidden = true;
  });

  if (coverInput) coverInput.addEventListener("change", async function () {
    const file = coverInput.files && coverInput.files[0];
    if (!file) return;
    const entry = document.querySelector('.settings-entry[data-job="cover"]');
    setJobRun(entry, true);
    setCabRun(true);
    try {
      const fd = new FormData();
      fd.append("cover", file);
      await fetch(window.FamiGate.origin() + "/api/cover?k=" + encodeURIComponent(key), { method: "POST", body: fd });
      const door = await window.FamiGate.api("/api/door", key, { timeout: 15000 });
      if (door.j && door.j.reader) renderMe(door.j.reader);
    } finally {
      setJobRun(entry, false);
      setCabRun(false);
      coverInput.value = "";
    }
  });

  if (backdropInput) backdropInput.addEventListener("change", async function () {
    const file = backdropInput.files && backdropInput.files[0];
    if (!file || waitBusy) {
      backdropInput.value = "";
      return;
    }
    waitBusy = true;
    showWaitCard("更換背景中");
    waitTimer = window.setInterval(function () {
      const pct = document.getElementById("waitPct");
      const n = parseInt((pct && pct.textContent) || "0", 10) || 0;
      if (n < 90) setWaitPct(n + 1);
    }, 280);
    const entry = document.querySelector('.settings-entry[data-job="backdrop"]');
    setJobRun(entry, true);
    setCabRun(true);
    try {
      const fd = new FormData();
      fd.append("backdrop", file);
      await fetch(window.FamiGate.origin() + "/api/backdrop?k=" + encodeURIComponent(key), { method: "POST", body: fd });
      setWaitPct(100);
      const door = await window.FamiGate.api("/api/door", key, { timeout: 15000 });
      if (door.j && door.j.reader) renderMe(door.j.reader);
    } finally {
      hideWaitCard();
      setJobRun(entry, false);
      setCabRun(false);
      waitBusy = false;
      backdropInput.value = "";
    }
  });

  if (micBtn) micBtn.addEventListener("click", function (ev) {
    ev.preventDefault();
    listenVoice();
  });
  const findClose = document.getElementById("findClose");
  if (findClose) findClose.addEventListener("click", closeFind);
  const actClose = document.getElementById("actClose");
  if (actClose) actClose.addEventListener("click", closeAct);
  bindMaskClose("findMask", closeFind);
  bindMaskClose("actMask", closeAct);

  const readerBack = document.getElementById("reader-back");
  if (readerBack) readerBack.addEventListener("click", function (ev) {
    ev.preventDefault();
    closeReader();
  });
  window.addEventListener("message", function (ev) {
    if (ev.origin !== location.origin) return;
    const kind = ev.data && ev.data.fami;
    if (kind === "close-reader") closeReader();
    else if (kind === "reader-ready") showReaderLive();
  });
  window.addEventListener("popstate", function () {
    if (readerOpen) {
      padOverlay();
      return;
    }
  });
  window.addEventListener("resize", layoutStage);

  window.FamiShelf = {
    openSaved: function (data) { if (data && data.id) openListen(data.id); },
    closeReader: closeReader,
  };

  boot();
})();
