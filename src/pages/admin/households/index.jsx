import Head from 'next/head'
import Sidebar from '@/components/admin/layouts/Sidebar'
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useReactToPrint } from 'react-to-print';

import { useRouter } from 'next/router';
import { ChevronRightIcon, ChevronLeftIcon, TrashIcon, PencilSquareIcon, DocumentPlusIcon, PrinterIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { formatDate, classNames, translateNumberToMyanmar } from '/src/components/utilities/tools.js';
import { useUserRoleCheck } from '/src/components/utilities/useUserRoleCheck.js';

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export default function Household() {
    const router = useRouter();
    const user = useUser()
    const supabase = useSupabaseClient();
    
    const { t } = useTranslation("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [households, setHouseholds] = useState([]);
    
    // Search and filter state
    const [searchQuery, setSearchQuery] = useState('');
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
    
    
    useUserRoleCheck();
    
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

    async function fetchHouseholds() {
        setIsLoading(true);
        setErrorMessage(null);

        let { data: househlodData, error } = await supabase
        .from('households').select(`
            id, 
            household_no, 
            entry_date,
            house_no,
            state_regions (id, name),
            districts (id, name),
            townships (id, name),
            ward_village_tracts (id, name),
            villages (id, name)
        `)
        .order('id', { ascending: false });

        // Simulating a delay of 1 second
        setTimeout(() => {
            setHouseholds(househlodData);
        }, 1000);

        if (error) {
        setErrorMessage(error.message);
        } else {
        setHouseholds(househlodData);
        }

        setIsLoading(false);
    }

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
    
    
    // Filtered households based on search and filters
    const filteredHouseholds = households.filter((household) => {
        const isMatchingSearchQuery =
        (household.household_no && household?.household_no.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (household.entry_date && formatDate(household.entry_date).startsWith(searchQuery)) ||
        (household.house_no && household?.house_no.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (household.state_regions?.name && household?.state_regions?.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (household.districts?.name && household?.districts?.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (household.townships.name && household?.townships?.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (household.ward_village_tracts.name && household?.ward_village_tracts?.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (household.villages.name && household?.villages?.name.toLowerCase().includes(searchQuery.toLowerCase()));


        const isMatchingStateRegion =
        selectedStateRegion === '' || household.state_regions.name === selectedStateRegion;

        const isMatchingDistrict =
        selectedDistrict === '' || household.districts.name === selectedDistrict;

        const isMatchingTownship =
        selectedTownship === '' || household.townships.name === selectedTownship;

        const isMatchingWardVillageTract =
        selectedWardVillageTract === '' ||
        household.ward_village_tracts.name === selectedWardVillageTract;

        const isMatchingVillage = selectedVillage === '' || household.villages.name === selectedVillage;

        return (
        isMatchingSearchQuery &&
        isMatchingStateRegion &&
        isMatchingDistrict &&
        isMatchingTownship &&
        isMatchingWardVillageTract &&
        isMatchingVillage
        );
    });
    
    const handleAddClick = () => {
        router.push('/admin/households/add');
    };
    
    // Pagination Start
    const [currentPage, setCurrentPage] = useState(0);
    const [perPage] = useState(10);
    const offset = currentPage * perPage;
    const currentPageData = filteredHouseholds.slice(offset, offset + perPage);
    const goToPreviousPage = () => {
        if (currentPage > 0) {
          setCurrentPage(currentPage - 1);
        }
    };
    const goToNextPage = () => {
    if (currentPage < Math.ceil(filteredHouseholds.length / perPage) - 1) {
        setCurrentPage(currentPage + 1);
    }
    };
    // Pagination End
    
    //Delete
    const handleDeleteHousehold = async (householdId) => {
        
        const confirmed = window.confirm("Are you sure you want to delete?");
        if (confirmed) {
            try {
                const { error } = await supabase
                .from('households')
                .delete()
                .eq('id', householdId);
            
                if (error) {
                alert('Failed to delete household!');
                console.error(error);
                } else {
                alert('Household deleted successfully!');
                fetchHouseholds();
                router.push('/admin/households');
                }
            } catch (error) {
                alert('An error occurred while deleting the household!');
                console.error(error);
            }
        }
    };

    //Print start
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => {
          const table = componentRef.current;
          const clonedTable = table.cloneNode(true);
          const rows = clonedTable.getElementsByTagName('tr');
      
          // Create a div element for the row
          const rowElement = document.createElement('div');
          rowElement.classList.add('flex', 'justify-between'); // Apply flex and justify-between classes to align the elements
      
          // Add page title
          const titleElement = document.createElement('div');
          titleElement.innerHTML = `<h1 class="py-4 px-8 font-semibold">${t("sidebar.Households")}</h1>`; // Customize the page title as per your needs
      
          // Get current date
          const currentDate = new Date().toLocaleDateString();
      
          // Create a div element for the current date
          const dateElement = document.createElement('div');
          dateElement.innerHTML = `<p class="py-4 px-8">${currentDate}</p>`;
      
          rowElement.appendChild(titleElement);
          rowElement.appendChild(dateElement);
      
          const tableWrapper = document.createElement('div');
          tableWrapper.classList.add('text-center'); // Center align the content
          tableWrapper.appendChild(rowElement);
          tableWrapper.appendChild(clonedTable);
      
          // Remove columns 12 and 13
          for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const cells = row.getElementsByTagName('td');
            if (cells.length >= 11) {
              row.removeChild(cells[10]);
              row.removeChild(cells[9]);
            }
          }
      
          return tableWrapper;
        },
    });
    //Print end

    return (
        <>
            <Head>
                <title>VIMS - Household</title>
                <meta
                name="description"
                content="Most bookkeeping software is accurate, but hard to use. We make the opposite trade-off, and hope you don’t get audited."
                />
            </Head>
            <Sidebar>
            <div className="px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs Start */}
                <div className='py-2'>
                    
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
                
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h2 className="py-4 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">{t("sidebar.Households")}</h2>
                       
                        {/* <p className="mt-2 text-sm text-gray-700">
                            A list of all the users in your account including their name, title, email and role.
                        </p> */}
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <button
                            type="button"
                            onClick={handleAddClick}
                            className="flex items-center justify-center px-3 py-2 text-sm font-semibold text-white rounded-md shadow-sm bg-sky-600 hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                        >
                        <DocumentPlusIcon className="w-6 h-6 mr-2"/>
                        {t("other.Add")}
                        </button>
                    </div>
                </div>
                
                <div className="flow-root mt-8">
                    <p className="text-left text-gray-500 sm:text-left">
                        {t("filter.TotalResults")}: {filteredHouseholds.length}
                    </p>
                    <div className="py-4 sm:grid sm:grid-cols-6 sm:gap-4">
                        <div className="relative flex items-center mt-2">
                            <input
                            type="text"
                            name="search"
                            id="search"
                            placeholder={t("filter.Search")}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                            />
                            <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                            <kbd className="inline-flex items-center px-1 font-sans text-xs text-gray-400 border border-gray-200 rounded">
                                ⌘K
                            </kbd>
                            </div>
                        </div>

                        <div>
                            <select
                            value={selectedStateRegion}
                            onChange={(e) => setSelectedStateRegion(e.target.value)}
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
                            <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6">
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
                            <select value={selectedTownship} onChange={(e) => setSelectedTownship(e.target.value)} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6">
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
                            <select value={selectedWardVillageTract} onChange={(e) => setSelectedWardVillageTract(e.target.value)} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6">
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
                            <select value={selectedVillage} onChange={(e) => setSelectedVillage(e.target.value)} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6">
                            <option value="">{t("filter.Villages")}</option>
                            {/* Render village options */}
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
                            
                            <table ref={componentRef} className="min-w-full border-separate border-spacing-0">
                                <thead className='bg-gray-300'>
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
                                             {t("HouseholdNo")}
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                                        >
                                             {t("EntryDate")}
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                                        >
                                             {t("HouseNo")}
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                                        >
                                             {t("Villages")}
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                                        >
                                            {t("WardVillageTracts")}
                                        </th> 
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                                        >
                                            {t("Townships")}
                                        </th>  
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                                        >
                                            {t("Districts")}
                                        </th>   
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                                        >
                                            {t("StateRegions")}
                                        </th>     
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                                        >
                                            <span className="sr-only">Edit</span>
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                                        >
                                            <span className="sr-only">Delete</span>
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
                                    {currentPageData.map((household, householdIdx) => (
                                    <tr key={household.id} className='transition duration-300 ease-in-out border-b hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600'>
                                        <td
                                        className={classNames(
                                            householdIdx !== households.length - 1 ? 'border-b border-gray-200' : '',
                                            'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                                        )}
                                        >
                                        {translateNumberToMyanmar((currentPage * perPage) + householdIdx + 1)}
                                        {/* {householdIdx + 1} */}
                                        </td>
                                        <td
                                        className={classNames(
                                            householdIdx !== households.length - 1 ? 'border-b border-gray-200' : '',
                                            'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                                        )}
                                        >
                                        {household.household_no}
                                        </td>
                                        <td
                                        className={classNames(
                                            householdIdx !== households.length - 1 ? 'border-b border-gray-200' : '',
                                            'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 sm:table-cell'
                                        )}
                                        >
                                        {formatDate(household.entry_date)}
                                        {/* {new Date(household.entry_date).toLocaleDateString('my-MM', {
                                            year: 'numeric',
                                            month: 'numeric',
                                            day: 'numeric',
                                            numberingSystem: 'Myanmar',
                                        })} */}
                                        </td>
                                        <td
                                        className={classNames(
                                            householdIdx !== households.length - 1 ? 'border-b border-gray-200' : '',
                                            'whitespace-nowrap px-3 py-4 text-sm text-gray-500'
                                        )}
                                        >
                                        {household.house_no}
                                        </td>
                                        <td
                                        className={classNames(
                                            householdIdx !== households.length - 1 ? 'border-b border-gray-200' : '',
                                            'whitespace-nowrap px-3 py-4 text-sm text-gray-500'
                                        )}
                                        >
                                        {household.villages.name}
                                        </td>
                                        <td
                                        className={classNames(
                                            householdIdx !== households.length - 1 ? 'border-b border-gray-200' : '',
                                            'whitespace-nowrap px-3 py-4 text-sm text-gray-500'
                                        )}
                                        >
                                        {household.ward_village_tracts.name}
                                        </td>
                                        <td
                                        className={classNames(
                                            householdIdx !== households.length - 1 ? 'border-b border-gray-200' : '',
                                            'whitespace-nowrap px-3 py-4 text-sm text-gray-500'
                                        )}
                                        >
                                        {household.townships.name}
                                        </td>
                                        <td
                                        className={classNames(
                                            householdIdx !== households.length - 1 ? 'border-b border-gray-200' : '',
                                            'whitespace-nowrap px-3 py-4 text-sm text-gray-500'
                                        )}
                                        >
                                        {household.districts.name}
                                        </td>
                                        <td
                                        className={classNames(
                                            householdIdx !== households.length - 1 ? 'border-b border-gray-200' : '',
                                            'whitespace-nowrap px-3 py-4 text-sm text-gray-500'
                                        )}
                                        >
                                        {household.state_regions.name}
                                        </td>
                                        <td className={classNames(
                                            householdIdx !== households.length - 1 ? 'border-b border-gray-200' : '',
                                            'relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-8 lg:pr-8'
                                        )}>
                                            <Link href={`/admin/households/${household.id}`} className="text-sky-600 hover:text-sky-900">
                                                <PencilSquareIcon className="inline-block w-4 h-4 mr-1 align-text-bottom" aria-hidden="true" />
                                                <span className="inline-block align-middle">{t("other.Edit")}</span>
                                                <span className="sr-only">, {household.id}</span>
                                            </Link>
                                        </td>
                                        <td className={classNames(
                                            householdIdx !== households.length - 1 ? 'border-b border-gray-200' : '',
                                            'relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-8 lg:pr-8'
                                            )}>
                                            <button
                                                onClick={() => handleDeleteHousehold(household.id)}
                                                className="text-red-600 hover:text-red-400"
                                            >
                                                <TrashIcon className="inline-block w-4 h-4 mr-1 align-text-bottom" aria-hidden="true" />
                                                <span className="inline-block align-middle">{t("other.Trash")}</span>
                                                <span className="sr-only">{household.id}</span>
                                            </button>
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                            {/* Pagination */}
                            <nav className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6" aria-label="Pagination">
                                <div className="hidden sm:block">
                                <p className="text-sm text-gray-700">
                                    {t("other.Showing")} <span className="font-medium">{offset + 1}</span> {t("other.To")}{' '}
                                    <span className="font-medium">{offset + currentPageData.length}</span> {t("other.Of")}{' '}
                                    <span className="font-medium">{filteredHouseholds.length}</span> {t("other.Results")}
                                </p>
                                </div>
                                <div className="flex justify-between flex-1 sm:justify-end">
                                <button
                                    onClick={goToPreviousPage}
                                    className="relative inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                                    disabled={currentPage === 0}
                                >
                                     <ChevronLeftIcon className="w-4 h-4 mr-1" />
                                     {t("other.Previous")}
                                </button>
                                <button
                                    onClick={goToNextPage}
                                    className="relative inline-flex items-center px-3 py-2 ml-3 text-sm font-semibold text-gray-900 bg-white rounded-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                                    disabled={currentPage === Math.ceil(filteredHouseholds.length / perPage) - 1}
                                >
                                    {t("other.Next")}
                                    <ChevronRightIcon className="w-4 h-4 ml-1" />
                                </button>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
                <div className="flex items-center mt-4">
                    <button className="flex px-4 py-2 mr-2 text-white bg-blue-900 rounded-md">
                        <PrinterIcon className="w-5 h-5 mr-2" />
                        Print
                    </button>
                    <button className="flex px-4 py-2 text-white bg-blue-500 rounded-md">
                        <BookOpenIcon className="w-5 h-5 mr-2" />
                        Save as PDF
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