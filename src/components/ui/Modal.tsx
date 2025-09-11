import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  showCloseButton?: boolean;
}

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  size = 'md',
  children,
  showCloseButton = true 
}: ModalProps) {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel 
                className={`
                  w-full ${sizeClasses[size]} transform overflow-hidden rounded-3xl
                  bg-white/95 dark:bg-neutral-900/60
                  backdrop-blur-md
                  border border-neutral-200/50 dark:border-0
                  p-8 text-left align-middle 
                  shadow-xl shadow-black/10 dark:shadow-black/40
                  transition-all
                  relative
                `}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
                  ...(typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? {
                    background: 'linear-gradient(135deg, rgba(15,23,42,0.6) 0%, rgba(30,41,59,0.8) 100%)'
                  } : {})
                }}
              >
                {/* Gradient Background Overlay */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-600/8 via-blue-600/8 to-violet-600/8 dark:from-purple-600/10 dark:via-blue-600/10 dark:to-violet-600/10"></div>
                
                {/* Floating Gradient Orbs */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                  <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br from-purple-400/25 to-violet-600/25 dark:from-purple-400/20 dark:to-violet-600/20 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-br from-blue-400/25 to-cyan-600/25 dark:from-blue-400/20 dark:to-cyan-600/20 rounded-full blur-3xl"></div>
                  <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-purple-600/20 dark:from-pink-400/15 dark:to-purple-600/15 rounded-full blur-2xl"></div>
                </div>
                
                <div className="relative z-10">
                  {(title || showCloseButton) && (
                    <div className="flex items-center justify-between mb-6">
                      {title && (
                        <Dialog.Title
                          as="h3"
                          className="text-2xl font-bold bg-gradient-to-r from-purple-700 via-blue-700 to-violet-700 dark:from-purple-600 dark:via-blue-600 dark:to-violet-600 bg-clip-text text-transparent"
                        >
                          {title}
                        </Dialog.Title>
                      )}
                      
                      {showCloseButton && (
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="x"
                          onClick={onClose}
                          className="ml-auto hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        />
                      )}
                    </div>
                  )}
                  
                  <div className="bg-white/60 dark:bg-neutral-800/30 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/30 dark:border-0 ring-1 ring-neutral-200/20 dark:ring-neutral-700/30">
                    {children}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
