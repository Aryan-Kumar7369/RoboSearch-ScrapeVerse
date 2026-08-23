import "./globals.css";

export const metadata = {
  title: "RoboSearch India | Hardware Arbitrage & BOM Optimizer",
  description: "Resilient robotics procurement powered by Bright Data Scraper Studio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 min-h-screen text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}