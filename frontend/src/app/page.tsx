import type { Metadata } from 'next';
import PageClient from './PageClient';

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await props.params;
  const bookId = Number(id);

  try {
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
  // params: Promise<{ id: string }>;
}) {
  return <PageClient />;
}
