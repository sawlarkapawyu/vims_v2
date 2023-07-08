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
    const [typeDeaths, setTypeDeaths] = useState([]);
    const [selectedDeathType, setSelectedDeathType] = useState('');   
    const [deathDate, setDeathDate] = useState('');
    const [deathPlace, setDeathPlace] = useState('');
    const [complainant, setComplainant] = useState('');
    const [remark, setRemark] = useState('');
    
    useUserRoleCheck();
    
    useEffect(() => {
        fetchDeathType();

        const fetchDeathData = async () => {
            const { data: deathData, error: deathError } = await supabase
                .from('deaths')
                .select(`
                death_date,
                death_place,
                type,
                complainant,
                remark,
                families (name, date_of_birth, nrc_id, gender, households (household_no, state_regions(name), townships(name), districts(name), ward_village_tracts(name), villages(name)))
                `)
                .eq('id', id)
                .single();

            if (deathError) {
                throw deathError;
            }

            if (deathData) {
                setSelectedDeathType(deathData.type);
                setDeathDate(deathData.death_date);
                setDeathPlace(deathData.death_place);
                setComplainant(deathData.complainant);
                setRemark(deathData.remark);
                setDeaths(deathData);
            }
            };

        if (id) {
        fetchDeathData();
        }
    }, [id]);

    // Handle edit death
    const handleEditDeath = async (e) => {
        e.preventDefault();

        const confirmed = window.confirm('Are you sure you want to edit?');
        if (confirmed) {

            const { data: deathData, error: deathError } = await supabase
                .from('deaths')
                .update({
                    type: selectedDeathType,
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
        }
    };

    // Add New Death Type
    const [newDeath, setNewDeath] = useState('');
    const [showModalDeath, setShowModalDeath] = useState(false);
    
    const handleCloseModalDeath = () => {
        setShowModalDeath(false);
        setNewDeath('');
    };

    const fetchDeathType = async () => {
        try {
          const { data, error } = await supabase.from('type_of_deaths').select('id, name');
      
          if (error) {
            throw new Error(error.message);
          } else {
            setTypeDeaths(data || []);
          }
        } catch (error) {
          console.error('Error fetching deaths:', error);
        }
    };  
    
    const handleDeathChange = (e) => {
        setSelectedDeathType(e.target.value);
        if (e.target.value === "new") {
            setShowModalDeath(true);
        }
    };

    const handleNewDeathChange = (e) => {
        setNewDeath(e.target.value);
    };

    const handleNewDeathSubmit = async () => {
        if (newDeath) {
          const { data, error } = await supabase.from('type_of_deaths').insert({ name: newDeath });
      
          fetchDeathType();
      
          // Close the modal box
          setShowModalDeath(false);
      
          if (error) {
            console.log(error);
          } else {
            if (data) {
                setTypeDeaths([...deaths, data[0]]);
                setSelectedDeathType(data[0].id);
            }
            setNewDeath('');
            setShowModalDeath(false);
          }
        }
    };
    // End


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
                type,
                remark,
                families (name, date_of_birth, nrc_id, gender, households (household_no, state_regions(name), townships(name), districts(name), ward_village_tracts(name), villages(name)))
                `)
                .eq('id', id)
                .single();

            if (deathError) {
                throw deathError;
            }
            setSelectedDeathType([deathData.type]);
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

                            {/* Type */}
                            <div className="col-span-1 px-3 py-3 mt-3 md:col-span-1">
                                <label htmlFor="" className="block text-sm font-medium leading-6 text-gray-900">
                                {t("TypeOfDeath")}
                                </label>
                                <div className="relative mt-2">
                                    <select
                                        id="death"
                                        value={selectedDeathType}
                                        onChange={handleDeathChange}
                                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                    >
                                        <option value="">{t("other.Choose")}</option>
                                        {typeDeaths && typeDeaths.map((death, index) => (
                                            <option key={index} value={death.id}>
                                            {death.name}
                                            </option>
                                        ))}
                                        <option disabled>──────────</option>
                                        <option value="new" className="font-medium text-blue-500">
                                            {t("other.Add")}
                                        </option>
                                    </select>
                                </div>
                                {showModalDeath && (
                                    <div className="fixed inset-0 z-10 overflow-y-auto">
                                        <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                                <div className="absolute inset-0 bg-gray-300 opacity-75"></div>
                                            </div>
                                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                                            <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                                            <div>
                                                <div className="mt-3 text-center sm:mt-5">
                                                    <h3 className="text-lg font-medium leading-6 text-gray-900">{t("other.Add")} - {t("TypeOfDeath")}</h3>
                                                    <div className="mt-2">
                                                        <input
                                                        type="text"
                                                        name="newDeath"
                                                        id="newDeath"
                                                        value={newDeath}
                                                        onChange={handleNewDeathChange}
                                                        className="block w-full px-3 py-2 mt-2 mb-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-between mt-5 sm:mt-6">
                                                    <button
                                                        type="button"
                                                        className="inline-block w-full py-2 text-base font-medium text-white border border-transparent rounded-md shadow-sm bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 sm:text-sm disabled:opacity-50"
                                                        disabled={!selectedDeathType && !newDeath}
                                                        onClick={handleNewDeathSubmit}
                                                    >
                                                        {t("other.Submit")}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="inline-block w-full px-4 py-2 ml-2 text-base font-medium text-gray-700 bg-gray-200 border border-transparent rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:text-sm"
                                                        onClick={handleCloseModalDeath}
                                                    >
                                                        {t("other.Cancel")}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                )}
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
  