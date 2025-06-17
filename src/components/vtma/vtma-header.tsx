'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { HelpCircle } from 'lucide-react';
import { LanguageToggle } from '@/components/language-toggle';
import { useLanguage } from '@/lib/i18n/language-context';

export function VTMAHeader() {
  const { t } = useLanguage();
  
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">{t('header.title')}</h1>
            <p className="text-sm text-gray-600 hidden sm:block">
              {t('header.subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <HelpCircle className="w-4 h-4 mr-2" />
              {t('common.help')}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
} 