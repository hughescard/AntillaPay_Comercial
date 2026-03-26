import { useEffect, useRef } from 'react';


const modalStack: string[] = [];

export const useModalShortcuts = (
  isOpen: boolean,
  onClose: () => void,
  onConfirm: () => void,
  allowConfirm: boolean = true,
  allowExit: boolean = true
) => {
  const modalId = useRef<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (modalId.current === null) {
      modalId.current = `modal-${modalStack.length}`;
    }

    modalStack.push(modalId.current);

    const handleKeyDown = (event: KeyboardEvent) => {
      const isTopModal = modalStack[modalStack.length - 1] === modalId.current;

      if (!isTopModal) return;

      if (event.key === 'Escape' && allowExit) {
        event.preventDefault();
        event.stopImmediatePropagation(); 
        onClose();
      }
      
      if (event.key === 'Enter' && allowConfirm) {
        event.preventDefault(); 
        event.stopImmediatePropagation();
        onConfirm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      const index = modalStack.indexOf(modalId.current!);
      if (index > -1) {
        modalStack.splice(index, 1);
      }
      
      window.removeEventListener('keydown', handleKeyDown);
      
      modalId.current = null;
    };
  }, [isOpen, onClose, onConfirm, allowConfirm]);
};