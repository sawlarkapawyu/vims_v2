import Head from 'next/head'
import { useState, useEffect } from 'react';
import Sidebar from '@/components/admin/layouts/Sidebar'
import Dashboards from '@/components/admin/Dashboard';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from "next-i18next";
import { useUserRoleCheckIsVillager } from '/src/components/utilities/useUserRoleCheckIsVillager.js';
import { useSession } from '@supabase/auth-helpers-react'

export default function Dashboard() {
    const router = useRouter();
    const session = useSession()

    // useEffect(() => {
    //     if (!session) {
    //       router.push('/login');
    //     }
    // }, [session, router]);

    // useUserRoleCheckIsVillager();
    
    const { t } = useTranslation("");
    const handleClick = () => {
        router.push('/admin/reports');
    };
    
    return (
        <>
            <Head>
                <title>VIMS - Dashboard</title>
                <meta
                name="description"
                content="Most bookkeeping software is accurate, but hard to use. We make the opposite trade-off, and hope you don’t get audited."
                />
            </Head>
            <Sidebar>
                <div className="md:flex md:items-center md:justify-between">
                    <div className="flex-1 min-w-0">
                        <h2 className="py-4 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        {t("sidebar.Dashboard")}
                        </h2>
                    </div>
                    <div className="flex mt-4 md:ml-4 md:mt-0">
                        
                            <button
                            type="button"
                            onClick={handleClick}
                            className="inline-flex items-center px-3 py-2 ml-3 text-sm font-semibold text-white rounded-md shadow-sm bg-sky-600 hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                            >
                            {t("sidebar.Reports")}
                            </button>
                       
                    </div>
                </div>
                <Dashboards />
                
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
  