document.addEventListener("DOMContentLoaded", (event) => {
gsap.registerPlugin(DrawSVGPlugin,ScrollTrigger,SplitText,CustomEase)

CustomEase.create("loader-ease", "0.625, 0.05, 0, 1");

/* Route page scripts */
const pageType = document.body.getAttribute('data-page');

if (pageType === 'home') {

function initLoader() {

      // loaderAnimation = lottie.loadAnimation({
      //   container: document.getElementById('loader-lottie'), // Your new Div ID
      //   renderer: 'svg',
      //   loop: false,
      //   autoplay: false, // <--- THIS GUARANTEES IT STOPS
      //   path: 'https://cdn.prod.website-files.com/690b30f06b0e2b9223fd700b/6989a9343015b25ab03db813_menu%20start.json'
      // });

  const heading = document.querySelectorAll(".hero-h1");
  const buttons = document.querySelectorAll(".button-wrap, .hero-p");
  const lines = document.querySelectorAll(".nav-line");
  const navMenu = document.querySelectorAll(".nav-link");
  const logo = document.querySelector(".logo");
  const galleryContainer = document.querySelector(".nav-gallery-wrapper");
  const galleryItems = document.querySelectorAll(".nav-gallery-item");

  const tl = gsap.timeline({
    defaults: { ease: "expo.inOut" },
  });

  let split;
  if (heading.length) {
    split = new SplitText(heading, {
      type: "words",
      mask: "words"
    });

    gsap.set(split.words, { yPercent: 130 });
  }

  if (galleryItems.length) {
    tl.from(galleryItems, {
      y: 150,
      opacity: 0,
      stagger: 0.05,
      duration: 1.2,
      ease: "expo.out"
    });
  }

  tl.fromTo(galleryContainer,
    {
      height: "100vh",
      scale: 1.5,
    },
    {
      height: "auto",
      scale: 1,
      ease: "loader-ease",
      duration: 1.5,
      onComplete: () => ScrollTrigger.refresh()
    }, "<0.5"
  );

  if (navMenu.length || logo.length) {
    tl.fromTo([logo, navMenu],
      { yPercent: 100, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        ease: "expo.out",
        duration: 1,
        stagger: 0.07
      }, "<0.2"
    );
  }

  if (split && split.words.length) {
    tl.to(split.words, {
      yPercent: 0,
      stagger: 0.05,
      ease: "expo.out",
      duration: 0.75
    }, "<0.1");
  }

  if (buttons.length) {
    tl.fromTo(buttons,
      { yPercent: 100, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        ease: "expo.out",
        duration: 0.75,
        stagger: 0.2
      }, "<0.2"
    );
  }

  if (lines.length) {
    tl.fromTo(lines,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "expo.out",
        duration: 1,
      }, "<0.2"
    );
  }

// tl.call(() => {
//      loaderAnimation.play();
//   }, null, "<");

}

initLoader();

function initNavMove() {
  const wrapper = document.querySelector(".nav-gallery-list");

  if (!wrapper) return;

  wrapper.addEventListener("mousemove", (e) => {
    const xMove = wrapper.offsetWidth - window.innerWidth;
    
    if (xMove <= 0) return;

    const mousePercent = e.clientX / window.innerWidth;
    const targetX = (0.5 - mousePercent) * xMove;

    gsap.to(wrapper, {
      x: targetX,
      duration: 1,
      ease: "power2.out",
      overwrite: "auto"
    });
  });

  wrapper.addEventListener("mouseleave", () => {
    gsap.to(wrapper, {
      x: 0,
      duration: 1,
      ease: "power2.out",
      overwrite: "auto"
    });
  });
}

initNavMove();


function initDetectScrollingDirection() {
  let lastScrollTop = 0;
  const threshold = 10; // Minimal scroll distance to switch to up/down 
  const thresholdTop = 50; // Minimal scroll distance from top of window to start

  window.addEventListener('scroll', () => {
    const nowScrollTop = window.scrollY;

    if (Math.abs(lastScrollTop - nowScrollTop) >= threshold) {
      // Update Scroll Direction
      const direction = nowScrollTop > lastScrollTop ? 'down' : 'up';
      document.querySelectorAll('[data-scrolling-direction]').forEach(el => 
        el.setAttribute('data-scrolling-direction', direction)
      );

      // Update Scroll Started
      const started = nowScrollTop > thresholdTop;
      document.querySelectorAll('[data-scrolling-started]').forEach(el => 
        el.setAttribute('data-scrolling-started', started ? 'true' : 'false')
      );

      lastScrollTop = nowScrollTop;
    }
  });
}

initDetectScrollingDirection();

/* Text Reveals */
const splitConfig = {
  lines: { duration: 1, stagger: 0.08 },
  words: { duration: 0.6, stagger: 0.06 },
  chars: { duration: 0.4, stagger: 0.01 }
}

function initMaskTextScrollReveal() {
  document.querySelectorAll('[data-split="heading"]').forEach(heading => {
    const type = heading.dataset.splitReveal || 'lines'
    const typesToSplit =
      type === 'lines' ? ['lines'] :
      type === 'words' ? ['lines','words'] :
      ['lines','words','chars']
    
    SplitText.create(heading, {
      type: typesToSplit.join(', '),
      mask: 'lines',
      autoSplit: true,
      linesClass: 'line',
      wordsClass: 'word',
      charsClass: 'letter',
      onSplit: function(instance) {
        const targets = instance[type]
        const config = splitConfig[type]
        
        return gsap.from(targets, {
          yPercent: 110,
          duration: config.duration,
          stagger: config.stagger,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: heading,
            start: 'clamp(top 80%)',
            once: true
          }
        });
      }
    })
  })
}

  let headings = document.querySelectorAll('[data-split="heading"]')
  
  headings.forEach(heading => {
    gsap.set(heading, { autoAlpha: 1 })
  });


initMaskTextScrollReveal();


 /* Global Parallax Setup */
function initGlobalParallax() {
  const mm = gsap.matchMedia()

  mm.add(
    {
      isMobile: "(max-width:479px)",
      isMobileLandscape: "(max-width:767px)",
      isTablet: "(max-width:991px)",
      isDesktop: "(min-width:992px)"
    },
    (context) => {
      const { isMobile, isMobileLandscape, isTablet } = context.conditions

      const ctx = gsap.context(() => {
        document.querySelectorAll('[data-parallax="trigger"]').forEach((trigger) => {
            // Check if this trigger has to be disabled on smaller breakpoints
            const disable = trigger.getAttribute("data-parallax-disable")
            if (
              (disable === "mobile" && isMobile) ||
              (disable === "mobileLandscape" && isMobileLandscape) ||
              (disable === "tablet" && isTablet)
            ) {
              return
            }
            
            // Optional: you can target an element inside a trigger if necessary 
            const target = trigger.querySelector('[data-parallax="target"]') || trigger

            // Get the direction value to decide between xPercent or yPercent tween
            const direction = trigger.getAttribute("data-parallax-direction") || "vertical"
            const prop = direction === "horizontal" ? "xPercent" : "yPercent"
            
            // Get the scrub value, our default is 'true' because that feels nice with Lenis
            const scrubAttr = trigger.getAttribute("data-parallax-scrub")
            const scrub = scrubAttr ? parseFloat(scrubAttr) : true
            
            // Get the start position in % 
            const startAttr = trigger.getAttribute("data-parallax-start")
            const startVal = startAttr !== null ? parseFloat(startAttr) : 20
            
            // Get the end position in %
            const endAttr = trigger.getAttribute("data-parallax-end")
            const endVal = endAttr !== null ? parseFloat(endAttr) : -20
            
            // Get the start value of the ScrollTrigger
            const scrollStartRaw = trigger.getAttribute("data-parallax-scroll-start") || "top bottom"
            const scrollStart = `clamp(${scrollStartRaw})`
            
           // Get the end value of the ScrollTrigger  
            const scrollEndRaw = trigger.getAttribute("data-parallax-scroll-end") || "bottom top"
            const scrollEnd = `clamp(${scrollEndRaw})`

            gsap.fromTo(
              target,
              { [prop]: startVal },
              {
                [prop]: endVal,
                ease: "none",
                scrollTrigger: {
                  trigger,
                  start: scrollStart,
                  end: scrollEnd,
                  scrub,
                },
              }
            )
          })
      })

      return () => ctx.revert()
    }
  )
}

initGlobalParallax();


function initModalBasic() {

  const modalGroup = document.querySelector('[data-modal-group-status]');
  const modals = document.querySelectorAll('[data-modal-name]');
  const modalTargets = document.querySelectorAll('[data-modal-target]');

  // Open modal
  modalTargets.forEach((modalTarget) => {
    modalTarget.addEventListener('click', function () {
      const modalTargetName = this.getAttribute('data-modal-target');

      // Close all modals
      modalTargets.forEach((target) => target.setAttribute('data-modal-status', 'not-active'));
      modals.forEach((modal) => modal.setAttribute('data-modal-status', 'not-active'));

      // Activate clicked modal
      document.querySelector(`[data-modal-target="${modalTargetName}"]`).setAttribute('data-modal-status', 'active');
      document.querySelector(`[data-modal-name="${modalTargetName}"]`).setAttribute('data-modal-status', 'active');

      // Set group to active
      if (modalGroup) {
        modalGroup.setAttribute('data-modal-group-status', 'active');
      }
    });
  });

  // Close modal
  document.querySelectorAll('[data-modal-close]').forEach((closeBtn) => {
    closeBtn.addEventListener('click', closeAllModals);
  });

  // Close modal on `Escape` key
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeAllModals();
    }
  });

  // Function to close all modals
  function closeAllModals() {
    modalTargets.forEach((target) => target.setAttribute('data-modal-status', 'not-active'));
    
    if (modalGroup) {
      modalGroup.setAttribute('data-modal-group-status', 'not-active');
    }
  }
}

initModalBasic();


/*  Image Reveal */
function revealImages() {
  const images = document.querySelectorAll("[reveal-img]");

  images.forEach((img) => {
    gsap.fromTo(img,
      { clipPath: "inset(50% 50% 50% 50%)" },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "power2.out",
        scrollTrigger: {
          trigger: img,
          start: "top 90%",
          end: "bottom 75%",
          scrub: true,
        }
      }
    );
  });
}

revealImages();

/* Values Section Reveal */
function initRevealValue() {
  
  let mm = gsap.matchMedia();

  mm.add({
    isMobile: "(max-width: 768px)",
    isDesktop: "(min-width: 769px)",
  }, (context) => {
    
    let { isMobile, isDesktop } = context.conditions;

    gsap.from(".values-item", {
      x: isMobile ? "200vw" : window.innerWidth,
      scale: isMobile ? 2 : 5,                                  
      ease: "expo.out",
      stagger: 0.1,
      scrollTrigger: {
        trigger: ".about-container",
        start: "top 75%",
        end: "bottom top",
        scrub: true,
      }
    });

  });
}

initRevealValue();

function initDrawPathOnScroll() {
  const mm = gsap.matchMedia();
  const wrappers = document.querySelectorAll("[data-draw-scroll-wrap]");

  mm.add(
    {
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)"
    },
    (context) => {
      const { isDesktop, isMobile } = context.conditions;

      wrappers.forEach((wrap) => {
        // Kill any previous timeline for this wrapper
        if (wrap._drawTl) {
          if (wrap._drawTl.scrollTrigger) {
            wrap._drawTl.scrollTrigger.kill();
          }
          wrap._drawTl.kill();
          wrap._drawTl = null;
        }

        const desktopSVG = wrap.querySelector("[data-draw-scroll-desktop]");
        const mobileSVG  = wrap.querySelector("[data-draw-scroll-mobile]"); // optional

        // default: desktop
        let svgToUse = desktopSVG;

        // on mobile, use mobileSVG if it exists
        if (isMobile && mobileSVG) {
          svgToUse = mobileSVG;
        }

        if (!svgToUse) return;

        const path = svgToUse.querySelector("[data-draw-scroll-path]");
        if (!path) return;

        const tl = gsap.timeline({
          defaults: {
            ease: "linear" // scroll speed controls easing
          },
          scrollTrigger: {
            trigger: wrap,
            start: "clamp(top center)",  // When top of wrap reaches center of viewport
            end: "clamp(bottom center)", // When bottom of wrap reaches center of viewport
            scrub: true,
            invalidateOnRefresh: true
          }
        });

        tl.fromTo(path,
          { drawSVG: 0 },
          { drawSVG: "100%", duration: 1 }
        );

        // Keep a reference so we can kill it on breakpoint change
        wrap._drawTl = tl;
      });

      // Make sure ScrollTrigger recalculates
      ScrollTrigger.refresh();

      // Cleanup when breakpoint changes
      return () => {
        wrappers.forEach((wrap) => {
          if (wrap._drawTl) {
            if (wrap._drawTl.scrollTrigger) {
              wrap._drawTl.scrollTrigger.kill();
            }
            wrap._drawTl.kill();
            wrap._drawTl = null;
          }
        });
      };
    }
  );
}

initDrawPathOnScroll();


/* Cards Fanning Animation */
function initCardFan() {
  const cards = document.querySelectorAll('.menu-item');
  const wrapper = document.querySelector('.menu-list');
  const section = document.querySelector('.section_menu');

  if (!wrapper || cards.length === 0) return;

  ScrollTrigger.getAll().forEach(t => {
    if (t.trigger === section) t.kill();
  });


  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: wrapper,
      start: "top 90%",
      end: "center 90%",
      scrub: false,
    }
  });

  
  tl.from(cards, {
    x: (index, target) => {
      const wrapperRect = wrapper.getBoundingClientRect();
      const cardRect = target.getBoundingClientRect();
      
      // Center of wrapper
      const wrapperCenter = wrapperRect.left + (wrapperRect.width / 2);
      // Center of current card
      const cardCenter = cardRect.left + (cardRect.width / 2);
      
      // The distance needed to move this card to the exact center of the wrapper
      return wrapperCenter - cardCenter;
    },
    y: (index) => {
      // Add a little randomness to Y so it looks like a messy pile
      return index % 2 === 0 ? 10 : -5;
    },
    rotation: (index) => {
      // Fan the rotation out based on index
      // Center cards rotate less, outer cards rotate more
      // Example for 4 cards: -15, -5, 5, 15
      const middle = (cards.length - 1) / 2;
      return (index - middle) * 3; // 10 degrees separation
    },
    scale: 0.9, // Start slightly smaller
    boxShadow: "0px 0px 0px 0px rgba(0,0,0,0)", // Hide shadows when stacked
    duration: 1.25,
    ease: "loader-ease",
    stagger: {
      amount: 0.1, // Slight offset between cards starting their move
      from: "center"
    }
  });
}

initCardFan();


 /* Accordion Faqs */
function initAccordionCSS() {
  document.querySelectorAll('[data-accordion-css-init]').forEach((accordion) => {
    const closeSiblings = accordion.getAttribute('data-accordion-close-siblings') === 'true';

    accordion.addEventListener('click', (event) => {
      const toggle = event.target.closest('[data-accordion-toggle]');
      if (!toggle) return; // Exit if the clicked element is not a toggle

      const singleAccordion = toggle.closest('[data-accordion-status]');
      if (!singleAccordion) return; // Exit if no accordion container is found

      const isActive = singleAccordion.getAttribute('data-accordion-status') === 'active';
      singleAccordion.setAttribute('data-accordion-status', isActive ? 'not-active' : 'active');
      
      // When [data-accordion-close-siblings="true"]
      if (closeSiblings && !isActive) {
        accordion.querySelectorAll('[data-accordion-status="active"]').forEach((sibling) => {
          if (sibling !== singleAccordion) sibling.setAttribute('data-accordion-status', 'not-active');
        });
      }
    });
  });
}

initAccordionCSS();

// /* Wheel Animation */
function initProcessAnimation() {
  gsap.registerPlugin(ScrollTrigger);

  const wheelCircle = document.querySelector('.wheel circle');
  
  // Define precise checkpoints for each step based on the clock position
  // 0.0 = 12 o'clock (Top)
  // 0.25 = 3 o'clock (Right)
  // 0.375 = ~4:30 (Bottom Right)
  // 0.5 = 6 o'clock (Bottom) - This is Step 4
  // 0.75 = 9 o'clock (Left)
  const steps = [
    { threshold: 0.0,   class: '.is--1', imgIndex: 0 }, // Top
    { threshold: 0.25,  class: '.is--2', imgIndex: 1 }, // Right
    { threshold: 0.42,  class: '.is--3', imgIndex: 2 }, // Bot-Right
    { threshold: 0.58,   class: '.is--4', imgIndex: 3 }, // Bottom
    { threshold: 0.75,  class: '.is--5', imgIndex: 4 }  // Left
  ];

  // 1. Setup Wheel Stroke
  const radius = wheelCircle.getAttribute('r');
  const circumference = 2 * Math.PI * radius;
  
  gsap.set(wheelCircle, {
    strokeDasharray: circumference,
    strokeDashoffset: circumference // Start empty
  });

  // 2. Create Timeline linked to Scroll
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".process-track",
      start: "top top", 
      end: "bottom bottom", 
      scrub: 0.5, // Slight smoothing for better feel
      onUpdate: (self) => updateActiveStep(self.progress)
    }
  });

  // 3. Animate Wheel Filling 
  tl.to(wheelCircle, {
    strokeDashoffset: 0,
    ease: "none",
    duration: 1
  });

  // 4. Logic to update active classes based on progress
  function updateActiveStep(progress) {
    // Find the step that corresponds to the current progress
    // We reverse the array to find the *last* threshold passed
    let activeStepIndex = 0;
    
    // Check which zone we are in
    if (progress >= 0.75) activeStepIndex = 4;      // Step 5
    else if (progress >= 0.58) activeStepIndex = 3;  // Step 4
    else if (progress >= 0.42) activeStepIndex = 2; // Step 3
    else if (progress >= 0.25) activeStepIndex = 1; // Step 2
    else activeStepIndex = 0;                       // Step 1

    // Update classes only if necessary (performance optimization)
    const currentActiveDot = document.querySelector(`.process-dot.is-active`);
    const newDotClass = steps[activeStepIndex].class;
    
    // Only update DOM if the active step has changed
    if (!currentActiveDot || !currentActiveDot.classList.contains(newDotClass.replace('.',''))) {
      
      // Reset all
      document.querySelectorAll('.label-item, .step-img, .process-dot').forEach(el => {
        el.classList.remove('is-active');
      });

      // Activate new elements using the shared class suffix (e.g., .is--4)
      const targetSuffix = steps[activeStepIndex].class;
      
      // 1. Activate Dot
      const dot = document.querySelector(`.process-dot${targetSuffix}`);
      if(dot) dot.classList.add('is-active');

      // 2. Activate Label
      const label = document.querySelector(`.label-item${targetSuffix}`);
      if(label) label.classList.add('is-active');

      // 3. Activate Image
      // We map images by index to ensure 100% accuracy
      const images = document.querySelectorAll('.center-images-container .step-img');
      if(images[steps[activeStepIndex].imgIndex]) {
        images[steps[activeStepIndex].imgIndex].classList.add('is-active');
      }
    }
  }
}

initProcessAnimation();


  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
  });
  
  document.fonts.ready.then(() => {
    ScrollTrigger.refresh();
  });

}

/* MOBILE MENU */
function initMobileMenu() {
  if (window.matchMedia("(max-width: 991px)").matches) {
    const menuBtn = document.querySelector(".nav-menu-btn");
    const menuBg = document.querySelector(".menu-bg");
    const navMobile = document.querySelector(".nav-mobile");
    const navLogo = document.querySelector(".logo");

    if (!menuBtn || !menuBg || !navMobile || !navLogo) return;

    // Initial states
    gsap.set(menuBg, { height: "0%" });
    gsap.set(navMobile, { opacity: 0, display: "none" });

    // Timeline
    const tl = gsap.timeline({ paused: true, reversed: true });

    tl.to(menuBg, {
      display: "block",
      height: "100vh",
      duration: 0.5,
      ease: "power2.inOut",
    })
      .set(navMobile, { display: "flex" }, "-=0.3") // make it appear in layout
      .to(navMobile, { opacity: 1, duration: 0.1 }, "<"); // fade it in

    // Toggle logic
    menuBtn.addEventListener("click", () => {
      if (tl.reversed()) {
        tl.play();
        document.body.style.overflow = "hidden";
        document.body.classList.add("menu-open");
      } else {
        // fade out nav before collapsing bg
        gsap.to(navMobile, { opacity: 0, duration: 0.2, ease: "expo.out" });
        tl.reverse();
        document.body.style.overflow = "";
        document.body.classList.remove("menu-open");
      }
    });
  }
}

initMobileMenu();

if (pageType === 'legal') {
    const richText = document.querySelector(".legal-text");
    const anchorMenu = document.querySelector(".legal-sticky-nav");

    if (!richText || !anchorMenu) return;

    // Clear any existing menu items (in case of rerender)
    anchorMenu.innerHTML = "";

    const headings = richText.querySelectorAll("h2");
    const usedIds = new Set(); // To ensure uniqueness

    headings.forEach((heading, index) => {
      // Generate a slug from the heading text
      let slug = heading.textContent
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')        // Remove punctuation
        .replace(/\s+/g, '-')            // Replace spaces with hyphens
        .replace(/-+/g, '-');            // Remove duplicate hyphens

      // Ensure ID is unique by appending a number if needed
      let uniqueSlug = slug;
      let counter = 1;
      while (usedIds.has(uniqueSlug)) {
        uniqueSlug = `${slug}-${counter++}`;
      }
      usedIds.add(uniqueSlug);

      heading.id = uniqueSlug;

      // Create link element
      const link = document.createElement("a");
      link.href = `#${uniqueSlug}`;
      link.textContent = heading.textContent;
      link.classList.add("anchor-link"); // Optional styling class

      anchorMenu.appendChild(link);
    });
} 

});

