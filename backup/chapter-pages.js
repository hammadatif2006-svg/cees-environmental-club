
const $ = (s,p=document) => p.querySelector(s);

/* ---------- portfolio modal ---------- */
const modal = $("#portfolioModal");
const closeButton = $("#portfolioClose");
const posterName = $("#posterName");
const posterRole = $("#posterRole");
let lastCard = null;

document.querySelectorAll(".portfolio-button").forEach(button => {
  button.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();

    const card = button.closest(".cabinet-card");
    if (!card || !modal) return;

    lastCard = card;
    posterName.textContent = card.dataset.name || "STUDENT PORTFOLIO";
    posterRole.textContent = card.dataset.role || "";

    modal.classList.add("open");
    modal.setAttribute("aria-hidden","false");
    document.body.style.overflow = "hidden";

    setTimeout(() => closeButton?.focus(), 80);
  });
});

function closePortfolio(){
  modal?.classList.remove("open");
  modal?.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
  lastCard?.querySelector(".portfolio-button")?.focus();
}

closeButton?.addEventListener("click", closePortfolio);

modal?.addEventListener("click", event => {
  if(event.target === modal) closePortfolio();
});

document.addEventListener("keydown", event => {
  if(event.key === "Escape" && modal?.classList.contains("open")){
    closePortfolio();
  }
});


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
   ENSC STUDENT CABINET
   PROFILE CARD INTERACTION
   ========================================================== */

const enscCabinetCards = $$(
  ".chapter-cabinet-grid .leadership-profile-card"
);

const enscLeadershipModal =
  $("#leadershipModal");

const enscLeadershipClose =
  $("#leadershipProfileClose");

const enscProfileImage =
  $("#leadershipProfileImage");

const enscProfilePlaceholder =
  $("#leadershipProfilePlaceholder");

const enscProfileName =
  $("#leadershipProfileName");

const enscProfileRole =
  $("#leadershipProfileRole");

const enscProfileChapter =
  $("#leadershipProfileChapter");

const enscProfileBio =
  $("#leadershipProfileBio");

const enscPortfolioButton =
  $("#studentPortfolioButton");

const enscPortfolioModal =
  $("#studentPortfolioModal");

const enscPortfolioClose =
  $("#studentPortfolioClose");

const enscPortfolioImage =
  $("#studentPortfolioImage");

const enscPortfolioPlaceholder =
  $("#studentPosterPlaceholder");

let enscActiveCard = null;


/* ==========================================================
   OPEN PROFILE
   ========================================================== */

function openEnscProfile(card) {

  if (
    !card ||
    !enscLeadershipModal
  ) {
    return;
  }

  enscActiveCard = card;


  const name =
    card.dataset.name ||
    "Student Name";

  const role =
    card.dataset.role ||
    "";

  const chapter =
    card.dataset.chapter ||
    "Environmental Sciences Student Cabinet";

  const bio =
    card.dataset.bio ||
    "";

  const portrait =
    card.dataset.portrait ||
    "";


  /* ---------- TEXT ---------- */

  enscProfileName.textContent =
    name;

  enscProfileRole.textContent =
    role;

  enscProfileChapter.textContent =
    chapter;

  enscProfileBio.textContent =
    bio;


  /* ---------- PORTRAIT ---------- */

  if (enscProfileImage) {

    enscProfileImage.classList.remove(
      "loaded"
    );

    enscProfileImage.removeAttribute(
      "src"
    );

    enscProfileImage.alt =
      name + " portrait";

  }


  if (enscProfilePlaceholder) {

    enscProfilePlaceholder.textContent =
      getEnscInitials(name);

    enscProfilePlaceholder.style.display =
      "grid";

  }


  if (
    portrait &&
    enscProfileImage
  ) {

    enscProfileImage.onload =
      () => {

        enscProfileImage.classList.add(
          "loaded"
        );

        if (enscProfilePlaceholder) {

          enscProfilePlaceholder.style.display =
            "none";

        }

      };


    enscProfileImage.onerror =
      () => {

        enscProfileImage.classList.remove(
          "loaded"
        );

        if (enscProfilePlaceholder) {

          enscProfilePlaceholder.style.display =
            "grid";

        }

      };


    enscProfileImage.src =
      portrait;

  }


  /* ---------- OPEN ---------- */

  enscLeadershipModal.classList.add(
    "open"
  );

  enscLeadershipModal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.style.overflow =
    "hidden";

}


/* ==========================================================
   INITIALS
   ========================================================== */

function getEnscInitials(name) {

  const words =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean);


  if (!words.length) {
    return "EC";
  }


  if (words.length === 1) {

    return words[0]
      .substring(0, 2)
      .toUpperCase();

  }


  return (
    words[0][0] +
    words[words.length - 1][0]
  ).toUpperCase();

}


/* ==========================================================
   CARD CLICK
   ========================================================== */

enscCabinetCards.forEach(card => {

  card.setAttribute(
    "tabindex",
    "0"
  );

  card.setAttribute(
    "role",
    "button"
  );


  const button =
    card.querySelector(
      ".profile-card-cta"
    );


  /* View Profile button */

  button?.addEventListener(
    "click",
    event => {

      event.preventDefault();

      event.stopPropagation();

      openEnscProfile(card);

    }
  );


  /* Entire card */

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

      openEnscProfile(card);

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

        openEnscProfile(card);

      }

    }
  );

});


/* ==========================================================
   CLOSE PROFILE
   ========================================================== */

function closeEnscProfile() {

  if (!enscLeadershipModal) {
    return;
  }


  enscLeadershipModal.classList.remove(
    "open"
  );

  enscLeadershipModal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.style.overflow =
    "";


  enscActiveCard?.focus();

}


/* Close button */

enscLeadershipClose?.addEventListener(
  "click",
  closeEnscProfile
);


/* Backdrop */

enscLeadershipModal?.addEventListener(
  "click",
  event => {

    if (
      event.target ===
      enscLeadershipModal ||
      event.target.classList.contains(
        "leadership-modal-backdrop"
      )
    ) {

      closeEnscProfile();

    }

  }
);


/* ==========================================================
   PORTFOLIO
   ========================================================== */

enscPortfolioButton?.addEventListener(
  "click",
  event => {

    event.preventDefault();

    event.stopPropagation();


    if (
      !enscActiveCard ||
      !enscPortfolioModal
    ) {
      return;
    }


    const poster =
      enscActiveCard.dataset.poster ||
      "";


    /* Reset */

    if (enscPortfolioImage) {

      enscPortfolioImage.classList.remove(
        "loaded"
      );

      enscPortfolioImage.removeAttribute(
        "src"
      );

    }


    if (enscPortfolioPlaceholder) {

      enscPortfolioPlaceholder.style.display =
        "grid";

    }


    /* Load poster */

    if (
      poster &&
      enscPortfolioImage
    ) {

      enscPortfolioImage.onload =
        () => {

          enscPortfolioImage.classList.add(
            "loaded"
          );

          if (enscPortfolioPlaceholder) {

            enscPortfolioPlaceholder.style.display =
              "none";

          }

        };


      enscPortfolioImage.onerror =
        () => {

          if (enscPortfolioPlaceholder) {

            enscPortfolioPlaceholder.style.display =
              "grid";

          }

        };


      enscPortfolioImage.src =
        poster;

    }


    enscPortfolioModal.classList.add(
      "open"
    );

    enscPortfolioModal.setAttribute(
      "aria-hidden",
      "false"
    );

  }
);


/* ==========================================================
   CLOSE PORTFOLIO
   ========================================================== */

function closeEnscPortfolio() {

  if (!enscPortfolioModal) {
    return;
  }


  enscPortfolioModal.classList.remove(
    "open"
  );

  enscPortfolioModal.setAttribute(
    "aria-hidden",
    "true"
  );


  if (enscPortfolioImage) {

    enscPortfolioImage.removeAttribute(
      "src"
    );

  }

}


/* Close portfolio */

enscPortfolioClose?.addEventListener(
  "click",
  closeEnscPortfolio
);


/* Portfolio backdrop */

enscPortfolioModal?.addEventListener(
  "click",
  event => {

    if (
      event.target ===
      enscPortfolioModal ||
      event.target.classList.contains(
        "student-portfolio-backdrop"
      )
    ) {

      closeEnscPortfolio();

    }

  }
);


/* ==========================================================
   ESCAPE
   ========================================================== */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key !== "Escape"
    ) {
      return;
    }


    /* Close portfolio first */

    if (
      enscPortfolioModal?.classList.contains(
        "open"
      )
    ) {

      closeEnscPortfolio();

      return;

    }


    /* Then profile */

    if (
      enscLeadershipModal?.classList.contains(
        "open"
      )
    ) {

      closeEnscProfile();

    }

  }
);