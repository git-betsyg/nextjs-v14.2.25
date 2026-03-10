import type { ReactNode } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Fragment } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import localFont from "next/font/local";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// Route to breadcrumb label mapping
const routeLabels: Record<string, string> = {
  home: "Home",
  task: "Task",
  taskList: "Task List",
};

// Generate breadcrumb label based on path segment
function getBreadcrumbLabel(segment: string, index: number, segments: string[]): string {
  // Check if it's a known route
  if (routeLabels[segment]) {
    return routeLabels[segment];
  }
  
  // Handle dynamic route parameters
  const prevSegment = segments[index - 1];
  
  if (prevSegment === "task") {
    // /task/[tid] - tid is the task ID
    return `Task #${segment}`;
  }
  
  if (index >= 2 && segments[index - 2] === "task") {
    // /task/[tid]/[stid] - stid is the subtask ID
    return `SubTask #${segment}`;
  }
  
  // Default: capitalize the first letter of segment
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

// Generate breadcrumb data
function useBreadcrumbs() {
  const router = useRouter();
  const { asPath } = router;
  
  // Remove query parameters and hash
  const pathWithoutQuery = asPath.split("?")[0].split("#")[0];
  
  // Split the path
  const segments = pathWithoutQuery.split("/").filter(Boolean);
  
  // Generate breadcrumb items
  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = getBreadcrumbLabel(segment, index, segments);
    const isLast = index === segments.length - 1;
    
    return { href, label, isLast };
  });
  
  return breadcrumbs;
}

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const breadcrumbs = useBreadcrumbs();
  
  return (
    <>
      <div className={`${geistSans.variable} ${geistMono.variable}`}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-16 shrink-0 border-b items-center gap-2 transition-[width,height] ease-linear">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                  <BreadcrumbList>
                    {breadcrumbs.map((crumb, index) => (
                      <Fragment key={crumb.href}>
                        {index > 0 && (
                          <BreadcrumbSeparator className="hidden md:block" />
                        )}
                        <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                          {crumb.isLast ? (
                            <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink asChild>
                              <Link href={crumb.href}>{crumb.label}</Link>
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                      </Fragment>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex min-h-0 flex-1 flex-col p-4 bg-[#e5e5ed]">
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white rounded-lg">{children}</div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </>
  );
}
