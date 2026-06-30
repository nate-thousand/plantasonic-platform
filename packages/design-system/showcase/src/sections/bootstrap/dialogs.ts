import { bsSection } from '../../lib/bootstrap-ui';
import { demoCard } from '../../lib/ui';

export function renderBsDialogs(): string {
  return bsSection(
    'Dialogs',
    'Modal, confirmation, and loading dialog patterns — no application logic.',
    `${renderModal()}${renderConfirm()}${renderLoading()}`,
  );
}

function renderModal(): string {
  return demoCard(
    'Modal',
    `<button type="button" class="btn btn-outline-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#bsModal">Open modal</button>
     <div class="modal fade" id="bsModal" tabindex="-1" aria-labelledby="bsModalLabel" aria-hidden="true">
       <div class="modal-dialog"><div class="modal-content">
         <div class="modal-header"><h5 class="modal-title" id="bsModalLabel">Modal title</h5>
           <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
         <div class="modal-body small">Themed modal using raised surface and backdrop tokens.</div>
         <div class="modal-footer"><button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Close</button>
           <button type="button" class="btn btn-primary btn-sm">Save</button></div>
       </div></div>
     </div>`,
    ['--ds-color-overlay-backdrop', '--ds-color-surface-raised'],
  );
}

function renderConfirm(): string {
  return demoCard(
    'Confirmation dialog',
    `<button type="button" class="btn btn-outline-danger btn-sm" data-bs-toggle="modal" data-bs-target="#bsConfirm">Delete preset</button>
     <div class="modal fade" id="bsConfirm" tabindex="-1" aria-hidden="true">
       <div class="modal-dialog modal-sm"><div class="modal-content">
         <div class="modal-header"><h5 class="modal-title h6">Confirm delete</h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
         <div class="modal-body small">This action cannot be undone.</div>
         <div class="modal-footer"><button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cancel</button>
           <button type="button" class="btn btn-danger btn-sm">Delete</button></div>
       </div></div>
     </div>`,
    ['--ds-color-error'],
  );
}

function renderLoading(): string {
  return demoCard(
    'Loading dialog',
    `<button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#bsLoading">Show loading</button>
     <div class="modal fade" id="bsLoading" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
       <div class="modal-dialog modal-sm modal-dialog-centered"><div class="modal-content text-center p-4">
         <div class="spinner-border text-primary mx-auto mb-2" role="status"></div>
         <div class="small text-secondary">Initializing…</div>
       </div></div>
     </div>`,
  );
}
