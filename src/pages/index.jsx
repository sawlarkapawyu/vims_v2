import Head from 'next/head'
import Sidebar from '@/components/admin/layouts/Sidebar'
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from 'next/router';


export default function Home() {

    const { t } = useTranslation("");
    const router = useRouter();
    const handleClick = () => {
        router.push('/admin/dashboard');
    };

    return (
        <>
        <Head>
            <title>VIMS - Welcome</title>
            <meta
            name="description"
            content="Most bookkeeping software is accurate, but hard to use. We make the opposite trade-off, and hope you don’t get audited."
            />
        </Head>
        <Sidebar>
            <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                {t("home.Welcome")}
                </h2>
            </div>
            <div className="flex mt-4 md:ml-4 md:mt-0">
                <button
                onClick={handleClick}
                type="button"
                className="inline-flex items-center px-3 py-2 ml-3 text-sm font-semibold text-white rounded-md shadow-sm bg-sky-600 hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                >
                 {t("home.Dashboard")}
                </button>
            </div>
            </div>

            <div className="p-6 mt-6 bg-white shadow-md">
            <h3 className="text-lg font-semibold"> {t("home.VIMS")}</h3>
            <p className="py-4 mt-2 text-gray-600">
                {t("home.Description1")}
            </p>
            <div className="py-4 mt-4">
                <blockquote className="italic text-gray-700">
                {t("home.Description2")}
                </blockquote>
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