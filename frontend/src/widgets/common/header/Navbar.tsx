'use client';

import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import Button, {
  ButtonColor,
  ButtonVariant,
} from '../../../shared/ui/button/Button';
import Sidebar from './Sidebar';
import Logo from '@/../public/assets/icon/test_logo.svg';
import styles from './navbar.module.css';
import { List } from 'lucide-react';
type NavbarProps = {
  className?: string;
};

const Navbar: FC<NavbarProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);

  const commonElements = (
    <>
      <Sidebar
        isOpen={isOpen}
        width={320}
        title="Меню"
        onClose={() => setIsOpen(false)}
        position="left"
      >
        <div className="flex flex-col">
          <Link
            href={`/ipoteca`}
            className="text-xs font-medium tracking-widest text-obsidian-400 hover:text-gold-500  uppercase mb-3"
          >
            Калькулятор ипотеки
          </Link>
          <Link
            href={`/ipoteca`}
            className="text-xs font-medium tracking-widest text-obsidian-400  hover:text-gold-500  uppercase mb-3"
          >
            Калькулятор авто кредита
          </Link>
          <Link
            href={`/ipoteca`}
            className="text-xs font-medium tracking-widest text-obsidian-400  hover:text-gold-500  uppercase mb-3"
          >
            Калькулятор кредита потребительского
          </Link>
          <Link
            href={`/ipoteca`}
            className="text-xs font-medium tracking-widest text-obsidian-400  hover:text-gold-500  uppercase mb-3"
          >
            Калькулятор доставки
          </Link>
        </div>
      </Sidebar>
    </>
  );

  return (
    <header
      className={clsx(
        'container bg-obsidian-900/20 py-[12px] relative px-[15px] rounded-[12px]',
        className,
      )}
    >
      {commonElements}

      <Link href="/" className="cursor-pointer">
        <Image
          src={Logo}
          className="w-[45px] h-auto"
          priority
          alt="logo"
          style={{ objectFit: 'contain' }}
        />
      </Link>

      <Button
        title="Навигация"
        color={ButtonColor.PRIMARY}
        RightIcon={<List />}
        size="m"
        variant={ButtonVariant.OUTLINE}
        onClick={() => setIsOpen(true)}
        className="absolute top-[50%] translate-y-[-50%] right-[15px]"
      />
    </header>
  );
};

export default Navbar;
