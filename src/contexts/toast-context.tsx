import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Toast, ToastType } from '../components/toast';

interface ToastContextType {
    toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [activeToast, setActiveToast] = useState<{ id: number; message: string; type: ToastType } | null>(null);

    const toast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Date.now();
        setActiveToast({ id, message, type });

        // Auto dismiss after 3 seconds
        setTimeout(() => {
            setActiveToast(current => {
                if (current?.id === id) {
                    return null;
                }
                return current;
            });
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            {activeToast && (
                <Toast
                    key={activeToast.id}
                    message={activeToast.message}
                    type={activeToast.type}
                    onClose={() => setActiveToast(null)}
                />
            )}
        </ToastContext.Provider>
    );
}

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
