import Head from 'next/head'
import Sidebar from '@/components/admin/layouts/Sidebar'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import React, { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useUserRoleCheck } from '/src/components/utilities/useUserRoleCheck.js';
// import {supabase} from '/src/components/utilities/supabase';
import { useRouter } from 'next/router';
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import { getDateValue } from '/src/components/utilities/tools.js';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export const getStaticPaths = async () => {
    return {
      fallback: true,
      paths: [
        '/admin/deaths/id',
        { params: { id: '1' } },
      ],
    };
};
  

export default function DeathEdit() {
    const router = useRouter();
    const supabase = useSupabaseClient();
    const user = useUser()
    
    const { id } = router.query;
    const { t } = useTranslation("");
    
    const [deaths, setDeaths] = useState(null);
    const [deathDate, setDeathDate] = useState('');
    const [deathPlace, setDeathPlace] = useState('');
    const [complainant, setComplainant] = useState('');
    const [remark, setRemark] = useState('');
    
    useUserRoleCheck();
    
    useEffect(() => {
        const fetchDeathData = async () => {
            const { data: deathData, error: deathError } = await supabase
                .from('deaths')
                .select(`
                death_date,
                death_place,
                complainant,
                remark,
                families (name, date_of_birth, nrc_id, gender, households (household_no, state_regions(name), townships(name), districts(name), ward_village_tracts(name), villages(name)))
                `)
                .eq('id', id)
                .single();

            if (deathError) {
                throw deathError;
            }
            setDeathDate(deathData.death_date);
            setDeathPlace(deathData.death_place);
            setComplainant(deathData.complainant);
            setRemark(deathData.remark);
            setDeaths(deathData);
            };

        if (id) {
        fetchDeathData();
        }
    }, [id]);

    // Handle edit death
    const handleEditDeath = async (e) => {
        e.preventDefault();
        const { data: deathData, error: deathError } = await supabase
        .from('deaths')
        .update({
            death_date: deathDate,
            death_place: deathPlace,
            complainant: complainant,
            remark: remark
        })
        .eq('id', id)
        .single();

        console.log(deathData);
        if (deathError) {
        alert('Failed to update death!');
        console.error(deathError);
        } else {
        alert('Death updated successfully!');
        router.push('/admin/deaths');
        }
    };

    const handleBackClick = () => {
        router.push('/admin/deaths');
    };

    const handleCancel = () => {
        const fetchDeathData = async () => {
            const { data: deathData, error: deathError } = await supabase
                .from('deaths')
                .select(`
                death_date,
                death_place,
                complainant,
                remark,
                families (name, date_of_birth, nrc_id, gender, households (household_no, state_regions(name), townships(name), districts(name), ward_village_tracts(name), villages(name)))
                `)
                .eq('id', id)
                .single();

            if (deathError) {
                throw deathError;
            }
            setDeathDate(deathData.death_date);
            setDeathPlace(deathData.death_place);
            setComplainant(deathData.complainant);
            setRemark(deathData.remark);
            setDeaths(deathData);
            };
        fetchDeathData();
    };

    return (
        <>
            <Head>
                <title>VIMS - Death Edit</title>
                <meta
                name="description"
                content="Most bookkeeping software is accurate, but hard to use. We make the opposite trade-off, and hope you don’t get audited."
                />
            </Head>
            <Sidebar>
                <div>
                    <div>
                        <nav className="sm:hidden" aria-label="Back">
                            <a onClick={handleBackClick} href="#" className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
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
                                {t("sidebar.Deaths")}
                                </a>
                            </div>
                            </li>
                            <li>
                            <div className="flex items-center">
                                <ChevronRightIcon className="flex-shrink-0 w-5 h-5 text-gray-400" aria-hidden="true" />
                                <a href="#" aria-current="page" className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                                {t("other.Edit")}
                                </a>
                            </div>
                            </li>
                        </ol>
                        </nav>
                    </div>
                    <div className="mt-2 md:flex md:items-center md:justify-between">
                        <div className="flex-1 min-w-0">
                        <h2 className="py-4 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                            {t("sidebar.Deaths")}
                        </h2>
                        </div>
                        <div className="flex-shrink-0 hidden mt-4 md:ml-4 md:mt-0 md:block">
                            <button
                                type="button"
                                onClick={handleBackClick}
                                className="inline-flex items-center px-3 py-2 ml-3 text-sm font-semibold text-white rounded-md shadow-sm bg-sky-600 hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                            >
                                <ArrowUturnLeftIcon className="w-5 h-5 mr-2" /> {t("other.Back")}
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 pt-10 gap-x-8 gap-y-8 md:grid-cols-2">
                    <form onSubmit={handleEditDeath} className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                        {deaths && (
                        <div className="grid grid-cols-1 px-6 py-6 md:grid-cols-1">
                            <p><span className="font-semibold">{t("Name")}:</span> {deaths.families.name}</p>
                            <p><span className="font-semibold">{t("DOB")}:</span> {getDateValue(deaths.families.date_of_birth)}</p>
                            <p><span className="font-semibold">{t("Gender")}:</span> {deaths.families.gender}</p>
                            <p><span className="font-semibold">{t("NRC")}:</span> {deaths.families.nrc_id}</p>
                            <p><span className="font-semibold">{t("Address")}:</span> {`${deaths.families.households.villages.name}\n${deaths.families.households.ward_village_tracts.name}\n${deaths.families.households.townships.name}, ${deaths.families.households.districts.name},${deaths.families.households.state_regions.name}`}</p>
                        </div>
                         )}
                        <div className="grid grid-cols-1 px-3 py-3 border-t md:grid-cols-2"> {/* Updated className */}
                            <div className="col-span-1 px-3 py-3 mt-3 md:col-span-1">
                                <label htmlFor="deathDate" className="block text-sm font-medium leading-6 text-gray-900">
                                    {t("DeathDate")}
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="date"
                                        id="deathDate"
                                        value={getDateValue(deathDate)}
                                        onChange={(e) => setDeathDate(e.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="col-span-1 px-3 py-3 mt-3 md:col-span-1">
                                <label htmlFor="deathPlace" className="block text-sm font-medium leading-6 text-gray-900">
                                    {t("DeathPlace")}
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        id="deathPlace"
                                        value={deathPlace}
                                        onChange={(e) => setDeathPlace(e.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="col-span-1 px-3 py-3 mt-3 md:col-span-1">
                                <label htmlFor="complainant" className="block text-sm font-medium leading-6 text-gray-900">
                                    {t("Complainant")}
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        id="complainant"
                                        value={complainant}
                                        onChange={(e) => setComplainant(e.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            {/* Remark */}
                            <div className="col-span-1 px-3 py-3 mt-3 md:col-span-1">
                                <label htmlFor="remark" className="block text-sm font-medium leading-6 text-gray-900">
                                    {t("Remarks")}
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        id="remark"
                                        value={remark}
                                        onChange={(e) => setRemark(e.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                        </div> 
                        <div className="flex items-center justify-end px-4 py-4 border-t gap-x-6 border-gray-900/10 sm:px-8">
                            <button onClick={handleCancel} type="button" className="text-sm font-semibold leading-6 text-gray-900">
                            
                                {t("other.Cancel")}
                            </button>
                            <button
                            type="submit"
                            className="px-3 py-2 text-sm font-semibold text-white rounded-md shadow-sm bg-sky-600 hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                            >
                                {t("other.Submit")}
                            </button>
                        </div>
                    </form>
                </div>
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
  