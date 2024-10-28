import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { SUPABASE_ADMIN_CONFIG } from "@/supabase-admin.config";

const defaultUrl = process.env.PANEL_URL
  ? `https://${process.env.PANEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: SUPABASE_ADMIN_CONFIG.general.panelTitle + ' - ' + SUPABASE_ADMIN_CONFIG.general.panelSubtitle,
  description: SUPABASE_ADMIN_CONFIG.general.panelSubtitle,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
              {children}
              <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
