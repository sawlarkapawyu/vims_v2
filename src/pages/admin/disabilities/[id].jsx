import Head from 'next/head'
import Sidebar from '@/components/admin/layouts/Sidebar'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import React, { useState, useEffect } from "react";
import { useUserRoleCheck } from '/src/components/utilities/useUserRoleCheck.js';

import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'

import { useRouter } from 'next/router';
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import { getDateValue } from '/src/components/utilities/tools.js';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export const getStaticPaths = async () => {
    return {
      fallback: true,
      paths: [
        '/admin/disabilities/id',
        { params: { id: '1' } },
      ],
    };
};
  

export default function DisabilityEdit() {
    const router = useRouter();
    const supabase = useSupabaseClient();
    const user = useUser()
    
    const { id } = router.query;
    const { t } = useTranslation("");

    const [disabilities, setDisabilities] = useState(null);
    const [typeDisabilities, setTypeDisabilities] = useState([]);
    const [selectedDisabilityType, setSelectedDisabilityType] = useState('');    
    const [description, setDescription] = useState('');
    
    useUserRoleCheck();
    
    useEffect(() => {
        fetchDisabilityType();
        
        const fetchDisabilityData = async () => {
          const { data: disabilityData, error: disabilityError } = await supabase
            .from('disabilities')
            .select(`
              id,
              type,
              description,
              families (name, date_of_birth, nrc_id, gender, households (household_no, state_regions(name), townships(name), districts(name), ward_village_tracts(name), villages(name)))
            `)
            .eq('id', id)
            .single();
      
          if (disabilityError) {
            throw disabilityError;
          }
      
          if (disabilityData) {
            setSelectedDisabilityType([disabilityData.type]);
            setDescription(disabilityData.description);
            setDisabilities(disabilityData);
          }
        };
      
        if (id) {
          fetchDisabilityData();
        }
    }, [id]);

    // Handle edit disabilities
    const handleEditDisability = async (e) => {
        e.preventDefault();
        const { data: disabilityData, error: disabilityError } = await supabase
        .from('disabilities')
        .update({
            type: selectedDisabilityType,
            description: description,
        })
        .eq('id', id)
        .single();

        console.log(disabilityData);
        if (disabilityError) {
        alert('Failed to update disability!');
        console.error(disabilityError);
        } else {
        alert('Disability updated successfully!');
        router.push('/admin/disabilities');
        }
    };

    const [newDisability, setNewDisability] = useState('');
    const [showModalDisability, setShowModalDisability] = useState(false);
    
    const handleCloseModalDisability = () => {
        setShowModalDisability(false);
        setNewDisability('');
    };

    const fetchDisabilityType = async () => {
        try {
          const { data, error } = await supabase.from('type_of_disabilities').select('id, name');
      
          if (error) {
            throw new Error(error.message);
          } else {
            setTypeDisabilities(data || []);
          }
        } catch (error) {
          console.error('Error fetching disabilities:', error);
        }
    };      

    const handleDisabilityChange = (e) => {
        setSelectedDisabilityType(e.target.value);
        if (e.target.value === "new") {
            setShowModalDisability(true);
        }
    };

    const handleNewDisabilityChange = (e) => {
        setNewDisability(e.target.value);
    };
    
    const handleNewDisabilitySubmit = async () => {
        if (newDisability) {
          const { data, error } = await supabase.from('type_of_disabilities').insert({ name: newDisability });
      
          fetchDisabilityType();
      
          // Close the modal box
          setShowModalDisability(false);
      
          if (error) {
            console.log(error);
          } else {
            if (data) {
                setTypeDisabilities([...disabilities, data[0]]);
                setSelectedDisabilityType(data[0].id);
            }
            setNewDisability('');
            setShowModalDisability(false);
          }
        }
    };

    const handleBackClick = () => {
        router.push('/admin/disabilities');
    };
    
    const handleCancel = () => {
        const fetchDisabilityData = async () => {
            const { data: disabilityData, error: disabilityError } = await supabase
              .from('disabilities')
              .select(`
                id,
                type,
                description,
                families (name, date_of_birth, nrc_id, gender, households (household_no, state_regions(name), townships(name), districts(name), ward_village_tracts(name), villages(name)))
              `)
              .eq('id', id)
              .single();
        
            if (disabilityError) {
              throw disabilityError;
            }
        
            if (disabilityData) {
              setSelectedDisabilityType([disabilityData.type]);
              setDescription(disabilityData.description);
              setDisabilities(disabilityData);
            }
          };
            fetchDisabilityData();
    };
    

    
    return (
        <>
            <Head>
                <title>VIMS - Disability Edit</title>
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
                                {t("sidebar.Disabilities")}
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
                        {t("DisabilityRegistration")}
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
                    <form onSubmit={handleEditDisability} className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                        {disabilities && (
                        <div className="grid grid-cols-1 px-6 py-6 md:grid-cols-1">
                            <p><span className="font-semibold">{t("Name")}:</span> {disabilities.families.name}</p>
                            <p><span className="font-semibold">{t("DOB")}:</span> {getDateValue(disabilities.families.date_of_birth)}</p>
                            <p><span className="font-semibold">{t("Gender")}:</span> {disabilities.families.gender}</p>
                            <p><span className="font-semibold">{t("NRC")}:</span> {disabilities.families.nrc_id}</p>
                            <p><span className="font-semibold">{t("Address")}:</span> {`${disabilities.families.households.villages.name}\n${disabilities.families.households.ward_village_tracts.name}\n${disabilities.families.households.townships.name}, ${disabilities.families.households.districts.name},${disabilities.families.households.state_regions.name}`}</p>
                        </div>
                         )}
                        <div className="grid grid-cols-1 px-3 py-3 border-t md:grid-cols-2"> {/* Updated className */}
                            {/* Type */}
                            <div className="col-span-1 px-3 py-3 mt-3 md:col-span-1">
                                <label htmlFor="" className="block text-sm font-medium leading-6 text-gray-900">
                                {t("TypeOfDisability")}
                                </label>
                                <div className="relative mt-2">
                                    <select
                                        id="disability"
                                        value={selectedDisabilityType}
                                        onChange={handleDisabilityChange}
                                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                    >
                                        <option value="">{t("other.Choose")}</option>
                                        {typeDisabilities && typeDisabilities.map((disability, index) => (
                                            <option key={index} value={disability.id}>
                                            {disability.name}
                                            </option>
                                        ))}
                                        <option disabled>──────────</option>
                                        <option value="new" className="font-medium text-blue-500">
                                            {t("other.Add")}
                                        </option>
                                    </select>
                                </div>
                                {showModalDisability && (
                                    <div className="fixed inset-0 z-10 overflow-y-auto">
                                        <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                                <div className="absolute inset-0 bg-gray-300 opacity-75"></div>
                                            </div>
                                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                                            <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                                            <div>
                                                <div className="mt-3 text-center sm:mt-5">
                                                    <h3 className="text-lg font-medium leading-6 text-gray-900">{t("other.Add")} - {t("TypeOfDisability")}</h3>
                                                    <div className="mt-2">
                                                        <input
                                                        type="text"
                                                        name="newDisability"
                                                        id="newDisability"
                                                        value={newDisability}
                                                        onChange={handleNewDisabilityChange}
                                                        className="block w-full px-3 py-2 mt-2 mb-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-between mt-5 sm:mt-6">
                                                    <button
                                                        type="button"
                                                        className="inline-block w-full py-2 text-base font-medium text-white border border-transparent rounded-md shadow-sm bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 sm:text-sm disabled:opacity-50"
                                                        disabled={!selectedDisabilityType && !newDisability}
                                                        onClick={handleNewDisabilitySubmit}
                                                    >
                                                        {t("other.Submit")}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="inline-block w-full px-4 py-2 ml-2 text-base font-medium text-gray-700 bg-gray-200 border border-transparent rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:text-sm"
                                                        onClick={handleCloseModalDisability}
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
                                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                                {t("Description")}
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
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