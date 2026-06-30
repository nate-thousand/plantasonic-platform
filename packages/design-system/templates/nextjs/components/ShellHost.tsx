'use client';

import { useEffect, useRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import {
  bindApplicationShell,
  initShellTheme,
  renderApplicationShell,
} from 'plantasonic-design-system/shell';
import { shellConfig } from '@/lib/shell-config';

type Props = { children: React.ReactNode };

export function ShellHost({ children }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<Root | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    void import('bootstrap/dist/js/bootstrap.bundle.min.js').then(() => {
      initShellTheme(shellConfig.theme ?? 'dark');
      host.innerHTML = renderApplicationShell(
        shellConfig,
        '<div id="app-page" class="ps-workspace p-3"></div>',
      );
      bindApplicationShell(shellConfig);

      const page = host.querySelector('#app-page');
      if (page) {
        rootRef.current?.unmount();
        rootRef.current = createRoot(page);
        rootRef.current.render(<>{children}</>);
      }
    });

    return () => {
      rootRef.current?.unmount();
      rootRef.current = null;
    };
  }, [children]);

  return <div ref={hostRef} className="app-root" style={{ height: '100vh' }} />;
}
