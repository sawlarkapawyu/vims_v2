import Head from 'next/head'
import Sidebar from '@/components/admin/layouts/Sidebar'
import Reports from '@/components/admin/Report'
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from "next-i18next";
import { useUserRoleCheck } from '/src/components/utilities/useUserRoleCheck.js';

export default function Home() {
    const { t } = useTranslation("");
    useUserRoleCheck();
  return (
    <>
        <Head>
            <title>VIMS - Reports</title>
            <meta
            name="description"
            content="Most bookkeeping software is accurate, but hard to use. We make the opposite trade-off, and hope you don’t get audited."
            />
        </Head>
        <Sidebar>
            <div className="md:flex md:items-center md:justify-between">
                {/* Breadcrumbs Start */}
                <div className='py-2'>
                    <nav className="sm:hidden" aria-label="Back">
                        <a href="#" className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
                            <ChevronLeftIcon className="flex-shrink-0 w-5 h-5 mr-1 -ml-1 text-gray-400" aria-hidden="true" />
                            {t("other.Back")}
                        </a>
                        </nav>
                        <nav className="hidden sm:flex" aria-label="Breadcrumb">
                        <ol role="list" className="flex items-center space-x-4">
                            <li>
                            <div className="flex">
                                <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                                {t("other.Admin")}
                                </a>
                            </div>
                            </li>
                            <li>
                            <div className="flex items-center">
                                <ChevronRightIcon className="flex-shrink-0 w-5 h-5 text-gray-400" aria-hidden="true" />
                                <a href="#" className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                                {t("sidebar.Reports")}
                                </a>
                            </div>
                            </li>
                            <li>
                            <div className="flex items-center">
                                <ChevronRightIcon className="flex-shrink-0 w-5 h-5 text-gray-400" aria-hidden="true" />
                                <a href="#" aria-current="page" className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                                {t("other.Show")}
                                </a>
                            </div>
                            </li>
                        </ol>
                    </nav>
                </div>
                {/* Breadcrumbs End */}
            </div>
            <div className="py-4 sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h2 className="py-4 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">{t("report.Reports")}</h2>
                </div>
            </div>
            <Reports />
            
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