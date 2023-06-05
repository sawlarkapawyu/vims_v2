import 'focus-visible'
import '@/styles/tailwind.css'
import { useState } from 'react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { LicenseInfo } from '@mui/x-data-grid-pro'
import { useEffect } from "react";
import { useRouter } from "next/router";

import { appWithTranslation } from "next-i18next";

LicenseInfo.setLicenseKey(process.env.NEXT_PUBLIC_MUI_PREMIUM_LICENSE)

function App({ Component, pageProps }) {
  
  const router = useRouter();
  useEffect(() => {
    // Set the locale from the router query parameter (e.g., ?lng=en)
    router.locale = router.query.lng || router.locale || "en";
  }, [router.query.lng, router.locale]);
  
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Component {...pageProps} />
    </SessionContextProvider>
  )
}

export default appWithTranslation(App);

// export default function App({ Component, pageProps }) {
//   return <Component {...pageProps} />
// }