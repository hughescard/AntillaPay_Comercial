'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/common/context/authContext';

export const RouteChangeListener = () => {
  const pathname = usePathname();
  const {getMyInfo} = useAuth();

  useEffect(() => {
      getMyInfo();
  }, [pathname,getMyInfo]); 

  return null; 
};