import { useState, useEffect, type ReactNode } from 'react';
import { ToastContext, type ToastType } from './ToastContext';

export type Toast = {
  id: string;
  message: string;
  type?: ToastType;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = (message: string, type: ToastType = 'success') => {
    const id = crypto.randomUUID();

    setToasts((prev) => {
      const next = [...prev, { id, message, type }];

      setTimeout(() => {
        setToasts((p) => p.filter((t) => t.id !== id));
      }, 3000);

      return next;
    });
  };
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-5 right-5 space-y-2 z-50">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} message={toast.message} type={toast.type} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({
  message,
  type = 'success',
}: {
  message: string;
  type?: ToastType;
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div
      className={`px-4 py-2 rounded-[8px] text-[14px] md:text-[16px] lg:text-[20px] shadow-lg fontH text-white ${bgColor} transition-all duration-300 ease-in-out
        ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'}
      `}
    >
      {message}
    </div>
  );
};
