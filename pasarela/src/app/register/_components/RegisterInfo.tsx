'use client';
import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";

interface InfoItemProps {
  title: string;
  description: string;
  isVisible: boolean; 
  delayClass: string; 
}

const InfoItem = ({ title, description, isVisible, delayClass }: InfoItemProps) => (
  <div 
    className={`
      border-l-[3px] border-accent pl-6 py-1
      transform transition-all duration-700 ease-out ${delayClass}
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
    `}
  >
    <h3 className="font-bold text-foreground text-lg mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">
      {description}
    </p>
  </div>
);

export const RegisterInfo = () => {
  const { t } = useTranslation();
  
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-[90%] mx-auto lg:w-full lg:order-1 order-2 flex flex-col justify-center items-center">
        
        {/* El título también se anima */}
        <div 
          className={`
            w-full flex lg:justify-start
            transform transition-all duration-700 ease-out
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
          `}
        >
            <h2 className="text-3xl font-bold text-foreground">{t('nav.brand')}</h2>
        </div>

      <div className="flex flex-col justify-center flex-1 w-full py-12">
        <div className="w-full max-w-md space-y-10 text-left">
          
          
          <InfoItem 
            title={t('register.info.title1')} 
            description={t('register.info.desc1')}
            isVisible={isVisible}
            delayClass="delay-200" 
          />
          
          <InfoItem 
            title={t('register.info.title2')} 
            description={t('register.info.desc2')} 
            isVisible={isVisible}
            delayClass="delay-400" 
          />
          
          <InfoItem 
            title={t('register.info.title3')} 
            description={t('register.info.desc3')} 
            isVisible={isVisible}
            delayClass="delay-600" 
          />

        </div>
      </div>
      
    </div>
  );
};