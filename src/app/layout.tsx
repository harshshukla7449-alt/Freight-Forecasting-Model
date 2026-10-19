import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NaviFreight AI: Intelligent Maritime Freight Forecasting & Bulk Chartering Platform',
  description:
    'Predictive freight rate analytics, vessel feasibility validation against physical port constraints (draft, LOA, beam), and actionable contract recommendations for Indian East Coast bulk procurement.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-maritime-deep text-slate-100 antialiased selection:bg-cyan-500 selection:text-navy-950">
        {children}
      </body>
    </html>
  );
}
