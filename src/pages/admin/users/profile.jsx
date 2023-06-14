import Head from 'next/head'
import Sidebar from '@/components/admin/layouts/Sidebar'
import { useEffect } from 'react'
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from "next-i18next";
import { useUser } from '@supabase/auth-helpers-react'
import Profile from '/src/components/users/Profile';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'



export default function Dashboard() {
    const router = useRouter();
    const user = useUser()
    const session = useSession()
    const supabase = useSupabaseClient()
    
    // useEffect(() => {
    //     if (!session) {
    //       router.push('/login');
    //     }
    // }, [session, router]);
    
    const { t } = useTranslation("");
    
    
    return (
        <>
            <Head>
                <title>VIMS - Profile</title>
                <meta
                name="description"
                content="Most bookkeeping software is accurate, but hard to use. We make the opposite trade-off, and hope you don’t get audited."
                />
            </Head>
            {/* <AuthForm /> */}
            <Sidebar>
                <div className="md:flex md:items-center md:justify-between">
                    <div className="flex-1 min-w-0">
                        <h2 className="py-4 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        {t('profile.Title')}
                        </h2>
                    </div>
                </div>
                {/* {session ? <Profile session={session} /> : null} */}
                <Profile />
            </Sidebar>
        </>
    )
}

export async function getStaticProps({ locale }) {
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
      },
    };
}