/* Silver Play — theme.js
   Vanilla JS for every interactive, user-facing effect on the home page:
   header pin/mobile-nav, reveal-on-scroll, tab switcher, flip cards,
   draggable strips, dark/journal carousels, testimonial clothesline modal,
   FAQ accordion, effortless-elegance thumb preview. No build step required. */
(function () {
  "use strict";

  /* ---------------- Header pin + mobile menu ---------------- */
  function initHeader() {
    var bar = document.querySelector("[data-header-bar]");
    var burger = document.querySelector("[data-menu-open]");
    var closeBtn = document.querySelector("[data-menu-close]");
    var menu = document.querySelector("[data-mobile-menu]");
    if (!bar) return;

    var hero = document.querySelector("[data-page-hero]");

    // No hero at all on the page (e.g. the single product page): there is
    // nothing for the transparent look to sit over, so start solid brown
    // instead of transparent, then settle into the same pinned pill after
    // a much shorter scroll (no banner height to wait out).
    if (!hero) bar.classList.add("no-hero");
    else bar.classList.remove("no-hero");

    // The cinematic hero (homepage only) reports its own pin-release
    // offset on window.__heroScrollEnd once initCinematicHero() measures
    // it (matches the source's ScrollTrigger self.end). Everywhere else,
    // fall back to the real height of whatever page hero is on screen.
    function onScroll() {
      var threshold = window.__heroScrollEnd;
      if (threshold == null) {
        threshold = hero ? hero.offsetTop + hero.offsetHeight - 1 : 60;
      }
      if (window.scrollY > threshold) bar.classList.add("is-pinned");
      else bar.classList.remove("is-pinned");
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    if (burger && menu) {
      burger.addEventListener("click", function () { menu.classList.add("is-open"); });
    }
    if (closeBtn && menu) {
      closeBtn.addEventListener("click", function () { menu.classList.remove("is-open"); });
    }
  }

  /* ---------------- Reveal on scroll ---------------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- Tabs (Fresh Edit) ---------------- */
  function initTabs() {
    document.querySelectorAll("[data-tabs]").forEach(function (group) {
      var pills = group.querySelectorAll("[data-tab-btn]");
      var panels = group.querySelectorAll("[data-tab-panel]");
      pills.forEach(function (pill) {
        pill.addEventListener("click", function () {
          var key = pill.getAttribute("data-tab-btn");
          pills.forEach(function (p) { p.classList.toggle("is-active", p === pill); });
          panels.forEach(function (panel) {
            panel.classList.toggle("is-active", panel.getAttribute("data-tab-panel") === key);
          });
        });
      });
    });
  }

  /* ---------------- Flip cards (Archive Treasure) ---------------- */
  function initFlipCards() {
    document.querySelectorAll(".flip-card").forEach(function (card) {
      card.addEventListener("click", function () { card.classList.toggle("is-flipped"); });
      card.setAttribute("tabindex", "0");
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.classList.toggle("is-flipped");
        }
      });
    });
  }

  /* ---------------- Generic drag-to-scroll strip ---------------- */
  function initDragScroll(selector) {
    document.querySelectorAll(selector).forEach(function (wrap) {
      var isDown = false, startX, scrollLeft;
      wrap.addEventListener("pointerdown", function (e) {
        isDown = true;
        wrap.setPointerCapture(e.pointerId);
        startX = e.clientX;
        scrollLeft = wrap.scrollLeft;
        wrap.style.cursor = "grabbing";
      });
      wrap.addEventListener("pointermove", function (e) {
        if (!isDown) return;
        wrap.scrollLeft = scrollLeft - (e.clientX - startX);
      });
      function end() { isDown = false; wrap.style.cursor = "grab"; }
      wrap.addEventListener("pointerup", end);
      wrap.addEventListener("pointerleave", end);
    });
  }

  /* ---------------- Carousel arrows (Royal Simplicity / Journal) ---------------- */
  function initCarouselArrows() {
    document.querySelectorAll("[data-carousel]").forEach(function (carousel) {
      var track = carousel.querySelector("[data-carousel-track]");
      var prev = carousel.querySelector("[data-carousel-prev]");
      var next = carousel.querySelector("[data-carousel-next]");
      if (!track) return;
      function cardWidth() {
        var card = track.children[0];
        if (!card) return 320;
        var style = getComputedStyle(track);
        var gap = parseFloat(style.columnGap || style.gap || "24");
        return card.getBoundingClientRect().width + gap;
      }
      if (prev) prev.addEventListener("click", function () { track.scrollBy({ left: -cardWidth(), behavior: "smooth" }); });
      if (next) next.addEventListener("click", function () { track.scrollBy({ left: cardWidth(), behavior: "smooth" }); });
    });
  }

  /* ---------------- Testimonials: open/close expanded note ---------------- */
  function initTestimonials() {
    var overlay = document.querySelector("[data-voice-overlay]");
    if (!overlay) return;
    var overlayPaper = overlay.querySelector("[data-voice-overlay-paper]");
    var quoteEl = overlay.querySelector("[data-voice-quote]");
    var attrEl = overlay.querySelector("[data-voice-attribution]");

    document.querySelectorAll("[data-voice-card]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        quoteEl.textContent = btn.getAttribute("data-quote");
        attrEl.textContent = btn.getAttribute("data-attribution");
        overlay.classList.add("is-open");
        overlay.style.display = "flex";
      });
    });
    function close() {
      overlay.classList.remove("is-open");
      overlay.style.display = "none";
    }
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });
    if (overlayPaper) overlayPaper.addEventListener("click", close);
  }

  /* ---------------- FAQ accordion ---------------- */
  function initFaq() {
    document.querySelectorAll(".faq-row").forEach(function (row) {
      function open() {
        document.querySelectorAll(".faq-row").forEach(function (r) { r.classList.remove("is-active"); });
        row.classList.add("is-active");
      }
      function close() { row.classList.remove("is-active"); }
      row.addEventListener("mouseenter", open);
      row.addEventListener("mouseleave", close);
      var top = row.querySelector(".faq-row__top");
      if (top) top.addEventListener("click", function () {
        row.classList.contains("is-active") ? close() : open();
      });
    });
  }

  /* ---------------- Effortless Elegance thumb preview ---------------- */
  function initEffortlessPreview() {
    var preview = document.querySelector("[data-effortless-preview]");
    if (!preview) return;
    var img = preview.querySelector("img");
    document.querySelectorAll("[data-effortless-thumb]").forEach(function (thumb) {
      thumb.addEventListener("mouseenter", function () {
        document.querySelectorAll("[data-effortless-thumb]").forEach(function (t) { t.classList.remove("is-active"); });
        thumb.classList.add("is-active");
        var src = thumb.getAttribute("data-image");
        if (src && img) img.src = src;
      });
    });
  }

  /* ---------------- Stone guide explorer (thumb hover/tap swaps detail panel) ---------------- */
  function initStoneExplorer() {
    document.querySelectorAll("[data-stone-explorer]").forEach(function (root) {
      var thumbs = root.querySelectorAll("[data-stone-thumb]");
      var panels = root.querySelectorAll("[data-stone-panel]");
      function activate(target) {
        thumbs.forEach(function (t) {
          var isActive = t.getAttribute("data-stone-target") === target;
          t.classList.toggle("is-active", isActive);
          t.setAttribute("aria-pressed", isActive ? "true" : "false");
        });
        panels.forEach(function (p) {
          p.hidden = p.id !== target;
        });
      }
      thumbs.forEach(function (thumb) {
        var target = thumb.getAttribute("data-stone-target");
        thumb.addEventListener("mouseenter", function () { activate(target); });
        thumb.addEventListener("focus", function () { activate(target); });
        thumb.addEventListener("click", function () { activate(target); });
      });
    });
  }

  /* ---------------- Ajax Cart (drawer + quick add + cart page) ---------------- */
  var moneyFormat = window.Shopify && Shopify.money_format ? Shopify.money_format : "₹{{amount}}";
  function formatMoney(cents) {
    var amount = (cents / 100).toFixed(2);
    var parts = amount.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return moneyFormat.replace(/\{\{\s*amount\s*\}\}/, parts[0] + "." + parts[1]);
  }

  function setCartCount(count) {
    document.querySelectorAll("[data-cart-count]").forEach(function (el) { el.textContent = count; });
  }

  function openCartDrawer() {
    var drawer = document.querySelector("[data-cart-drawer]");
    if (!drawer) return;
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeCartDrawer() {
    var drawer = document.querySelector("[data-cart-drawer]");
    if (!drawer) return;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function renderCartDrawer(cart) {
    var body = document.querySelector("[data-cart-drawer-body]");
    var subtotalEl = document.querySelector("[data-cart-drawer-subtotal]");
    var foot = document.querySelector("[data-cart-drawer-foot]");
    if (!body) return;
    setCartCount(cart.item_count);
    if (subtotalEl) subtotalEl.textContent = formatMoney(cart.total_price);
    if (foot) foot.style.display = cart.item_count === 0 ? "none" : "";

    if (cart.item_count === 0) {
      var emptyTpl = document.querySelector("[data-cart-drawer-empty-template]");
      body.innerHTML = emptyTpl ? emptyTpl.innerHTML : "<p>Your bag is empty.</p>";
      return;
    }

    var lineTpl = document.querySelector("[data-cart-drawer-line-template]");
    if (!lineTpl) return;
    body.innerHTML = "";
    cart.items.forEach(function (item) {
      var node = lineTpl.content.cloneNode(true);
      var root = node.querySelector("[data-cart-line]");
      root.setAttribute("data-key", item.key);
      var urlEls = node.querySelectorAll("[data-cart-line-url]");
      urlEls.forEach(function (a) { a.setAttribute("href", item.url); });
      var img = node.querySelector("[data-cart-line-image]");
      if (img) { img.src = item.image || ""; img.alt = item.title; }
      var titleEl = node.querySelector("[data-cart-line-title]");
      if (titleEl) titleEl.textContent = item.product_title || item.title;
      var variantEl = node.querySelector("[data-cart-line-variant]");
      if (variantEl) variantEl.textContent = item.variant_title && item.variant_title !== "Default Title" ? item.variant_title : "";
      var qtyEl = node.querySelector("[data-cart-line-qty]");
      if (qtyEl) qtyEl.textContent = item.quantity;
      var priceEl = node.querySelector("[data-cart-line-price]");
      if (priceEl) priceEl.textContent = formatMoney(item.final_line_price);
      var dec = node.querySelector("[data-cart-line-decrease]");
      var inc = node.querySelector("[data-cart-line-increase]");
      var rem = node.querySelector("[data-cart-line-remove]");
      if (dec) dec.addEventListener("click", function () { changeCartLine(item.key, item.quantity - 1); });
      if (inc) inc.addEventListener("click", function () { changeCartLine(item.key, item.quantity + 1); });
      if (rem) rem.addEventListener("click", function () { changeCartLine(item.key, 0); });
      body.appendChild(node);
    });
  }

  function refreshCart(openDrawer) {
    fetch("/cart.js")
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        renderCartDrawer(cart);
        if (openDrawer) openCartDrawer();
      })
      .catch(function () {});
  }

  function changeCartLine(key, quantity) {
    return fetch("/cart/change.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: key, quantity: quantity }),
    })
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        renderCartDrawer(cart);
        updateCartPage(cart, key, quantity);
        return cart;
      })
      .catch(function () {});
  }

  function updateCartPage(cart, key, quantity) {
    var page = document.querySelector("[data-cart-page-lines]");
    if (!page) return;
    var lineEl = page.querySelector('[data-cart-line][data-key="' + key + '"]');
    var subtotalEl = document.querySelector("[data-cart-subtotal]");
    if (subtotalEl) subtotalEl.textContent = formatMoney(cart.total_price);
    if (!lineEl) return;
    if (quantity <= 0 || cart.item_count === 0) {
      if (cart.item_count === 0) { window.location.reload(); return; }
      lineEl.remove();
      return;
    }
    var item = cart.items.filter(function (i) { return i.key === key; })[0];
    if (!item) return;
    var qtyEl = lineEl.querySelector("[data-cart-line-qty]");
    if (qtyEl) qtyEl.textContent = item.quantity;
    var priceEl = lineEl.querySelector(".cart-line__price");
    if (priceEl) priceEl.textContent = formatMoney(item.final_line_price);
  }

  function addToCart(variantId, quantity, button) {
    if (!variantId) return;
    if (button) { button.classList.add("is-loading"); }
    return fetch("/cart/add.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: variantId, quantity: quantity || 1 }),
    })
      .then(function (r) { return r.json().then(function (data) { return { ok: r.ok, data: data }; }); })
      .then(function (result) {
        if (button) button.classList.remove("is-loading");
        if (!result.ok) throw new Error((result.data && result.data.description) || "Could not add to bag");
        refreshCart(true);
        return result.data;
      })
      .catch(function (err) {
        if (button) button.classList.remove("is-loading");
        return Promise.reject(err);
      });
  }

  function initCartDrawer() {
    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-cart-drawer-open]")) {
        e.preventDefault();
        refreshCart(true);
      }
      if (e.target.closest("[data-cart-drawer-close]")) {
        closeCartDrawer();
      }
    });
    refreshCart(false);
  }

  function initQuickAdd() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-quick-add]");
      if (!btn) return;
      e.preventDefault();
      var variantId = btn.getAttribute("data-variant-id");
      addToCart(variantId, 1, btn).catch(function () {
        btn.textContent = "Unavailable";
        setTimeout(function () { btn.textContent = "Quick Add"; }, 1800);
      });
    });
  }

  /* ---------------- Cart page: quantity/remove without reload ---------------- */
  function initCartPage() {
    var page = document.querySelector("[data-cart-page-lines]");
    if (!page) return;
    page.addEventListener("click", function (e) {
      var stepper = e.target.closest("[data-cart-qty-stepper]");
      var removeBtn = e.target.closest("[data-cart-line-remove]");
      if (removeBtn) {
        changeCartLine(removeBtn.getAttribute("data-key"), 0);
        return;
      }
      if (!stepper) return;
      var key = stepper.getAttribute("data-key");
      var qtyEl = stepper.querySelector("[data-cart-line-qty]");
      var qty = parseInt(qtyEl.textContent, 10) || 1;
      if (e.target.closest("[data-cart-line-decrease]")) changeCartLine(key, Math.max(0, qty - 1));
      if (e.target.closest("[data-cart-line-increase]")) changeCartLine(key, qty + 1);
    });
  }

  /* ---------------- Product page: gallery, variants, add to cart ---------------- */
  function initProductPage() {
    var page = document.querySelector("[data-product-page]");
    if (!page) return;

    var mainImg = document.getElementById("ProductMainImage");
    document.querySelectorAll("[data-product-thumb]").forEach(function (thumb) {
      thumb.addEventListener("click", function () {
        document.querySelectorAll("[data-product-thumb]").forEach(function (t) { t.classList.remove("is-active"); });
        thumb.classList.add("is-active");
        if (mainImg) mainImg.src = thumb.getAttribute("data-full-src");
      });
    });

    var form = page.querySelector("[data-product-form]");
    if (!form) return;
    var variantInput = form.querySelector("[data-product-variant-id]");
    var qtyInput = form.querySelector("[data-qty-input]");
    var stepper = form.querySelector("[data-product-qty-stepper]");
    var addBtn = form.querySelector("[data-product-add-to-cart]");
    var addText = form.querySelector("[data-add-to-cart-text]");
    var message = form.querySelector("[data-product-form-message]");

    if (stepper) {
      stepper.querySelector("[data-qty-decrease]").addEventListener("click", function () {
        qtyInput.value = Math.max(1, (parseInt(qtyInput.value, 10) || 1) - 1);
      });
      stepper.querySelector("[data-qty-increase]").addEventListener("click", function () {
        qtyInput.value = (parseInt(qtyInput.value, 10) || 1) + 1;
      });
    }

    // Variant option pills — resolve the matching variant from the product's variants JSON.
    var optionGroups = form.querySelectorAll("[data-product-option]");
    var variantsScript = page.querySelector("[data-product-variants-json]");
    var variants = [];
    try { variants = variantsScript ? JSON.parse(variantsScript.textContent) : []; } catch (e) { variants = []; }
    var priceEl = page.querySelector("[data-product-price]");
    var availabilityEl = page.querySelector("[data-product-availability]");

    function currentSelection() {
      var selection = [];
      optionGroups.forEach(function (group) {
        var active = group.querySelector("[data-option-value].is-active");
        selection.push(active ? active.getAttribute("data-option-value") : null);
      });
      return selection;
    }

    function findMatchingVariant() {
      if (!variants.length) return null;
      var selection = currentSelection();
      return variants.filter(function (v) {
        var opts = [v.option1, v.option2, v.option3];
        return selection.every(function (val, i) { return val == null || opts[i] === val; });
      })[0] || null;
    }

    function applyVariant(variant) {
      if (!variant) {
        if (variantInput) variantInput.value = "";
        if (addBtn) addBtn.setAttribute("disabled", "disabled");
        if (addText) addText.textContent = "Unavailable";
        return;
      }
      if (variantInput) variantInput.value = variant.id;
      if (priceEl) {
        var html = formatMoney(variant.price);
        if (variant.compare_at_price && variant.compare_at_price > variant.price) {
          html += ' <span class="product-card__compare">' + formatMoney(variant.compare_at_price) + "</span>";
        }
        priceEl.innerHTML = html;
      }
      if (availabilityEl) availabilityEl.textContent = variant.available ? "In Stock" : "Sold Out";
      if (addBtn && addText) {
        if (variant.available) { addBtn.removeAttribute("disabled"); addText.textContent = "Add To Bag"; }
        else { addBtn.setAttribute("disabled", "disabled"); addText.textContent = "Sold Out"; }
      }
    }

    if (optionGroups.length) {
      optionGroups.forEach(function (group) {
        group.querySelectorAll("[data-option-value]").forEach(function (pill) {
          pill.addEventListener("click", function () {
            group.querySelectorAll("[data-option-value]").forEach(function (p) { p.classList.remove("is-active"); });
            pill.classList.add("is-active");
            applyVariant(findMatchingVariant());
          });
        });
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!variantInput || !variantInput.value) return;
      var qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
      if (message) { message.textContent = ""; message.className = "product-page__form-message"; }
      if (addText) addText.textContent = "Adding…";
      addToCart(variantInput.value, qty, addBtn)
        .then(function () {
          if (addText) addText.textContent = "Added";
          if (message) { message.textContent = "Added to your bag."; message.className = "product-page__form-message is-success"; }
          setTimeout(function () { if (addText) addText.textContent = "Add To Bag"; }, 1800);
        })
        .catch(function (err) {
          if (addText) addText.textContent = "Add To Bag";
          if (message) { message.textContent = err.message || "Could not add to bag."; message.className = "product-page__form-message is-error"; }
        });
    });

    // Load live recommendations to replace the fallback grid.
    var rec = document.querySelector("[data-product-recommendations]");
    if (rec) {
      var url = rec.getAttribute("data-url");
      fetch(url)
        .then(function (r) { return r.text(); })
        .then(function (html) {
          var doc = new DOMParser().parseFromString(html, "text/html");
          var newGrid = doc.querySelector("[data-product-recommendations-grid]");
          var grid = rec.querySelector("[data-product-recommendations-grid]");
          if (newGrid && grid && newGrid.children.length) grid.innerHTML = newGrid.innerHTML;
        })
        .catch(function () {});
    }
  }

  /* ---------------- Predictive search ---------------- */
  function initPredictiveSearch() {
    var panel = document.querySelector("[data-search-panel]");
    if (!panel) return;
    var input = panel.querySelector("[data-predictive-search-input]");
    var results = panel.querySelector("[data-predictive-search-results]");
    var timer;

    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-search-open]")) {
        panel.classList.add("is-open");
        panel.setAttribute("aria-hidden", "false");
        setTimeout(function () { input && input.focus(); }, 50);
      }
      if (e.target.closest("[data-search-close]")) {
        panel.classList.remove("is-open");
        panel.setAttribute("aria-hidden", "true");
      }
    });

    if (!input) return;
    input.addEventListener("input", function () {
      var q = input.value.trim();
      clearTimeout(timer);
      if (q.length < 2) { results.innerHTML = ""; return; }
      timer = setTimeout(function () {
        fetch("/search/suggest.json?q=" + encodeURIComponent(q) + "&resources[type]=product,article,page&resources[limit]=6")
          .then(function (r) { return r.json(); })
          .then(function (data) {
            var res = data.resources && data.resources.results;
            if (!res) { results.innerHTML = ""; return; }
            var items = (res.products || []).concat(res.articles || [], res.pages || []);
            if (!items.length) {
              results.innerHTML = '<p class="search-panel__empty">No results for &ldquo;' + q + '&rdquo;</p>';
              return;
            }
            results.innerHTML = items.map(function (item) {
              var img = item.image ? '<img src="' + item.image + '" alt="">' : "";
              var price = item.price ? '<p class="search-panel__result-price">' + formatMoney(item.price) + '</p>' : "";
              return '<a class="search-panel__result" href="' + item.url + '">' + img +
                '<span><span class="search-panel__result-title">' + item.title + '</span>' + price + '</span></a>';
            }).join("");
          })
          .catch(function () {});
      }, 220);
    });
  }

  /* ---------------- Cinematic hero: scroll-scrub approximation ----------
     Vanilla-JS stand-in for the source's GSAP ScrollTrigger pin + video
     currentTime scrub (see CinematicHero.tsx). While the visitor scrolls
     through the tall `.hero-pin` track (CSS keeps `.hero` sticky for that
     range), this:
       1. Scrubs the hero video's currentTime in proportion to scroll
          progress through the track (eased toward the target each frame,
          not snapped — same 0.3 lerp factor and 1/30s min-seek-delta the
          source uses, to avoid seek-flooding on fast scroll).
       2. Fades + parallaxes the text/CTA block out as the video takes
          over, and fades the "scroll to discover" cue out as soon as the
          visitor starts scrolling.
     Simplification vs. source: one static content block (title/sub/CTA)
     fading out, not five crossfading text "chapters" — see README. */
  function initCinematicHero() {
    var wrap = document.querySelector("[data-hero-pin]");
    var video = document.querySelector("[data-hero-video]");
    var content = document.querySelector("[data-hero-content]");
    var cue = document.querySelector("[data-hero-cue]");
    if (!wrap || !video) return;

    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return; // CSS drops the pin track; video just autoplay-loops.

    var MIN_SEEK_DELTA = 1 / 30;
    var duration = 0;
    var targetProgress = 0;
    var appliedTime = -1;
    var lastAppliedTime = -1;
    var cueHidden = false;
    var rafId = 0;

    video.addEventListener("loadedmetadata", function () {
      duration = video.duration || 0;
    });
    // Unlock frame decoding on iOS Safari (a seek before any play() call
    // shows nothing there) without ever letting the video advance on its
    // own: play then immediately pause, before the next paint.
    var playPromise = video.play();
    if (playPromise && playPromise.then) {
      playPromise.then(function () { video.pause(); }).catch(function () {});
    } else {
      video.pause();
    }

    function measure() {
      var rect = wrap.getBoundingClientRect();
      var wrapTop = rect.top + window.scrollY;
      var pinRange = wrap.offsetHeight - window.innerHeight;
      pinRange = pinRange > 0 ? pinRange : 1;
      // Header reads this to know when the hero has fully scrolled past
      // (see initHeader) — same role as the source's ScrollTrigger onRefresh
      // writing self.end here.
      window.__heroScrollEnd = wrapTop + pinRange;
      return { wrapTop: wrapTop, pinRange: pinRange };
    }

    var m = measure();

    function onScroll() {
      var progress = (window.scrollY - m.wrapTop) / m.pinRange;
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;
      targetProgress = progress;

      if (!cueHidden && progress > 0.01 && cue) {
        cueHidden = true;
        cue.style.transition = "opacity .6s ease-out";
        cue.style.opacity = "0";
      } else if (cueHidden && progress <= 0.01 && cue) {
        cueHidden = false;
        cue.style.opacity = "1";
      }

      if (content) {
        // Visible through the first ~12% of the track, faded and lifted
        // out by ~40% — leaves the video as the sole subject for the rest
        // of the pinned scroll, then the section releases into the page.
        var fadeStart = 0.12, fadeEnd = 0.4;
        var opacity = 1;
        if (progress > fadeStart) {
          opacity = 1 - Math.min(1, (progress - fadeStart) / (fadeEnd - fadeStart));
        }
        content.style.opacity = String(opacity);
        content.style.transform = "translateY(" + (-40 * (1 - opacity)) + "px)";
        content.style.pointerEvents = opacity > 0.6 ? "auto" : "none";
      }
    }

    function tick() {
      rafId = requestAnimationFrame(tick);
      if (!duration || video.readyState < 2) return;
      var targetTime = targetProgress * duration;
      appliedTime = appliedTime < 0 ? targetTime : appliedTime + (targetTime - appliedTime) * 0.3;
      if (Math.abs(appliedTime - lastAppliedTime) < MIN_SEEK_DELTA) return;
      try {
        video.currentTime = appliedTime;
        lastAppliedTime = appliedTime;
      } catch (e) {
        /* seeking can throw mid-load; next tick retries */
      }
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () {
      m = measure();
      onScroll();
    });
    rafId = requestAnimationFrame(tick);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initHeader();
    initCinematicHero();
    initReveal();
    initTabs();
    initFlipCards();
    initDragScroll("[data-drag-scroll]");
    initCarouselArrows();
    initTestimonials();
    initFaq();
    initEffortlessPreview();
    initStoneExplorer();
    initCartDrawer();
    initQuickAdd();
    initCartPage();
    initProductPage();
    initPredictiveSearch();
  });
})();
