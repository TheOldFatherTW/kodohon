(function () {
  const q = new URLSearchParams(location.search);
  const key = window.FamiGate ? window.FamiGate.currentKey() : (q.get("k") || "");
  const origin = window.FamiGate ? window.FamiGate.origin() : String(window.VAULT_ORIGIN || "").replace(/\/$/, "");
  const titleEl = document.getElementById("bookTitle");
  const coverEl = document.getElementById("listenCover");
  const player = document.getElementById("player");
  const playBtn = document.getElementById("playBtn");
  const playFace = document.getElementById("playFace");
  const nextBtn = document.getElementById("nextBtn");
  const menu = document.getElementById("readerSettingsMenu");
  const catcher = document.getElementById("readerSettingsCatch");
  let currentId = q.get("id") || "";
  let userStarted = false;

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

  async function showStory(id) {
    currentId = id;
    const x = await window.FamiGate.api("/api/story?id=" + encodeURIComponent(id), key, { timeout: 15000 });
    const story = x.j || {};
    if (titleEl) titleEl.textContent = story.title || "";
    if (coverEl) {
      coverEl.src = origin + "/thumb?id=" + encodeURIComponent(id) + "&k=" + encodeURIComponent(key);
    }
    player.pause();
    player.src = origin + "/audio?id=" + encodeURIComponent(id) + "&k=" + encodeURIComponent(key);
    player.load();
    try { sessionStorage.setItem("kodohon.listening", JSON.stringify({ id: id, k: key })); } catch (e) {}
    if (userStarted) {
      player.play().catch(function () {});
      if (playFace) playFace.textContent = "暫停";
    } else if (playFace) {
      playFace.textContent = "播放";
    }
    if (embedded()) {
      try { window.parent.postMessage({ fami: "reader-ready" }, location.origin); } catch (e) {}
    }
  }

  async function nextStory() {
    const x = await window.FamiGate.api("/api/night/next", key, { method: "POST", timeout: 15000 });
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
    if (player.paused) {
      userStarted = true;
      player.play();
      playFace.textContent = "暫停";
    } else {
      player.pause();
      playFace.textContent = "播放";
    }
  });
  nextBtn.addEventListener("click", function () { nextStory(); });
  player.addEventListener("ended", function () { nextStory(); });
  player.addEventListener("play", function () { playFace.textContent = "暫停"; });
  player.addEventListener("pause", function () { if (!player.ended) playFace.textContent = "播放"; });

  if (currentId) showStory(currentId);
  else {
    window.FamiGate.api("/api/night", key, { timeout: 8000 }).then(function (x) {
      if (x.j && x.j.id) showStory(x.j.id);
    });
  }
})();
