export default function FiltersPanel() {
  return (
    <section style={{ padding: "12px", background: "#101018", color: "#fff" }}>
      <h2 style={{ margin: "0 0 8px" }}>Filters</h2>
      <div style={{ display: "grid", gap: "8px" }}>
        <label>
          Country
          <input style={{ width: "100%" }} placeholder="e.g. Sweden" />
        </label>
        <label>
          Region
          <input style={{ width: "100%" }} placeholder="e.g. Nordic" />
        </label>
        <label>
          Tags
          <input style={{ width: "100%" }} placeholder="e.g. Military" />
        </label>
      </div>
    </section>
  );
}
