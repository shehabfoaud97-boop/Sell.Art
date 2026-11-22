(function () {
  "use strict";
  var S = window.SITE || {};
  var ART = window.ARTWORKS || [];

  var SHOP_LABELS = {
    redbubble: "Redbubble",
    society6: "Society6",
    inprnt: "INPRNT",
    etsy: "Etsy",
    kofi: "Ko-fi",
    gumroad: "Gumroad"
  };
  var SHOP_BLURBS = {
    redbubble: "Prints, stickers, apparel",
    society6: "Art prints & home decor",
    inprnt: "Gallery-quality prints",
    etsy: "Prints & digital downloads",
    kofi: "Support me & shop",
    gumroad: "Digital downloads"
  };
  var SOCIAL_LABELS = { instagram: "Instagram", tiktok: "TikTok", x: "X" };

  function $(id) { return document.getElementById(id); }
  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "class") n.className = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    if (text != null) n.textContent = text;
    return n;
  }
  function link(href, text, cls) {
    var a = el("a", { href: href, class: cls || "", target: "_blank", rel: "noopener" }, text);
    return a;
  }

  // ---- Basic text ----
  var name = S.artistName || "Artist";
  document.querySelectorAll("[data-artist-name]").forEach(function (n) { n.textContent = name; });
  document.querySelectorAll("[data-tagline]").forEach(function (n) { n.textContent = S.tagline || ""; });
  document.querySelectorAll("[data-about]").forEach(function (n) { n.textContent = S.about || ""; });
  document.title = name + " · Art, Prints & Commissions";
  $("year").textContent = new Date().getFullYear();

  // ---- Hero ----
  if (ART.length) {
    $("hero-img").src = ART[0].image;
    $("hero-img").alt = ART[0].title;
  }

  // ---- Gallery ----
  var activeTag = "all";
  var tags = ["all"];
  ART.forEach(function (a) {
    (a.tags || []).forEach(function (t) { if (tags.indexOf(t) < 0) tags.push(t); });
  });
  if (tags.length > 2) {
    tags.forEach(function (t) {
      var b = el("button", { type: "button", class: "chip", "aria-pressed": String(t === "all") }, t);
      b.addEventListener("click", function () {
        activeTag = t;
        document.querySelectorAll(".chip").forEach(function (c) {
          c.setAttribute("aria-pressed", String(c.textContent === t));
        });
        renderGrid();
      });
      $("filters").appendChild(b);
    });
  }

  function renderGrid() {
    var grid = $("grid");
    grid.innerHTML = "";
    ART.forEach(function (a, i) {
      if (activeTag !== "all" && (a.tags || []).indexOf(activeTag) < 0) return;
      var card = el("button", { type: "button", class: "card", "aria-label": "View " + a.title });
      var img = el("img", { src: a.image, alt: a.title, loading: "lazy" });
      card.appendChild(img);
      var cap = el("span", { class: "card-cap" });
      cap.appendChild(el("span", { class: "card-title" }, a.title));
      cap.appendChild(el("span", { class: "card-price" }, a.sold ? "Original sold" : (a.price || "")));
      card.appendChild(cap);
      card.addEventListener("click", function () { openLightbox(i); });
      grid.appendChild(card);
    });
  }
  renderGrid();

  // ---- Lightbox ----
  var lb = $("lightbox");
  function openLightbox(i) {
    var a = ART[i];
    $("lb-img").src = a.image;
    $("lb-img").alt = a.title;
    $("lb-title").textContent = a.title;
    $("lb-meta").textContent = [a.medium, a.year].filter(Boolean).join(" · ");
    $("lb-desc").textContent = a.description || "";
    $("lb-price").textContent = a.price || "";
    var acts = $("lb-actions");
    acts.innerHTML = "";
    if (a.printUrl) acts.appendChild(link(a.printUrl, "Buy a print", "btn btn-primary"));
    if (a.downloadUrl) acts.appendChild(link(a.downloadUrl, "Digital download", "btn btn-ghost"));
    if (!a.printUrl && !a.downloadUrl) {
      var ask = el("a", { href: "#commissions", class: "btn btn-ghost" }, "Ask about a print");
      ask.addEventListener("click", function () { lb.close(); });
      acts.appendChild(ask);
    }
    if (typeof lb.showModal === "function") lb.showModal(); else lb.setAttribute("open", "");
  }
  $("lb-close").addEventListener("click", function () { lb.close(); });
  lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });

  // ---- Shop ----
  var shops = S.shops || {};
  var anyShop = false;
  Object.keys(shops).forEach(function (k) {
    if (!shops[k]) return;
    anyShop = true;
    var a = link(shops[k], "", "shop-card");
    a.appendChild(el("span", { class: "shop-name" }, SHOP_LABELS[k] || k));
    a.appendChild(el("span", { class: "muted small" }, SHOP_BLURBS[k] || "Visit shop"));
    $("shop-links").appendChild(a);
  });
  $("shop-empty").hidden = anyShop;

  // ---- Commissions ----
  var c = S.commissions || { open: false, tiers: [] };
  var status = $("comm-status");
  status.textContent = c.open ? "Open" : "Closed";
  status.classList.add(c.open ? "open" : "closed");
  (c.tiers || []).forEach(function (t) {
    var d = el("div", { class: "tier" });
    d.appendChild(el("span", { class: "tier-name" }, t.name));
    d.appendChild(el("span", { class: "tier-price" }, t.price));
    d.appendChild(el("span", { class: "muted small" }, t.detail));
    $("tiers").appendChild(d);
    $("tier-select").appendChild(el("option", { value: t.name }, t.name + " (" + t.price + ")"));
  });
  $("tier-select").appendChild(el("option", { value: "Other" }, "Something else"));

  var form = $("comm-form");
  if (!c.open) {
    form.querySelectorAll("input,select,textarea,button").forEach(function (n) { n.disabled = true; });
    $("form-note").textContent = "Commissions are currently closed. Check back soon!";
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    var f = new FormData(form);
    if (!S.email) {
      $("form-note").textContent = "The artist hasn't set a contact email yet. Please reach out via social media below.";
      return;
    }
    var subject = "Commission request: " + f.get("tier");
    var body = "Name: " + f.get("name") + "\nEmail: " + f.get("email") +
      "\nType: " + f.get("tier") + "\n\nIdea:\n" + f.get("idea");
    window.location.href = "mailto:" + S.email +
      "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    $("form-note").textContent = "Opening your email app… If nothing happens, email " + S.email + " directly.";
  });

  // ---- Social ----
  var social = S.social || {};
  Object.keys(social).forEach(function (k) {
    if (social[k]) $("social").appendChild(link(social[k], SOCIAL_LABELS[k] || k));
  });
})();
