import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/shared/ui/Providers';
import Layout from '@/widgets/common/layout/Layout';

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
    <html lang="ru">
      <body>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
