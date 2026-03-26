'use client';

import { useTranslation } from 'react-i18next';
import { ExternalLink } from 'lucide-react';
import { Navbar } from '@/common/components/ui/Navbar';
import { Header } from '@/common/components/layout/Header';
import { SurfaceCard } from '@/common/components/ui/SurfaceCard';

export default function DevelopersDocsPage() {
  const { t } = useTranslation();

  return (
    <div className="lg:flex h-full min-h-0 overflow-hidden animate-enter-step">
      <Navbar />
      <div className="min-w-0 flex-1 min-h-0 flex flex-col">
        <Header />
        <div className="flex-1 min-h-0 overflow-y-auto bg-surface p-6">
          <div className="mx-auto w-full max-w-5xl">
            <SurfaceCard className="p-6">
              <h1 className="text-2xl font-bold text-foreground">
                {t('nav.docs')}
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                {t('developers.webhooks.docs.description')}
              </p>
              <a
                href="#"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover"
              >
                {t('developers.webhooks.docs.link')}
                <ExternalLink size={14} />
              </a>
            </SurfaceCard>
          </div>
        </div>
      </div>
    </div>
  );
}
