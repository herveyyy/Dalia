import type { Metadata } from "next";
import { Nunito_Sans, Quicksand } from "next/font/google";
import { PageTransitionLoader } from "@repo/ui/components/atoms/PageTransitionLoader";
import "./globals.css";

const nunito = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Dalia HRIS — first product of the Dalia ERP",
    template: "%s · Dalia",
  },
  description:
    "Dalia is building an ERP for the Philippines accounting firms. We start with Dalia HRIS: timekeeping and statutory payroll for MSMEs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunito.variable} ${quicksand.variable} font-sans antialiased`}
      >
        <PageTransitionLoader />
        {children}
      </body>
    </html>
  );
}
