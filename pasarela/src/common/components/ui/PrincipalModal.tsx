'use client';

import { useState, useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
}

export const PrincipalModal = ({ 
  isOpen, 
  onClose, 
  children, 
  className = '',
  wrapperClassName = '' 
}: ModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [finallyanimation,setFinallyAnimation] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFinallyAnimation(false);
      setIsVisible(true);
      document.body.style.overflow = 'hidden'; 
    } else {
      handleClose()
      document.body.style.overflow = 'unset'; 
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    const timer = setTimeout(() => {
      onClose(); 
      setFinallyAnimation(true);
    }, 200); 
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isVisible && contentRef.current && !contentRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isVisible]); 

  if (!isOpen && finallyanimation) return null;

  return (
    <div 
      className={`
        fixed inset-0 z-50 flex items-center justify-center 
        bg-black/50 backdrop-blur-sm p-4
        transition-opacity duration-200 ease-in-out
        ${isVisible ? 'opacity-100' : 'opacity-0'}
        ${wrapperClassName}
      `}
    >
      <div 
        ref={contentRef}
        className={`
          bg-surface border border-border shadow-2xl rounded-xl
          transform transition-all duration-200 ease-in-out
          ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
          ${className} 
        `}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
};