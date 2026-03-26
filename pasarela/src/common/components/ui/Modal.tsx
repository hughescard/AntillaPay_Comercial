/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string; 
  style?: React.CSSProperties;
}

export const Modal = ({ isOpen, onClose, children, className = '', style }: ModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null); 

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false); 
    const timer = setTimeout(() => {
      onClose(); 
    }, 200); 
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && contentRef.current && !contentRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  

  if (!isOpen) return null;

  return (
    <div 
      ref={contentRef} 
      className={`
        bg-surface border border-border shadow-xl rounded-xl
        transform transition-discrete duration-200 ease-in-out
        ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        ${className} 
      `}
      style={style} 
    >
      {children}
    </div>
  );
};