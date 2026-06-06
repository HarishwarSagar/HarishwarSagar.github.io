/* Harishwar Sagar — portfolio interactions (vanilla JS, no deps) */
(function () {
  "use strict";

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Sticky nav background after scroll
  var nav = document.getElementById("nav");
  var onScroll = function () {
    if (window.scrollY > 24) nav.classList.add("is-stuck");
    else nav.classList.remove("is-stuck");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu toggle
  var toggle = document.getElementById("navToggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll(".nav__links a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Scroll-reveal
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Active nav link via section observation
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = {};
  document.querySelectorAll(".nav__links a").forEach(function (a) {
    navLinks[a.getAttribute("href")] = a;
  });
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var link = navLinks["#" + e.target.id];
        if (!link) return;
        if (e.isIntersecting) {
          Object.keys(navLinks).forEach(function (k) { navLinks[k].classList.remove("is-active"); });
          link.classList.add("is-active");
        }
      });
    }, { threshold: 0.5 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  // Lightbox for certificate / proof images
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = lightbox ? lightbox.querySelector("img") : null;
  var closeBtn = lightbox ? lightbox.querySelector(".lightbox__close") : null;
  document.querySelectorAll(".shot").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var img = btn.querySelector("img");
      if (!img || btn.classList.contains("is-empty") || !lightbox) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || "";
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
    });
  });
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";
  }
  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (lightbox) lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeLightbox(); });

  // Back to top
  var toTop = document.getElementById("toTop");
  if (toTop) toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ====================================================================
  // Cinematic hero parallax
  // One cohesive motion: every layer drifts UP together, at different
  // depths, with easing. The name leads (rises and clears the head first),
  // the photo follows slowly, the copy and stats trail and fade — so the
  // scene feels spacious and settled, never cluttered.
  // ====================================================================
  var hero = document.getElementById("hero");
  var nameBack = document.getElementById("nameBack");
  var heroPhoto = document.getElementById("heroPhoto");
  var heroOrbit = document.getElementById("heroOrbit");
  var heroContent = document.getElementById("heroContent");
  var scrollCue = document.getElementById("scrollCue");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isDesktop = function () { return window.innerWidth > 940; };

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function setLayer(el, py, ps, po) {
    if (!el) return;
    el.style.setProperty("--py", py.toFixed(1) + "px");
    if (ps !== null) el.style.setProperty("--ps", ps.toFixed(3));
    if (po !== null) el.style.setProperty("--po", po.toFixed(3));
  }
  function clearLayer(el) {
    if (!el) return;
    el.style.removeProperty("--py");
    el.style.removeProperty("--ps");
    el.style.removeProperty("--po");
  }

  if (hero && !reduce && "requestAnimationFrame" in window) {
    var ticking = false;

    var render = function () {
      ticking = false;

      // On mobile the hero is a normal stacked flow — no parallax.
      if (!isDesktop()) {
        clearLayer(nameBack); clearLayer(heroPhoto);
        clearLayer(heroOrbit); clearLayer(heroContent);
        if (scrollCue) scrollCue.style.removeProperty("--po");
        return;
      }

      var vh = window.innerHeight || 1;
      // The whole effect plays out over the first ~95% of a viewport of scroll.
      var p = clamp(window.scrollY / (vh * 0.95), 0, 1);
      var e = easeOutCubic(p);

      // Name: leads the motion, rises well clear, fades only in the back third.
      var nameFade = e < 0.4 ? 0.92 : Math.max(0, 0.92 * (1 - (e - 0.4) / 0.6));
      setLayer(nameBack, -e * vh * 0.42, 1 + e * 0.06, nameFade);

      // Photo: deepest layer, drifts slowly, softens gently.
      setLayer(heroPhoto, -e * vh * 0.15, 1 - e * 0.04, 1 - e * 0.45);

      // Stats: mid layer, lift and fade out.
      setLayer(heroOrbit, -e * vh * 0.26, null, clamp(1 - e * 1.25, 0, 1));

      // Copy: trails, fades as it leaves.
      setLayer(heroContent, -e * vh * 0.10, null, clamp(1 - e * 1.3, 0, 1));

      // Scroll cue: disappears almost immediately once scrolling starts.
      if (scrollCue) scrollCue.style.setProperty("--po", clamp(1 - e * 3, 0, 1).toFixed(3));
    };

    var onHeroScroll = function () {
      if (!ticking) { window.requestAnimationFrame(render); ticking = true; }
    };

    render();
    window.addEventListener("scroll", onHeroScroll, { passive: true });
    window.addEventListener("resize", render);
  }
})();
