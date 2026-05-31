import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { TasksProvider } from "@/lib/tasks-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CmsProvider } from "@/lib/cms-context";
import { GovernanceProvider } from "@/lib/governance-context";
import { ReportsProvider } from "@/lib/reports-context";
import { VolunteerApplicationsProvider } from "@/lib/volunteer-applications-context";
import { ServicesProvider } from "@/lib/services-context";
import ChatBot from "@/components/ChatBot";

export const metadata: Metadata = {
  title: "جمعية ألهمني",
  description: "جمعية غير ربحية تسعى إلى إلهام المجتمع وتمكينه",
  icons: { icon: "/logo-square.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <AuthProvider>
          <CmsProvider>
            <TasksProvider>
              <GovernanceProvider>
                <ReportsProvider>
                  <VolunteerApplicationsProvider>
                    <ServicesProvider>
                      <Navbar />
                      <main className="min-h-screen">{children}</main>
                      <Footer />
                      <ChatBot />
                    </ServicesProvider>
                  </VolunteerApplicationsProvider>
                </ReportsProvider>
              </GovernanceProvider>
            </TasksProvider>
          </CmsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
