import AtlasMap from "../components/AtlasMap";
import FiltersPanel from "../components/FiltersPanel";
import LiveFeed from "../components/LiveFeed";

export default function HomePage() {
  return (
    <main style={{ display: "grid", gap: "12px", padding: "12px" }}>
      <header>
        <h1 style={{ margin: 0 }}>Sentinel Atlas</h1>
        <p style={{ margin: "4px 0 0" }}>
          Global OSINT Intelligence &amp; Mapping Platform
        </p>
      </header>
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "240px 1fr 320px",
          gap: "12px",
          minHeight: "70vh",
        }}
      >
        <FiltersPanel />
        <div style={{ borderRadius: "8px", overflow: "hidden", minHeight: "70vh" }}>
          <AtlasMap />
        </div>
        <LiveFeed />
      </section>
      <section style={{ background: "#111320", padding: "12px", borderRadius: "8px" }}>
        <h2 style={{ margin: "0 0 8px" }}>Curated Intelligence Flows</h2>
        <p style={{ margin: 0 }}>
          Admin-managed regional and country monitoring tiles will appear here.
        </p>
      </section>
    </main>
  );
}
