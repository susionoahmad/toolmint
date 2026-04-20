let hasTriggered = false;

export function triggerAdSafe() {
  const link = import.meta.env.VITE_ADSTERRA_LINK as string;

  if (!hasTriggered) {
    const newTab = window.open(link, "_blank");
    if (!newTab) window.location.href = link;
    hasTriggered = true;
  }
}

export function triggerAdAndContinue(callback: () => void) {
  triggerAdSafe();
  callback();
}
