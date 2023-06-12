import 'focus-visible'
import '@/styles/tailwind.css'
import React, { useEffect, useState } from "react";
import { LicenseInfo } from '@mui/x-data-grid-pro'
import { useRouter } from "next/router";
import { appWithTranslation } from "next-i18next";
import Preloader from '../components/Preloader';
import Head from 'next/head'

import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'

LicenseInfo.setLicenseKey(process.env.NEXT_PUBLIC_MUI_PREMIUM_LICENSE)

function App({ Component, pageProps }) {
  
  const router = useRouter();
  const [supabase] = useState(() => createBrowserSupabaseClient())
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    // Set the locale from the router query parameter (e.g., ?lng=en)
    router.locale = router.query.lng || router.locale || "en";
  }, [router.query.lng, router.locale]);
  
  return (
    <>
      <Head>
          <title>VIMS</title>
      </Head>

      {!loading ? (
        <SessionContextProvider
          supabaseClient={supabase}
          initialSession={pageProps.initialSession}
        >
          <Component {...pageProps} />
        </SessionContextProvider>
      ) : (
        <Preloader />
      )}
    </>
  )
}

export default appWithTranslation(App);

// export default function App({ Component, pageProps }) {
//   return <Component {...pageProps} />
// }