import Head from 'next/head'
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/admin/layouts/Sidebar'
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Management from '/src/components/users/Management'
import { useUserRoleCheckIsAdmin } from '/src/components/utilities/useUserRoleCheckIsAdmin.js';

export default function Home() {
    const { t } = useTranslation("");
    useUserRoleCheckIsAdmin();
    
    return (
        <>
            <Head>
                <title>VIMS - User Management</title>
                <meta
                name="description"
                content="Most bookkeeping software is accurate, but hard to use. We make the opposite trade-off, and hope you don’t get audited."
                />
            </Head>
            <Sidebar>
                <div className="md:flex md:items-center md:justify-between">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        {t("sidebar.UserManagement")}
                        </h2>
                    </div>
                </div>
                    <Management />
            </Sidebar>
        
        </>
    )
}

export async function getStaticProps({ locale }) {
    return {
      props: {
        ...(await serverSideTranslations(locale, ["common"])),
      },
    };
}