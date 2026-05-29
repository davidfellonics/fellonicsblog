import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "FFellonics";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ffell.com";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          background: "#f0f4f8",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Geometric background pattern — 7-circle rings tiled */}
        <svg
          style={{ position: "absolute", inset: 0, opacity: 0.07 }}
          width="1200"
          height="630"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Row 1 */}
          {[120, 360, 600, 840, 1080].map((cx) => (
            <g key={cx}>
              <circle cx={cx} cy={120} r={96} fill="none" stroke="#1a3a5c" strokeWidth="6" />
              <circle cx={cx + 192} cy={120} r={96} fill="none" stroke="#1a3a5c" strokeWidth="6" />
            </g>
          ))}
          {/* Row 2 */}
          {[0, 240, 480, 720, 960, 1200].map((cx) => (
            <circle key={cx} cx={cx} cy={313} r={96} fill="none" stroke="#1a3a5c" strokeWidth="6" />
          ))}
          {/* Row 3 */}
          {[120, 360, 600, 840, 1080].map((cx) => (
            <circle key={cx} cx={cx} cy={510} r={96} fill="none" stroke="#1a3a5c" strokeWidth="6" />
          ))}
        </svg>

        {/* Left accent bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "8px",
            height: "100%",
            background: "#1a3a5c",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            padding: "64px 80px 56px 88px",
          }}
        >
          {/* Site name */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            {/* Mini 7-circle logo */}
            <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="16" fill="none" stroke="#1a3a5c" strokeWidth="5" />
              <circle cx="82" cy="50" r="16" fill="none" stroke="#1a3a5c" strokeWidth="5" />
              <circle cx="66" cy="77.7" r="16" fill="none" stroke="#1a3a5c" strokeWidth="5" />
              <circle cx="34" cy="77.7" r="16" fill="none" stroke="#1a3a5c" strokeWidth="5" />
              <circle cx="18" cy="50" r="16" fill="none" stroke="#1a3a5c" strokeWidth="5" />
              <circle cx="34" cy="22.3" r="16" fill="none" stroke="#1a3a5c" strokeWidth="5" />
              <circle cx="66" cy="22.3" r="16" fill="none" stroke="#1a3a5c" strokeWidth="5" />
            </svg>
            <span style={{ fontSize: "28px", color: "#1a3a5c", fontWeight: 700, letterSpacing: "-0.5px" }}>
              FFellonics
            </span>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: title.length > 80 ? "40px" : title.length > 50 ? "48px" : "56px",
              fontWeight: 700,
              color: "#111111",
              lineHeight: 1.2,
              maxWidth: "960px",
              letterSpacing: "-1px",
            }}
          >
            {title}
          </div>

          {/* Bottom bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid #d1d5db",
              paddingTop: "20px",
            }}
          >
            <span style={{ fontSize: "20px", color: "#6b7280" }}>
              Exploring geometry — topology, tessellation, polyhedra &amp; more
            </span>
            <span style={{ fontSize: "18px", color: "#9ca3af" }}>
              {siteUrl.replace("https://", "")}
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
