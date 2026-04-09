'use client';

import { FC, ReactNode } from 'react';
// import { Footer } from '@/widgets/common/footer';
import Navbar from '@/widgets/common/header/Navbar';

type LayoutProps = {
  children?: ReactNode;
};

const Layout: FC<LayoutProps> = (props) => {
  const { children } = props;
  return (
    <>
      <Navbar />
      <main className="w-full px-4 md:px-6 lg:px-8 mx-auto 2xl:w-[1312px] 2xl:px-0 py-10">
        {children}
      </main>
      {/* <Footer /> */}
    </>
  );
};

export default Layout;
