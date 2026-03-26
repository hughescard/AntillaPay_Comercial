import { createItems } from "@/lib/createData";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRbacSimulation } from "@/common/context";

interface CreateMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateMenu = ({ isOpen, onClose }: CreateMenuProps) => {
  const { t } = useTranslation();
  const { hasPermission } = useRbacSimulation();
  const [isVisible, setIsVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const visibleItems = createItems.filter((item) => hasPermission(item.permission));

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isVisible || visibleItems.length === 0) return null;

  return (
    <div
      ref={menuRef}
      className={`
        absolute top-full right-0 mt-2 w-[min(14rem,calc(100vw-1rem))] z-[200]
        bg-surface border border-border rounded-lg shadow-xl overflow-hidden
        origin-top-right
        transform transition-all duration-200 ease-in-out
        ${isOpen 
          ? 'opacity-100 scale-100 translate-y-0' 
          : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}
      `}
    >
      <div className="py-1">
        {visibleItems.map((item, index) => (
          <Link
            href={item.href}
            key={index}
            className="w-full flex cursor-pointer items-center justify-between px-4 py-2 text-sm text-foreground hover:bg-surface-muted transition-colors group"
            onClick={() => {
              console.log(`Creating ${item.label}`);
              onClose();
            }}
          >
            <div className="flex items-center gap-3">
              <item.icon size={16} className="text-muted-foreground group-hover:text-accent transition-colors" />
              <span className="font-medium">{item.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
