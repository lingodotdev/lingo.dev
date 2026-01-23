'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { tools } from '@/lib/data';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/components/logo';
import { LayoutDashboard } from 'lucide-react';
import { LanguageSwitcher } from './language-switcher';
import { useLocalization } from '@/i18n/context';
import { getToolUrl } from '@/lib/utils';

export function SidebarNav() {
  const pathname = usePathname();
  const { t } = useLocalization();

  const toolLinks = tools.map(tool => ({
    href: getToolUrl(tool.id),
    label: tool.name, // This will be translated below
    id: tool.id,
    icon: tool.icon,
  }));

  const getTranslatedLabel = (id: string, defaultLabel: string) => {
    const keyMap: { [key: string]: string } = {
      'documentation-generator': 'sidebar.documentationGenerator',
      'topic-summarizer': 'sidebar.topicSummarizer',
    };
    return t(keyMap[id] || id, defaultLabel);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex w-full items-center justify-between">
          <Logo />
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/dashboard'}
              tooltip={{ children: t('sidebar.dashboard', 'Dashboard') }}
            >
              <Link href="/dashboard">
                <LayoutDashboard />
                <span>{t('sidebar.dashboard', 'Dashboard')}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <Separator className="my-2" />
          {toolLinks.map(link => {
            const Icon = link.icon;
            if (!Icon) return null;
            const translatedLabel = getTranslatedLabel(link.id, link.label);
            return (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === link.href}
                  tooltip={{ children: translatedLabel }}
                >
                  <Link href={link.href}>
                    <Icon />
                    <span>{translatedLabel}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="w-full px-2 pb-2">
          <LanguageSwitcher />
        </div>
        <Button variant="ghost" className="w-full justify-start gap-2" suppressHydrationWarning>
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            ?
          </div>
          <span>{t('sidebar.help', 'Help & Support')}</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
