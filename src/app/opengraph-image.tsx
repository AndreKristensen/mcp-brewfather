import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "#525252",
          }}
        />

        {/* Category pills */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 48,
          }}
        >
          {["Batches", "Inventory", "Recipes"].map((label) => (
            <div
              key={label}
              style={{
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: 6,
                padding: "6px 14px",
                color: "#737373",
                fontSize: 18,
                letterSpacing: "0.05em",
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: "#ededed",
            letterSpacing: "-3px",
            lineHeight: 1,
          }}
        >
          Brewfather MCP
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            color: "#737373",
            marginTop: 24,
            fontWeight: 400,
            letterSpacing: "-0.5px",
          }}
        >
          Your brewery, inside Claude
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#404040",
            fontSize: 18,
          }}
        >
          <span>11 tools</span>
          <span style={{ color: "#252525" }}>·</span>
          <span>Open source</span>
          <span style={{ color: "#252525" }}>·</span>
          <span>Self-hosted</span>
        </div>
      </div>
    ),
    size
  );
}
