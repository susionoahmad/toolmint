export function triggerAdAndContinue(callback: () => void): void {
  const adLink = import.meta.env.VITE_AD_DIRECT_LINK;
  
  if (adLink) {
    window.open(adLink, "_blank");
  } else {
    console.warn("VITE_AD_DIRECT_LINK is not set.");
  }
  
  setTimeout(() => {
    callback();
  }, 800);
}
