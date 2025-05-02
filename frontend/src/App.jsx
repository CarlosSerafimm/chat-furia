import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/";

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        {!isAuthPage && <AppSidebar  />}
        <main className={`flex-1 relative`}>
          {!isAuthPage && (
            <SidebarTrigger className="cursor-pointer absolute top-4 left-4 z-10 bg-slate-400" />
          )}
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
