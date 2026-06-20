import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Stratwyze CRM',
  description: 'AI-powered sales pipeline management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
