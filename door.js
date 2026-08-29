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
  const rail = document.getElementById("photo-rail");
  const GEAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.6 3.8l.6-1.3h3.6l.6 1.3 1.6.7 1.4-.5 2.5 2.5-.5 1.4.7 1.6 1.3.6v3.6l-1.3.6-.7 1.6.5 1.4-2.5 2.5-1.4-.5-1.6.7-.6 1.3h-3.6l-.6-1.3-1.6-.7-1.4.5-2.5-2.5.5-1.4-.7-1.6-1.3-.6v-3.6l1.3-.6.7-1.6-.5-1.4L6.6 4l1.4.5 1.6-.7z" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linejoin="round"/><circle cx="12" cy="11.9" r="3.2" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
  const CAMERA = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="8" width="17" height="11.5" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M8 8l1.4-2.4h5.2L16 8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="13.6" r="3" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>';
  const SCENE = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M5.5 16.2l4.2-4.6 3 3.2 2.2-2.4 3.6 3.8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="9" cy="9.2" r="1.3" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
  const HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20C10.5 18.4 7.3 15.8 5.4 11.9C4 9.1 5.2 6 8.4 6c1.8 0 3 1.1 3.6 2.2C12.6 7.1 13.8 6 15.6 6c3.2 0 4.4 3.1 3 5.9C16.7 15.8 13.5 18.4 12 20Z"/></svg>';
  const MAG = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M15.2 15.2L20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  const PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 6l12 6-12 6z" fill="currentColor"/></svg>';
  const PAUSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 6h3v12H8zM13 6h3v12h-3z" fill="currentColor"/></svg>';
  const TRASH = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8V6.8A1.8 1.8 0 0 1 9.8 5h4.4A1.8 1.8 0 0 1 16 6.8V8M5 8h14M9 11v7M12 11v7M15 11v7M7 8l.8 12.2A1.6 1.6 0 0 0 9.4 22h5.2a1.6 1.6 0 0 0 1.6-1.8L17 8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const SHUFFLE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h4.2l7.6 10H20M16.5 7H20M4 17h4.2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M16.2 4.8L20 7l-3.8 2.2M16.2 14.8L20 17l-3.8 2.2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const LOOP = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h8.5a4 4 0 0 1 0 8H7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M9.2 4.8L6.4 7l2.8 2.2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const LOOP_CHOICES = [1, 2, 3, 0];
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
  let selectedPick = "";
  let nightPicks = {};
  let shuffleOn = false;
  let loopOn = false;
  let lastSearchQ = "";
  let readerOpen = false;
  let readerStaySeq = 0;
  let holdTimer = 0;
  let holdId = "";
  let userStarted = false;
  let armedId = "";
  let countLoops = 1;
  let askUnfavId = "";
  let finding = false;
  let holdFired = false;
  let waitingId = "";

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
        if (row.dataset.keep === "1") {
          onClick();
          return;
        }
        closeSettings();
        onClick();
      });
      return row;
    }
    menu.appendChild(gearRow(CAMERA, "更換頭像", "cover", function () { if (coverInput) coverInput.click(); }));
    menu.appendChild(gearRow(SCENE, "更換背景", "backdrop", function () { if (backdropInput) backdropInput.click(); }));
    const shuffleRow = gearRow(SHUFFLE, "隨機", "shuffle", function () { toggleFlag("shuffle"); });
    const loopRow = gearRow(LOOP, "循環", "loop", function () { toggleFlag("loop"); });
    shuffleRow.dataset.keep = "1";
    loopRow.dataset.keep = "1";
    menu.appendChild(shuffleRow);
    menu.appendChild(loopRow);
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
    paintStage(reader);
  }

  function thumbUrl(item) {
    return window.FamiGate.origin() + "/thumb?id=" + encodeURIComponent(item.id) + "&k=" + encodeURIComponent(key);
  }

  function playerEl() {
    return document.getElementById("player");
  }

  function playerStoryId() {
    const player = playerEl();
    const src = (player && (player.currentSrc || player.src)) || "";
    if (!src) return "";
    try {
      return new URL(src, location.href).searchParams.get("id") || "";
    } catch (e) {
      return "";
    }
  }

  function paintSchedHuds() {
    if (!feed || hostTab !== "sched") return;
    feed.querySelectorAll(".tile.is-job").forEach(function (el) {
      decorateJob(el, {
        id: el.dataset.id,
        pick: el.dataset.pick,
        state: el.dataset.state,
      });
    });
  }

  function postNight(body) {
    return window.FamiGate.api("/api/night", key, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      timeout: 15000,
    });
  }

  function paintFlags() {
    const sh = document.querySelector('.settings-entry[data-job="shuffle"]');
    const lp = document.querySelector('.settings-entry[data-job="loop"]');
    if (sh) {
      const badge = sh.querySelector(".ins-icon");
      if (badge) badge.classList.toggle("is-run", !!shuffleOn);
    }
    if (lp) {
      const badge = lp.querySelector(".ins-icon");
      if (badge) badge.classList.toggle("is-run", !!loopOn);
    }
  }

  async function toggleFlag(name) {
    if (name === "shuffle") shuffleOn = !shuffleOn;
    if (name === "loop") loopOn = !loopOn;
    paintFlags();
    await postNight({ op: "settings", shuffle: shuffleOn, loop: loopOn });
    paintFlags();
  }

  function nextLoop(n) {
    const i = LOOP_CHOICES.indexOf(n);
    return LOOP_CHOICES[(i < 0 ? 0 : i + 1) % LOOP_CHOICES.length];
  }

  function loadAudio(id, play) {
    const player = playerEl();
    if (!player || !id) return;
    const origin = window.FamiGate.origin();
    if (play) {
      userStarted = true;
      waitingId = id;
      paintSchedHuds();
    }
    player.src = origin + "/audio?id=" + encodeURIComponent(id) + "&k=" + encodeURIComponent(key);
    player.load();
    if (play) {
      player.play().catch(function () {});
    }
  }

  function stopAudio() {
    const player = playerEl();
    waitingId = "";
    if (!player) return;
    player.pause();
    try { player.removeAttribute("src"); player.load(); } catch (e) {}
  }

  function clearSelect() {
    selectedPick = "";
    armedId = "";
    if (feed) {
      feed.querySelectorAll(".tile.is-pick").forEach(function (el) { el.classList.remove("is-pick"); });
      feed.querySelectorAll(".tile .job-ctrl.play-arm").forEach(function (el) { el.remove(); });
    }
    paintRail();
  }

  function paintCountFace(btn, n) {
    const face = btn.querySelector(".ins-face");
    if (!face) return;
    if (n === 0) {
      face.innerHTML = LOOP;
      btn.setAttribute("aria-label", "循環");
      btn.title = "循環";
    } else {
      face.textContent = "×" + n;
      btn.setAttribute("aria-label", "×" + n);
      btn.title = "×" + n;
    }
  }

  function paintRail() {
    if (!rail) return;
    if (hostTab !== "sched" || selectedPick === "") {
      rail.hidden = true;
      rail.innerHTML = "";
      document.documentElement.classList.remove("has-rail");
      return;
    }
    const tile = feed && feed.querySelector('.tile[data-pick="' + selectedPick + '"]');
    countLoops = tile ? Number(tile.dataset.loops) : 1;
    if (countLoops !== 0 && LOOP_CHOICES.indexOf(countLoops) < 0) countLoops = 1;
    rail.hidden = false;
    document.documentElement.classList.add("has-rail");
    rail.innerHTML = "";
    const cycle = insButton("rail-loop", countLoops === 0 ? LOOP : PLAY, countLoops === 0 ? "循環" : "×" + countLoops);
    paintCountFace(cycle, countLoops);
    cycle.addEventListener("click", async function () {
      countLoops = nextLoop(countLoops);
      paintCountFace(cycle, countLoops);
      if (tile) tile.dataset.loops = String(countLoops);
      await postNight({ op: "loops", index: selectedPick, loops: countLoops });
      loadShelf();
    });
    const trash = insButton("rail-trash", TRASH, "丟掉");
    trash.addEventListener("click", async function () {
      const idx = selectedPick;
      clearSelect();
      const x = await postNight({ op: "remove", index: idx });
      const cur = x.j || {};
      const player = playerEl();
      if (cur.id && userStarted && !cur.paused && !cur.done) {
        if (!player || !player.src || player.paused) loadAudio(cur.id, true);
      } else if (!cur.id || cur.done) {
        stopAudio();
      }
      loadShelf();
    });
    const sid = tile && tile.dataset.id;
    const live = !!(userStarted && playerEl() && !playerEl().paused && sid && playerStoryId() === sid);
    const toggle = insButton("job-ctrl", live ? PAUSE : PLAY, live ? "暫停" : "播放");
    toggle.addEventListener("click", async function () {
      const player = playerEl();
      const pick = selectedPick;
      const here = tile && tile.dataset.id;
      if (player && !player.paused && player.src && here && playerStoryId() === here) {
        player.pause();
        waitingId = "";
        await postNight({ op: "pause" });
      } else {
        userStarted = true;
        const sameSrc = !!(here && player && player.src && playerStoryId() === here);
        if (!sameSrc && here) {
          waitingId = here;
          paintSchedHuds();
        }
        const now = here
          ? await postNight({ op: "play_pick", index: pick })
          : await postNight({ op: "play" });
        selectedPick = "0";
        const nid = (now.j && now.j.id) || here;
        if (sameSrc) player.play().catch(function () {});
        else if (nid) loadAudio(nid, true);
      }
      loadShelf();
    });
    rail.appendChild(cycle);
    rail.appendChild(toggle);
    rail.appendChild(trash);
  }

  function applySchedPick() {
    if (!feed || hostTab !== "sched") return;
    const tiles = feed.querySelectorAll(".tile");
    tiles.forEach(function (el, i) {
      if (el.dataset.pick == null || el.dataset.pick === "") el.dataset.pick = String(i);
    });
    if (tiles.length === 0) selectedPick = "";
    else if (tiles.length === 1) selectedPick = tiles[0].dataset.pick;
    else if (selectedPick !== "") {
      let found = false;
      tiles.forEach(function (el) {
        if (el.dataset.pick === String(selectedPick)) found = true;
      });
      if (!found) selectedPick = "";
    }
    tiles.forEach(function (el) {
      el.classList.toggle("is-pick", selectedPick !== "" && el.dataset.pick === String(selectedPick));
    });
    paintRail();
  }

  async function goSchedAndPlay(id, loops) {
    const before = await window.FamiGate.api("/api/night", key, { timeout: 8000 });
    const idle = !before.j || !before.j.id || before.j.done || before.j.paused || !userStarted;
    await postNight({ op: "enqueue", id: id, loops: loops || 1 });
    if (idle) {
      const now = await window.FamiGate.api("/api/night", key, { timeout: 8000 });
      const picks = (now.j && now.j.night && now.j.night.picks) || [];
      let idx = picks.length - 1;
      for (let i = picks.length - 1; i >= 0; i--) {
        if (String(picks[i].id) === String(id)) {
          idx = i;
          break;
        }
      }
      const played = await postNight({ op: "play_pick", index: idx });
      selectedPick = "0";
      const nid = (played.j && played.j.id) || id;
      loadAudio(nid, true);
    }
    pickTab("sched");
  }

  function decorateJob(el, item) {
    el.classList.add("is-job");
    if (item.state != null) el.dataset.state = item.state;
    if (item.pick != null) el.dataset.pick = String(item.pick);
    const sid = item.id;
    const same = playerStoryId() === sid;
    const player = playerEl();
    const live = !!(player && player.src && !player.paused && same);
    const loading = waitingId === sid;
    const pick = item.pick != null ? String(item.pick) : "";
    let hudState = "queued";
    if (loading || live) hudState = "running";
    else if (same && userStarted) hudState = "paused";
    else if (pick === "0") hudState = "paused";
    else if (item.state === "paused") hudState = "paused";
    else if (item.state === "running") hudState = "running";
    el.classList.toggle("is-run", hudState === "running");
    const name = el.querySelector(".tile-pct");
    if (name) name.hidden = true;
    let hud = el.querySelector(".tile-job-hud");
    if (!hud) {
      hud = document.createElement("div");
      hud.className = "tile-job-hud hp";
      hud.innerHTML =
        '<div class="hp-label">' +
        '<span class="hp-text"></span>' +
        '<div class="thinking-five hp-think" aria-hidden="true" hidden>' +
        "<span></span><span></span><span></span><span></span><span></span></div></div>";
      el.appendChild(hud);
    }
    const running = hudState === "running";
    hud.classList.toggle("is-run", running);
    const text = hud.querySelector(".hp-text");
    const think = hud.querySelector(".thinking-five");
    if (text) {
      text.textContent = running ? "播放中" : (hudState === "paused" ? "已暫停" : "排隊中");
    }
    if (think) think.hidden = !running;
  }

  function armTile(btn, item) {
    if (feed) feed.querySelectorAll(".tile .job-ctrl.play-arm").forEach(function (el) { el.remove(); });
    armedId = item.id;
    const play = insButton("job-ctrl play-arm", PLAY, "播放");
    play.addEventListener("click", function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      armedId = "";
      play.remove();
      goSchedAndPlay(item.id, 1);
    });
    btn.appendChild(play);
  }

  function tileEl(item) {
    catalog[item.id] = item;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tile";
    btn.dataset.id = item.id;
    if (item.pick != null) btn.dataset.pick = String(item.pick);
    if (item.loops != null) btn.dataset.loops = String(item.loops);
    if (item.state != null) btn.dataset.state = item.state;
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
    if (item.favorite && hostTab !== "sched") {
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
    if (hostTab === "sched") decorateJob(btn, item);
    btn.addEventListener("pointerdown", function (ev) {
      if (ev.button && ev.button !== 0) return;
      if (ev.target.closest && ev.target.closest(".job-ctrl")) return;
      holdId = item.id;
      holdTimer = window.setTimeout(function () {
        holdFired = true;
        if (hostTab === "all") {
          window.FamiGate.api("/api/fav", key, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: item.id, on: true }),
          }).then(function () { loadShelf(); });
          return;
        }
        if (hostTab === "fav") {
          openUnfavAsk(item.id);
          return;
        }
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
      if (holdFired) {
        holdFired = false;
        return;
      }
      if (ev.target.closest && ev.target.closest(".job-ctrl")) return;
      if (hostTab === "sched") {
        selectedPick = btn.dataset.pick != null ? btn.dataset.pick : "0";
        applySchedPick();
        return;
      }
      if (!item.ready) return;
      if (armedId === item.id) {
        goSchedAndPlay(item.id, 1);
        return;
      }
      armTile(btn, item);
    });
    return btn;
  }

  function paintFindMode() {
    const bar = document.getElementById("mode-bar");
    if (!bar) return;
    bar.querySelectorAll(".mode-btn").forEach(function (el) {
      if (el.dataset.mode === "find") el.classList.toggle("is-on", !!finding);
      else el.classList.toggle("is-on", !finding && el.dataset.mode === hostTab);
    });
  }

  function pickTab(tab) {
    hostTab = tab || "all";
    finding = false;
    closeFind();
    paintFindMode();
    clearSelect();
    loadShelf();
  }

  function ensureModes() {
    const bar = document.getElementById("mode-bar");
    if (!bar || bar.dataset.ready) return;
    bar.dataset.ready = "1";
    bar.hidden = false;
    if (tagBoard) tagBoard.hidden = false;
    [["fav", "最愛"], ["all", "全部"], ["sched", "排程"]].forEach(function (pair) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "mode-btn" + (hostTab === pair[0] ? " is-on" : "");
      btn.dataset.mode = pair[0];
      btn.textContent = pair[1];
      btn.addEventListener("click", function () { pickTab(pair[0]); });
      bar.appendChild(btn);
    });
    const findBtn = document.createElement("button");
    findBtn.type = "button";
    findBtn.className = "mode-btn mode-find";
    findBtn.dataset.mode = "find";
    findBtn.innerHTML = MAG + "<span>找故事？</span>";
    findBtn.addEventListener("click", function () {
      finding = true;
      paintFindMode();
      const mask = document.getElementById("findMask");
      const title = document.getElementById("findTitle");
      if (title) title.textContent = "找故事？";
      if (mask) mask.hidden = false;
      const input = document.getElementById("findInput");
      if (input) input.value = "";
    });
    bar.appendChild(findBtn);
  }

  function closeFind() {
    const mask = document.getElementById("findMask");
    if (mask) mask.hidden = true;
    finding = false;
    paintFindMode();
  }

  function closeAct() {
    const mask = document.getElementById("actMask");
    if (mask) mask.hidden = true;
  }

  function bindMaskClose(maskId, closeFn) {
    const mask = document.getElementById(maskId);
    if (!mask) return;
    if (window.FamiGate && window.FamiGate.lockSheetPage) window.FamiGate.lockSheetPage(mask);
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
    const body = document.getElementById("findHits");
    const title = document.getElementById("findTitle");
    if (title) title.textContent = lastSearchQ ? "是這個嗎" : "找故事？";
    if (!body || !mask) return;
    body.innerHTML = "";
    const hits = result.hits || [];
    if (!hits.length) {
      const p = document.createElement("p");
      p.textContent = "沒對到，再找一次";
      body.appendChild(p);
    }
    const row = document.createElement("div");
    row.className = "tag-row";
    hits.forEach(function (hit) {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "tag-chip";
      chip.textContent = hit.title;
      chip.addEventListener("click", async function () {
        if (lastSearchQ) {
          await window.FamiGate.api("/api/alias", key, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ q: lastSearchQ, id: hit.id }),
          });
        }
        closeFind();
        goSchedAndPlay(hit.id, 1);
      });
      row.appendChild(chip);
    });
    if (hits.length) body.appendChild(row);
    finding = true;
    mask.hidden = false;
    paintFindMode();
  }

  function openUnfavAsk(id) {
    askUnfavId = id;
    const mask = document.getElementById("askMask");
    const text = document.getElementById("askText");
    const yes = document.getElementById("askYes");
    const ok = document.getElementById("askOk");
    if (text) text.textContent = "是否取消最愛";
    if (yes) yes.hidden = true;
    if (ok) ok.hidden = false;
    if (mask) mask.hidden = false;
  }

  function closeAsk() {
    const mask = document.getElementById("askMask");
    if (mask) mask.hidden = true;
    askUnfavId = "";
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
    paintFlags();
    feed.innerHTML = "";
    catalog = {};
    (x.j.items || []).forEach(function (it) { feed.appendChild(tileEl(it)); });
    if (tagBoard) tagBoard.hidden = false;
    if (hostTab === "sched") applySchedPick();
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
      goSchedAndPlay(x.j.hits[0].id, 1);
      return;
    }
    showHits(x.j, q);
  }

  /* 封存：語音輸入後續再開發。門面不掛麥克風。 */
  async function searchBlob(blob, name) {
    const fd = new FormData();
    fd.append("file", blob, name || "speech.webm");
    const x = await window.FamiGate.api("/api/search", key, { method: "POST", body: fd, timeout: 45000 });
    if (!x.j) return;
    if (x.j.auto && x.j.hits && x.j.hits[0]) {
      goSchedAndPlay(x.j.hits[0].id, 1);
      return;
    }
    showHits(x.j, x.j.q || "");
  }

  function listenVoice() {
    if (busy) return;
    busy = true;
    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
        const rec = new MediaRecorder(stream);
        const chunks = [];
        rec.ondataavailable = function (ev) { if (ev.data && ev.data.size) chunks.push(ev.data); };
        rec.onstop = function () {
          stream.getTracks().forEach(function (t) { t.stop(); });
          const blob = new Blob(chunks, { type: rec.mimeType || "audio/webm" });
          searchBlob(blob, "speech.webm").finally(function () { busy = false; });
        };
        rec.start();
        window.setTimeout(function () { if (rec.state === "recording") rec.stop(); }, 3200);
      }).catch(function () {
        if (Speech) webSpeech(Speech);
        else busy = false;
      });
      return;
    }
    if (Speech) webSpeech(Speech);
    else busy = false;
  }

  function webSpeech(Speech) {
    const rec = new Speech();
    rec.lang = "zh-TW";
    rec.interimResults = false;
    rec.onresult = function (ev) {
      const q = ev.results && ev.results[0] && ev.results[0][0] ? ev.results[0][0].transcript : "";
      searchText(q).finally(function () { busy = false; });
    };
    rec.onerror = function () { busy = false; };
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

  const findClose = document.getElementById("findClose");
  if (findClose) findClose.addEventListener("click", closeFind);
  const actClose = document.getElementById("actClose");
  if (actClose) actClose.addEventListener("click", closeAct);
  bindMaskClose("findMask", closeFind);
  bindMaskClose("actMask", closeAct);
  if (window.FamiGate && window.FamiGate.lockSheetPage) {
    const askMask = document.getElementById("askMask");
    if (askMask) window.FamiGate.lockSheetPage(askMask);
  }
  const findForm = document.getElementById("findForm");
  if (findForm) {
    findForm.addEventListener("submit", function (ev) {
      ev.preventDefault();
      const input = document.getElementById("findInput");
      const q = ((input && input.value) || "").trim();
      if (!q) return;
      searchText(q);
    });
  }
  const askNo = document.getElementById("askNo");
  const askOk = document.getElementById("askOk");
  if (askNo) askNo.addEventListener("click", closeAsk);
  if (askOk) {
    askOk.addEventListener("click", async function () {
      const id = askUnfavId;
      closeAsk();
      if (!id) return;
      await window.FamiGate.api("/api/fav", key, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id, on: false }),
      });
      loadShelf();
    });
  }
  const player = playerEl();
  if (player) {
    player.addEventListener("ended", async function () {
      if (!userStarted) return;
      const x = await postNight({ op: "next" });
      if (x.j && x.j.id && !x.j.done) loadAudio(x.j.id, true);
      else stopAudio();
      if (hostTab === "sched") loadShelf();
    });
    player.addEventListener("playing", function () {
      waitingId = "";
      if (hostTab === "sched") loadShelf();
    });
    player.addEventListener("waiting", function () {
      const sid = playerStoryId();
      if (userStarted && sid) {
        waitingId = sid;
        paintSchedHuds();
      }
    });
    player.addEventListener("play", function () {
      if (hostTab === "sched") paintRail();
    });
    player.addEventListener("pause", function () {
      if (hostTab === "sched") {
        paintSchedHuds();
        paintRail();
      }
    });
  }

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
