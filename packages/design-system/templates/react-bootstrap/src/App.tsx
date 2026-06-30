import { ShellHost } from './ShellHost';
import { BootstrapPage } from './pages/BootstrapPage';

export function App() {
  return (
    <ShellHost>
      <BootstrapPage />
    </ShellHost>
  );
}
