(function () {
  var nav = document.getElementById("site-nav");
  var toggle = document.querySelector(".nav-toggle");
  var yearEl = document.getElementById("year");
  var mq = window.matchMedia("(max-width: 720px)");
  var skip = document.querySelector(".skip-link");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  function scrollToSectionId(id, smooth) {
    if (!id) return;
    var el = document.getElementById(id);
    if (!el) return;
    var behavior = smooth && !window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "smooth" : "auto";
    el.scrollIntoView({ behavior: behavior, block: "start" });
  }

  function readSectionFromUrl() {
    var params = new URLSearchParams(window.location.search);
    return params.get("section");
  }

  function applySectionFromUrl() {
    var section = readSectionFromUrl();
    if (section) {
      scrollToSectionId(section, true);
    }
  }

  function setUrlSection(sectionId) {
    var path = window.location.pathname || "./";
    var next = sectionId ? path + "?section=" + encodeURIComponent(sectionId) : path;
    window.history.pushState({ section: sectionId || "" }, "", next);
  }

  document.querySelectorAll('a[href^="?section="]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var href = link.getAttribute("href") || "";
      var match = /^\?section=([^&]+)/.exec(href);
      var id = match ? decodeURIComponent(match[1]) : null;
      if (!id) return;
      e.preventDefault();
      setUrlSection(id);
      scrollToSectionId(id, true);
      if (mq.matches && nav) {
        nav.classList.remove("is-open");
        syncNavA11y();
      }
    });
  });

  window.addEventListener("popstate", function () {
    applySectionFromUrl();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applySectionFromUrl);
  } else {
    applySectionFromUrl();
  }

  if (skip) {
    skip.addEventListener("click", function () {
      var main = document.getElementById("main");
      if (!main) return;
      main.focus({ preventScroll: true });
      main.scrollIntoView({ behavior: "auto", block: "start" });
    });
  }

  if (!nav || !toggle) return;

  function syncNavA11y() {
    if (!nav || !toggle) return;
    if (mq.matches) {
      var open = nav.classList.contains("is-open");
      nav.setAttribute("aria-hidden", open ? "false" : "true");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    } else {
      nav.removeAttribute("aria-hidden");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      nav.classList.remove("is-open");
    }
  }

  toggle.addEventListener("click", function () {
    if (!mq.matches) return;
    nav.classList.toggle("is-open");
    syncNavA11y();
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      if (mq.matches) {
        nav.classList.remove("is-open");
        syncNavA11y();
      }
    });
  });

  mq.addEventListener("change", syncNavA11y);
  syncNavA11y();
})();
