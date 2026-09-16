import { ImageResponse } from "next/og";

/** iOS ana ekrana ekleme simgesi — `icon.svg`'deki pusula glifinin PNG karşılığı. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#100f0a",
        }}
      >
        <svg width={112} height={112} viewBox="0 0 24 24" fill="none" stroke="#c7a468" strokeWidth={2.2}>
          <circle cx="12" cy="12" r="10" />
          <line x1="22" x2="18" y1="12" y2="12" />
          <line x1="6" x2="2" y1="12" y2="12" />
          <line x1="12" x2="12" y1="6" y2="2" />
          <line x1="12" x2="12" y1="22" y2="18" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
