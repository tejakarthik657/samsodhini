import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "SUMSHODHINI | National Science & Technology Symposium • KITSW Warangal",
  description: "The official platform and institutional heritage archive of Sumshodhini at Kakatiya Institute of Technology & Science, Warangal (KITSW). Featuring department flagship masterclasses, national competitions, delegate registrations, and institutional legacy vault.",
  keywords: ["Sumshodhini", "KITSW", "Warangal", "Kakatiya Institute of Technology and Science", "Technical Symposium", "Workshops", "Hackathons", "Robotics", "Engineering Symposium"],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#0f172a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="min-h-screen bg-[#FAF9F5] text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">
        {children}
      </body>
    </html>
  );
}
