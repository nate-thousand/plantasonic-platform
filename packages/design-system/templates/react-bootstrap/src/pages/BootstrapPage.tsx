export function BootstrapPage() {
  return (
    <div className="row g-4">
      <div className="col-lg-6">
        <div className="card h-100">
          <div className="card-header">Buttons</div>
          <div className="card-body d-flex flex-wrap gap-2">
            <button type="button" className="btn btn-primary">Primary</button>
            <button type="button" className="btn btn-secondary">Secondary</button>
            <button type="button" className="btn btn-outline-primary">Outline</button>
            <button type="button" className="btn btn-primary" disabled>Disabled</button>
          </div>
        </div>
      </div>
      <div className="col-lg-6">
        <div className="card h-100">
          <div className="card-header">Forms</div>
          <div className="card-body">
            <label className="form-label" htmlFor="sample-input">Label</label>
            <input id="sample-input" className="form-control mb-3" placeholder="Text input" />
            <select className="form-select" defaultValue="">
              <option value="" disabled>Select option</option>
              <option value="1">Option one</option>
              <option value="2">Option two</option>
            </select>
          </div>
        </div>
      </div>
      <div className="col-12">
        <div className="alert alert-success mb-0" role="alert">
          Bootstrap components inherit Plantasonic tokens via CSS variables and the theme bridge.
        </div>
      </div>
    </div>
  );
}
