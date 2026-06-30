import { bsSection } from '../../lib/bootstrap-ui';
import { demoCard } from '../../lib/ui';

export function renderBsNavigation(): string {
  return bsSection(
    'Navigation',
    'Navbar, tabs, pills, breadcrumbs, and pagination with active and disabled states.',
    `${renderNavbar()}${renderTabsPills()}${renderBreadcrumbPagination()}`,
  );
}

function renderNavbar(): string {
  return demoCard(
    'Navbar',
    `<nav class="navbar navbar-dark rounded px-3 mb-0" data-ds-tokens="--ds-color-surface-nav,--ps-nav-height"
      style="background:var(--ds-color-surface-nav);min-height:var(--ps-nav-height)">
      <span class="navbar-brand mb-0 h1 fs-6">Plantasonic</span>
      <div class="navbar-nav flex-row gap-2 ms-auto">
        <a class="nav-link active" href="#" aria-current="page">Active</a>
        <a class="nav-link" href="#">Link</a>
        <a class="nav-link disabled" tabindex="-1" aria-disabled="true">Disabled</a>
      </div>
    </nav>`,
    ['--ps-nav-height', '--ds-color-surface-nav'],
  );
}

function renderTabsPills(): string {
  return demoCard(
    'Nav tabs · Pills',
    `<ul class="nav nav-tabs mb-3" role="tablist">
      <li class="nav-item"><a class="nav-link active" href="#" aria-current="page">Active tab</a></li>
      <li class="nav-item"><a class="nav-link" href="#">Tab</a></li>
      <li class="nav-item"><a class="nav-link disabled" href="#" tabindex="-1">Disabled</a></li>
    </ul>
    <ul class="nav nav-pills">
      <li class="nav-item"><a class="nav-link active" href="#">Active pill</a></li>
      <li class="nav-item"><a class="nav-link" href="#">Pill</a></li>
      <li class="nav-item"><a class="nav-link disabled" href="#">Disabled</a></li>
    </ul>`,
    ['--ds-color-border-subtle'],
  );
}

function renderBreadcrumbPagination(): string {
  return demoCard(
    'Breadcrumbs · Pagination',
    `<nav aria-label="breadcrumb" class="mb-3"><ol class="breadcrumb mb-0">
      <li class="breadcrumb-item"><a href="#">Home</a></li>
      <li class="breadcrumb-item"><a href="#">Bootstrap</a></li>
      <li class="breadcrumb-item active" aria-current="page">Navigation</li>
    </ol></nav>
    <nav aria-label="Page navigation"><ul class="pagination pagination-sm mb-0">
      <li class="page-item disabled"><span class="page-link">Prev</span></li>
      <li class="page-item active"><span class="page-link">1</span></li>
      <li class="page-item"><a class="page-link" href="#">2</a></li>
      <li class="page-item"><a class="page-link" href="#">3</a></li>
    </ul></nav>`,
    ['--ds-color-primary'],
  );
}
