import { shadcn } from "@clerk/themes";
import { publicEnv } from "@/lib/env";

const basePath = publicEnv.baseUrl.replace(/\/$/, "");

export const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/brand/amara-logo.png`,
  },
  variables: {
    colorPrimary: "#c41a1a",
    colorForeground: "#1a1212",
    colorMutedForeground: "#3d2828",
    colorDanger: "#c41a1a",
    colorBackground: "#ffffff",
    colorInput: "#ffffff",
    colorInputForeground: "#1a1212",
    colorNeutral: "#e8dbdb",
    fontFamily: "DM Sans, sans-serif",
    borderRadius: "0px",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-card rounded-none w-[440px] max-w-full overflow-hidden border border-border",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "font-display text-foreground",
    headerSubtitle: "text-muted-foreground",
    formFieldLabel: "text-foreground",
    footerActionText: "text-muted-foreground",
    footerActionLink: "text-primary",
    dividerText: "text-muted-foreground",
    formButtonPrimary: "bg-primary text-primary-foreground rounded-none",
    formFieldInput: "rounded-none border-border text-foreground",
  },
};

export function stripBase(path: string): string {
  return basePath && path.startsWith(basePath) ? path.slice(basePath.length) || "/" : path;
}

export { basePath };
