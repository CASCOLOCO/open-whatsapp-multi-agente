import { PanelSidebar } from "@/components/panel/PanelSidebar";
import { PanelMainContent } from "@/components/panel/PanelMainContent";

export const metadata = { title: "WhatsApp CRM — Panel" };

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex">
      <PanelSidebar userName="Admin" />
      <PanelMainContent>{children}</PanelMainContent>
    </div>
  );
}
