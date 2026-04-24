// Theme preference is saved so the same mode is restored on reload.
const themeToggle = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("portfolio-theme");

if (savedTheme === "light") {
  document.body.classList.add("light-theme");
}

if (themeToggle) {
  const updateThemeButton = () => {
    themeToggle.textContent = document.body.classList.contains("light-theme")
      ? "Dark Mode"
      : "Light Mode";
  };

  updateThemeButton();

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    localStorage.setItem(
      "portfolio-theme",
      document.body.classList.contains("light-theme") ? "light" : "dark"
    );
    updateThemeButton();
  });
}

// Elements for the time-based greeting and name personalization.
const greetingEl = document.getElementById("greeting");
const nameInput = document.getElementById("visitor-name");
const nameOutput = document.getElementById("name-output");
const yearEl = document.getElementById("year");

// Elements for the hero highlight cards.
const highlightValues = document.querySelectorAll(".highlight-value[data-target]");

// Elements for project filtering.
const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");
const projectEmpty = document.getElementById("project-empty");

// Elements for the GitHub repositories section.
const repoGrid = document.getElementById("repo-grid");
const repoStatus = document.getElementById("repo-status");
const repoSort = document.getElementById("repo-sort");

// Elements for contact form feedback.
const contactForm = document.querySelector(".contact-form");
const formNote = document.getElementById("form-note");

const pinnedRepository = {
  name: "exam-scheduling-system",
  description: "Midterm exam scheduling system project repository.",
  language: "Academic",
  html_url: "https://github.com/memnt01F/exam-scheduling-system",
  updated_at: "2026-01-01T00:00:00Z",
  pushed_at: "2026-01-01T00:00:00Z",
  full_name: "memnt01F/exam-scheduling-system",
};

let repositories = [];

const getTimeGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
};

const updateGreeting = () => {
  const name = nameInput ? nameInput.value.trim() : "";

  if (greetingEl) {
    greetingEl.textContent = getTimeGreeting();
  }

  if (nameOutput) {
    nameOutput.textContent = name
      ? `Nice to meet you, ${name}!`
      : "Please enter your name above.";
  }
};

const formatHighlightValue = (element, value) => {
  const decimals = Number(element.dataset.decimals || 0);
  const prefix = element.dataset.prefix || "";
  const suffix = element.dataset.suffix || "";
  const useGrouping = element.dataset.grouping === "true";
  const formattedValue = value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping,
  });

  element.textContent = `${prefix}${formattedValue}${suffix}`;
};

const animateHighlights = () => {
  if (!highlightValues.length) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    highlightValues.forEach((element) => {
      formatHighlightValue(element, Number(element.dataset.target || 0));
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const element = entry.target;
        const targetValue = Number(element.dataset.target || 0);
        const duration = 900;
        const startTime = performance.now();

        formatHighlightValue(element, 0);

        const step = (currentTime) => {
          const progress = Math.min((currentTime - startTime) / duration, 1);
          const easedProgress = 1 - Math.pow(1 - progress, 3);
          const currentValue = targetValue * easedProgress;

          formatHighlightValue(element, currentValue);

          if (progress < 1) {
            window.requestAnimationFrame(step);
            return;
          }

          formatHighlightValue(element, targetValue);
        };

        window.requestAnimationFrame(step);
        observer.unobserve(element);
      });
    },
    {
      threshold: 0.35,
    }
  );

  highlightValues.forEach((element) => observer.observe(element));
};

const filterProjects = (category) => {
  let visibleCount = 0;

  projectCards.forEach((card) => {
    const categories = (card.dataset.category || "").split(" ");
    const isVisible = category === "all" || categories.includes(category);
    card.classList.toggle("is-hidden", !isVisible);

    if (isVisible) {
      visibleCount += 1;
    }
  });

  if (projectEmpty) {
    projectEmpty.hidden = visibleCount !== 0;
  }
};

const renderRepositories = () => {
  if (!repoGrid || !repoSort) {
    return;
  }

  const sortedRepos = [...repositories].sort((firstRepo, secondRepo) => {
    const firstDate = new Date(firstRepo.pushed_at || firstRepo.updated_at).getTime();
    const secondDate = new Date(secondRepo.pushed_at || secondRepo.updated_at).getTime();

    return repoSort.value === "oldest" ? firstDate - secondDate : secondDate - firstDate;
  });

  repoGrid.innerHTML = "";

  sortedRepos.forEach((repo) => {
    const repoCard = document.createElement("article");
    repoCard.className = "repo-card";

    const repoTitle = document.createElement("h3");
    repoTitle.textContent = repo.name;

    const repoDescription = document.createElement("p");
    repoDescription.textContent = repo.description || "No description provided.";

    const repoMeta = document.createElement("div");
    repoMeta.className = "repo-meta";

    const updated = document.createElement("span");
    updated.textContent = `Updated: ${new Date(
      repo.pushed_at || repo.updated_at
    ).toLocaleDateString()}`;

    repoMeta.append(updated);

    const repoLink = document.createElement("a");
    repoLink.className = "repo-link";
    repoLink.href = repo.html_url;
    repoLink.target = "_blank";
    repoLink.rel = "noreferrer";
    repoLink.textContent = "View Repository";

    repoCard.append(repoTitle, repoDescription, repoMeta, repoLink);
    repoGrid.appendChild(repoCard);
  });
};

const loadRepositories = async () => {
  if (!repoGrid || !repoStatus) {
    return;
  }

  repoStatus.textContent = "Loading repositories...";
  repoStatus.classList.remove("error");

  try {
    const response = await fetch("https://api.github.com/users/itisMavis/repos?per_page=100");

    if (!response.ok) {
      throw new Error("Request failed");
    }

    const repoData = await response.json();
    const combinedRepos = [...repoData, pinnedRepository];
    const uniqueRepos = [];
    const seenUrls = new Set();

    combinedRepos.forEach((repo) => {
      if (!seenUrls.has(repo.html_url)) {
        seenUrls.add(repo.html_url);
        uniqueRepos.push(repo);
      }
    });

    repositories = uniqueRepos;
    renderRepositories();
    repoStatus.textContent = `Showing ${repositories.length} repositories.`;
  } catch (error) {
    repoStatus.textContent =
      "Repositories could not be loaded right now. Please try again later.";
    repoStatus.classList.add("error");
  }
};

updateGreeting();
animateHighlights();

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (nameInput) {
  nameInput.addEventListener("input", updateGreeting);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    filterProjects(button.dataset.filter || "all");
  });
});

filterProjects("all");

if (repoSort) {
  repoSort.addEventListener("change", renderRepositories);
}

loadRepositories();

if (contactForm && formNote) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameField = contactForm.querySelector("#name");
    const emailField = contactForm.querySelector("#email");
    const messageField = contactForm.querySelector("#message");

    const nameValue = nameField ? nameField.value.trim() : "";
    const emailValue = emailField ? emailField.value.trim() : "";
    const messageValue = messageField ? messageField.value.trim() : "";
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

    if (!nameValue || !emailValue || !messageValue || !emailValid) {
      formNote.textContent =
        "Please enter your name, a valid email, and a message.";
      formNote.classList.add("visible", "error");
      return;
    }

    formNote.textContent = `Thanks, ${nameValue}! Your message has been received (demo form).`;
    formNote.classList.remove("error");
    formNote.classList.add("visible");
    contactForm.reset();
  });
}
