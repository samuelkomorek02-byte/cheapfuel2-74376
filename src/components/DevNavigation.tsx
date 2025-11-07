import { isPreviewMode } from "@/lib/utils";
import { Button } from "./ui/button";
import { useNavigate, useLocation } from "react-router-dom";

export const DevNavigation = () => {
  if (!isPreviewMode()) return null;
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const pages = [
    { path: "/", label: "Index" },
    { path: "/auth", label: "Auth" },
    { path: "/paywall", label: "Paywall" },
    { path: "/onboarding", label: "Onboarding" },
  ];
  
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-card border-2 border-primary p-2 rounded-lg shadow-xl">
      <div className="text-xs font-bold mb-2 text-primary">DEV MODE</div>
      <div className="flex gap-1 flex-col">
        {pages.map(page => (
          <Button
            key={page.path}
            size="sm"
            variant={location.pathname === page.path ? "default" : "outline"}
            onClick={() => navigate(page.path)}
          >
            {page.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
