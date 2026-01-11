import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Returns Graph - Line Chart Visualizer',
  description: 'Interactive line chart application built with Next.js and Chart.js',
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
