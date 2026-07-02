import { LogIn, Mail, Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { useAuthState } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";

function googleSignInUrl() {
  const redirect = `${window.location.origin}/auth/callback`;
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: redirect,
    response_type: "code",
    scope: "openid email profile",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export default function Navbar() {
  const { isAuthenticated } = useAuthState();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-500">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">
            <span className="gradient-text">NITAI</span> AI
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground">
            Features
          </a>
          <a href="#tools" className="text-sm text-muted-foreground hover:text-foreground">
            Tools
          </a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">
            Pricing
          </a>
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline">
                  <Mail className="h-4 w-4" />
                  Email Login
                </Button>
              </Link>
              <a href={googleSignInUrl()}>
                <Button>
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              </a>
            </div>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/40 bg-background px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <a href="#features" className="text-sm text-muted-foreground" onClick={() => setOpen(false)}>
              Features
            </a>
            <a href="#tools" className="text-sm text-muted-foreground" onClick={() => setOpen(false)}>
              Tools
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground" onClick={() => setOpen(false)}>
              Pricing
            </a>
            {isAuthenticated ? (
              <Link to="/dashboard" onClick={() => setOpen(false)}>
                <Button className="w-full">Dashboard</Button>
              </Link>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" className="w-full" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full">
                    <Mail className="h-4 w-4" />
                    Email Login
                  </Button>
                </Link>
                <a href={googleSignInUrl()} className="w-full" onClick={() => setOpen(false)}>
                  <Button className="w-full">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Button>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
