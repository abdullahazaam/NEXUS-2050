import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
export const cityMotion = { phase: 0, progress: 0 };
export function useCityMotion(reduced: boolean) {
  useEffect(() => {
    cityMotion.progress = 0;
    cityMotion.phase = 0;
    if (reduced) return;
    const context = gsap.context(() => {
      const copy = document.querySelector<HTMLElement>(".hero-content");
      const stage = document.querySelector<HTMLElement>(".journey-stage");
      const phase = document.querySelector(".journey-phase");
      const timeline = gsap.timeline({
        scrollTrigger: {
          id: "city-journey",
          trigger: "#overview",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.35,
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          if (copy) copy.inert = cityMotion.progress > 0.25;
          if (stage) stage.dataset.progress = cityMotion.progress.toFixed(3);
          if (phase)
            phase.textContent = [
              "01 / DAWN",
              "02 / ACTIVE DAYTIME",
              "03 / HIGH-DEMAND EVENING",
              "04 / INTELLIGENT NIGHT",
            ][Math.min(3, Math.floor(cityMotion.phase + 0.2))];
        },
      });
      timeline
        .fromTo(
          cityMotion,
          { progress: 0, phase: 0 },
          { progress: 1, phase: 3, duration: 1, ease: "none" },
          0,
        )
        .to(
          ".hero-content",
          { autoAlpha: 0, y: -45, duration: 0.15, ease: "power1.inOut" },
          0.09,
        )
        .to(
          ".hero-coordinate, .hero-bottom, .city-axis",
          { autoAlpha: 0, duration: 0.12 },
          0.12,
        )
        .to(".city-vignette", { opacity: 0.2, duration: 0.2 }, 0.12)
        .fromTo(
          ".journey-outro",
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.1 },
          0.87,
        )
        .to(".journey-blend", { opacity: 1, duration: 0.14 }, 0.86);
      gsap.to(document.body, {
        backgroundColor: "#0b1821",
        ease: "none",
        scrollTrigger: {
          trigger: "#systems",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
      gsap.to(document.body, {
        backgroundColor: "#070e17",
        ease: "none",
        scrollTrigger: {
          trigger: "#simulation",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          },
        );
      });
    });
    return () => {
      context.revert();
      const copy = document.querySelector<HTMLElement>(".hero-content");
      if (copy) copy.inert = false;
      const phase = document.querySelector(".journey-phase");
      if (phase) phase.textContent = "01 / DAWN";
      const stage = document.querySelector<HTMLElement>(".journey-stage");
      if (stage) stage.dataset.progress = "0";
      cityMotion.progress = 0;
      cityMotion.phase = 0;
    };
  }, [reduced]);
}
