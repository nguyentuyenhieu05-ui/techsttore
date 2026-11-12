import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div
      id="toast-notifications-container"
      data-testid="toast-notifications-container"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            data-testid={`toast-${toast.type}`}
            className={`pointer-events-auto p-3.5 rounded-xl shadow-lg border text-xs flex items-center gap-3 transition-all animate-in slide-in-from-bottom-2 duration-200 ${
              isSuccess
                ? 'bg-slate-900 text-white border-slate-800'
                : isError
                ? 'bg-rose-900 text-white border-rose-800'
                : 'bg-slate-800 text-white border-slate-700'
            }`}
          >
            {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {isError && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {!isSuccess && !isError && <Info className="w-4 h-4 text-indigo-400 shrink-0" />}

            <span className="flex-1 font-medium leading-relaxed">{toast.message}</span>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
