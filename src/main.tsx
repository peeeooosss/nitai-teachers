import { ConvexProviderWithHerculesAuth } from "@usehercules/auth/convex-react";
import { HerculesAuthProvider } from "@usehercules/auth/react";
import { ConvexReactClient } from "convex/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";

import App from "./App";
import "./index.css";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL!);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HerculesAuthProvider
      authority="https://auth.hercules.app"
      client_id="nitai-teachers"
    >
      <ConvexProviderWithHerculesAuth client={convex}>
        <App />
        <Toaster position="bottom-right" richColors />
      </ConvexProviderWithHerculesAuth>
    </HerculesAuthProvider>
  </StrictMode>,
);
