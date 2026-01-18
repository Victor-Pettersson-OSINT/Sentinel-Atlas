import type { ReactNode } from "react";
import "mapbox-gl/dist/mapbox-gl.css";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0b0b10", color: "#fff" }}>
        {children}
      </body>
    </html>
  );
}
