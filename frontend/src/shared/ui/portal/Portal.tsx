'use client';

import { FC, ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type PortalProps = {
  children?: ReactNode;
  element?: HTMLElement;
};

const Portal: FC<PortalProps> = ({ children, element }) => {
  const [mounted, setMounted] = useState(false);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
    setMountNode(element ?? document.body);
  }, [element]);

  if (!mounted || !mountNode) return null;

  return createPortal(children, mountNode);
};

export default Portal;
