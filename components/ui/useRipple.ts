"use client";

import { MouseEvent } from "react";

export function useRipple() {
  function createRipple(e: MouseEvent<HTMLElement>) {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const circle = document.createElement("span");
    circle.className = "ripple-circle";
    circle.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
    button.appendChild(circle);

    circle.addEventListener("animationend", () => circle.remove());
  }

  return createRipple;
}
