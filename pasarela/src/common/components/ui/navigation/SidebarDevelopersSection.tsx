'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { AccordionMenu } from '../AccordionMenu';
import { developersMenus } from '@/lib/navData';
import { useRbacSimulation } from '@/common/context';

type DeveloperMenu = {
  label: (typeof developersMenus)[number]["label"];
  icon: (typeof developersMenus)[number]["icon"];
  subItems: Array<(typeof developersMenus)[number]["subItems"][number]>;
};

interface ActiveModalState {
  top: number;
  left: number;
  arrowTop: number;
  title:
    | 'nav.developers'
    | 'nav.webhooks'
    | 'nav.logs'
    | 'nav.docs'
    | 'nav.apiKeys';
  items: DeveloperMenu["subItems"];
}

export const SidebarDevelopersSection = ({
  isNavBarCollapsed,
  onNavigate,
  footerMode = false,
}: {
  isNavBarCollapsed: boolean;
  onNavigate?: () => void;
  footerMode?: boolean;
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useRbacSimulation();
  const [activeModal, setActiveModal] = useState<ActiveModalState | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const FLOATING_MODAL_OFFSET = 10;
  const FLOATING_MODAL_VERTICAL_PADDING = 12;
  const FLOATING_MODAL_HEADER_HEIGHT = 42;
  const FLOATING_MODAL_ITEM_HEIGHT = 40;
  const FLOATING_MODAL_EDGE_GAP = 16;
  const visibleMenus: DeveloperMenu[] = developersMenus
    .map((menu) => ({
      ...menu,
      subItems: menu.subItems.filter((subItem) => hasPermission(subItem.permission)),
    }))
    .filter((menu) => menu.subItems.length > 0);

  const handleItemEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    menu: DeveloperMenu | ''
  ) => {
    if (!isNavBarCollapsed) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const rect = e.currentTarget.getBoundingClientRect();

    if (menu) {
      const modalHeight =
        FLOATING_MODAL_HEADER_HEIGHT +
        menu.subItems.length * FLOATING_MODAL_ITEM_HEIGHT +
        FLOATING_MODAL_VERTICAL_PADDING;
      const preferredTop = rect.top + rect.height / 2 - modalHeight / 2;
      const maxTop = Math.max(
        FLOATING_MODAL_EDGE_GAP,
        window.innerHeight - modalHeight - FLOATING_MODAL_EDGE_GAP
      );
      const clampedTop = Math.min(
        Math.max(preferredTop, FLOATING_MODAL_EDGE_GAP),
        maxTop
      );
      const arrowTop = Math.min(
        Math.max(rect.top + rect.height / 2 - clampedTop - 6, FLOATING_MODAL_EDGE_GAP),
        modalHeight - FLOATING_MODAL_EDGE_GAP - 12
      );

      setActiveModal({
        top: clampedTop,
        left: rect.right,
        arrowTop,
        title: menu.label,
        items: menu.subItems,
      });
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveModal(null);
    }, 300);
  };

  const handleClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <div className={footerMode ? "px-3 py-3" : "px-3 mt-4 mb-6"}>

      <div className="flex flex-col gap-1">
        {visibleMenus.map((menu) => (
          <div
            key={menu.label}
            className="relative"
            onMouseEnter={(e) => handleItemEnter(e, menu)}
            onMouseLeave={handleMouseLeave}
          >
            <AccordionMenu
              label={menu.label}
              icon={menu.icon}
              isDisabled={isNavBarCollapsed}
              maxHeight="250px"
              className="rounded-md px-3 py-2 cursor-pointer text-sm text-muted-foreground hover:bg-surface-muted hover:text-foreground"
            >
              <div className="flex flex-col ml-9 border-l border-border pl-2 space-y-1 mt-1">
                {menu.subItems.map((subItem) => (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    onClick={() => handleClick()}
                    className="group flex items-center gap-2 px-2 py-1.5 text-sm text-subtle-foreground hover:text-foreground rounded-md hover:bg-surface-muted transition-colors"
                  >
                    <span>{t(subItem.label)}</span>
                  </Link>
                ))}
              </div>
            </AccordionMenu>
          </div>
        ))}
      </div>

      {isNavBarCollapsed && activeModal && (
        <div
          onMouseEnter={(e) => handleItemEnter(e, '')}
          onMouseLeave={handleMouseLeave}
          className="fixed isolate z-[160] w-48 overflow-hidden rounded-xl border border-border bg-white shadow-2xl ring-1 ring-black/5 p-1 flex flex-col gap-1"
          style={{
            top: activeModal.top,
            left: activeModal.left + FLOATING_MODAL_OFFSET,
            backgroundColor: 'rgb(255, 255, 255)',
            opacity: 1,
          }}
        >
          <div className="px-3 py-2 text-xs font-semibold text-subtle-foreground uppercase border-b border-divider mb-1">
            {t(activeModal.title)}
          </div>

          {activeModal.items.map((subItem) => (
            <Link
              key={subItem.href}
              href={subItem.href}
              onClick={() => handleClick()}
              className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-surface-muted rounded-md transition-colors"
            >
              <span className="font-medium">{t(subItem.label)}</span>
            </Link>
          ))}
          <div
            className="absolute -left-1.5 h-3 w-3 rotate-45 border-b border-l border-divider bg-white"
            style={{ top: activeModal.arrowTop }}
          />
        </div>
      )}
    </div>
  );
};
