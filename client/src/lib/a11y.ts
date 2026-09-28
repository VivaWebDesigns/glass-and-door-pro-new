import type { KeyboardEvent } from "react";

/** Keyboard handler that activates a custom clickable element on Enter or Space. */
export function onActivateKey<T extends Element>(activate: () => void) {
  return (event: KeyboardEvent<T>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activate();
    }
  };
}
