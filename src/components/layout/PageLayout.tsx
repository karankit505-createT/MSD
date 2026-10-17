import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface PageLayoutProps {
  children: ReactNode;
  hideHeader?: boolean;
  hideFooter?: boolean;
}

const PageLayout = ({ children, hideHeader = false, hideFooter = false }: PageLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink font-sans selection:bg-surface-card selection:text-coral">
      {!hideHeader && <Header />}
      <main className="flex-1 w-full">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default PageLayout;
