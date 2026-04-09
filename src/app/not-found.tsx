// // app/not-found.tsx

import type { Metadata } from 'next';
// import { Layout } from "@/widgets/common/layout";
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 | Noveloop',
  description: '«Увы что-то пошло не так или данная страница в разработке».',
  icons: {
    icon: 'https://cdn.noveloop.ru/essentials/favicon.ico',
  },
};

export default function NotFound() {
  return (
    <div className="flex flex-col md:max-w-[567px] mx-auto">
      <h1 className="text-2xl text-center mb-[20px]">
        404 - Страница не найдена...
      </h1>
      <div className="text-md text-center mb-[20px]">
        «Увы что-то пошло не так или данная страница в разработке»
      </div>
      <Link
        href={`/`}
        className="rounded overflow-hidden text-brand-primary border-1 max-w-[120px] text-center px-2 py-2 md:hover:text-[#c3b630] mx-auto"
      >
        На главную
      </Link>
    </div>
    // <Layout>
    // </Layout>
  );
}
