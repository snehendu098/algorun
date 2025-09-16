import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import WalletWrapper from "@/components/providers/wallet-wrapper";
import { ThemeProvider } from "@/components/providers/theme-provider";

const geistSans = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "AlgoRun",
  description: "AlgoRun The Game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          forcedTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <WalletWrapper>{children}</WalletWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
