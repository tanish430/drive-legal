import { Space_Grotesk, Merriweather } from 'next/font/google';
import './globals.css';
import ServiceWorkerRegister from '../components/ServiceWorkerRegister';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-sans' });
const merriweather = Merriweather({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-serif' });

export const metadata = {
  title: 'DriveLegal',
  description: 'Location-aware Indian traffic law assistant and ride-safety PWA.',
  manifest: '/manifest.webmanifest',
  themeColor: '#123b5d',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${merriweather.variable}`}>
      <body>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
