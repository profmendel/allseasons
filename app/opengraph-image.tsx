import { ImageResponse } from "next/og";

export const alt = "All Seasons Catering Company — Premium Event Catering in Nigeria";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Dynamic social share image shown when the site is shared on WhatsApp/social.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "linear-gradient(135deg, #1e4a38 0%, #143528 100%)",
          color: "#f7f2e7",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 18,
              background: "#c1922f",
              color: "#241a09",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 700,
            }}
          >
            AS
          </div>
          <div style={{ fontSize: 30, letterSpacing: 3, color: "#e8d3a0" }}>
            ALL SEASONS CATERING
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, maxWidth: 940 }}>
            We make every season unforgettable
          </div>
          <div style={{ fontSize: 32, color: "#cbb79b", maxWidth: 860 }}>
            Premium catering for weddings, corporate events & celebrations across Nigeria.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, color: "#e8d3a0" }}>
          <div style={{ display: "flex", gap: 8 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{ width: 18, height: 18, borderRadius: 18, background: "#e8d3a0", display: "flex" }}
              />
            ))}
          </div>
          <div>Loved by 500+ hosts</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
