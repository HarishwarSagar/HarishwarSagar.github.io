/* ============================================================
   Harishwar Sagar — Portfolio interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---------- year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- mobile nav ---------- */
  var toggle = document.getElementById("navToggle");
  var mobile = document.getElementById("navMobile");
  function closeMobile() {
    if (!mobile) return;
    mobile.classList.remove("open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }
  if (toggle && mobile) {
    toggle.addEventListener("click", function () {
      var open = mobile.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mobile.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMobile);
    });
    document.addEventListener("click", function (e) {
      if (!mobile.contains(e.target) && !toggle.contains(e.target)) closeMobile();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMobile();
    });
  }

  /* ---------- scroll reveal (scroll-position based — robust everywhere) ---------- */
  var reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  var tItems = Array.prototype.slice.call(document.querySelectorAll(".timeline__item"));

  // stagger siblings for a gentle cascade
  reveals.forEach(function (el, i) {
    el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + "ms";
  });

  if (reduceMotion) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
    tItems.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var checkReveal = function () {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var trigger = vh * 0.92;
      var still = false;
      reveals.forEach(function (el) {
        if (el.classList.contains("is-in")) return;
        if (el.getBoundingClientRect().top < trigger) el.classList.add("is-in");
        else still = true;
      });
      tItems.forEach(function (el) {
        if (el.classList.contains("is-in")) return;
        if (el.getBoundingClientRect().top < trigger) el.classList.add("is-in");
        else still = true;
      });
      return still;
    };
    var ticking = false;
    var onRevealScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { checkReveal(); ticking = false; });
    };
    window.addEventListener("scroll", onRevealScroll, { passive: true });
    window.addEventListener("resize", onRevealScroll, { passive: true });
    // initial passes (cover late layout / font load)
    checkReveal();
    requestAnimationFrame(checkReveal);
    setTimeout(checkReveal, 250);
    window.addEventListener("load", function () { setTimeout(checkReveal, 60); });
    // failsafe: never leave content hidden (set inline styles directly, independent of CSS transitions)
    setTimeout(function () {
      var all = reveals.concat(tItems);
      all.forEach(function (el) {
        el.classList.add("is-in");
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    }, 4500);
    // also reveal everything if the tab was hidden on load and later becomes visible
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) { checkReveal(); }
    });
  }

  /* ---------- metric count-up ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 1400, start = null;
    var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { el.textContent = prefix + target + suffix; return; }
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.round(target * eased);
      el.textContent = prefix + val + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target + suffix;
    }
    requestAnimationFrame(step);
  }
  var counts = Array.prototype.slice.call(document.querySelectorAll(".metric__value[data-count]"));
  var countDone = [];
  var checkCounts = function () {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    counts.forEach(function (el, i) {
      if (countDone[i]) return;
      if (el.getBoundingClientRect().top < vh * 0.85) { countDone[i] = true; animateCount(el); }
    });
  };
  window.addEventListener("scroll", checkCounts, { passive: true });
  checkCounts();
  setTimeout(checkCounts, 300);
  setTimeout(function () { counts.forEach(function (el, i) { if (!countDone[i]) { countDone[i] = true; animateCount(el); } }); }, 4200);

  /* ---------- back to top ---------- */
  var toTop = document.getElementById("toTop");
  if (toTop) {
    var onScroll = function () {
      if (window.scrollY > 600) toTop.classList.add("show");
      else toTop.classList.remove("show");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
  }

  /* ---------- nav active link on scroll ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__links a[href^="#"]'));
  var navMap = navLinks.map(function (a) {
    return { a: a, sec: document.querySelector(a.getAttribute("href")) };
  }).filter(function (o) { return o.sec; });
  function setActive() {
    var pos = window.scrollY + (window.innerHeight || 0) * 0.32;
    var current = null;
    navMap.forEach(function (o) {
      if (o.sec.offsetTop <= pos) current = o.a;
    });
    navMap.forEach(function (o) {
      var on = o.a === current;
      o.a.style.color = on ? "var(--ink)" : "";
      o.a.style.background = on ? "rgba(245,237,226,.06)" : "";
    });
  }
  if (navMap.length) {
    window.addEventListener("scroll", setActive, { passive: true });
    setActive();
  }

  /* ---------- contact form ---------- */
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (status) { status.className = "form-status"; status.textContent = ""; }
      if (!form.checkValidity()) {
        if (status) { status.className = "form-status err"; status.textContent = "Please fill in the required fields."; }
        form.reportValidity();
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      var orig = btn ? btn.textContent : "";
      if (btn) { btn.textContent = "Sending…"; btn.disabled = true; }

      var action = form.getAttribute("action") || "";
      var usable = action && action.indexOf("your-id") === -1;

      if (!usable) {
        // No live endpoint configured yet — fail gracefully toward email.
        setTimeout(function () {
          if (status) {
            status.className = "form-status ok";
            status.innerHTML = 'Thanks! Form delivery isn\u2019t wired up yet — reach me directly at <a href="mailto:SagarHarishwar@gmail.com" style="color:inherit;text-decoration:underline">SagarHarishwar@gmail.com</a>.';
          }
          if (btn) { btn.textContent = orig; btn.disabled = false; }
        }, 600);
        return;
      }

      fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      }).then(function (res) {
        if (res.ok) {
          if (status) { status.className = "form-status ok"; status.textContent = "Thanks — I\u2019ll be in touch shortly."; }
          form.reset();
        } else {
          throw new Error("bad response");
        }
      }).catch(function () {
        if (status) { status.className = "form-status err"; status.textContent = "Something went wrong. Email me at SagarHarishwar@gmail.com."; }
      }).finally(function () {
        if (btn) { btn.textContent = orig; btn.disabled = false; }
      });
    });
  }
})();
