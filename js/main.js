// Nero — small progressive-enhancement behaviors. No framework, no build step.
(function () {
  "use strict";

  // Theme toggle: cycles light/dark, remembered per browser.
  var root = document.documentElement;
  var themeBtn = document.querySelector("[data-theme-toggle]");
  var savedTheme = null;
  try { savedTheme = localStorage.getItem("nero-theme"); } catch (e) {}
  if (savedTheme === "light" || savedTheme === "dark") root.setAttribute("data-theme", savedTheme);

  function currentTheme() {
    var attr = root.getAttribute("data-theme");
    if (attr) return attr;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("nero-theme", next); } catch (e) {}
    });
  }

  // Mobile nav drawer
  var menuBtn = document.querySelector("[data-menu-open]");
  var drawer = document.querySelector("[data-drawer]");
  var closeBtn = document.querySelector("[data-menu-close]");
  var scrim = drawer ? drawer.querySelector(".nr-drawer__scrim") : null;

  function openDrawer() {
    if (!drawer) return;
    drawer.setAttribute("data-open", "true");
    document.body.style.overflow = "hidden";
    if (closeBtn) closeBtn.focus();
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.setAttribute("data-open", "false");
    document.body.style.overflow = "";
    if (menuBtn) menuBtn.focus();
  }
  if (menuBtn) menuBtn.addEventListener("click", openDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  if (scrim) scrim.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && drawer && drawer.getAttribute("data-open") === "true") closeDrawer();
  });

  // Quantity steppers (product page, cart page)
  document.querySelectorAll("[data-stepper]").forEach(function (stepper) {
    var input = stepper.querySelector("input");
    var min = parseInt(input.min, 10) || 1;
    var max = parseInt(input.max, 10) || 99;
    stepper.querySelectorAll("button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var delta = btn.dataset.step === "up" ? 1 : -1;
        var value = (parseInt(input.value, 10) || min) + delta;
        input.value = Math.min(max, Math.max(min, value));
        input.dispatchEvent(new Event("change"));
      });
    });
  });

  // Product gallery: swap main image on thumbnail click
  document.querySelectorAll("[data-gallery]").forEach(function (gallery) {
    var main = gallery.querySelector("[data-gallery-main]");
    var thumbs = gallery.querySelectorAll("[data-gallery-thumb]");
    thumbs.forEach(function (thumb) {
      thumb.addEventListener("click", function () {
        thumbs.forEach(function (t) { t.setAttribute("aria-current", "false"); });
        thumb.setAttribute("aria-current", "true");
        if (main) main.className = "nr-media " + (thumb.dataset.shape || "");
      });
    });
  });

  // Cart line removal (demo only — no persistence/backend wired up)
  document.querySelectorAll("[data-cart-remove]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var row = btn.closest(".nr-cart__row");
      if (row) row.remove();
    });
  });
})();
