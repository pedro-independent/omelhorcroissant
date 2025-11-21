gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);


/* LOADER */
// Custom Ease for Loader
CustomEase.create("loader-ease", "0.625, 0.05, 0, 1");

// Loading Animation
function initLoader() {

  const heading = document.querySelectorAll(".hero-h1");
  const buttons = document.querySelectorAll(".button-wrap, .hero-p");
  const lines = document.querySelectorAll(".nav-line");
  const navMenu = document.querySelectorAll(".nav-link");
  const logo = document.querySelector(".logo");
  const galleryContainer = document.querySelector(".nav-gallery-wrapper");
  const galleryItems = document.querySelectorAll(".nav-gallery-item");
  
  
  /* GSAP Timeline */
  const tl = gsap.timeline({
    defaults: {
      ease: "expo.inOut",
    },

  });
  
  /* GSAP SplitText */
  let split;
  if (heading.length) {
    split = new SplitText(heading, {
      type: "words",
      mask: "words"
    });

    gsap.set(split.words, {
      yPercent: 130,
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
        duration: 1,
        onComplete: () => {
      ScrollTrigger.refresh(); 
    }
      }, "<0.2");

  
if (navMenu.length || logo.length) {
    tl.fromTo([logo, navMenu],
      {
        yPercent: 100,
        opacity: 0
      },
      {
        yPercent: 0,
        opacity: 1,
        ease: "expo.out",
        duration: 1,
        stagger: 0.07
      }, "<0.2");
  }

  if (split && split.words.length) {
    tl.to(split.words, {
      yPercent: 0,
      stagger: 0.05,
      ease: "expo.out",
      duration: .75
    }, "< 0.1");
  }
  
  if (buttons.length) {
    tl.fromTo(buttons,
      {
        yPercent: 100,
        opacity: 0
      },
      {
        yPercent: 0,
        opacity: 1,
        ease: "expo.out",
        duration: .75,
        stagger: 0.2
      }, "<0.2");
  }

  if (lines.length) {
    tl.fromTo(lines,
      {
        scaleX: 0,
      },
      {
        scaleX: 1,
        ease: "expo.out",
        duration: 1,
      }, "<0.2");
  }


}
  
initLoader();

function initHoverMove() {
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

initHoverMove();

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

initMaskTextScrollReveal()


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

initGlobalParallax()

/* About Section Image Animation */
function animateAboutImages() {
  const images = document.querySelectorAll(".about-img");

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

animateAboutImages()


