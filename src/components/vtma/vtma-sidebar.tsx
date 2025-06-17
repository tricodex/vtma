'use client';

import * as React from 'react';
import {
  Upload,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  Stethoscope,
  FileText,
  Calendar,
  Brain
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar';

interface VTMASidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function VTMASidebar({ activeView, onViewChange, ...props }: VTMASidebarProps) {
  const { t } = useLanguage();
  
  const mainMenuItems = [
    {
      id: 'workflow',
      label: t('sidebar.workflow.label'),
      description: t('sidebar.workflow.description'),
      icon: Upload,
    },
    {
      id: 'patients',
      label: t('sidebar.patients.label'),
      description: t('sidebar.patients.description'),
      icon: Users,
    },
    {
      id: 'reports',
      label: t('sidebar.reports.label'),
      description: t('sidebar.reports.description'),
      icon: FileText,
    },
    {
      id: 'analytics',
      label: t('sidebar.analytics.label'),
      description: t('sidebar.analytics.description'),
      icon: BarChart3,
    },
    {
      id: 'calendar',
      label: t('sidebar.calendar.label'),
      description: t('sidebar.calendar.description'),
      icon: Calendar,
    },
    {
      id: 'ai-chat',
      label: 'AI Assistent',
      description: 'Chat met AI over thermografie',
      icon: Brain,
    },
  ];

  const systemItems = [
    {
      id: 'settings',
      label: t('sidebar.settings'),
      icon: Settings,
    },
    {
      id: 'help',
      label: t('sidebar.help'),
      icon: HelpCircle,
    },
  ];
  
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <div className="flex items-center cursor-pointer">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg mr-2">
                  <Stethoscope className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-base font-semibold">{t('sidebar.vtma')}</span>
                  <div className="text-xs text-gray-500">{t('sidebar.thermographySystem')}</div>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('sidebar.mainMenu')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onViewChange(item.id)}
                      isActive={isActive}
                      tooltip={item.description as string}
                      className="data-[active=true]:bg-blue-50 data-[active=true]:text-blue-700 data-[active=true]:border-l-4 data-[active=true]:border-blue-600"
                    >
                      <Icon className="w-5 h-5" />
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{item.label}</span>
                        <span className="text-xs text-gray-400">{item.description}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t('sidebar.system')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onViewChange(item.id)}
                      tooltip={item.label as string}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-green-800">Systeem Online</span>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
} 