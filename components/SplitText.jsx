"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Free-tier SplitText replacement.
 * Manually splits text into <span> chars/words instead of using the
 * paid gsap/SplitText plugin, then animates with plain GSAP + ScrollTrigger.
 */
const SplitText = ({
  text,
  className = "",
  delay = 50,
  duration = 1.25,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  tag = "p",
  onLetterAnimationComplete,
}) => {
  const ref = useRef(null);
  const animationCompletedRef = useRef(false);
  const onCompleteRef = useRef(onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.fonts && document.fonts.status === "loaded") {
      setFontsLoaded(true);
    } else if (document.fonts) {
      document.fonts.ready.then(() => setFontsLoaded(true));
    } else {
      setFontsLoaded(true);
    }
  }, []);

  const renderSplitChildren = () => {
    if (!text) return null;
    if (splitType === "words") {
      const words = text.split(" ");
      return words.map((word, i) => (
        <span key={i} className="split-word inline-block overflow-hidden" style={{ whiteSpace: "pre" }}>
          {word + (i < words.length - 1 ? "\u00A0" : "")}
        </span>
      ));
    }
    return text.split(" ").map((word, wi, arr) => (
      <span key={wi} className="inline-block whitespace-nowrap">
        {word.split("").map((char, ci) => (
          <span key={ci} className="split-char inline-block">{char}</span>
        ))}
        {wi < arr.length - 1 ? <span className="inline-block">&nbsp;</span> : null}
      </span>
    ));
  };

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded) return;
      if (animationCompletedRef.current) return;

      const el = ref.current;
      const targets = el.querySelectorAll(splitType === "words" ? ".split-word" : ".split-char");
      if (!targets.length) return;

      const startPct = (1 - threshold) * 100;
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
      const marginUnit = marginMatch ? marginMatch[2] || "px" : "px";
      const sign =
        marginValue === 0 ? "" :
        marginValue < 0 ? `-=${Math.abs(marginValue)}${marginUnit}` :
        `+=${marginValue}${marginUnit}`;
      const start = `top ${startPct}%${sign}`;

      const tween = gsap.fromTo(targets, { ...from }, {
        ...to,
        duration,
        ease,
        stagger: delay / 1000,
        scrollTrigger: { trigger: el, start, once: true, fastScrollEnd: true, anticipatePin: 0.4 },
        onComplete: () => {
          animationCompletedRef.current = true;
          onCompleteRef.current?.();
        },
        willChange: "transform, opacity",
        force3D: true,
      });

      return () => {
        ScrollTrigger.getAll().forEach((st) => { if (st.trigger === el) st.kill(); });
        tween.kill();
      };
    },
    {
      dependencies: [text, delay, duration, ease, splitType, JSON.stringify(from), JSON.stringify(to), threshold, rootMargin, fontsLoaded],
      scope: ref,
    }
  );

  const Tag = tag || "p";
  const style = { textAlign, wordWrap: "break-word", willChange: "transform, opacity" };
  const classes = `split-parent overflow-hidden inline-block whitespace-normal ${className}`;

  return (
    <Tag ref={ref} className={classes} style={style}>
      {renderSplitChildren()}
    </Tag>
  );
};

export default SplitText;
