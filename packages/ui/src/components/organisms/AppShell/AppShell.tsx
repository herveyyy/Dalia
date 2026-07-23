import * as React from "react";
import { Drawer as BaseDrawer } from "@base-ui/react/drawer";
import { Menu as MenuIcon, X } from "lucide-react";
import { AppSidebar, AppSidebarProps } from "../AppSidebar";

export interface AppShellProps extends AppSidebarProps {
  children: React.ReactNode;
}

export function AppShell({ children, ...sidebarProps }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* Desktop Sidebar (Persistent) */}
      <div className="hidden md:flex md:w-[280px] md:flex-col shrink-0">
        <AppSidebar {...sidebarProps} />
      </div>

      {/* Main Container */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Mobile Header Bar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 md:hidden shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-display text-xl font-bold tracking-tight text-primary">
              Dalia
            </span>
          </div>

          <BaseDrawer.Root open={mobileOpen} onOpenChange={setMobileOpen}>
            <BaseDrawer.Trigger className="rounded-lg p-2 text-muted-foreground hover:bg-muted transition-colors cursor-pointer outline-none">
              <MenuIcon className="size-6" />
            </BaseDrawer.Trigger>

            <BaseDrawer.Portal>
              <BaseDrawer.Backdrop className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
              <BaseDrawer.Popup className="fixed inset-y-0 left-0 z-50 w-full max-w-[300px] bg-card transition-transform duration-300 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left">
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-end px-4 pt-4">
                    <BaseDrawer.Close className="rounded-full p-1.5 text-muted-foreground hover:bg-muted cursor-pointer outline-none">
                      <X className="size-6" />
                    </BaseDrawer.Close>
                  </div>
                  <div className="flex-1 overflow-hidden -mt-8">
                    <AppSidebar
                      {...sidebarProps}
                      onSelectWorkspace={(id) => {
                        sidebarProps.onSelectWorkspace(id);
                        setMobileOpen(false);
                      }}
                      onCreateWorkspaceClick={() => {
                        sidebarProps.onCreateWorkspaceClick();
                        setMobileOpen(false);
                      }}
                    />
                  </div>
                </div>
              </BaseDrawer.Popup>
            </BaseDrawer.Portal>
          </BaseDrawer.Root>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-muted/20 p-6 md:p-8 focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}
