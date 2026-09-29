// Shoshie Ross · Creative Arts Therapy
// Mobile menu, draft banner, footer year and the enquiry form.

(function () {
  "use strict";

  // Web3Forms access key. This is a public identifier by design: it can only
  // ever deliver to the inbox it was created for, so it is safe in page code.
  var WEB3FORMS_KEY_PLACEHOLDER = "REPLACE_WITH_WEB3FORMS_ACCESS_KEY";
  var FALLBACK_EMAIL = "shoshie@shoshierossat.com";

  // ---- mobile menu ----
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  // ---- footer year ----
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  // ---- draft banner: shows while any "to confirm" text is left on the page ----
  var pending = document.querySelectorAll(".tbc").length;
  if (pending > 0) {
    var banner = document.createElement("div");
    banner.className = "draft-banner";
    banner.setAttribute("role", "note");
    banner.textContent = "Draft: " + pending + " highlighted item" + (pending === 1 ? "" : "s") + " to confirm on this page";
    document.body.appendChild(banner);
  }

  // ---- enquiry form ----
  var form = document.getElementById("enquiry-form");
  if (!form) return;

  var status = document.getElementById("form-status");
  var button = form.querySelector("button[type=submit]");

  function setStatus(message, isError) {
    status.textContent = message;
    status.classList.toggle("error", !!isError);
  }

  // Only flag fields as invalid once someone has interacted with them.
  form.querySelectorAll("input, select, textarea").forEach(function (el) {
    el.addEventListener("blur", function () { el.classList.add("touched"); });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    form.querySelectorAll("input, select, textarea").forEach(function (el) { el.classList.add("touched"); });
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var data = new FormData(form);
    if (data.get("access_key") === WEB3FORMS_KEY_PLACEHOLDER) {
      setStatus("The form isn't connected yet. For now, please email " + FALLBACK_EMAIL + ".", true);
      return;
    }

    var payload = {};
    data.forEach(function (value, key) { payload[key] = value; });

    button.disabled = true;
    setStatus("Sending...", false);

    fetch(form.action, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        return res.json().then(function (json) { return { ok: res.ok && json.success, json: json }; });
      })
      .then(function (result) {
        if (!result.ok) throw new Error(result.json && result.json.message);
        var done = document.getElementById("form-success");
        form.hidden = true;
        done.hidden = false;
        done.focus();
      })
      .catch(function () {
        button.disabled = false;
        setStatus("Sorry, something went wrong and your message wasn't sent. Please try again, or email " + FALLBACK_EMAIL + ".", true);
      });
  });
})();
