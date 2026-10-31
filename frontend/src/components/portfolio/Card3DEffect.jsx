import { useEffect } from "react";

/**
 * Micro-Interactive 3D Card Engine:
 * Gives every `.card-3d` element dynamic cursor-following 3D tilt,
 * radial glare reflection, and smooth spring physics.
 */
export default function Card3DEffect() {
  useEffect(() => {
    // Check if fine pointer is available
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let activeCard = null;

    const handlePointerMove = (e) => {
      const target = e.target.closest(".card-3d");

      if (activeCard && activeCard !== target) {
        // Reset previously active card
        resetCard(activeCard);
        activeCard = null;
      }

      if (!target) return;

      activeCard = target;
      const rect = target.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      // Calculate tilt angles (degrees)
      const maxTilt = 12;
      const tiltX = (0.5 - y) * (maxTilt * 2);
      const tiltY = (x - 0.5) * (maxTilt * 2);

      target.style.setProperty("--mouse-x", `${(x * 100).toFixed(2)}%`);
      target.style.setProperty("--mouse-y", `${(y * 100).toFixed(2)}%`);
      target.style.setProperty("--glare-opacity", "0.15");
      target.style.transform = `perspective(1100px) rotateX(${tiltX.toFixed(
        2
      )}deg) rotateY(${tiltY.toFixed(2)}deg) translateZ(10px) scale3d(1.02, 1.02, 1.02)`;
    };

    const handlePointerOut = (e) => {
      if (activeCard && (!e.relatedTarget || !activeCard.contains(e.relatedTarget))) {
        resetCard(activeCard);
        activeCard = null;
      }
    };

    const resetCard = (card) => {
      if (!card) return;
      card.style.setProperty("--glare-opacity", "0");
      card.style.transform = "";
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerout", handlePointerOut, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerout", handlePointerOut);
      if (activeCard) resetCard(activeCard);
    };
  }, []);

  return null;
}
