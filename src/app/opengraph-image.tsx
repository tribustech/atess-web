import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ATESS Project — Pardoseli sportive profesionale";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "linear-gradient(135deg, #0B0B0D 0%, #1A1A1D 70%, #7A0A1C 100%)",
          color: "#F5F5F3",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "8px",
              height: "48px",
              background: "#C8102E",
            }}
          />
          <span
            style={{
              fontSize: "20px",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#C8102E",
            }}
          >
            ATESS PROJECT
          </span>
        </div>
        <div>
          <div
            style={{
              fontSize: "84px",
              fontWeight: 600,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              maxWidth: "900px",
            }}
          >
            Pardoseli sportive profesionale
          </div>
          <div
            style={{
              marginTop: "32px",
              fontSize: "28px",
              color: "rgba(245, 245, 243, 0.7)",
            }}
          >
            Aplicator certificat Stockmeier · 10+ ani pe teren
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
