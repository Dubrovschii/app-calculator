'use client';

import { FC, ReactNode } from 'react';
// import { Footer } from '@/widgets/common/footer';
import Navbar from '../header/Navbar';

type LayoutProps = {
  children?: ReactNode;
};

const Layout: FC<LayoutProps> = (props) => {
  const { children } = props;
  return (
    <>
      <Navbar />
      <main className="">{children}</main>
      {/* <Footer /> */}
    </>
  );
};

export default Layout;
