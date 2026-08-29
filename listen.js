(function () {
  const q = new URLSearchParams(location.search);
  const key = window.FamiGate ? window.FamiGate.currentKey() : (q.get("k") || "");
  const origin = window.FamiGate ? window.FamiGate.origin() : String(window.VAULT_ORIGIN || "").replace(/\/$/, "");
  const titleEl = document.getElementById("bookTitle");
  const coverEl = document.getElementById("listenCover");
  const playBtn = document.getElementById("playBtn");
  const playFace = document.getElementById("playFace");
  const nextBtn = document.getElementById("nextBtn");
  const menu = document.getElementById("readerSettingsMenu");
  const catcher = document.getElementById("readerSettingsCatch");
  let currentId = q.get("id") || "";
  let userStarted = false;
  let nextStoryId = "";
  let liveIsA = true;
  let playersPrimed = false;
  let handingOff = false;

  function playerEl() {
    return document.getElementById(liveIsA ? "player" : "player-next");
  }

  function standbyEl() {
    return document.getElementById(liveIsA ? "player-next" : "player");
  }

  function storyIdFrom(el) {
    const src = (el && (el.currentSrc || el.src)) || "";
    if (!src) return "";
    try {
      return new URL(src, location.href).searchParams.get("id") || "";
    } catch (e) {
      return "";
    }
  }

  function audioUrl(id) {
    return origin + "/audio?id=" + encodeURIComponent(id) + "&k=" + encodeURIComponent(key);
  }

  function rememberNight(j) {
    if (j && Object.prototype.hasOwnProperty.call(j, "next_id")) {
      nextStoryId = j.next_id || "";
      if (userStarted) armStandby();
    }
  }

  function primePlayers(id) {
    if (playersPrimed) return;
    playersPrimed = true;
    const wait = document.getElementById("player-next");
    if (!wait) return;
    if (id) {
      try { wait.src = audioUrl(id); } catch (e) {}
    }
    wait.muted = true;
    const p = wait.play();
    if (p && p.then) {
      p.then(function () {
        wait.pause();
        wait.muted = false;
      }).catch(function () { wait.muted = false; });
    } else {
      try { wait.pause(); } catch (e) {}
      wait.muted = false;
    }
  }

  function armStandby() {
    const nid = nextStoryId;
    const wait = standbyEl();
    if (!nid || !wait || nid === storyIdFrom(playerEl())) return;
    if (storyIdFrom(wait) === nid && (wait.currentSrc || wait.src)) return;
    wait.src = audioUrl(nid);
    wait.load();
  }

  function embedded() {
    try { return window.parent && window.parent !== window; } catch (e) { return false; }
  }

  function goBack() {
    if (embedded()) {
      try { window.parent.postMessage({ fami: "close-reader" }, location.origin); } catch (e) {}
      return;
    }
    location.href = "./index.html?k=" + encodeURIComponent(key) + "#k=" + encodeURIComponent(key);
  }

  function closeMenu() {
    if (menu) menu.hidden = true;
    if (catcher) catcher.hidden = true;
    const toggle = document.getElementById("configButton");
    if (toggle) {
      toggle.classList.remove("is-live");
      toggle.setAttribute("aria-expanded", "false");
    }
  }

  function paintFace(playing) {
    if (playFace) playFace.textContent = playing ? "暫停" : "播放";
  }

  async function showStory(id) {
    currentId = id;
    const x = await window.FamiGate.api("/api/story?id=" + encodeURIComponent(id), key, { timeout: 15000 });
    const story = x.j || {};
    if (titleEl) titleEl.textContent = story.title || "";
    if (coverEl) {
      coverEl.src = origin + "/thumb?id=" + encodeURIComponent(id) + "&k=" + encodeURIComponent(key);
    }
    const player = playerEl();
    const already = storyIdFrom(player) === id && (player.currentSrc || player.src);
    if (!already) {
      player.pause();
      player.src = audioUrl(id);
      player.load();
    }
    try { sessionStorage.setItem("kodohon.listening", JSON.stringify({ id: id, k: key })); } catch (e) {}
    if (userStarted) {
      if (!already) player.play().catch(function () {});
      paintFace(true);
      armStandby();
    } else {
      paintFace(false);
    }
    if (embedded()) {
      try { window.parent.postMessage({ fami: "reader-ready" }, location.origin); } catch (e) {}
    }
  }

  function tryHandoff(fromEnded) {
    if (handingOff || !userStarted) return;
    const nid = nextStoryId;
    if (nid && nid === storyIdFrom(playerEl()) && !fromEnded) return;
    if (!nid) {
      if (!fromEnded) return;
      handingOff = true;
      window.FamiGate.api("/api/night/next", key, { method: "POST", timeout: 15000 }).then(function (x) {
        handingOff = false;
        rememberNight(x.j);
        if (x.j && x.j.id) showStory(x.j.id);
        else goBack();
      });
      return;
    }
    handingOff = true;
    const live = playerEl();
    const wait = standbyEl();
    currentId = nid;
    if (nid === storyIdFrom(live)) {
      try { live.currentTime = 0; } catch (e) {}
      live.play().catch(function () {});
    } else if (wait && storyIdFrom(wait) === nid) {
      live.pause();
      liveIsA = !liveIsA;
      playerEl().play().catch(function () {});
    } else {
      showStory(nid);
    }
    paintFace(true);
    window.FamiGate.api("/api/night/next", key, { method: "POST", timeout: 15000 }).then(function (x) {
      handingOff = false;
      rememberNight(x.j);
      if (x.j && x.j.id && x.j.id !== storyIdFrom(playerEl())) showStory(x.j.id);
      else if (!x.j || !x.j.id) goBack();
      else {
        showStory(x.j.id);
        armStandby();
      }
    });
  }

  async function nextStory() {
    const x = await window.FamiGate.api("/api/night/next", key, { method: "POST", timeout: 15000 });
    rememberNight(x.j);
    if (x.j && x.j.id) showStory(x.j.id);
    else goBack();
  }

  document.addEventListener("contextmenu", function (e) { e.preventDefault(); });
  document.getElementById("backShelf").addEventListener("click", function (ev) {
    ev.preventDefault();
    goBack();
  });
  document.getElementById("backToShelf").addEventListener("click", function () {
    closeMenu();
    goBack();
  });
  document.getElementById("configButton").addEventListener("click", function (ev) {
    ev.preventDefault();
    const open = menu.hidden;
    menu.hidden = !open;
    catcher.hidden = !open;
    this.classList.toggle("is-live", open);
    this.setAttribute("aria-expanded", open ? "true" : "false");
  });
  if (catcher) catcher.addEventListener("click", closeMenu);
  playBtn.addEventListener("click", function () {
    const player = playerEl();
    if (player.paused) {
      userStarted = true;
      primePlayers(currentId);
      player.play();
      paintFace(true);
      armStandby();
    } else {
      player.pause();
      paintFace(false);
    }
  });
  nextBtn.addEventListener("click", function () { nextStory(); });
  function bindPlayer(el) {
    if (!el) return;
    el.addEventListener("ended", function () {
      if (el !== playerEl()) return;
      tryHandoff(true);
    });
    el.addEventListener("timeupdate", function () {
      if (el !== playerEl() || !userStarted) return;
      if (el.duration && isFinite(el.duration) && el.duration > 1 && el.duration - el.currentTime <= 0.35) {
        tryHandoff(false);
      }
    });
    el.addEventListener("playing", function () {
      if (el !== playerEl()) return;
      armStandby();
    });
    el.addEventListener("play", function () {
      if (el !== playerEl()) return;
      paintFace(true);
    });
    el.addEventListener("pause", function () {
      if (el !== playerEl() || handingOff) return;
      if (!el.ended) paintFace(false);
    });
  }
  bindPlayer(document.getElementById("player"));
  bindPlayer(document.getElementById("player-next"));

  if (currentId) {
    window.FamiGate.api("/api/night", key, { timeout: 8000 }).then(function (x) {
      rememberNight(x.j);
      showStory(currentId);
    });
  } else {
    window.FamiGate.api("/api/night", key, { timeout: 8000 }).then(function (x) {
      rememberNight(x.j);
      if (x.j && x.j.id) showStory(x.j.id);
    });
  }
})();
