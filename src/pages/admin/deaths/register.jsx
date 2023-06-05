import Head from 'next/head'
import Sidebar from '@/components/admin/layouts/Sidebar'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import React, { useState, useEffect } from "react";

// import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { supabase } from "/src/components/utilities/supabase";

import { useRouter } from 'next/router';
import { formatDate } from '/src/components/utilities/tools.js';
import { UserMinusIcon } from '@heroicons/react/24/outline';
import { getDateValue } from '/src/components/utilities/tools.js';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export default function FamilySearch() {
    const router = useRouter();
    // const supabase = useSupabaseClient();
    const { t } = useTranslation("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    
    const [families, setFamilies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredFamilies, setFilteredFamilies] = useState([]);

    const [stateRegions, setStateRegions] = useState([]);
    const [selectedStateRegion, setSelectedStateRegion] = useState('');
    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [townships, setTownships] = useState([]);
    const [selectedTownship, setSelectedTownship] = useState('');
    const [wardVillageTracts, setWardVillageTracts] = useState([]);
    const [selectedWardVillageTract, setSelectedWardVillageTract] = useState('');
    const [villages, setVillages] = useState([]);
    const [selectedVillage, setSelectedVillage] = useState('');
    const [households, setHouseholds] = useState([]);
    const [selectedHousehold, setSelectedHousehold] = useState('');
    
    
    useEffect(() => {
        fetchFamilies();
    }, []);

    const fetchFamilies = async () => {
        setIsLoading(true);
        setErrorMessage(null);
        
        try {
            const { data: familiesData, error: familiesError } = await supabase
                .from('families')
                .select(`
                    id, 
                    name, 
                    date_of_birth,
                    nrc_id,
                    gender,
                    father_name,
                    mother_name,
                    remark,
                    relationships (name),
                    occupations (name),
                    educations (name),
                    ethnicities (name),
                    nationalities (name),
                    religions (name),
                    households (household_no, state_regions(name), townships(name), districts(name), ward_village_tracts(name), villages(name)),
                    household_no
                `)
                .eq('isDeath', 'No');
        
            if (familiesError) throw new Error(familiesError.message);
      
            setFamilies(familiesData);
            setFilteredFamilies(familiesData);
        } catch (error) {
            console.error('Error fetching families:', error);
        }
        setIsLoading(false);
    };

    //Search and Filter Start
    const filterFamilies = (searchTerm) => {
        const filtered = [];
        
        for (const family of families) {
          const isMatchingSearchTerm =
            (family.name && family.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (family.nrc_id && family.nrc_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (family.date_of_birth && formatDate(family.date_of_birth).startsWith(searchTerm)) ||
            (family.gender && family.gender.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (family.father_name && family.father_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (family.household_no && family.household_no.toLowerCase().includes(searchTerm.toLowerCase()));
            
            const isMatchingStateRegion =
                selectedStateRegion === '' || family.households.state_regions.name === selectedStateRegion;
        
            const isMatchingDistrict = selectedDistrict === '' || family.households.districts.name === selectedDistrict;
        
            const isMatchingTownship =
                selectedTownship === '' || family.households.townships.name === selectedTownship;
        
            const isMatchingWardVillageTract =
                selectedWardVillageTract === '' || family.households.ward_village_tracts.name === selectedWardVillageTract;
        
            const isMatchingVillage = selectedVillage === '' || family.households.villages.name === selectedVillage;

            const isMatchingHousehold = selectedHousehold === '' || family.household_no === selectedHousehold;
            
          if (
            isMatchingSearchTerm &&
            isMatchingStateRegion &&
            isMatchingDistrict &&
            isMatchingTownship &&
            isMatchingWardVillageTract &&
            isMatchingVillage &&
            isMatchingHousehold
          ) {
            filtered.push(family);
          }
        }
      
        setFilteredFamilies(filtered);
    };
    
    const handleVillageChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedVillage(selectedValue);
    
        // Update filtered families based on the selected village
        const filteredByVillage = selectedValue
          ? families.filter((family) => family.households.villages.name === selectedValue)
          : families;
    
        setFilteredFamilies(filteredByVillage);
    };

    const handleWardVillageTractChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedWardVillageTract(selectedValue);
    
        // Update filtered families based on the selected village
        const filteredByWardVillagTract = selectedValue
          ? families.filter((family) => family.households.ward_village_tracts.name === selectedValue)
          : families;
    
        setFilteredFamilies(filteredByWardVillagTract);
    };

    const handleTownshipChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedTownship(selectedValue);
    
        // Update filtered families based on the selected village
        const filteredByTownship = selectedValue
          ? families.filter((family) => family.households.townships.name === selectedValue)
          : families;
    
        setFilteredFamilies(filteredByTownship);
    };

    const handleDistrictChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedDistrict(selectedValue);
    
        // Update filtered families based on the selected village
        const filteredByDistrict = selectedValue
          ? families.filter((family) => family.households.districts.name === selectedValue)
          : families;
    
        setFilteredFamilies(filteredByDistrict);
    };

    const handleStateRegionChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedStateRegion(selectedValue);
    
        // Update filtered families based on the selected village
        const filteredByStateRegion = selectedValue
          ? families.filter((family) => family.households.state_regions.name === selectedValue)
          : families;
    
        setFilteredFamilies(filteredByStateRegion);
    };

    const handleHousehlodChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedHousehold(selectedValue);
    
        const filteredByHousehold = selectedValue
          ? families.filter((family) => family.household_no === selectedValue)
          : families;
    
        setFilteredFamilies(filteredByHousehold);
    };
    
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        filterFamilies(e.target.value);
    };

    useEffect(() => {
        const fetchData = async () => {
          try {
            await fetchStateRegions();
            await fetchDistricts();
            await fetchTownships();
            await fetchWardVillageTracts();
            await fetchVillages();
            await fetchHouseholds();
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
      
        fetchData();
    }, []);
    
    async function fetchStateRegions() {
        try {
          const { data, error } = await supabase.from('state_regions').select('id, name');
          if (error) {
            throw new Error(error.message);
          }
          setStateRegions(data);
        } catch (error) {
          console.log('Error fetching state regions:', error.message);
        }
    }

    async function fetchDistricts() {
        try {
          const { data, error } = await supabase.from('districts').select('id, name');
          if (error) {
            throw new Error(error.message);
          }
          setDistricts(data);
        } catch (error) {
          console.log('Error fetching districts:', error.message);
        }
    }

    async function fetchTownships() {
        try {
          const { data, error } = await supabase.from('townships').select('id, name');
          if (error) {
            throw new Error(error.message);
          }
          setTownships(data);
        } catch (error) {
          console.log('Error fetching townships:', error.message);
        }
    }

    async function fetchWardVillageTracts() {
        try {
          const { data, error } = await supabase.from('ward_village_tracts').select('id, name');
          if (error) {
            throw new Error(error.message);
          }
          setWardVillageTracts(data);
        } catch (error) {
          console.log('Error fetching ward village tracts:', error.message);
        }
    }

    async function fetchVillages() {
        try {
          const { data, error } = await supabase.from('villages').select('id, name');
          if (error) {
            throw new Error(error.message);
          }
          setVillages(data);
        } catch (error) {
          console.log('Error fetching villages:', error.message);
        }
    }
    
    async function fetchHouseholds() {
        try {
          const { data, error } = await supabase.from('households').select('id, household_no');
          if (error) {
            throw new Error(error.message);
          }
          setHouseholds(data);
        } catch (error) {
          console.log('Error fetching households:', error.message);
        }
    }
    
    //Search and Filter End
    
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    //Modal Box with selected Id and register 
    const [selectedFamily, setSelectedFamily] = useState(null);
    const [deathDate, setDeathDate] = useState('');
    const [deathPlace, setDeathPlace] = useState('');
    const [complainant, setComplainant] = useState('');
    const [remark, setRemark] = useState('');
      
    function handleRegistrationClick(familyId) {
        const selectedFamily = filteredFamilies.find(family => family.id === familyId);
        setSelectedFamily(selectedFamily);
        // Open the modal here (implementation depends on your specific modal component)
    }

    const handleRegister = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!deathDate || !deathPlace || !complainant || !selectedFamily) {
            console.error('Please fill in all required fields.');
            return;
        }
        
        const { data: deathData, error: deathError } = await supabase
        .from("deaths")
        .insert([
        {
            death_date: deathDate,
            death_place: deathPlace,
            complainant: complainant,
            remark: remark,
            family_id: selectedFamily.id
        },
        ]);
        
        // Update isDeath to 'Yes' in families table
        const { data: updateData, error: updateError } = await supabase
        .from("families")
        .update({ isDeath: 'Yes' })
        .eq('id', selectedFamily.id);

        if (updateError) {
        throw updateError;
        }
        
        if (deathError) {
            throw deathError;
        }
        
        setSelectedFamily(null)
        fetchFamilies();
        // alert('Death registered successfully!');
        router.push('/admin/deaths');
        console.log(deathData);
        console.log(updateData);
    };

    // Pagination Start
    const [currentPage, setCurrentPage] = useState(0);
    const [perPage] = useState(10);
    const offset = currentPage * perPage;
    const currentPageData = filteredFamilies.slice(offset, offset + perPage);
    const goToPreviousPage = () => {
        if (currentPage > 0) {
          setCurrentPage(currentPage - 1);
        }
    };
    const goToNextPage = () => {
    if (currentPage < Math.ceil(filteredFamilies.length / perPage) - 1) {
        setCurrentPage(currentPage + 1);
    }
    };
    // Pagination End

    return (
        <>
            <Head>
                <title>VIMS - Death Register</title>
                <meta
                name="description"
                content="Most bookkeeping software is accurate, but hard to use. We make the opposite trade-off, and hope you don’t get audited."
                />
            </Head>
            <Sidebar>
                <div className="px-4 sm:px-6 lg:px-8">
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
                                    {t("sidebar.Deaths")}
                                    </a>
                                </div>
                                </li>
                                <li>
                                <div className="flex items-center">
                                    <ChevronRightIcon className="flex-shrink-0 w-5 h-5 text-gray-400" aria-hidden="true" />
                                    <a href="#" aria-current="page" className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                                    {t("Register")}
                                    </a>
                                </div>
                                </li>
                            </ol>
                        </nav>
                    </div>
                    {/* Breadcrumbs End */}
                    
                    <div className="py-4 sm:flex sm:items-center sm:justify-between sm:gap-3">
                        <div className="flex-1 min-w-0">
                            <h2 className="py-4 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                                {t("DeathRegistration")}
                                <span className="px-4 text-sm">({filteredFamilies.length} {t("filter.TotalResults")})</span>
                            </h2>
                            </div>
                            <div className="relative flex items-center mt-2 sm:mt-0">
                            <input
                                type="text"
                                name="search"
                                id="search"
                                placeholder={t("filter.Search")}
                                value={searchTerm}
                                onChange={handleSearch}
                                className="block w-full rounded-md border-0 py-1.5 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                            />
                            <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                                <kbd className="inline-flex items-center px-1 font-sans text-xs text-gray-400 border border-gray-200 rounded">
                                ⌘K
                                </kbd>
                            </div>
                        </div>
                    </div>

                    
                    <div className="py-4 sm:grid sm:grid-cols-6 sm:gap-4">
                        <div>
                            <select value={selectedHousehold} onChange={handleHousehlodChange} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6">
                                <option value="">{t("filter.Households")}</option>
                                {/* Render Religions options */}
                                {households.map((household) => (
                                    <option key={household.id} value={household.household_no}>
                                    {household.household_no}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <select
                            value={selectedStateRegion}
                            onChange={handleStateRegionChange}
                            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6"
                            >
                            <option value="">{t("filter.StateRegions")}</option>
                                {/* Render state region options */}
                                {stateRegions.map((stateRegion) => (
                                    <option key={stateRegion.id} value={stateRegion.name}>
                                {stateRegion.name}
                                </option>
                            ))}
                            </select>
                        </div>
                            
                        <div>
                            <select value={selectedDistrict} onChange={handleDistrictChange} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6">
                                <option value="">{t("filter.Districts")}</option>
                                {/* Render district options */}
                                {districts.map((district) => (
                                    <option key={district.id} value={district.name}>
                                    {district.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <select value={selectedTownship} onChange={handleTownshipChange} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6">
                            <option value="">{t("filter.Townships")}</option>
                            {/* Render township options */}
                            {townships.map((township) => (
                                <option key={township.id} value={township.name}>
                                {township.name}
                                </option>
                            ))}
                            </select>
                        </div>
                        
                        <div>
                            <select value={selectedWardVillageTract} onChange={handleWardVillageTractChange} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6">
                                <option value="">{t("filter.WardVillageTracts")}</option>
                                {/* Render ward/village tract options */}
                                {wardVillageTracts.map((wardVillageTract) => (
                                    <option key={wardVillageTract.id} value={wardVillageTract.name}>
                                    {wardVillageTract.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <select value={selectedVillage} onChange={handleVillageChange} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6">
                                <option value="">{t("filter.Villages")}</option>
                                    {villages.map((village) => (
                                    <option key={village.id} value={village.name}>
                                    {village.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            
                            <table className="min-w-full border-separate border-spacing-0">
                                <thead>
                                    <tr>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                                        >
                                            {t("No")}
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                                        >
                                             {t("Name")}
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                                        >
                                            {t("NRC")}
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                                        >
                                            {t("DOB")}
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                                        >
                                            {t("Age")}
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                                        >
                                            {t("Gender")}
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                                        >
                                            {t("FatherName")}
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                                        >
                                            {t("MotherName")}
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                                        >
                                            {t("Address")}
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                                        >
                                            <span className="sr-only">{t("Register")}</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="py-4 pl-4 pr-3 text-lg">
                                            {isLoading && <p>Loading...</p>}
                                            {errorMessage && <p>{errorMessage}</p>}
                                        </td>
                                    </tr>

                                    {currentPageData.map((family, familyIdx) => (
                                    <tr key={family.id} className='transition duration-300 ease-in-out border-b hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600'>
                                        <td
                                        className={classNames(
                                            familyIdx !== family.length - 1 ? 'border-b border-gray-200' : '',
                                            'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                                        )}
                                        >
                                        {(currentPage * perPage) + familyIdx + 1}
                                        </td>
                                        <td
                                        className={classNames(
                                            familyIdx !== family.length - 1 ? 'border-b border-gray-200' : '',
                                            'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                                        )}
                                        >
                                        {family.name}
                                        </td>
                                        <td
                                        className={classNames(
                                            familyIdx !== family.length - 1 ? 'border-b border-gray-200' : '',
                                            'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 sm:table-cell'
                                        )}
                                        >
                                        {family.nrc_id}
                                        </td>
                                        <td
                                        className={classNames(
                                            familyIdx !== family.length - 1 ? 'border-b border-gray-200' : '',
                                            'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 lg:table-cell'
                                        )}
                                        >
                                            {formatDate(family.date_of_birth)}
                                        </td>
                                        <td
                                        className={classNames(
                                            familyIdx !== family.length - 1 ? 'border-b border-gray-200' : '',
                                            'whitespace-nowrap px-3 py-4 text-sm text-gray-500'
                                        )}
                                        >
                                            {Math.floor(
                                            (new Date() - new Date(family.date_of_birth)) /
                                                (365.25 * 24 * 60 * 60 * 1000)
                                            )}
                                        </td>
                                        <td
                                        className={classNames(
                                            familyIdx !== family.length - 1 ? 'border-b border-gray-200' : '',
                                            'whitespace-nowrap px-3 py-4 text-sm text-gray-500'
                                        )}
                                        >
                                        {family.gender}
                                        </td>
                                        <td
                                        className={classNames(
                                            familyIdx !== family.length - 1 ? 'border-b border-gray-200' : '',
                                            'whitespace-nowrap px-3 py-4 text-sm text-gray-500'
                                        )}
                                        >
                                        {family.father_name}
                                        </td>
                                        <td
                                        className={classNames(
                                            familyIdx !== family.length - 1 ? 'border-b border-gray-200' : '',
                                            'whitespace-nowrap px-3 py-4 text-sm text-gray-500'
                                        )}
                                        >
                                        {family.household_no}
                                        </td>
                                        <td
                                        className={classNames(
                                            familyIdx !== family.length - 1 ? 'border-b border-gray-200' : '',
                                            'whitespace-pre-line px-3 py-4 text-sm text-gray-500'
                                        )}
                                        >
                                        {`${family.households.villages.name}\n${family.households.ward_village_tracts.name}\n${family.households.townships.name}, ${family.households.districts.name},${family.households.state_regions.name}`}
                                        </td>
                                        <td
                                        className={classNames(
                                            familyIdx !== family.length - 1 ? 'border-b border-gray-200' : '',
                                            'relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-8 lg:pr-8'
                                        )}
                                        >
                                        <a href="#" onClick={() => handleRegistrationClick(family.id)} className="text-red-600 hover:text-sky-900">
                                            <UserMinusIcon className="inline-block w-4 h-4 mr-1 align-text-bottom" aria-hidden="true" />
                                            <span className="inline-block align-middle">{t("Register")}</span>
                                            <span className="sr-only">, {family.name}</span>
                                        </a>
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                            
                            {/* Pagination */}
                            <nav className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6" aria-label="Pagination">
                                <div className="hidden sm:block">
                                <p className="text-sm text-gray-700">
                                    {t("other.Showing")}  <span className="font-medium">{offset + 1}</span> {t("other.To")}{' '}
                                    <span className="font-medium">{offset + currentPageData.length}</span> {t("other.Of")}{' '}
                                    <span className="font-medium">{filteredFamilies.length}</span> {t("other.Results")}
                                </p>
                                </div>
                                <div className="flex justify-between flex-1 sm:justify-end">
                                <button
                                    onClick={goToPreviousPage}
                                    className="relative inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                                    disabled={currentPage === 0}
                                >
                                    {t("other.Previous")}
                                </button>
                                <button
                                    onClick={goToNextPage}
                                    className="relative inline-flex items-center px-3 py-2 ml-3 text-sm font-semibold text-gray-900 bg-white rounded-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                                    disabled={currentPage === Math.ceil(filteredFamilies.length / perPage) - 1}
                                >
                                    {t("other.Next")}
                                </button>
                                </div>
                            </nav>

                            {/* Modal */}
                            <form onSubmit={handleRegister}>
                                {selectedFamily && (
                                <Modal onClose={() => setSelectedFamily(null)}>
                                    <div className="grid max-w-4xl grid-cols-1 px-6 py-4 mx-auto gap-x-4 gap-y-8 sm:grid-cols-1">
                                        <div className="sm:col-span-4">
                                            <div className="text-lg font-bold">{t("DeathRegistrationForm")}</div>
                                            <hr className="my-2 border-gray-300" />
                                            <p><span className="font-semibold">{t("Name")}:</span> {selectedFamily.name}</p>
                                            <p><span className="font-semibold">{t("DOB")}:</span> {getDateValue(selectedFamily.date_of_birth)}</p>
                                            <p><span className="font-semibold">{t("Gender")}:</span> {selectedFamily.gender}</p>
                                            <p><span className="font-semibold">{t("NRC")}:</span> {selectedFamily.nrc_id}</p>
                                            <p><span className="font-semibold">{t("Address")}:</span> {`${selectedFamily.households.villages.name}\n${selectedFamily.households.ward_village_tracts.name}\n${selectedFamily.households.townships.name}, ${selectedFamily.households.districts.name},${selectedFamily.households.state_regions.name}`}</p>
                                        </div>
                                        <div className="sm:col-span-4">
                                            <input
                                            type="date"
                                            value={deathDate}
                                            onChange={(e) => setDeathDate(e.target.value)}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                        <div className="sm:col-span-4">
                                            <input
                                            type="text"
                                            placeholder={t("DeathPlace")}
                                            value={deathPlace}
                                            onChange={(e) => setDeathPlace(e.target.value)}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                        <div className="sm:col-span-4">
                                            <input
                                            type="text"
                                            placeholder={t("Complainant")}
                                            value={complainant}
                                            onChange={(e) => setComplainant(e.target.value)}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>

                                        <div className="sm:col-span-4">
                                            <textarea
                                                id="about"
                                                placeholder={t("Remarks")}
                                                value={remark}
                                                onChange={(e) => setRemark(e.target.value)}
                                                rows={3}
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                        
                                        <div className="flex justify-between sm:col-span-4">
                                            <button
                                                type="submit"
                                                className="px-4 py-2 text-white rounded bg-sky-500 hover:bg-blue-600"
                                            >
                                                {t("other.Submit")}
                                            </button>
                                            <button
                                                className="px-4 py-2 text-white bg-gray-800 rounded hover:bg-gray-700"
                                                onClick={() => setSelectedFamily(null)}
                                            >
                                                {t("other.Cancel")}
                                            </button>
                                        </div>

                                    </div>
                                </Modal>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </Sidebar>
        
        </>
    )
}

const Modal = ({ children }) => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-gray-800 opacity-75"></div>
        <div className="z-50 max-w-4xl p-6 mx-auto bg-white rounded-lg">
          {children}
        </div>
      </div>
    );
};

export async function getStaticProps({ locale }) {
    return {
      props: {
        ...(await serverSideTranslations(locale, ["common"])),
      },
    };
}
  