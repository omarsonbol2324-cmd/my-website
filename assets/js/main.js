document.addEventListener("DOMContentLoaded", function () {
  initDarkMode();
  initScrollTopButton();
  initEventsFilters();
  initContactValidation();
  initEventDetails();
});

function initDarkMode() {
  var themeToggleBtn = document.getElementById("themeToggle");
  var storageKey = "svu-theme";
  var savedTheme = localStorage.getItem(storageKey);

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");
      var mode = document.body.classList.contains("dark-mode") ? "dark" : "light";
      localStorage.setItem(storageKey, mode);
    });
  }
}

function initScrollTopButton() {
  var scrollBtn = document.createElement("button");
  scrollBtn.id = "scrollTopBtn";
  scrollBtn.type = "button";
  scrollBtn.className = "btn btn-primary";
  scrollBtn.setAttribute("aria-label", "\u0627\u0644\u0639\u0648\u062f\u0629 \u0625\u0644\u0649 \u0627\u0644\u0623\u0639\u0644\u0649");
  scrollBtn.textContent = "?";
  document.body.appendChild(scrollBtn);

  window.addEventListener("scroll", function () {
    if (window.scrollY > 240) {
      scrollBtn.classList.add("show");
    } else {
      scrollBtn.classList.remove("show");
    }
  });

  scrollBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initEventsFilters() {
  var eventsContainer = document.getElementById("eventsContainer");
  if (!eventsContainer) return;

  var searchInput = document.getElementById("searchInput");
  var categoryFilter = document.getElementById("categoryFilter");
  var dateFilter = document.getElementById("dateFilter");
  var locationFilter = document.getElementById("locationFilter");
  var resetBtn = document.getElementById("resetFilters");
  var noResultsAlert = document.getElementById("noResultsAlert");
  var cards = Array.prototype.slice.call(eventsContainer.querySelectorAll(".card"));
  var categoryStorageKey = "svu-last-category";

  var lastCategory = localStorage.getItem(categoryStorageKey);
  if (lastCategory && categoryFilter && categoryFilter.querySelector('option[value="' + lastCategory + '"]')) {
    categoryFilter.value = lastCategory;
  }

  function applyFilters() {
    var term = searchInput ? searchInput.value.trim().toLowerCase() : "";
    var category = categoryFilter ? categoryFilter.value : "all";
    var dateValue = dateFilter ? dateFilter.value : "";
    var location = locationFilter ? locationFilter.value : "all";
    var visibleCount = 0;

    if (categoryFilter) {
      localStorage.setItem(categoryStorageKey, category);
    }

    cards.forEach(function (card) {
      var title = (card.querySelector("h3") ? card.querySelector("h3").textContent : "").toLowerCase();
      var cardCategory = card.dataset.category || "";
      var cardDate = card.dataset.date || "";
      var cardLocation = card.dataset.location || "";

      var termMatch = !term || title.indexOf(term) !== -1;
      var categoryMatch = category === "all" || cardCategory === category;
      var dateMatch = !dateValue || cardDate === dateValue;
      var locationMatch = location === "all" || cardLocation === location;
      var visible = termMatch && categoryMatch && dateMatch && locationMatch;

      card.style.display = visible ? "" : "none";
      if (visible) visibleCount += 1;
    });

    if (noResultsAlert) {
      noResultsAlert.classList.toggle("d-none", visibleCount !== 0);
    }
  }

  if (searchInput) searchInput.addEventListener("input", applyFilters);
  if (categoryFilter) categoryFilter.addEventListener("change", applyFilters);
  if (dateFilter) dateFilter.addEventListener("change", applyFilters);
  if (locationFilter) locationFilter.addEventListener("change", applyFilters);

  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      if (searchInput) searchInput.value = "";
      if (categoryFilter) categoryFilter.value = "all";
      if (dateFilter) dateFilter.value = "";
      if (locationFilter) locationFilter.value = "all";
      localStorage.setItem(categoryStorageKey, "all");
      applyFilters();
    });
  }

  applyFilters();
}

function initContactValidation() {
  var form = document.getElementById("contactForm");
  if (!form) return;

  var nameInput = document.getElementById("name");
  var emailInput = document.getElementById("email");
  var messageInput = document.getElementById("message");
  var nameError = document.getElementById("nameError");
  var emailError = document.getElementById("emailError");
  var messageError = document.getElementById("messageError");
  var alertsBox = document.getElementById("contactAlerts");
  var successMsg = document.getElementById("successMsg");
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function toggleError(element, show) {
    if (element) element.style.display = show ? "block" : "none";
  }

  function renderAlert(type, text) {
    if (!alertsBox) return;
    alertsBox.innerHTML = '<div class="alert alert-' + type + ' mt-3" role="alert">' + text + "</div>";
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var nameValid = !!nameInput && nameInput.value.trim().length >= 3;
    var emailValid = !!emailInput && emailRegex.test(emailInput.value.trim());
    var messageValid = !!messageInput && messageInput.value.trim().length > 0;

    toggleError(nameError, !nameValid);
    toggleError(emailError, !emailValid);
    toggleError(messageError, !messageValid);

    if (!nameValid || !emailValid || !messageValid) {
      renderAlert("danger", "\u064a\u0631\u062c\u0649 \u062a\u0639\u0628\u0626\u0629 \u062c\u0645\u064a\u0639 \u0627\u0644\u062d\u0642\u0648\u0644 \u0628\u0634\u0643\u0644 \u0635\u062d\u064a\u062d.");
      if (successMsg) successMsg.style.display = "none";
      return;
    }

    renderAlert("success", "\u062a\u0645 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0631\u0633\u0627\u0644\u0629 \u0628\u0646\u062c\u0627\u062d! \u0634\u0643\u0631\u064b\u0627 \u0644\u062a\u0648\u0627\u0635\u0644\u0643.");
    if (successMsg) successMsg.style.display = "none";
    form.reset();
    toggleError(nameError, false);
    toggleError(emailError, false);
    toggleError(messageError, false);
  });
}

function initEventDetails() {
  var titleEl = document.getElementById("eventTitle");
  var dateEl = document.getElementById("eventDate");
  var locationEl = document.getElementById("eventLocation");
  var descEl = document.getElementById("eventDesc");
  var imgEl = document.getElementById("eventImg");

  if (!titleEl || !dateEl || !locationEl || !descEl || !imgEl) return;

  var params = new URLSearchParams(window.location.search);
  var eventId = params.get("id");

  // A small static map is enough for this homework demo.
  var eventsMap = {
    spring: {
      title: "\u0645\u0647\u0631\u062c\u0627\u0646 \u0627\u0644\u0631\u0628\u064a\u0639 \u0627\u0644\u062b\u0642\u0627\u0641\u064a",
      date: "20 \u0645\u0627\u064a\u0648 2026",
      location: "\u062f\u0645\u0634\u0642",
      desc: "\u0641\u0639\u0627\u0644\u064a\u0629 \u062b\u0642\u0627\u0641\u064a\u0629 \u0645\u062a\u0646\u0648\u0639\u0629 \u062a\u0634\u0645\u0644 \u0639\u0631\u0648\u0636\u0627\u064b \u0641\u0646\u064a\u0629\u060c \u0645\u0633\u0627\u0628\u0642\u0627\u062a \u0637\u0644\u0627\u0628\u064a\u0629\u060c \u0648\u0623\u0631\u0643\u0627\u0646\u0627\u064b \u0645\u0639\u0631\u0641\u064a\u0629.",
      img: "img/spring.jpg"
    },
    coding: {
      title: "\u0648\u0631\u0634\u0629 \u062a\u0637\u0648\u064a\u0631 \u0627\u0644\u0648\u064a\u0628",
      date: "01 \u064a\u0648\u0646\u064a\u0648 2026",
      location: "\u0623\u0648\u0646\u0644\u0627\u064a\u0646",
      desc: "\u0648\u0631\u0634\u0629 \u062a\u0637\u0628\u064a\u0642\u064a\u0629 \u062d\u0648\u0644 HTML \u0648 CSS \u0648 JavaScript \u0645\u0639 \u0623\u0645\u062b\u0644\u0629 \u0639\u0645\u0644\u064a\u0629 \u0644\u0628\u0646\u0627\u0621 \u0648\u0627\u062c\u0647\u0627\u062a \u062a\u0641\u0627\u0639\u0644\u064a\u0629.",
      img: "img/coding.jpg"
    },
    music: {
      title: "\u0623\u0645\u0633\u064a\u0629 \u0628\u064a\u0627\u0646\u0648 \u0643\u0644\u0627\u0633\u064a\u0643\u064a\u0629",
      date: "10 \u064a\u0648\u0646\u064a\u0648 2026",
      location: "\u062f\u0645\u0634\u0642",
      desc: "\u0623\u0645\u0633\u064a\u0629 \u0645\u0648\u0633\u064a\u0642\u064a\u0629 \u0647\u0627\u062f\u0626\u0629 \u064a\u0642\u062f\u0645\u0647\u0627 \u0637\u0644\u0627\u0628 \u0645\u0648\u0647\u0648\u0628\u0648\u0646 \u0645\u0639 \u0641\u0642\u0631\u0627\u062a \u062a\u0639\u0631\u064a\u0641\u064a\u0629 \u0639\u0646 \u0627\u0644\u0645\u0642\u0637\u0648\u0639\u0627\u062a \u0627\u0644\u0643\u0644\u0627\u0633\u064a\u0643\u064a\u0629.",
      img: "img/music.jpg"
    }
  };

  var selectedEvent = eventsMap[eventId] || eventsMap.spring;
  titleEl.textContent = selectedEvent.title;
  dateEl.textContent = "\ud83d\udcc5 \u0627\u0644\u062a\u0627\u0631\u064a\u062e: " + selectedEvent.date;
  locationEl.textContent = "\ud83d\udccd \u0627\u0644\u0645\u0648\u0642\u0639: " + selectedEvent.location;
  descEl.textContent = selectedEvent.desc;
  imgEl.src = selectedEvent.img;
  imgEl.alt = selectedEvent.title;
}
