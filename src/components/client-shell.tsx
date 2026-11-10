'use client';

import { FleetHeader, FleetFooter } from '@/components/site-shell';
import { ChatWidget } from '@/components/chat-widget';

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FleetHeader />
      <main className="min-h-[62vh]">{children}</main>
      <FleetFooter />
      <ChatWidget />
    </>
  );
}
