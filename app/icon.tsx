import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Branded favicon: the "AS" monogram on the deep-emerald brand colour.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1e4a38",
          color: "#f7f2e7",
          fontSize: 34,
          fontWeight: 700,
          borderRadius: 14,
        }}
      >
        AS
      </div>
    ),
    { ...size },
  );
}
