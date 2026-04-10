import type { Metadata } from 'next';
import './globals.css';

import Layout from '../widgets/common/layout/Layout';
import ClientProviders from './ClientProviders';
export const metadata: Metadata = {
  title: 'Калькулятор доходности автомобиля',
  description:
    'Рассчитайте ROI, срок окупаемости и чистую прибыль от сдачи автомобиля в аренду',
  keywords: ['калькулятор', 'ROI', 'доходность', 'автомобиль', 'инвестиции'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="overflow-x-hidden">
      <body
        className={`antialiased bg-surface-primary text-text-primary overflow-x-hidden min-h-[100vh] h-[100vh] flex flex-col no-scrollbar`}
      >
        <ClientProviders>
          <Layout>{children}</Layout>
        </ClientProviders>
      </body>
    </html>
  );
}
