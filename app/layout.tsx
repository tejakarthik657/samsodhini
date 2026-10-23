import type { Metadata, Viewport } from 'next';
import './globals.css';
import Preloader from '../components/Preloader';

export const metadata: Metadata = {
  title: "SUMSHODHINI | National Level Technical Symposium • KITSW Warangal",
  description: "The official platform and institutional heritage archive of Sumshodhini at Kakatiya Institute of Technology & Science, Warangal (KITSW). Featuring department flagship masterclasses, national competitions, delegate registrations, and institutional legacy vault.",
  keywords: ["Sumshodhini", "KITSW", "Warangal", "Kakatiya Institute of Technology and Science", "Technical Symposium", "Workshops", "Hackathons", "Robotics", "Engineering Symposium"],
  icons: {
    icon: [
      { url: '/Sumshodhini26icon.png', sizes: 'any' },
      { url: '/icon.png', sizes: 'any' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: ['/Sumshodhini26icon.png'],
    apple: [
      { url: '/Sumshodhini26icon.png' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#3A4BFF',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "try{if(sessionStorage.getItem('sam-pre'))document.documentElement.classList.add('no-preload')}catch(e){}",
          }}
        />
        <link rel="icon" href="/Sumshodhini26icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/Sumshodhini26icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-paper text-slate-900 antialiased selection:bg-marigold-300 selection:text-ink">
        <Preloader />
        {children}
      </body>
    </html>
  );
}
