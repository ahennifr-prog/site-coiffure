/**
 * Lit une image localement (jamais envoyée) et la réduit si besoin pour rester légère.
 */
export async function readImage(
  file: File,
  maxMb: number,
  maxSide = 512,
): Promise<{ dataUrl: string } | { error: "type" | "size" }> {
  if (!file.type.startsWith("image/")) return { error: "type" };
  if (file.size > maxMb * 1024 * 1024) return { error: "size" };
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  }).catch(() => null);
  if (!dataUrl) return { error: "type" };
  if (file.type === "image/svg+xml") return { dataUrl };
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = dataUrl;
    });
    const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
    if (scale === 1 && file.size < 300 * 1024) return { dataUrl };
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
    return { dataUrl: canvas.toDataURL("image/png") };
  } catch {
    return { error: "type" };
  }
}
