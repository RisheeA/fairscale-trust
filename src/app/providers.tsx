"use client";

import { PrivyProvider } from "@privy-io/react-auth";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#b8924a",
          logo: "/logo.png",
        },
        loginMethods: ["wallet", "twitter"],
        embeddedWallets: {
          createOnLogin: "off",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
