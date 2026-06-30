import { ShellHost } from './ShellHost';
import { DesktopPage } from './pages/DesktopPage';

export function App() {
  return (
    <ShellHost>
      <DesktopPage />
    </ShellHost>
  );
}
