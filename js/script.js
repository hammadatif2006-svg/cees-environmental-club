/* Environmental Club - main interaction file
   Future edits should normally be made here rather than inline in index.html. */

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];


/* ---------- loader ---------- */

window.addEventListener("load", () => {

  setTimeout(() => {
    $("#siteLoader")?.classList.add("hide");
  }, 450);

  const year = $("#year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

});


/* ---------- mobile navigation ---------- */

const menuButton = $("#menuButton");
const mainNav = $("#mainNav");

menuButton?.addEventListener("click", () => {

  const isOpen = mainNav.classList.toggle("open");

  menuButton.setAttribute(
    "aria-expanded",
    String(isOpen)
  );

});


$$(".main-nav a").forEach(link => {

  link.addEventListener("click", () => {

    mainNav.classList.remove("open");

    menuButton?.setAttribute(
      "aria-expanded",
      "false"
    );

  });

});


/* ---------- active navigation ---------- */

const sections = $$("main section[id]");
const navItems = $$(".main-nav a[href^='#']");

const sectionObserver = new IntersectionObserver(
  entries => {

    entries.forEach(entry => {

      if (!entry.isIntersecting) return;

      navItems.forEach(item => {
        item.classList.remove("active");
      });

      const active = $(
        `.main-nav a[href="#${entry.target.id}"]`
      );

      active?.classList.add("active");

    });

  },
  {
    rootMargin: "-35% 0px -55% 0px"
  }
);

sections.forEach(section => {
  sectionObserver.observe(section);
});


/* ---------- reveal animations ---------- */

const revealObserver = new IntersectionObserver(
  entries => {

    entries.forEach(entry => {

      if (!entry.isIntersecting) return;

      entry.target.classList.add("visible");

      revealObserver.unobserve(entry.target);

    });

  },
  {
    threshold: .12
  }
);

$$(".reveal").forEach(element => {
  revealObserver.observe(element);
});


/* ==========================================================
   LEAF TRAIL CURSOR
   ========================================================== */

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


/* ==========================================================
   3D EARTH
   ========================================================== */

function initEarth() {

  const container = $("#earthCanvas");

  if (
    !container ||
    typeof THREE === "undefined"
  ) {
    return;
  }


  const scene = new THREE.Scene();


  const camera =
    new THREE.PerspectiveCamera(
      38,
      container.clientWidth /
      container.clientHeight,
      .1,
      100
    );

  camera.position.z = 3.35;


  const renderer =
    new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });


  renderer.setPixelRatio(
    Math.min(
      window.devicePixelRatio,
      2
    )
  );

  renderer.setSize(
    container.clientWidth,
    container.clientHeight
  );

  renderer.outputEncoding =
    THREE.sRGBEncoding;

  container.appendChild(
    renderer.domElement
  );


  const earthGroup =
    new THREE.Group();

  scene.add(earthGroup);


  const loader =
    new THREE.TextureLoader();


  const earthMap =
    loader.load(
      "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg"
    );


  const normalMap =
    loader.load(
      "https://threejs.org/examples/textures/planets/earth_normal_2048.jpg"
    );


  const specularMap =
    loader.load(
      "https://threejs.org/examples/textures/planets/earth_specular_2048.jpg"
    );


  const cloudMap =
    loader.load(
      "https://threejs.org/examples/textures/planets/earth_clouds_1024.png"
    );


  /* ---------- Earth ---------- */

  const earth =
    new THREE.Mesh(

      new THREE.SphereGeometry(
        1,
        96,
        96
      ),

      new THREE.MeshPhongMaterial({

        map: earthMap,

        normalMap: normalMap,

        specularMap: specularMap,


        /*
         * Let the original Earth texture
         * show through.
         */

        color:
          new THREE.Color(0xffffff),


        /*
         * Deep blue ocean reflections.
         */

        specular:
          new THREE.Color(0x123b5a),

        shininess: 12,


        /*
         * Very subtle dark base
         * for the night side.
         */

        emissive:
          new THREE.Color(0x010305),

        emissiveIntensity: .05

      })

    );


  earthGroup.add(earth);


  /*
   * NOTE:
   * The duplicate earthGroup.add(earth)
   * from the previous script has been removed.
   *
   * The Earth should only be added once.
   */


  /* ---------- Clouds ---------- */

  const clouds =
    new THREE.Mesh(

      new THREE.SphereGeometry(
        1.013,
        96,
        96
      ),

      new THREE.MeshPhongMaterial({

        map: cloudMap,

        transparent: true,

        opacity: .32,

        depthWrite: false

      })

    );


  earthGroup.add(clouds);


  /* ---------- Atmosphere ---------- */

  const atmosphere =
    new THREE.Mesh(

      new THREE.SphereGeometry(
        1.065,
        64,
        64
      ),

      new THREE.MeshBasicMaterial({

        color: 0x62dfff,

        transparent: true,

        opacity: .09,

        side: THREE.BackSide

      })

    );


  earthGroup.add(atmosphere);


  /* ---------- Lighting ---------- */

  const ambient =
    new THREE.AmbientLight(
      0x101612,
      .08
    );

  scene.add(ambient);


  const sunlight =
    new THREE.DirectionalLight(
      0xffffff,
      3.6
    );

  sunlight.position.set(
    -5,
    2.2,
    5
  );

  scene.add(sunlight);


  const coolFill =
    new THREE.DirectionalLight(
      0x3b7185,
      .06
    );

  coolFill.position.set(
    4,
    -2,
    -5
  );

  scene.add(coolFill);


  /*
   * Earth axial tilt.
   */

  earthGroup.rotation.z =
    THREE.MathUtils.degToRad(-23.4);


  /* ---------- rotation state ---------- */

  let targetRotation =
    THREE.MathUtils.degToRad(-35);

  let currentRotation =
    THREE.MathUtils.degToRad(-35);


  let targetTilt = 0;
  let currentTilt = 0;


  let cloudRotation = 0;
  let atmosphereRotation = 0;


  let dragging = false;


  let previousX = 0;
  let previousY = 0;


  /* ---------- mouse interaction ---------- */

  container.addEventListener(
    "pointerdown",
    event => {

      /*
       * Touch devices are intentionally
       * left to normal page interaction.
       */

      if (
        window.matchMedia(
          "(pointer: coarse)"
        ).matches
      ) {
        return;
      }


      dragging = true;

      previousX =
        event.clientX;

      previousY =
        event.clientY;


      container.setPointerCapture?.(
        event.pointerId
      );

    }
  );


  container.addEventListener(
    "pointermove",
    event => {

      if (!dragging) return;


      const deltaX =
        event.clientX -
        previousX;


      const deltaY =
        event.clientY -
        previousY;


      /*
       * Horizontal movement
       * rotates the Earth.
       */

      targetRotation +=
        deltaX * .006;


      /*
       * Vertical movement
       * tilts the Earth.
       */

      targetTilt +=
        deltaY * .006;


      /*
       * Prevent excessive flipping.
       */

      targetTilt =
        THREE.MathUtils.clamp(
          targetTilt,

          THREE.MathUtils.degToRad(-55),

          THREE.MathUtils.degToRad(55)
        );


      previousX =
        event.clientX;

      previousY =
        event.clientY;

    }
  );


  [
    "pointerup",
    "pointercancel",
    "pointerleave"
  ].forEach(type => {

    container.addEventListener(
      type,
      () => {
        dragging = false;
      }
    );

  });


  /* ---------- animation ---------- */

  const clock =
    new THREE.Clock();


  function render() {

    requestAnimationFrame(
      render
    );


    const t =
      clock.getElapsedTime();


    /* ---------- PLANETARY MOTION ---------- */


    /*
     * The solid Earth rotates
     * at its own rate.
     */

    if (!dragging) {

      targetRotation +=
        .0016;

    }


    currentRotation +=
      (
        targetRotation -
        currentRotation
      ) * .035;


    /*
     * Clouds move independently
     * from the Earth's surface.
     */

    cloudRotation +=
      .00235;


    /*
     * Atmosphere moves independently.
     */

    atmosphereRotation +=
      .00145;


    /* ---------- APPLY ROTATIONS ---------- */

    earth.rotation.y =
      currentRotation;


    currentTilt +=
      (
        targetTilt -
        currentTilt
      ) * .08;


    earth.rotation.x =
      currentTilt;


    clouds.rotation.y =
      cloudRotation;


    atmosphere.rotation.y =
      atmosphereRotation;


    /*
     * Very subtle vertical movement
     * keeps the planet from feeling
     * completely mechanical.
     */

    earthGroup.position.y =
      Math.sin(t * .7) * .025;


    renderer.render(
      scene,
      camera
    );

  }


  /* ---------- resize ---------- */

  function resize() {

    const width =
      container.clientWidth;

    const height =
      container.clientHeight;


    if (!width || !height) {
      return;
    }


    camera.aspect =
      width / height;


    camera.updateProjectionMatrix();


    renderer.setSize(
      width,
      height
    );

  }


  window.addEventListener(
    "resize",
    resize
  );


  resize();

  render();

}


initEarth();


/* ==========================================================
   GALLERY LIGHTBOX
   ========================================================== */

const lightbox =
  $("#lightbox");

const lightboxImage =
  $("#lightboxImage");

const lightboxTitle =
  $("#lightboxTitle");


$$(".gallery-card").forEach(
  card => {

    card.addEventListener(
      "click",
      () => {

        if (!lightbox) return;

        lightboxImage.src =
          card.dataset.image;

        lightboxImage.alt =
          card.querySelector("img")?.alt || "";

        lightboxTitle.textContent =
          card.dataset.title || "";


        lightbox.classList.add(
          "open"
        );

        lightbox.setAttribute(
          "aria-hidden",
          "false"
        );

      }
    );

  }
);


function closeLightbox() {

  lightbox?.classList.remove(
    "open"
  );

  lightbox?.setAttribute(
    "aria-hidden",
    "true"
  );

}


$("#lightboxClose")?.addEventListener(
  "click",
  closeLightbox
);


lightbox?.addEventListener(
  "click",
  event => {

    if (
      event.target === lightbox
    ) {
      closeLightbox();
    }

  }
);


/* ==========================================================
   LEADERSHIP PROFILE POPUP
   ========================================================== */

const leadershipModal =
  $("#leadershipModal");

const leadershipProfile =
  $(".leadership-profile");

const leadershipProfileClose =
  $("#leadershipProfileClose");


const leadershipProfileImage =
  $("#leadershipProfileImage");

const leadershipProfilePlaceholder =
  $("#leadershipProfilePlaceholder");

const leadershipProfileName =
  $("#leadershipProfileName");

const leadershipProfileRole =
  $("#leadershipProfileRole");

const leadershipProfileChapter =
  $("#leadershipProfileChapter");

const leadershipProfileBio =
  $("#leadershipProfileBio");
const studentPortfolioButton =
  $("#studentPortfolioButton");

const studentPortfolioModal =
  $("#studentPortfolioModal");

const studentPortfolioImage =
  $("#studentPortfolioImage");

const studentPosterPlaceholder =
  $("#studentPosterPlaceholder");

const studentPortfolioClose =
  $("#studentPortfolioClose");

const studentPortfolioBackdrop =
  $("#studentPortfolioBackdrop");

/*
 * Save the element that opened the popup.
 * This allows us to return focus to it
 * after closing.
 */

let lastLeadershipCard = null;


/* ---------- open profile ---------- */

function openLeadershipProfile(card) {

  if (
    !leadershipModal ||
    !card
  ) {
    return;
  }


  lastLeadershipCard =
    card;
if (studentPortfolioButton) {

  const isStudentBoard =
    card.classList.contains("board-card");

  if (isStudentBoard) {
    studentPortfolioButton.hidden = false;
  } else {
    studentPortfolioButton.hidden = true;
  }

}

  const name =
    card.dataset.name || "Environmental Club";


  const role =
    card.dataset.role || "";


  const chapter =
    card.dataset.chapter || "";


  const bio =
    card.dataset.bio || "";


  const portrait =
    card.dataset.portrait || "";


  leadershipProfileName.textContent =
    name;


  leadershipProfileRole.textContent =
    role;


  leadershipProfileChapter.textContent =
    chapter;


  leadershipProfileBio.textContent =
    bio;


  /*
   * Reset portrait state.
   */

  leadershipProfileImage.classList.remove(
    "loaded"
  );

  leadershipProfileImage.removeAttribute(
    "src"
  );

  leadershipProfileImage.alt =
    `${name} portrait`;


  leadershipProfilePlaceholder.textContent =
    getProfileInitials(name);


  /*
   * Load actual portrait if it exists.
   */

  if (portrait) {

    leadershipProfileImage.onload =
      () => {

        leadershipProfileImage.classList.add(
          "loaded"
        );

        leadershipProfilePlaceholder.style.display =
          "none";

      };


    leadershipProfileImage.onerror =
      () => {

        leadershipProfileImage.classList.remove(
          "loaded"
        );

        leadershipProfilePlaceholder.style.display =
          "grid";

      };


    leadershipProfileImage.src =
      portrait;

  }


  /*
   * Open modal.
   */

  leadershipModal.classList.add(
    "open"
  );

  leadershipModal.setAttribute(
    "aria-hidden",
    "false"
  );


  /*
   * Prevent the page underneath
   * from scrolling.
   */

  document.body.style.overflow =
    "hidden";


  /*
   * Put keyboard focus on close.
   */

  setTimeout(() => {

    leadershipProfileClose?.focus();

  }, 120);

}


/* ---------- initials fallback ---------- */

function getProfileInitials(name) {

  if (!name) return "EC";


  const words =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean);


  if (words.length === 1) {

    return words[0]
      .slice(0, 2)
      .toUpperCase();

  }


  return (
    words[0][0] +
    words[words.length - 1][0]
  ).toUpperCase();

}


/* ==========================================================
   LEADERSHIP CARD PROFILE TRIGGERS
   Works with institutional leadership,
   chapter coordinators and student executive board.
   ========================================================== */

/*
 * Find every leadership card using the existing
 * leadership card classes.
 *
 * This deliberately does NOT depend only on
 * .leadership-profile-card because the existing
 * HTML uses different classes for different
 * leadership groups.
 */

const leadershipCards = $$(
  ".leader-feature, .coordinator-card, .board-card"
);


/* ---------- attach profile behaviour ---------- */

leadershipCards.forEach(card => {

  /*
   * Make the card keyboard accessible.
   */

  card.setAttribute(
    "tabindex",
    "0"
  );

  card.setAttribute(
    "role",
    "button"
  );


  /*
   * Clicking the CTA opens the profile.
   *
   * stopPropagation prevents the same click
   * from travelling up to the card handler.
   */

  const profileButton =
    card.querySelector(".profile-card-cta");


  profileButton?.addEventListener(
    "click",
    event => {

      event.preventDefault();

      event.stopPropagation();

      openLeadershipProfile(card);

    }
  );
function openStudentPortfolio() {

  if (
    !studentPortfolioModal ||
    !lastLeadershipCard
  ) {
    return;
  }

  const poster =
    lastLeadershipCard.dataset.poster || "";

  studentPortfolioImage.removeAttribute("src");

  studentPortfolioImage.classList.remove(
    "loaded"
  );

  studentPosterPlaceholder.style.display =
    "flex";

  if (poster) {

    studentPortfolioImage.onload = () => {

      studentPortfolioImage.classList.add(
        "loaded"
      );

      studentPosterPlaceholder.style.display =
        "none";

    };

    studentPortfolioImage.onerror = () => {

      studentPortfolioImage.classList.remove(
        "loaded"
      );

      studentPosterPlaceholder.style.display =
        "flex";

    };

    studentPortfolioImage.src =
      poster;

  }

  studentPortfolioModal.classList.add(
    "open"
  );

  studentPortfolioModal.setAttribute(
    "aria-hidden",
    "false"
  );

}
studentPortfolioButton?.addEventListener(
  "click",
  event => {

    event.preventDefault();
    event.stopPropagation();

    openStudentPortfolio();

  }
);
function closeStudentPortfolio() {

  if (!studentPortfolioModal) {
    return;
  }

  studentPortfolioModal.classList.remove(
    "open"
  );

  studentPortfolioModal.setAttribute(
    "aria-hidden",
    "true"
  );

  studentPortfolioImage.removeAttribute(
    "src"
  );

  studentPortfolioImage.classList.remove(
    "loaded"
  );

  studentPosterPlaceholder.style.display =
    "flex";

}


studentPortfolioClose?.addEventListener(
  "click",
  closeStudentPortfolio
);


studentPortfolioBackdrop?.addEventListener(
  "click",
  closeStudentPortfolio
);

  /*
   * Clicking anywhere else on the card
   * opens the same profile.
   */

  card.addEventListener(
    "click",
    event => {

      /*
       * If the CTA was clicked, its own
       * handler already opened the profile.
       */

      if (
        event.target.closest(
          ".profile-card-cta"
        )
      ) {
        return;
      }


      openLeadershipProfile(card);

    }
  );


  /*
   * Keyboard support.
   */

  card.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Enter" ||
        event.key === " "
      ) {

        event.preventDefault();

        openLeadershipProfile(card);

      }

    }
  );

});


/* ---------- close profile ---------- */

function closeLeadershipProfile() {

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


  /*
   * Return focus to the card
   * that opened the profile.
   */

  lastLeadershipCard?.focus();

}


/* ---------- close buttons ---------- */

leadershipProfileClose?.addEventListener(
  "click",
  closeLeadershipProfile
);


$$(
  "[data-profile-close]"
).forEach(
  element => {

    element.addEventListener(
      "click",
      closeLeadershipProfile
    );

  }
);


/* ---------- backdrop close ---------- */

leadershipModal?.addEventListener(
  "click",
  event => {

    if (
      event.target.classList.contains(
        "leadership-modal-backdrop"
      )
    ) {

      closeLeadershipProfile();

    }

  }
);


/* ==========================================================
   KEYBOARD CONTROLS
   ========================================================== */

document.addEventListener(
  "keydown",
  event => {

    if (event.key !== "Escape") {
      return;
    }


    /*
     * Close leadership profile first.
     */

    if (
      leadershipModal?.classList.contains(
        "open"
      )
    ) {

      closeLeadershipProfile();

      return;

    }


    /*
     * Otherwise close gallery.
     */

    closeLightbox();

  }
);


/* ==========================================================
   ANIMATED IMPACT STATISTICS
   ========================================================== */

const impactRow =
  $(".impact-row");


if (impactRow) {

  const countElements =
    $$(".impact-number[data-count]", impactRow);


  const animateCounter =
    element => {

      const target =
        Number(
          element.dataset.count
        );


      if (
        !Number.isFinite(target)
      ) {
        return;
      }


      const suffix =
        element.dataset.suffix || "";


      const pad =
        Number(
          element.dataset.pad || 0
        );


      const duration =
        700;


      const startTime =
        performance.now();


      function updateCounter(
        currentTime
      ) {

        const progress =
          Math.min(
            (
              currentTime -
              startTime
            ) / duration,
            1
          );


        /*
         * Fast start,
         * smooth finish.
         */

        const eased =
          1 -
          Math.pow(
            1 - progress,
            3
          );


        const value =
          Math.round(
            target * eased
          );


        element.textContent =
          String(value)
            .padStart(
              pad,
              "0"
            ) +
          suffix;


        if (
          progress < 1
        ) {

          requestAnimationFrame(
            updateCounter
          );

        } else {

          element.textContent =
            String(target)
              .padStart(
                pad,
                "0"
              ) +
            suffix;

        }

      }


      requestAnimationFrame(
        updateCounter
      );

    };


  const statsObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(
          entry => {

            if (
              !entry.isIntersecting
            ) {
              return;
            }


            countElements.forEach(
              element => {
                animateCounter(
                  element
                );
              }
            );


            statsObserver.unobserve(
              entry.target
            );

          }
        );

      },
      {
        threshold: .45
      }
    );


  statsObserver.observe(
    impactRow
  );

}
/* ==========================================================
   ENVIRONMENTAL GALLERY
   Category → Album → Photos / Videos
   ========================================================== */

(() => {

  /* ----------------------------------------------------------
     ELEMENTS
     ---------------------------------------------------------- */

  const galleryHub =
    document.querySelector("#galleryHub");

  const galleryCategoryView =
    document.querySelector("#galleryCategoryView");

  const galleryAlbumView =
    document.querySelector("#galleryAlbumView");

  const galleryEventGrid =
    document.querySelector("#galleryEventGrid");

  const galleryMediaGrid =
    document.querySelector("#galleryMediaGrid");

  const galleryBackToHub =
    document.querySelector("#galleryBackToHub");

  const galleryBackToCategory =
    document.querySelector("#galleryBackToCategory");

  const galleryCategoryTitle =
    document.querySelector("#galleryCategoryTitle");

  const galleryCategoryDescription =
    document.querySelector("#galleryCategoryDescription");

  const galleryCategoryKicker =
    document.querySelector("#galleryCategoryKicker");

  const galleryAlbumTitle =
    document.querySelector("#galleryAlbumTitle");

  const galleryAlbumDescription =
    document.querySelector("#galleryAlbumDescription");

  const galleryAlbumKicker =
    document.querySelector("#galleryAlbumKicker");


  /* ----------------------------------------------------------
     STOP IF GALLERY IS NOT PRESENT
     ---------------------------------------------------------- */

  if (!galleryHub) {
    return;
  }


  /* ----------------------------------------------------------
     CATEGORY INFORMATION
     ---------------------------------------------------------- */

  const galleryCategories = {

    "events-celebrations": {
      title: "Events & Celebrations",
      kicker: "EVENTS",
      description:
        "Campus moments, celebrations and club milestones."
    },

    "seminars-webinars": {
      title: "Seminars & Webinars",
      kicker: "LEARNING",
      description:
        "Ideas, conversations and environmental knowledge."
    },

    "workshops-training": {
      title: "Workshops & Training",
      kicker: "SKILLS",
      description:
        "Practical learning, skills and hands-on experiences."
    },

    "field-visits": {
      title: "Field Visits & Expeditions",
      kicker: "EXPLORATION",
      description:
        "Learning beyond the classroom and into the field."
    },

    "awareness-campaigns": {
      title: "Awareness Campaigns",
      kicker: "ACTION",
      description:
        "Student-led campaigns for a healthier planet."
    },

    "club-life": {
      title: "Club Life & Memories",
      kicker: "COMMUNITY",
      description:
        "The people, places and moments behind the club."
    }

  };


  /* ----------------------------------------------------------
     STATE
     ---------------------------------------------------------- */

  let currentCategory = null;
  let currentAlbum = null;


  /* ----------------------------------------------------------
     VIEW HELPERS
     ---------------------------------------------------------- */

  function show(element) {

    if (!element) return;

    element.hidden = false;

  }


  function hide(element) {

    if (!element) return;

    element.hidden = true;

  }


  /* ----------------------------------------------------------
     OPEN CATEGORY
     ---------------------------------------------------------- */

  function openGalleryCategory(category) {

    const data =
      galleryCategories[category];

    if (!data) {
      return;
    }

    currentCategory = category;
    currentAlbum = null;


    /* Hide main gallery */

    hide(galleryHub);


    /* Show category page */

    show(galleryCategoryView);

    hide(galleryAlbumView);


    /* Update heading */

    if (galleryCategoryKicker) {

      galleryCategoryKicker.textContent =
        data.kicker;

    }


    if (galleryCategoryTitle) {

      galleryCategoryTitle.textContent =
        data.title;

    }


    if (galleryCategoryDescription) {

      galleryCategoryDescription.textContent =
        data.description;

    }


    /*
     * IMPORTANT:
     * The event/album cards will be inserted
     * here when actual gallery albums are added.
     */

    if (galleryEventGrid) {

      galleryEventGrid.innerHTML = "";


      const albums =
        getAlbumsForCategory(category);


      if (!albums.length) {

        const empty =
          document.createElement("div");

        empty.className =
          "gallery-empty-state";

        empty.innerHTML = `
          <p>GALLERY</p>
          <h3>Albums coming soon.</h3>
          <span>
            Photographs and memories from this category
            will appear here.
          </span>
        `;

        galleryEventGrid.appendChild(
          empty
        );

      } else {

        albums.forEach(album => {

          galleryEventGrid.appendChild(
            createAlbumCard(album)
          );

        });

      }

    }


    /* Scroll to gallery */

    galleryCategoryView?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  }


  /* ----------------------------------------------------------
     ALBUM DATA
     ----------------------------------------------------------

     We are deliberately keeping this separate.

     Your current project does not contain individual
     album folders/data, so the browser cannot automatically
     discover photographs from folders.

     We can add your real albums here later.
     ---------------------------------------------------------- */

  function getAlbumsForCategory(category) {

    /*
     * EMPTY FOR NOW.
     *
     * Example of how an album will eventually look:
     *
     * return [
     *   {
     *     id: "earth-day-2026",
     *     title: "Earth Day 2026",
     *     description: "Earth Day activities...",
     *     cover: "assets/gallery/earth-day-2026/cover.jpg"
     *   }
     * ];
     */

    return [];

  }


  /* ----------------------------------------------------------
     CREATE ALBUM CARD
     ---------------------------------------------------------- */

  function createAlbumCard(album) {

    const card =
      document.createElement("article");

    card.className =
      "gallery-event-card";

    card.tabIndex = 0;

    card.dataset.event =
      album.id;


    card.innerHTML = `

      <div class="gallery-event-image">

        ${
          album.cover
            ? `<img
                 src="${album.cover}"
                 alt="${album.title}"
                 loading="lazy"
               >`
            : ""
        }

      </div>

      <div class="gallery-event-content">

        <small>EVENT ALBUM</small>

        <h3>
          ${album.title}
        </h3>

        <p>
          ${album.description || ""}
        </p>

        <span>
          View Album ↗
        </span>

      </div>

    `;


    card.addEventListener(
      "click",
      () => {

        openGalleryAlbum(
          album
        );

      }
    );


    card.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Enter" ||
          event.key === " "
        ) {

          event.preventDefault();

          openGalleryAlbum(
            album
          );

        }

      }
    );


    return card;

  }


  /* ----------------------------------------------------------
     OPEN ALBUM
     ---------------------------------------------------------- */

  function openGalleryAlbum(album) {

    if (!album) {
      return;
    }


    currentAlbum =
      album;


    hide(galleryCategoryView);

    show(galleryAlbumView);


    if (galleryAlbumKicker) {

      galleryAlbumKicker.textContent =
        "EVENT ALBUM";

    }


    if (galleryAlbumTitle) {

      galleryAlbumTitle.textContent =
        album.title;

    }


    if (galleryAlbumDescription) {

      galleryAlbumDescription.textContent =
        album.description || "";

    }


    if (galleryMediaGrid) {

      galleryMediaGrid.innerHTML = "";


      const media =
        album.media || [];


      if (!media.length) {

        const empty =
          document.createElement("div");

        empty.className =
          "gallery-empty-state";

        empty.innerHTML = `
          <p>ALBUM</p>
          <h3>Photographs coming soon.</h3>
          <span>
            Media for this album will appear here.
          </span>
        `;

        galleryMediaGrid.appendChild(
          empty
        );

      } else {

        media.forEach(item => {

          galleryMediaGrid.appendChild(
            createMediaCard(item)
          );

        });

      }

    }


    galleryAlbumView?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  }


  /* ----------------------------------------------------------
     CREATE MEDIA CARD
     ---------------------------------------------------------- */

  function createMediaCard(item) {

    const card =
      document.createElement("article");

    card.className =
      "gallery-media-item";

    card.tabIndex = 0;


    card.dataset.image =
      item.image || "";

    card.dataset.video =
      item.video || "";

    card.dataset.title =
      item.title || "Environmental Club";

    card.dataset.categoryTitle =
      galleryCategories[
        currentCategory
      ]?.title || "";


    if (item.video) {

      card.innerHTML = `

        <div class="gallery-media-thumb">

          <video
            src="${item.video}"
            muted
            playsinline
            preload="metadata"
          ></video>

          <span class="gallery-media-play">
            ▶
          </span>

        </div>

        <h3>
          ${item.title || "Video"}
        </h3>

      `;

    } else {

      card.innerHTML = `

        <div class="gallery-media-thumb">

          <img
            src="${item.image}"
            alt="${item.title || "Environmental Club"}"
            loading="lazy"
          >

        </div>

        <h3>
          ${item.title || ""}
        </h3>

      `;

    }


    card.addEventListener(
      "click",
      () => {

        openGalleryMedia(
          card
        );

      }
    );


    card.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Enter" ||
          event.key === " "
        ) {

          event.preventDefault();

          openGalleryMedia(
            card
          );

        }

      }
    );


    return card;

  }


  /* ----------------------------------------------------------
     CATEGORY BUTTONS
     ---------------------------------------------------------- */

  document
    .querySelectorAll(
      ".gallery-category-card"
    )
    .forEach(card => {

      card.addEventListener(
        "click",
        () => {

          const category =
            card.dataset.galleryCategory;

          if (!category) {
            return;
          }

          openGalleryCategory(
            category
          );

        }
      );

    });


  /* ----------------------------------------------------------
     BACK TO CATEGORY HUB
     ---------------------------------------------------------- */

  galleryBackToHub?.addEventListener(
    "click",
    () => {

      hide(galleryCategoryView);

      hide(galleryAlbumView);

      show(galleryHub);

      currentCategory = null;
      currentAlbum = null;


      galleryHub?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }
  );


  /* ----------------------------------------------------------
     BACK TO CATEGORY
     ---------------------------------------------------------- */

  galleryBackToCategory?.addEventListener(
    "click",
    () => {

      hide(galleryAlbumView);

      show(galleryCategoryView);


      if (currentCategory) {

        const data =
          galleryCategories[
            currentCategory
          ];

        if (data) {

          if (galleryCategoryKicker) {
            galleryCategoryKicker.textContent =
              data.kicker;
          }

          if (galleryCategoryTitle) {
            galleryCategoryTitle.textContent =
              data.title;
          }

          if (galleryCategoryDescription) {
            galleryCategoryDescription.textContent =
              data.description;
          }

        }

      }


      galleryCategoryView?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }
  );


  /* ==========================================================
     GALLERY LIGHTBOX
     ========================================================== */

  const galleryLightbox =
    document.querySelector(
      "#galleryLightbox"
    );

  const galleryLightboxMedia =
    document.querySelector(
      "#galleryLightboxMedia"
    );

  const galleryLightboxTitle =
    document.querySelector(
      "#galleryLightboxTitle"
    );

  const galleryLightboxType =
    document.querySelector(
      "#galleryLightboxType"
    );

  const galleryLightboxClose =
    document.querySelector(
      "#galleryLightboxClose"
    );


  /* ----------------------------------------------------------
     OPEN MEDIA
     ---------------------------------------------------------- */

  function openGalleryMedia(item) {

    if (!galleryLightbox) {
      return;
    }


    const image =
      item.dataset.image || "";

    const video =
      item.dataset.video || "";

    const title =
      item.dataset.title ||
      "Environmental Club Gallery";


    if (galleryLightboxMedia) {

      galleryLightboxMedia.innerHTML = "";

    }


    if (video) {

      const videoElement =
        document.createElement(
          "video"
        );

      videoElement.src =
        video;

      videoElement.controls =
        true;

      videoElement.autoplay =
        true;

      videoElement.playsInline =
        true;

      galleryLightboxMedia?.appendChild(
        videoElement
      );


      if (galleryLightboxType) {

        galleryLightboxType.textContent =
          "VIDEO";

      }

    }

    else if (image) {

      const imageElement =
        document.createElement(
          "img"
        );

      imageElement.src =
        image;

      imageElement.alt =
        title;

      imageElement.loading =
        "eager";

      galleryLightboxMedia?.appendChild(
        imageElement
      );


      if (galleryLightboxType) {

        galleryLightboxType.textContent =
          "PHOTOGRAPH";

      }

    }


    if (galleryLightboxTitle) {

      galleryLightboxTitle.textContent =
        title;

    }


    galleryLightbox.classList.add(
      "open"
    );

    galleryLightbox.setAttribute(
      "aria-hidden",
      "false"
    );


    document.body.style.overflow =
      "hidden";

  }


  /* ----------------------------------------------------------
     CLOSE LIGHTBOX
     ---------------------------------------------------------- */

  function closeGalleryLightbox() {

    if (!galleryLightbox) {
      return;
    }


    galleryLightbox.classList.remove(
      "open"
    );

    galleryLightbox.setAttribute(
      "aria-hidden",
      "true"
    );


    if (galleryLightboxMedia) {

      galleryLightboxMedia.innerHTML =
        "";

    }


    document.body.style.overflow =
      "";

  }


  galleryLightboxClose?.addEventListener(
    "click",
    closeGalleryLightbox
  );


  galleryLightbox?.addEventListener(
    "click",
    event => {

      if (
        event.target ===
          galleryLightbox ||
        event.target.classList.contains(
          "gallery-lightbox-backdrop"
        )
      ) {

        closeGalleryLightbox();

      }

    }
  );


  /* ----------------------------------------------------------
     ESCAPE KEY
     ---------------------------------------------------------- */

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape" &&
        galleryLightbox?.classList.contains(
          "open"
        )
      ) {

        closeGalleryLightbox();

      }

    }
  );


  /* ----------------------------------------------------------
     INITIAL STATE
     ---------------------------------------------------------- */

  show(galleryHub);

  hide(galleryCategoryView);

  hide(galleryAlbumView);

})();
/* ==========================================================
   EVENT DETAILS
   Events Hub → Event Details
   ========================================================== */

(() => {

  /* ----------------------------------------------------------
     ELEMENTS
     ---------------------------------------------------------- */

  const eventList =
    document.querySelector(".event-list");

  const eventDetailsView =
    document.querySelector("#eventDetailsView");

  const eventBackButton =
    document.querySelector("#eventBackButton");

  const eventDetailsNumber =
    document.querySelector("#eventDetailsNumber");

  const eventDetailsStatus =
    document.querySelector("#eventDetailsStatus");

  const eventDetailsTitle =
    document.querySelector("#eventDetailsTitle");

  const eventDetailsIntro =
    document.querySelector("#eventDetailsIntro");

  const eventDetailsDate =
    document.querySelector("#eventDetailsDate");

  const eventDetailsTime =
    document.querySelector("#eventDetailsTime");

  const eventDetailsVenue =
    document.querySelector("#eventDetailsVenue");

  const eventDetailsDescription =
    document.querySelector("#eventDetailsDescription");

  const eventDetailsHighlights =
    document.querySelector("#eventDetailsHighlights");

  const eventDetailsAction =
    document.querySelector("#eventDetailsAction");

  const eventDetailsActionLabel =
    document.querySelector("#eventDetailsActionLabel");

  const eventDetailsActionText =
    document.querySelector("#eventDetailsActionText");
const eventDetailsActionCard =
  document.querySelector(".event-details-action");

  /* ----------------------------------------------------------
     EVENT INFORMATION
     ---------------------------------------------------------- */

  const eventData = {

"climate-action-week": {
  number: "01 / EVENT",
  status: "UPCOMING",

  title: "Greenspire ’26",

  intro:
        "Where Ideas Take Root. An environmental challenge bringing students together through plantation, problem-solving, creativity, persuasion and negotiation.",


  date:
    "28 September 2026",

  time:
       "1:30 PM to 4:30 PM",


  venue:
    "College of Earth & Environmental Sciences, University of the Punjab, Lahore",

  description:
        "Greenspire ’26 is the Environmental Sciences Chapter's event under Chapter Event Thrill, bringing together student teams to explore environmental issues through practical action, creative thinking and structured problem-solving. The event begins with a plantation activity, followed by the introduction of the Environmental President challenge and a series of environmental problem-solving rounds. Teams will develop practical solutions, present their ideas and use persuasion and negotiation to convince others. The event concludes with the announcement of the winning team and appreciation awards.",


  highlights: [
    "Welcome and introduction to Greenspire ’26",
    "Plantation activity with team saplings",
    "Sapling identification, planting and creative naming",
    "Greenspire ’26 team tagging",
    "Who Will Be the Environmental President introduction",
    "Three environmental problem-solving questions",
    "Team presentations and solution justification",
    "Persuasion and negotiation challenge",
    "Closing ceremony and winner announcement",
    "Greenest Team appreciation award",
    "Best Plant Presentation appreciation award"
  ],

 actionText:
  "Register for Greenspire ’2026 and join the Environmental Sciences Chapter for an afternoon of plantation, environmental challenges, creativity and teamwork.",

actionLabel:
  "Register for Greenspire ’26",

actionUrl:
  "https://forms.gle/8YmtrZCqU3GdptA16"
},


    "green-campus-drive": {
  number: "02 / EVENT",
  status: "UPCOMING",

  title:
    "World Tourism Day 2026",

  intro:
"Digital Tourism. Intelligent Ideas. New Possibilities.",
  date:
"29 September 2026",
  time:
     "To be announced",

  venue:
 "College of Earth & Environmental Sciences, University of the Punjab, Lahore",
  description:
    "The Tourism & Hospitality Management Chapter presents a special departmental event celebrating World Tourism Day 2026. The event explores how Artificial Intelligence, digital transformation, creativity and innovation are reshaping tourism and hospitality. Students will engage in challenges, competitions, discussions and creative activities designed to explore the future of tourism in the digital age.",

  highlights: [
     "AI & the Future of Tourism Panel Discussion",
    "AI in Tourism Challenge",
    "Digital Destination Marketing Competition",
    "Tourism Quiz",
    "AI-Powered Travel Itinerary Challenge",
    "Photography & Reel Competition",
    "Cultural & Culinary Showcase",
    "Expert Session on the Future of Tourism"
  ],

  actionText:
    "Join the Tourism & Hospitality Management Chapter as we explore how AI, digital innovation and creativity are redefining the future of tourism.",

  actionLabel:
    "Event Details",

  actionUrl:
    ""
},
 "eco-heritage": {
  number: "03 / CHANNEL",
  status: "ANNOUNCEMENT",
  title: "EcoHeritage",

  intro:
    "A channel by Prof. Dr. Abdul Qadir exploring nature, culture, heritage and sustainable tourism.",

  date: "NOW LIVE",

  time: "Available Online",

  venue: "EcoHeritage YouTube Channel",

  description:
    "EcoHeritage is the channel of Prof. Dr. Abdul Qadir, featuring content that explores Pakistan’s natural and cultural heritage, tourism, environment and the relationship between people and places. Subscribe to the channel to discover engaging insights and perspectives on the landscapes, traditions and heritage that shape our world.",

  highlights: [
    "Nature and environmental insights",
    "Pakistan’s cultural and natural heritage",
    "Sustainable tourism perspectives",
    "Exploration of destinations and landscapes",
    "Educational and engaging content",
    "Content by Prof. Dr. Abdul Qadir"
  ],

  actionText:
    "Subscribe to EcoHeritage and stay connected with content exploring nature, culture, heritage and sustainable tourism.",

  actionLabel: "Subscribe to EcoHeritage",

  actionUrl:
    "https://www.youtube.com/channel/UCT66nz5Bbn2gP3FDwOZuJKA"
},
  "earth-talks": {
  number: "04 / EVENT",
  status: "EVENT COMPLETED",
  title: "Scientia Spectrum 2026",
  intro: "CEES × UET | A collaborative science event bringing students together through knowledge, creativity and scientific engagement.",
  date: "28 October 2026",
  time: "To be announced",
  venue: "University of Engineering and Technology, Lahore",
  description:
    "Scientia Spectrum 2026 is a collaborative event bringing together students and societies through the UET Science Society's annual magazine and science-focused activities. The Environmental Club, CEES is collaborating with the UET Science Society to promote the event and encourage student participation. Students interested in contributing articles to the annual magazine should submit their articles by 7 September 2026.",
  highlights: [
    "CEES × UET collaboration",
    "Annual Magazine: Scientia Spectrum 2026",
    "Participation of students from different societies",
    "Student engagement and scientific activities",
    "Certificates for all participants upon successful completion",
    "Recognition of collaborating societies"
  ],
  actionText:
    "Register for Scientia Spectrum 2026 and mention Environmental Club, CEES under “From where you came to know about the event”.",
  actionLabel: "Register for Event",
  actionUrl: "https://forms.gle/9WEFxKKRa377j2SU9"
}

  };


  /* ----------------------------------------------------------
     OPEN EVENT
     ---------------------------------------------------------- */

  function openEventDetails(eventId) {

    const data =
      eventData[eventId];

    if (!data) {
      return;
    }


    /* Update content */

    eventDetailsNumber.textContent =
      data.number;

    eventDetailsStatus.textContent =
      data.status;

    eventDetailsTitle.textContent =
      data.title;

    eventDetailsIntro.textContent =
      data.intro;

    eventDetailsDate.textContent =
      data.date;

    eventDetailsTime.textContent =
      data.time;

    eventDetailsVenue.textContent =
      data.venue;

    eventDetailsDescription.textContent =
      data.description;

    eventDetailsActionText.textContent =
      data.actionText;


    /* Update highlights */

    eventDetailsHighlights.innerHTML = "";

    data.highlights.forEach(item => {

      const li =
        document.createElement("li");

      li.textContent =
        item;

      eventDetailsHighlights.appendChild(li);

    });


   /* Take-part card */

/* ----------------------------------------------------------
   TAKE-PART CARD
   ---------------------------------------------------------- */

const actionCard =
  eventDetailsAction?.closest(".event-details-action");

if (data.actionUrl) {

  /* Show the card */
  actionCard.hidden = false;

  /* Show and configure button */
  eventDetailsAction.hidden = false;

  eventDetailsAction.href =
    data.actionUrl;

  eventDetailsActionLabel.textContent =
    data.actionLabel;

  /*
   * Explicitly open the registration link.
   * This also works reliably with forms.gle links.
   */
  eventDetailsAction.onclick = event => {

    event.preventDefault();

    window.open(
      data.actionUrl,
      "_blank",
      "noopener,noreferrer"
    );

  };

} else {

  /* No registration link */
  actionCard.hidden = true;

  eventDetailsAction.hidden = true;

  eventDetailsAction.onclick = null;

}


    /* Switch views */

    eventList.hidden =
      true;

    eventDetailsView.hidden =
      false;


    /* Keep the user at the Events section */

    document
      .querySelector("#events")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

  }


  /* ----------------------------------------------------------
   OPEN BUTTONS + SYNC EVENT STATUS
   ---------------------------------------------------------- */

document
  .querySelectorAll(".event-details-button")
  .forEach(button => {

    const eventId = button.dataset.event;
    const data = eventData[eventId];

    /* Keep the status on the main event card
       synchronized with eventData */

    if (data) {
      const eventRow = button.closest(".event-row");
      const statusElement = eventRow?.querySelector(".event-date b");

      if (statusElement) {
        statusElement.textContent = data.status;
      }
    }

    button.addEventListener(
      "click",
      event => {

        event.preventDefault();

        openEventDetails(eventId);

      }
    );

  });


  /* ----------------------------------------------------------
     BACK TO EVENTS
     ---------------------------------------------------------- */

  eventBackButton?.addEventListener(
    "click",
    () => {

      eventDetailsView.hidden =
        true;

      eventList.hidden =
        false;


      document
        .querySelector("#events")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

    }
  );


})();