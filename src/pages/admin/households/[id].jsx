import Head from 'next/head';
import Sidebar from '@/components/admin/layouts/Sidebar';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { ArrowUturnLeftIcon} from '@heroicons/react/24/outline';
import React, { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useUserRoleCheck } from '/src/components/utilities/useUserRoleCheck.js';

import { useRouter } from 'next/router';
import { getDateValue } from '/src/components/utilities/tools.js';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export const getStaticPaths = async () => {
    return {
      fallback: true,
      paths: [
        '/admin/households/id',
        { params: { id: '1' } },
      ],
    };
};
  
export default function HouseholdEdit() {

    const router = useRouter();
    const supabase = useSupabaseClient();
    const user = useUser()

    const { t } = useTranslation("");
    const { id } = router.query; // Retrieve the `id` parameter from the route
    
    const [entryDate, setEntryDate] = useState('');
    const [householdId, setHouseholdId] = useState('');
    const [houseNo, setHouseNo] = useState('');

    const [stateRegions, setStateRegions] = useState([]);
    const [selectedStateRegion, setSelectedStateRegion] = useState(null);
    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState(null); // Initialize with an empty object
    const [townships, setTownships] = useState([]);
    const [selectedTownship, setSelectedTownship] = useState(null);
    const [wardVillageTracts, setWardVillageTracts] = useState([]);
    const [selectedWardVillageTract, setSelectedWardVillageTract] = useState(null);
    const [villages, setVillages] = useState([]);
    const [selectedVillage, setSelectedVillage] = useState("");

    useUserRoleCheck();
    
    useEffect(() => {    
        fetchStateRegions();
        
        const fetchHouseholdData = async () => {
            const { data: householdData, error: householdError } = await supabase
                .from('households')
                .select(`
                id,
                entry_date,
                household_no,
                house_no,
                state_regions (id, name),
                districts (id, name),
                townships (id, name),
                ward_village_tracts (id, name),
                villages (id, name)
                `)
                .eq('id', id)
                .single();
        
            if (householdError) {
                throw householdError;
            }
        
            setEntryDate(householdData.entry_date);
            setHouseholdId(householdData.household_no);
            setHouseNo(householdData.house_no);
            setSelectedStateRegion(householdData.state_regions);
            setSelectedDistrict(householdData.districts);
            setSelectedTownship(householdData.townships);
            setSelectedWardVillageTract(householdData.ward_village_tracts);
            setSelectedVillage(householdData.villages);
            };
        
        if (id) {
        fetchHouseholdData();
        }
    }, [id]);
    
    // Handle edit household
    const handleEditHousehold = async (e) => {
        e.preventDefault();

        const confirmed = window.confirm("Are you sure you want to edit?");
        if (confirmed) {
            // Check if all required fields are filled
            if (
            !entryDate ||
            !householdId ||
            !houseNo ||
            !selectedStateRegion ||
            !selectedDistrict ||
            !selectedTownship ||
            !selectedWardVillageTract ||
            !selectedVillage
            ) {
            alert('Please fill all required fields!');
            return;
            }

            const { data: householdData, error: householdError } = await supabase
            .from('households')
            .update({
                entry_date: entryDate,
                household_no: householdId,
                house_no: houseNo,
                state_region_id: selectedStateRegion.id,
                district_id: selectedDistrict.id,
                township_id: selectedTownship.id,
                ward_village_tract_id: selectedWardVillageTract.id,
                village_id: selectedVillage.id
            })
            .eq('id', id)
            .single();

            console.log(householdData);
            if (householdError) {
            alert('Failed to update household!');
            console.error(householdError);
            } else {
            alert('Household updated successfully!');
            router.push('/admin/households');
            }
        }
    };

    // Fetch state regions
    const fetchStateRegions = async () => {
        const { data: stateRegionsData, error: stateRegionsError } = await supabase
        .from('state_regions')
        .select('id, name');

        if (stateRegionsError) {
        console.error(stateRegionsError);
        } else {
        setStateRegions(stateRegionsData);
        }
    };

    const handleStateRegionChange = async (event) => {
        const selectedStateRegion = stateRegions.find(
        (sr) => sr.id === parseInt(event.target.value)
        );
        setSelectedStateRegion(selectedStateRegion);
        setSelectedDistrict(null);
        setSelectedTownship(null);
        setSelectedWardVillageTract(null);
        setSelectedVillage(null);
        setDistricts([]);
        setTownships([]);
        setWardVillageTracts([]);
        setVillages([]);
        try {
        const { data: districts, error } = await supabase
            .from("districts")
            .select("*")
            .eq("state_region_id", selectedStateRegion.id);
        console.log("districts", districts);
        if (error) throw error;
        setDistricts(districts);
        } catch (error) {
        console.log("error", error);
        }
    };

    const handleDistrictChange = async (event) => {
        const selectedDistrict = districts.find(
            (d) => d.id === parseInt(event.target.value));
            setSelectedDistrict(selectedDistrict);
            setSelectedTownship(null);
            setSelectedWardVillageTract(null);
            setSelectedVillage(null);
            setTownships([]);
            setWardVillageTracts([]);
            setVillages([]);
            
        try {
            const { data: townshipsData } = await supabase
            .from('townships')
            .select('*')
            .eq('district_id', selectedDistrict.id)
            .order('name', { ascending: true });
            if (townshipsData && townshipsData.length > 0) {
                setTownships(townshipsData);
            }
        } catch (error) {
        console.log('Error fetching townships', error);
        }
    }
  
    const handleTownshipChange = async (event) => {
        const selectedTownship = townships.find(
            (t) => t.id === parseInt(event.target.value));
            setSelectedTownship(selectedTownship);
            setSelectedWardVillageTract(null);
            setSelectedVillage(null);
            setWardVillageTracts([]);
            setVillages([]);
            
            try {
            const { data: wardVillageTractsData } = await supabase
            .from('ward_village_tracts')
            .select('*')
            .eq('township_id', selectedTownship.id)
            .order('name', { ascending: true });
            if (wardVillageTractsData && wardVillageTractsData.length > 0) {
                setWardVillageTracts(wardVillageTractsData);
            }
        } catch (error) {
        console.log('Error fetching ward village tracts', error);
        }
    }

    const handleWardVillageTractChange = async (event) => {
        const selectedWardVillageTract = wardVillageTracts.find(
            (wv) => wv.id === parseInt(event.target.value));
            setSelectedWardVillageTract(selectedWardVillageTract);
            setVillages([]);
            
            try {
            const { data: villagesData } = await supabase
            .from('villages')
            .select('*')
            .eq('ward_village_tract_id', selectedWardVillageTract.id)
            .order('name', { ascending: true });
            if (villagesData && villagesData.length > 0) {
                setVillages(villagesData);
            }
        } catch (error) {
        console.log('Error fetching villages', error);
        }
    }

    const handleVillageChange = (event) => {
        setSelectedVillage(event.target.value);
    };
  
    const handleBackClick = () => {
        router.push('/admin/households');
    };

    const handleCancel = () => {
        const fetchHouseholdData = async () => {
          const { data: householdData, error: householdError } = await supabase
            .from('households')
            .select(`
              id,
              entry_date,
              household_no,
              house_no,
              state_regions (id, name),
              districts (id, name),
              townships (id, name),
              ward_village_tracts (id, name),
              villages (id, name)
            `)
            .eq('id', id)
            .single();
      
          if (householdError) {
            throw householdError;
          }
      
          setEntryDate(householdData.entry_date);
          setHouseholdId(householdData.household_no);
          setHouseNo(householdData.house_no);
          setSelectedStateRegion(householdData.state_regions);
          setSelectedDistrict(householdData.districts);
          setSelectedTownship(householdData.townships);
          setSelectedWardVillageTract(householdData.ward_village_tracts);
          setSelectedVillage(householdData.villages);
        };
      
        fetchHouseholdData();
    };
      

    return (
        <>
            <Head>
                <title>VIMS - Household Add</title>
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
                                    {t("sidebar.Households")}
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
                            <li>
                            <div className="flex items-center">
                                <ChevronRightIcon className="flex-shrink-0 w-5 h-5 text-gray-400" aria-hidden="true" />
                                <a href="#" aria-current="page" className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                                {householdId}
                                </a>
                            </div>
                            </li>
                        </ol>
                        </nav>
                    </div>
                    <div className="mt-2 md:flex md:items-center md:justify-between">
                        <div className="flex-1 min-w-0">
                        <h2 className="py-4 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                            {t("sidebar.Households")}
                        </h2>
                        </div>
                        <div className="flex-shrink-0 hidden mt-2 md:ml-4 md:mt-0 md:block">
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
                
                <div className="grid grid-cols-1 pt-10 gap-x-8 gap-y-8 md:grid-cols-3">
                    <form onSubmit={handleEditHousehold} className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-3">
                        <div className="grid grid-cols-1 px-3 py-3 md:grid-cols-3"> {/* Updated className */}
                            <div className="col-span-1 px-3 py-3 mt-3 md:col-span-1">
                                <label htmlFor="householdId" className="block text-sm font-medium leading-6 text-gray-900">
                                    {t("HouseholdNo")}
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        id="householdId"
                                        value={householdId}
                                        onChange={(e) => setHouseholdId(e.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="col-span-1 px-3 py-3 mt-3 md:col-span-1">
                                <label htmlFor="entryDate" className="block text-sm font-medium leading-6 text-gray-900">
                                    {t("EntryDate")}
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="date"
                                        id="entryDate"
                                        value={getDateValue(entryDate)}
                                        onChange={(e) => setEntryDate(e.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="col-span-1 px-3 py-3 mt-3 md:col-span-1">
                                <label htmlFor="houseNo" className="block text-sm font-medium leading-6 text-gray-900">
                                    {t("HouseNo")}
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        id="houseNo"
                                        value={houseNo}
                                        onChange={(e) => setHouseNo(e.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="col-span-1 px-3 py-3 mt-3 md:col-span-1">
                                <label htmlFor="stateRegions" className="block text-sm font-medium leading-6 text-gray-900">
                                    {t("StateRegions")}
                                </label>
                                <div className="mt-2">
                                    <select 
                                        id="stateRegions"
                                        value={selectedStateRegion ? selectedStateRegion.id : ""}
                                        onChange={handleStateRegionChange} 
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6">
                                        <option value="">{t("other.Choose")}</option>
                                        {stateRegions.map((sr) => (
                                        <option key={sr.id} value={sr.id}>
                                            {sr.name}
                                        </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="col-span-1 px-3 py-3 mt-3 md:col-span-1">
                                <label htmlFor="districts" className="block text-sm font-medium leading-6 text-gray-900">
                                    {t("Districts")}
                                </label>
                                <div className="mt-2">
                                    <select
                                    id="districts"
                                    value={selectedDistrict ? selectedDistrict.id : ""}
                                    onChange={handleDistrictChange}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                    >
                                    <option value="">{t("other.Choose")}</option>
                                    {selectedDistrict && (
                                        <option key={selectedDistrict.id} value={selectedDistrict.id}>
                                        {selectedDistrict.name}
                                        </option>
                                    )}
                                    {districts.map((district) => (
                                        <option key={district.id} value={district.id}>
                                        {district.name}
                                        </option>
                                    ))}
                                    </select>
                                </div>
                            </div>

                            <div className="col-span-1 px-3 py-3 mt-3 md:col-span-1">
                                <label htmlFor="townships" className="block text-sm font-medium leading-6 text-gray-900">
                                    {t("Townships")}
                                </label>
                                <div className="mt-2">
                                    <select 
                                        id="townships"
                                        value={selectedTownship ? selectedTownship.id: ""}
                                        onChange={handleTownshipChange} 
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6">
                                        <option value="">{t("other.Choose")}</option>
                                        {selectedTownship && (
                                            <option key={selectedTownship.id} value={selectedTownship.id}>
                                            {selectedTownship.name}
                                            </option>
                                        )}
                                        {townships.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.name}
                                        </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="col-span-1 px-3 py-3 mt-3 md:col-span-1">
                                <label htmlFor="wardVillageTracts" className="block text-sm font-medium leading-6 text-gray-900">
                                    {t("WardVillageTracts")}
                                </label>
                                <div className="mt-2">
                                    <select 
                                        id="wardVillageTracts"
                                        value={selectedWardVillageTract ? selectedWardVillageTract.id : ""}
                                        onChange={handleWardVillageTractChange} 
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6">
                                        <option value="">{t("other.Choose")}</option>
                                        {selectedWardVillageTract && (
                                            <option key={selectedWardVillageTract.id} value={selectedWardVillageTract.id}>
                                            {selectedWardVillageTract.name}
                                            </option>
                                        )}
                                        {wardVillageTracts.map((wvt) => (
                                        <option key={wvt.id} value={wvt.id}>
                                            {wvt.name}
                                        </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="col-span-1 px-3 py-3 mt-3 md:col-span-1">
                                <label htmlFor="selectedVillage" className="block text-sm font-medium leading-6 text-gray-900">
                                    {t("Villages")}
                                </label>
                                <div className="mt-2">
                                    <select 
                                        id="selectedVillage"
                                        value={selectedVillage ? selectedVillage.id : ""}
                                        onChange={handleVillageChange} 
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6">
                                        <option value="">{t("other.Choose")}</option>
                                        {selectedVillage && (
                                            <option key={selectedVillage.id} value={selectedVillage.id}>
                                            {selectedVillage.name}
                                            </option>
                                        )}
                                        {villages.map((v) => (
                                        <option key={v.id} value={v.id}>
                                            {v.name}
                                        </option>
                                        ))}
                                    </select>
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
    );
}

export async function getStaticProps({ locale }) {
    return {
      props: {
        ...(await serverSideTranslations(locale, ["common"])),
      },
    };
}