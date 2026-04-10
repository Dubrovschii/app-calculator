'use client';

import { CSSProperties, FC, ReactNode, useEffect, useRef } from 'react';
import Portal from '../../../shared/ui/portal/Portal';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { useDetectClickOutside } from 'react-detect-click-outside';
import Button, { ButtonVariant } from '../../../shared/ui/button/Button';
import { X } from 'lucide-react';
import clsx from 'clsx';

type SidebarProps = {
  isOpen: boolean;
  onClose?: () => void;
  width: CSSProperties['width'];
  closeOnClickOutside?: boolean;
  children: ReactNode;
  title: string;
  position?: 'left' | 'right';
  className?: string;

  scrollY?: boolean;
  customScroll?: boolean;
};

const Sidebar: FC<SidebarProps> = ({
  isOpen,
  onClose,
  width,
  closeOnClickOutside = true,
  children,
  title,
  position = 'right',
  scrollY = false,
  customScroll = false,
  className,
}) => {
  const isRight = position === 'right';

  const initialX = isRight ? '100%' : '-100%';
  const exitX = isRight ? '100%' : '-100%';
  const overlayJustifyClass = isRight ? 'justify-end' : 'justify-start';

  const scrollRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  // блокируем body
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // кастомный скролл
  useEffect(() => {
    if (!customScroll || !scrollRef.current || !thumbRef.current) return;

    const container = scrollRef.current;
    const thumb = thumbRef.current;

    const update = () => {
      const ratio = container.clientHeight / container.scrollHeight;
      const thumbHeight = Math.max(ratio * container.clientHeight, 30);
      const scrollRatio =
        container.scrollTop / (container.scrollHeight - container.clientHeight);

      thumb.style.height = `${thumbHeight}px`;
      thumb.style.transform = `translateY(${
        scrollRatio * (container.clientHeight - thumbHeight)
      }px)`;
    };

    update();
    container.addEventListener('scroll', update);
    window.addEventListener('resize', update);

    return () => {
      container.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [customScroll, isOpen]);

  const sidebarRef = useDetectClickOutside({
    onTriggered: () => {
      if (closeOnClickOutside) onClose?.();
    },
  });

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-0 flex ${overlayJustifyClass} bg-modal-overlay z-250`}
          >
            <m.div
              initial={{ x: initialX }}
              animate={{ x: 0 }}
              exit={{ x: exitX }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              style={{ width }}
              ref={sidebarRef}
              className={clsx(
                'relative h-screen border-gold-300/50 bg-gradient-to-br from-obsidian-100 to-gold-500 py-6 px-4 flex flex-col',
                className,
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4 shrink-0">
                <h3 className="text-[20px] font-semibold">{title}</h3>
                <Button
                  onClick={() => onClose?.()}
                  className="p-0 w-6 h-6"
                  LeftIcon={<X />}
                  variant={ButtonVariant.CLEAR}
                />
              </div>

              {/* Content */}
              <div className="relative flex-1 overflow-hidden">
                <div
                  ref={scrollRef}
                  className={clsx(
                    'h-full relative',
                    scrollY && !customScroll && 'overflow-y-auto',
                    scrollY &&
                      customScroll &&
                      'overflow-y-scroll scrollbar-none',
                  )}
                >
                  {children}
                </div>

                {/* Custom scrollbar */}
                {scrollY && customScroll && (
                  <div
                    className="absolute top-0 right-1 w-[6px] h-full bg-transparent pointer-events-none"
                    style={{ outline: 'none' }}
                  >
                    <div
                      ref={thumbRef}
                      className="w-full bg-brand-primary rounded-full transition-transform pointer-events-auto"
                      style={{ outline: 'none' }}
                    />
                  </div>
                )}
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </Portal>
  );
};

export default Sidebar;
