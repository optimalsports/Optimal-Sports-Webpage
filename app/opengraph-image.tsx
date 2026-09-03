import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 20% 20%, #3d0c0c, #100000 60%)",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            fontSize: 104,
            lineHeight: 1,
            fontWeight: 800,
            letterSpacing: 16,
            textTransform: "uppercase",
          }}
        >
          Optimal
        </div>
        <div
          style={{
            marginTop: 24,
            padding: "12px 24px",
            border: "2px solid rgba(255,255,255,0.4)",
            borderRadius: 999,
            fontSize: 40,
            letterSpacing: 8,
          }}
        >
          Sports Management
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

