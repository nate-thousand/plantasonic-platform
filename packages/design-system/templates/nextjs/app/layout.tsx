import '@ds/css/variables.css';
import './globals.scss';
import { ShellHost } from '@/components/ShellHost';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ShellHost>{children}</ShellHost>
      </body>
    </html>
  );
}
