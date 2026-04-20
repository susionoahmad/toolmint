export function track(event: string, props?: Record<string, any>) {
  console.log("TRACK:", event, props || "");
}
