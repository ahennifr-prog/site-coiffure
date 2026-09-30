import { ImageResponse } from "next/og";
import { footer, seo } from "@/content";

export const alt = seo.ogTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const colors = ["#C4401F", "#FBF6EE", "#F3B23C", "#2E6150"];
  const paths = Array.from({ length: 8 }, (_, i) => {
    const r = 178;
    const a0 = (i * Math.PI) / 4;
    const a1 = ((i + 1) * Math.PI) / 4;
    return `M200 200 L${200 + r * Math.sin(a0)} ${200 - r * Math.cos(a0)} A${r} ${r} 0 0 1 ${200 + r * Math.sin(a1)} ${200 - r * Math.cos(a1)} Z`;
  });
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#FBF6EE", padding: 72, alignItems: "center", gap: 56 }}>
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ fontSize: 40, fontWeight: 700, color: "#C4401F" }}>Rouelia</div>
          <div style={{ fontSize: 64, lineHeight: 1.08, fontWeight: 700, color: "#1D1A16", marginTop: 24 }}>{seo.ogTitle}</div>
          <div style={{ fontSize: 28, color: "#5E564E", marginTop: 24 }}>{footer.tagline}</div>
        </div>
        <svg width="400" height="400" viewBox="0 0 400 400">
          <circle cx="200" cy="200" r="200" fill="#A33317" />
          {paths.map((d, i) => (
            <path key={i} d={d} fill={colors[i % 4]} />
          ))}
          <circle cx="200" cy="200" r="46" fill="#FFFFFF" />
        </svg>
      </div>
    ),
    size,
  );
}
