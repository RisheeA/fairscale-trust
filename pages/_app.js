import '../styles/globals.css';
import { PrivyProvider } from '@privy-io/react-auth';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#b8924a',
          logo: '/logo.png',
        },
        loginMethods: ['wallet', 'twitter'],
        embeddedWallets: { createOnLogin: 'off' },
      }}
    >
      <Head>
        <link rel="icon" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </Head>
      <Component {...pageProps} />
    </PrivyProvider>
  );
}
