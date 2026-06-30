export function HomePage() {
  return (
    <section className="container-fluid px-0">
      <div className="card">
        <div className="card-body">
          <h2 className="h5">Welcome to __APP_NAME__</h2>
          <p className="mb-4">
            This app was scaffolded with the Plantasonic Design System. Tokens, Bootstrap theme,
            CSS variables, and layout patterns are already configured.
          </p>
          <div className="d-flex flex-wrap gap-2">
            <button type="button" className="btn btn-primary">Primary</button>
            <button type="button" className="btn btn-secondary">Secondary</button>
            <button type="button" className="btn btn-outline-secondary">Outline</button>
          </div>
        </div>
      </div>
    </section>
  );
}
