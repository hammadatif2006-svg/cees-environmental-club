
const $ = (s,p=document) => p.querySelector(s);

/* ---------- rustling leaf cursor ---------- */
if (window.matchMedia("(pointer:fine)").matches) {

  let lastLeafTime = 0;

  window.addEventListener("pointermove", event => {

    if (modal?.classList.contains("open")) return;

    const now = performance.now();

    if (now - lastLeafTime < 70) return;
    lastLeafTime = now;

    createChapterLeaf(event.clientX, event.clientY);
  });

  function createChapterLeaf(x,y){

    const leaf = document.createElement("span");
    leaf.className = "leaf-cursor";

    const direction = Math.random() > .5 ? 1 : -1;

    const driftX = (10 + Math.random()*24) * direction;
    const driftY = -8 + Math.random()*28;

    const endX = (35 + Math.random()*55) * direction;
    const endY = -25 + Math.random()*55;

    const rotation = direction * (45 + Math.random()*110);

    leaf.style.left = `${x}px`;
    leaf.style.top = `${y}px`;

    leaf.style.setProperty("--leaf-x",`${driftX}px`);
    leaf.style.setProperty("--leaf-y",`${driftY}px`);
    leaf.style.setProperty("--leaf-x-end",`${endX}px`);
    leaf.style.setProperty("--leaf-y-end",`${endY}px`);
    leaf.style.setProperty("--leaf-rotation",`${rotation}deg`);

    const size = .72 + Math.random()*.62;
    leaf.style.width = `${14*size}px`;
    leaf.style.height = `${9*size}px`;

    const colors = [
      "#75a900",
      "#8bbd18",
      "#5f8f00",
      "#9bc52a",
      "#486f08"
    ];

    leaf.style.background =
      colors[Math.floor(Math.random()*colors.length)];

    document.body.appendChild(leaf);

    setTimeout(() => leaf.remove(), 950);
  }
}

/* ---------- hero background video ---------- */
document.querySelectorAll(".chapter-hero-media video").forEach(video => {
  video.muted = true;
  video.playsInline = true;

  const startVideo = () => {
    const play = video.play();
    if (play && typeof play.catch === "function") {
      play.catch(() => {
        /* Browser autoplay policy prevented playback. Poster remains visible. */
      });
    }
  };

  if (video.readyState >= 2) {
    startVideo();
  } else {
    video.addEventListener("canplay", startVideo, { once: true });
  }
});


/* ==========================================================
   STUDENT CABINET
   Shared profile + portfolio system for ENSC / HWRM / THM
   ========================================================== */

const cabinetCards = document.querySelectorAll(
  ".chapter-cabinet-grid .board-card"
);

const leadershipModal =
  document.getElementById("leadershipModal");

const leadershipClose =
  document.getElementById("leadershipProfileClose");

const leadershipImage =
  document.getElementById("leadershipProfileImage");

const leadershipPlaceholder =
  document.getElementById("leadershipProfilePlaceholder");

const leadershipName =
  document.getElementById("leadershipProfileName");

const leadershipRole =
  document.getElementById("leadershipProfileRole");

const leadershipChapter =
  document.getElementById("leadershipProfileChapter");

const leadershipBio =
  document.getElementById("leadershipProfileBio");

const portfolioButton =
  document.getElementById("studentPortfolioButton");

const portfolioModal =
  document.getElementById("studentPortfolioModal");

const portfolioClose =
  document.getElementById("studentPortfolioClose");

const portfolioImage =
  document.getElementById("studentPortfolioImage");

const posterPlaceholder =
  document.getElementById("studentPosterPlaceholder");

let activeCabinetCard = null;


/* ---------- chapter name ---------- */

function getCabinetChapter(card) {

  if (card.dataset.chapter) {
    return card.dataset.chapter;
  }

  const path =
    window.location.pathname.toLowerCase();

  if (path.includes("hwrm")) {
    return "Health, Water & Resource Management Student Cabinet";
  }

  if (path.includes("thm")) {
    return "Tourism & Hospitality Management Student Cabinet";
  }

  return "Environmental Sciences Student Cabinet";
}


/* ---------- initials ---------- */

function getInitials(name) {

  const words = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) {
    return "EC";
  }

  if (words.length === 1) {
    return words[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    words[0].charAt(0) +
    words[words.length - 1].charAt(0)
  ).toUpperCase();
}


/* ==========================================================
   OPEN PROFILE
   ========================================================== */

function openCabinetProfile(card) {

  if (!leadershipModal || !card) {
    return;
  }

  activeCabinetCard = card;

  const name =
    card.dataset.name ||
    "Student Name";

  const role =
    card.dataset.role ||
    "";

  const chapter =
    getCabinetChapter(card);

  const bio =
    card.dataset.bio ||
    "Student member of the chapter cabinet.";

  const portrait =
    card.dataset.portrait ||
    "";


  /* ---------- text ---------- */

  if (leadershipName) {
    leadershipName.textContent = name;
  }

  if (leadershipRole) {
    leadershipRole.textContent = role;
  }

  if (leadershipChapter) {
    leadershipChapter.textContent = chapter;
  }

  if (leadershipBio) {
    leadershipBio.textContent = bio;
  }


  /* ---------- reset image ---------- */

  if (leadershipImage) {

    leadershipImage.classList.remove(
      "loaded"
    );

    leadershipImage.removeAttribute(
      "src"
    );

    leadershipImage.alt =
      `${name} portrait`;
  }

  if (leadershipPlaceholder) {

    leadershipPlaceholder.textContent =
      getInitials(name);

    leadershipPlaceholder.style.display =
      "grid";
  }


  /* ---------- load portrait if supplied ---------- */

  if (
    portrait &&
    leadershipImage
  ) {

    leadershipImage.onload = () => {

      leadershipImage.classList.add(
        "loaded"
      );

      if (leadershipPlaceholder) {
        leadershipPlaceholder.style.display =
          "none";
      }

    };

    leadershipImage.onerror = () => {

      leadershipImage.classList.remove(
        "loaded"
      );

      if (leadershipPlaceholder) {
        leadershipPlaceholder.style.display =
          "grid";
      }

    };

    leadershipImage.src = portrait;
  }


  /* ---------- open modal ---------- */

  leadershipModal.classList.add(
    "open"
  );

  leadershipModal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.style.overflow =
    "hidden";

  setTimeout(() => {
    leadershipClose?.focus();
  }, 80);
}


/* ==========================================================
   CABINET CARD EVENTS
   ========================================================== */

cabinetCards.forEach(card => {

  card.setAttribute(
    "tabindex",
    "0"
  );

  card.setAttribute(
    "role",
    "button"
  );


  /* Whole card */

  card.addEventListener(
    "click",
    event => {

      if (
        event.target.closest(
          ".profile-card-cta"
        )
      ) {
        return;
      }

      openCabinetProfile(card);
    }
  );


  /* Keyboard */

  card.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Enter" ||
        event.key === " "
      ) {

        event.preventDefault();

        openCabinetProfile(card);
      }

    }
  );


  /* View Profile button */

  const profileButton =
    card.querySelector(
      ".profile-card-cta"
    );

  profileButton?.addEventListener(
    "click",
    event => {

      event.preventDefault();
      event.stopPropagation();

      openCabinetProfile(card);
    }
  );

});


/* ==========================================================
   CLOSE PROFILE
   ========================================================== */

function closeCabinetProfile() {

  if (!leadershipModal) {
    return;
  }

  leadershipModal.classList.remove(
    "open"
  );

  leadershipModal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.style.overflow =
    "";

  activeCabinetCard?.focus();
}


leadershipClose?.addEventListener(
  "click",
  closeCabinetProfile
);


/* Close by clicking backdrop */

leadershipModal?.addEventListener(
  "click",
  event => {

    if (
      event.target === leadershipModal ||
      event.target.classList.contains(
        "leadership-modal-backdrop"
      )
    ) {

      closeCabinetProfile();
    }

  }
);


/* ==========================================================
   PORTFOLIO POSTER
   ========================================================== */

portfolioButton?.addEventListener(
  "click",
  event => {

    event.preventDefault();
    event.stopPropagation();

    if (
      !activeCabinetCard ||
      !portfolioModal
    ) {
      return;
    }

    const poster =
      activeCabinetCard.dataset.poster ||
      "";


    /* Reset */

    if (portfolioImage) {

      portfolioImage.classList.remove(
        "loaded"
      );

      portfolioImage.removeAttribute(
        "src"
      );
    }

    if (posterPlaceholder) {

      posterPlaceholder.style.display =
        "grid";
    }


    /* Load poster */

    if (
      poster &&
      portfolioImage
    ) {

      portfolioImage.onload = () => {

        portfolioImage.classList.add(
          "loaded"
        );

        if (posterPlaceholder) {
          posterPlaceholder.style.display =
            "none";
        }

      };

      portfolioImage.onerror = () => {

        portfolioImage.classList.remove(
          "loaded"
        );

        if (posterPlaceholder) {
          posterPlaceholder.style.display =
            "grid";
        }

      };

      portfolioImage.src = poster;
    }


    portfolioModal.classList.add(
      "open"
    );

    portfolioModal.setAttribute(
      "aria-hidden",
      "false"
    );

    setTimeout(() => {
      portfolioClose?.focus();
    }, 80);
  }
);


/* ==========================================================
   CLOSE PORTFOLIO
   ========================================================== */

function closeCabinetPortfolio() {

  if (!portfolioModal) {
    return;
  }

  portfolioModal.classList.remove(
    "open"
  );

  portfolioModal.setAttribute(
    "aria-hidden",
    "true"
  );

  if (portfolioImage) {

    portfolioImage.removeAttribute(
      "src"
    );

    portfolioImage.classList.remove(
      "loaded"
    );
  }

  if (posterPlaceholder) {
    posterPlaceholder.style.display =
      "grid";
  }
}


portfolioClose?.addEventListener(
  "click",
  closeCabinetPortfolio
);


/* Close by clicking portfolio backdrop */

portfolioModal?.addEventListener(
  "click",
  event => {

    if (
      event.target === portfolioModal ||
      event.target.classList.contains(
        "student-portfolio-backdrop"
      )
    ) {

      closeCabinetPortfolio();
    }

  }
);


/* ==========================================================
   ESCAPE KEY
   ========================================================== */

document.addEventListener(
  "keydown",
  event => {

    if (event.key !== "Escape") {
      return;
    }

    if (
      portfolioModal?.classList.contains(
        "open"
      )
    ) {

      closeCabinetPortfolio();
      return;
    }

    if (
      leadershipModal?.classList.contains(
        "open"
      )
    ) {

      closeCabinetProfile();
    }

  }
);
if (window.matchMedia("(pointer:fine)").matches) {

  let lastLeafTime = 0;

  window.addEventListener("pointermove", event => {

    const now = performance.now();

    if (now - lastLeafTime < 65) return;

    lastLeafTime = now;

    createLeaf(
      event.clientX,
      event.clientY
    );

  });

  function createLeaf(x, y) {

    const leaf = document.createElement("span");

    leaf.className = "leaf-cursor";

    const direction =
      Math.random() > .5 ? 1 : -1;

    const driftX =
      (12 + Math.random() * 25) * direction;

    const driftY =
      -10 + Math.random() * 35;

    const endX =
      (35 + Math.random() * 55) * direction;

    const endY =
      -25 + Math.random() * 55;

    const rotation =
      direction * (40 + Math.random() * 100);

    leaf.style.left = `${x}px`;
    leaf.style.top = `${y}px`;

    leaf.style.setProperty(
      "--leaf-x",
      `${driftX}px`
    );

    leaf.style.setProperty(
      "--leaf-y",
      `${driftY}px`
    );

    leaf.style.setProperty(
      "--leaf-x-end",
      `${endX}px`
    );

    leaf.style.setProperty(
      "--leaf-y-end",
      `${endY}px`
    );

    leaf.style.setProperty(
      "--leaf-rotation",
      `${rotation}deg`
    );

    const size =
      .7 + Math.random() * .65;

    leaf.style.width =
      `${14 * size}px`;

    leaf.style.height =
      `${9 * size}px`;

    const leafColors = [
      "#75a900",
      "#8bbd18",
      "#5f8f00",
      "#9bc52a",
      "#486f08"
    ];

    leaf.style.background =
      leafColors[
        Math.floor(
          Math.random() * leafColors.length
        )
      ];

    document.body.appendChild(leaf);

    setTimeout(() => {
      leaf.remove();
    }, 950);

  }

}
