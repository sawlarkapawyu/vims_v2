import Head from 'next/head'
import Sidebar from '@/components/admin/layouts/Sidebar'
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function Home() {
    
    return (
        <>
            <Head>
                <title>TaxPal - Accounting made simple for small businesses</title>
                <meta
                name="description"
                content="Most bookkeeping software is accurate, but hard to use. We make the opposite trade-off, and hope you don’t get audited."
                />
            </Head>
            <Sidebar>
                <div className="md:flex md:items-center md:justify-between">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Dashboard
                        </h2>
                    </div>
                    <div className="flex mt-4 md:ml-4 md:mt-0">
                        <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                        Edit
                        </button>
                        <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 ml-3 text-sm font-semibold text-white rounded-md shadow-sm bg-sky-600 hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                        >
                        Publish
                        </button>
                    </div>
                    </div>
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