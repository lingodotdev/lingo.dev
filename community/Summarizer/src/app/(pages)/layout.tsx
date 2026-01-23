import { SidebarNav } from '@/components/sidebar-nav';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AiAssistant } from '@/components/ai-assistant';
import { LocalizationProvider } from '@/i18n/context';

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LocalizationProvider>
      <SidebarProvider>
        <SidebarNav />
        <SidebarInset>
          {children}
          <AiAssistant />
        </SidebarInset>
      </SidebarProvider>
    </LocalizationProvider>
  );
}
