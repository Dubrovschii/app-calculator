'use client';
import { FC, useEffect, useState } from 'react';

type NavbarProps = {
  className?: string;
};

const Navbar: FC<NavbarProps> = () => {
  return (
    <div className="list">
      <li>link</li>
      <li>link2</li>
      <li>link3</li>
    </div>
  );
};

export default Navbar;
