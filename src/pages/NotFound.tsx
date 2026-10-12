import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <PageLayout>
      <div className="section-editorial flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-surface-card border border-hairline flex items-center justify-center mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-coral">
            <path d="M12 2V22M2 12H22M4.93 4.93L19.07 19.07M4.93 19.07L19.07 4.93" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
        <h1 className="font-serif text-6xl text-ink font-normal mb-3">404</h1>
        <h2 className="font-serif text-2xl text-ink mb-4">Page Not Found</h2>
        <p className="text-body text-sm max-w-md mx-auto mb-8">
          The requested page <code className="text-coral font-mono bg-surface-card px-2 py-0.5 rounded">{location.pathname}</code> does not exist or has been moved.
        </p>
        <Link to="/" className="btn-primary-coral">
          <span>Return to Homepage</span>
        </Link>
      </div>
    </PageLayout>
  );
};

export default NotFound;
