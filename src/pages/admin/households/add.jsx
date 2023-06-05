import Head from 'next/head'
import Sidebar from '@/components/admin/layouts/Sidebar'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import React, { useState, useEffect } from "react";
// import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { supabase } from "/src/components/utilities/supabase";

import { useRouter } from 'next/router';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export default function HouseholdAdd() {
    const router = useRouter();
    // const supabase = useSupabaseClient();
    const { t } = useTranslation("");
    const [entryDate, setEntryDate] = useState('');
    const [householdId, setHouseholdId] = useState('');
    const [houseNo, setHouseNo] = useState('');

    const [stateRegions, setStateRegions] = useState([]);
    const [selectedStateRegion, setSelectedStateRegion] = useState(null);
    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [townships, setTownships] = useState([]);
    const [selectedTownship, setSelectedTownship] = useState(null);
    const [wardVillageTracts, setWardVillageTracts] = useState([]);
    const [selectedWardVillageTract, setSelectedWardVillageTract] = useState(null);
    const [villages, setVillages] = useState([]);
    const [selectedVillage, setSelectedVillage] = useState("");

    useEffect(() => {
        fetchStateRegions();
        fetchDistricts();
        fetchTownships();
        fetchWardVillageTracts();
        fetchVillages();
    }, []);

    const fetchStateRegions = async () => {
        try {
            const { data: stateRegions, error } = await supabase
            .from("state_regions")
            .select("*");
          if (error) throw error;
          setStateRegions(stateRegions);
        } catch (error) {
          console.log("error", error);
        }
    };

    const fetchDistricts = async () => {
        try {
            const { data: districts, error } = await supabase
            .from("districts")
            .select("*")
            .eq("stateregion_id", selectedStateRegion.id);
          if (error) throw error;
          setDistricts(districts);
        } catch (error) {
          console.log("error", error);
        }
    };

    const fetchTownships = async () => {
        try {
            const { data: townships, error } = await supabase
            .from("townships")
            .select("*")
            .eq("district_id", selectedDistrict.id);
          if (error) throw error;
          setTownships(townships);
        } catch (error) {
          console.log("error", error);
        }
    };

    const fetchWardVillageTracts = async () => {
        try {
            const { data: wardVillageTracts, error } = await supabase
            .from("ward_village_tracts")
            .select("*")
            .eq("township_id", selectedTownship.id);
          if (error) throw error;
          setWardVillageTracts(wardVillageTracts);
        } catch (error) {
          console.log("error", error);
        }
    };

    const fetchVillages = async () => {
        try {
            const { data: villages, error } = await supabase
            .from("villages")
            .select("*")
            .eq("wardvillagetract_id", selectedWardVillageTract.id);
          if (error) throw error;
          setVillages(villages);
        } catch (error) {
          console.log("error", error);
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
      

    // Handle create household
    const handleCreateHousehold = async (e) => {
        e.preventDefault();

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

        try {
        const { data: householdData, error: householdError } = await supabase
            .from('households')
            .insert([
            {
                entry_date: entryDate,
                household_no: householdId,
                house_no: houseNo,
                state_region_id: selectedStateRegion.id,
                district_id: selectedDistrict.id,
                township_id: selectedTownship.id,
                ward_village_tract_id: selectedWardVillageTract.id,
                village_id: selectedVillage,
            },
            ]);

        if (householdError) {
            throw householdError;
        }

        // Show success alert
        alert('Household created successfully!');

        // Redirect to '/admin/households'
        router.push('/admin/households');
        console.log(householdData);
        } catch (error) {
        console.error(error);
        // Show error alert
        alert('An error occurred while creating the household.');
        }
    };

    const handleBackClick = () => {
        router.push('/admin/households');
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
                                {t("sidebar.Households")}
                                </a>
                            </div>
                            </li>
                            <li>
                            <div className="flex items-center">
                                <ChevronRightIcon className="flex-shrink-0 w-5 h-5 text-gray-400" aria-hidden="true" />
                                <a href="#" aria-current="page" className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                                {t("other.Add")}
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
                        <div className="flex flex-shrink-0 mt-4 md:ml-4 md:mt-0">
                        {/* <button
                            type="button"
                            className="inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            Edit
                        </button> */}
                        <button
                            type="button"
                            onClick={handleBackClick}
                            className="inline-flex items-center px-3 py-2 ml-3 text-sm font-semibold text-white rounded-md shadow-sm bg-sky-600 hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                        >
                            <ArrowUturnLeftIcon className="w-5 h-5 mr-2" />{t("other.Back")}
                        </button>
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 pt-10 gap-x-8 gap-y-8 md:grid-cols-3">
                    <form onSubmit={handleCreateHousehold} className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-3">
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
                                        placeholder='HH-KWL-111'
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
                                        value={entryDate}
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
                                        placeholder='မရ-၀၁-၁၁၁'
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
                                        value={selectedDistrict ? selectedDistrict.id :"" }
                                        onChange={handleDistrictChange} 
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6">
                                        <option value="">{t("other.Choose")}</option>
                                        {districts.map((d) => (
                                        <option key={d.id} value={d.id}>
                                            {d.name}
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
                                        value={selectedTownship ? selectedDistrict.id: ""}
                                        onChange={handleTownshipChange} 
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6">
                                        <option value="">{t("other.Choose")}</option>
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
                                        value={selectedVillage}
                                        onChange={handleVillageChange} 
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6">
                                        <option value="">{t("other.Choose")}</option>
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
                            <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
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
        ...(await serverSideTranslations(locale, ["common"])),
      },
    };
}