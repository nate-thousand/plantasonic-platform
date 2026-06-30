declare global {
  interface Window {
    plantasonic?: { platform: string };
  }
}

export function DesktopPage() {
  const platform = window.plantasonic?.platform ?? 'unknown';

  return (
    <section className="card">
      <div className="card-body">
        <h2 className="h5">__APP_NAME__</h2>
        <p className="mb-2">Desktop app with Plantasonic Application Shell, design tokens, and Bootstrap theme.</p>
        <p className="mb-0 text-muted">Platform: {platform}</p>
      </div>
    </section>
  );
}
