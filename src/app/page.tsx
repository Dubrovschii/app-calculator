// import { CalculatorPage } from '@/components/calculator/CalculatorPage';

// export default function Home() {
//   return <CalculatorPage />;
// }

import type { Metadata } from 'next';
import PageClient from './PageClient';

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await props.params;
  const bookId = Number(id);

  try {
    // const book = await fetchBookDetails({ bookId });

    return {
      title: `Клиентское устройство `,
      description: ` Клиентское устройство помогает в Вашей жизни`,
      // alternates: {
      //   canonical: `/books/${bookId}`,
      // },
    };
  } catch {
    return {
      title: 'Клиентское устройство',
      description: ' Клиентское устройство помогает в Вашей жизни',
      // alternates: {
      //   canonical: `/books/${bookId}`,
      // },
    };
  }
}
export default async function HomePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  return <PageClient />;
}
