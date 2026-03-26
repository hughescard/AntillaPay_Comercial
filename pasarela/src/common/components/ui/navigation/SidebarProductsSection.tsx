'use client';

import { useRef, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { AccordionMenu } from "../AccordionMenu"; 
import { developersMenus, productsMenus } from "@/lib/navData";
import { useRbacSimulation } from "@/common/context";

type ProductMenu = {
  label: ((typeof productsMenus)[number] | (typeof developersMenus)[number])["label"];
  icon: ((typeof productsMenus)[number] | (typeof developersMenus)[number])["icon"];
  subItems: Array<((typeof productsMenus)[number]["subItems"][number] | (typeof developersMenus)[number]["subItems"][number])>;
};

interface ActiveModalState {
  top: number;
  left: number;
  title: string;
  items: ProductMenu["subItems"]; 
}

export const SidebarProductsSection = ({ isNavBarCollapsed,onNavigate }: { isNavBarCollapsed: boolean, onNavigate?: () => void }) => {
  const { t } = useTranslation();
  const { currentUser, hasPermission } = useRbacSimulation();
  
  const [activeModal, setActiveModal] = useState<ActiveModalState | null>(null);
  const groupedMenus =
    currentUser.roles.length === 1 && currentUser.roles.includes("developer")
      ? [...productsMenus, ...developersMenus]
      : productsMenus;

  const visibleMenus: ProductMenu[] = groupedMenus
    .map((menu) => ({
      ...menu,
      subItems: menu.subItems.filter((subItem) => hasPermission(subItem.permission)),
    }))
    .filter((menu) => menu.subItems.length > 0);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleItemEnter = (e: React.MouseEvent<HTMLDivElement>, menu: ProductMenu | '') => {
    if (!isNavBarCollapsed) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const rect = e.currentTarget.getBoundingClientRect();
    
    if(menu){
    setActiveModal({
      top: rect.top,
      left: rect.right,
      title: menu.label,
      items: menu.subItems
    });
    }
    
  };
  
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveModal(null);
    }, 300); 
  };

  const handleClick = ( )=>{
    if(onNavigate != undefined){
      onNavigate();
    }
  }

  return (
    <div className="px-3 mt-4 mb-6">
      {!isNavBarCollapsed && (
        <p className="px-3 text-xs font-light text-subtle-foreground mb-2 transition-opacity duration-300">
          {t('nav.productsSection')}
        </p>
      )}
    
      {/* Mapeamos los menús principales */}
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
                    onClick={()=>handleClick()}
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
          onMouseEnter={(e) => handleItemEnter(e,'')}
          onMouseLeave={handleMouseLeave}
          className="fixed isolate z-[160] w-48 overflow-hidden rounded-xl border border-border bg-white shadow-2xl ring-1 ring-black/5 p-1 flex flex-col gap-1"
          style={{
            top: activeModal.top - 10, 
            left: activeModal.left + 10, 
            backgroundColor: 'rgb(255, 255, 255)',
            opacity: 1,
          }}
        >
          <div className="px-3 py-2 text-xs font-semibold text-subtle-foreground uppercase border-b border-divider mb-1">
             {t(activeModal.title as never)}
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
            className="absolute top-4 -left-1.5 h-3 w-3 rotate-45 border-b border-l border-divider bg-white"
          />
        </div>
      )}
    </div>
  );
};
