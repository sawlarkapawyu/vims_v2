import Head from 'next/head'

import Sidebar from '@/components/admin/layouts/Sidebar'
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'

import { useRouter } from 'next/router';
import { ChevronLeftIcon, ChevronRightIcon, DocumentPlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { formatDate, classNames } from '/src/components/utilities/tools.js';
import { useUserRoleCheck } from '/src/components/utilities/useUserRoleCheck.js';

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export default function Family() {
    const router = useRouter();
    const user = useUser()
    const supabase = useSupabaseClient();
    
    const { t } = useTranslation("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [families, setFamilies] = useState([]);
    
    // Search and filter state
    const [searchQuery, setSearchQuery] = useState('');
    // const [relationships, setRelationships] = useState([]);
    // const [selectedRelationship, setSelectedRelationship] = useState('');
    const [occupations, setOccupations] = useState([]);
    const [selectedOccupation, setSelectedOccupation] = useState('');
    const [educations, setEducations] = useState([]);
    const [selectedEducation, setSelectedEducation] = useState('');
    const [ethnicities, setEthnicities] = useState([]);
    const [selectedEthnicity, setSelectedEthnicity] = useState('');
    // const [nationalities, setNationalities] = useState([]);
    // const [selectedNationality, setSelectedNationality] = useState('');
    const [religions, setReligions] = useState([]);
    const [selectedReligion, setSelectedReligion] = useState('');
    const [households, setHouseholds] = useState([]);
    const [selectedHousehold, setSelectedHousehold] = useState('');

    useUserRoleCheck();
    
    useEffect(() => {
        fetchFamilies();
        fetchEducation();
        fetchEthnicity();
        fetchHousehold();
        // fetchNationality();
        fetchOccupation();
        fetchRelition();
        // fetchRelationship();
    }, []);

    async function fetchFamilies() {
        setIsLoading(true);
        setErrorMessage(null);

        let { data: familyData, error } = await supabase
        .from('families').select(`
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
            households (household_no),
            household_no, 
            resident
        `)
        .eq('isDeath', 'No')
        .order('id', { ascending: false });

        if (error) {
        setErrorMessage(error.message);
        } else {
        setFamilies(familyData);
        }

        setIsLoading(false);
    }
    
    const handleAddClick = () => {
        router.push('/admin/families/add');
    };

    // async function fetchRelationship() {
    //     try {
    //       const { data, error } = await supabase.from('relationships').select('id, name');
    //       if (error) {
    //         throw new Error(error.message);
    //       }
    //       setRelationships(data);
    //     } catch (error) {
    //       console.log('Error fetching relationships:', error.message);
    //     }
    // }

    async function fetchOccupation() {
        try {
          const { data, error } = await supabase.from('occupations').select('id, name');
          if (error) {
            throw new Error(error.message);
          }
          setOccupations(data);
        } catch (error) {
          console.log('Error fetching occupations:', error.message);
        }
    }

    async function fetchEducation() {
        try {
          const { data, error } = await supabase.from('educations').select('id, name');
          if (error) {
            throw new Error(error.message);
          }
          setEducations(data);
        } catch (error) {
          console.log('Error fetching educations:', error.message);
        }
    }

    async function fetchEthnicity() {
        try {
          const { data, error } = await supabase.from('ethnicities').select('id, name');
          if (error) {
            throw new Error(error.message);
          }
          setEthnicities(data);
        } catch (error) {
          console.log('Error fetching ethnicities:', error.message);
        }
    }

    // async function fetchNationality() {
    //     try {
    //       const { data, error } = await supabase.from('nationalities').select('id, name');
    //       if (error) {
    //         throw new Error(error.message);
    //       }
    //       setNationalities(data);
    //     } catch (error) {
    //       console.log('Error fetching nationalities:', error.message);
    //     }
    // }
    async function fetchRelition() {
        try {
          const { data, error } = await supabase.from('religions').select('id, name');
          if (error) {
            throw new Error(error.message);
          }
          setReligions(data);
        } catch (error) {
          console.log('Error fetching religions:', error.message);
        }
    }
      
    async function fetchHousehold() {
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

    // Filtered faimiles based on search and filters
    const filteredFamilies = families.filter((family) => {
        const isMatchingSearchQuery =
        (family.name && family.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (family.nrc_id && family.nrc_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (family.date_of_birth && formatDate(family.date_of_birth).startsWith(searchQuery)) ||
        (family.gender && family.gender.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (family.father_name && family.father_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (family.mother_name && family.mother_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (family.remark && family.remark.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const isMatchingOccupation =
        selectedOccupation === '' || family.occupations.name === selectedOccupation;

        const isMatchingEducation =
        selectedEducation === '' || family.educations.name === selectedEducation;

        const isMatchingEthnicity =
        selectedEthnicity === '' ||
        family.ethnicities.name === selectedEthnicity;

        const isMatchingReligion = selectedReligion === '' || family.religions?.name === selectedReligion;

        const isMatchingHousehold = selectedHousehold === '' || family.households.household_no === selectedHousehold;
        
        return (
        isMatchingSearchQuery &&
        isMatchingOccupation &&
        isMatchingEducation &&
        isMatchingEthnicity &&
        isMatchingReligion &&
        isMatchingHousehold
        );
    });

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

    //Delete
    const handleDeleteFamily = async (familyId) => {
        const confirmed = window.confirm("Are you sure you want to delete this household?");
        
        if (confirmed) {
          try {
            const { error } = await supabase
              .from('families')
              .delete()
              .eq('id', familyId);
        
            if (error) {
              alert('Failed to delete family!');
              console.error(error);
            } else {
              alert('Family deleted successfully!');
              window.location.reload();
              router.push('/admin/families');
            }
          } catch (error) {
            alert('An error occurred while deleting the family!');
            console.error(error);
          }
        }
    };
    return (
        <>
            <Head>
                <title>VIMS - Family</title>
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
                                    {t("sidebar.Families")}
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
                            <h2 className="py-4 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">{t("sidebar.Families")}</h2>
                            
                        </div>
                        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                            <button
                                type="button"
                                onClick={handleAddClick}
                                className="flex items-center justify-center px-2 py-2 text-sm font-semibold text-white rounded-md shadow-sm bg-sky-600 hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                            >
                            <DocumentPlusIcon className="w-6 h-6 mr-2"/>
                            {t("other.Add")}
                            </button>
                        </div>
                    </div>
                    <div className="flow-root mt-8">
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
                                <select value={selectedHousehold} onChange={(e) => setSelectedHousehold(e.target.value)} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6">
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
                                <select value={selectedOccupation} onChange={(e) => setSelectedOccupation(e.target.value)} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6">
                                    <option value="">{t("filter.Occupations")}</option>
                                    {/* Render Occupations options */}
                                    {occupations.map((occupation) => (
                                        <option key={occupation.id} value={occupation.name}>
                                        {occupation.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                                
                            <div>
                                <select value={selectedEducation} onChange={(e) => setSelectedEducation(e.target.value)} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6">
                                    <option value="">{t("filter.Educations")}</option>
                                    {/* Render Educations options */}
                                    {educations.map((education) => (
                                        <option key={education.id} value={education.name}>
                                        {education.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <select value={selectedEthnicity} onChange={(e) => setSelectedEthnicity(e.target.value)} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6">
                                    <option value="">{t("filter.Ethnicities")}</option>
                                    {/* Render Ethnicities options */}
                                    {ethnicities.map((ethnicity) => (
                                        <option key={ethnicity.id} value={ethnicity.name}>
                                        {ethnicity.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <select value={selectedReligion} onChange={(e) => setSelectedReligion(e.target.value)} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6">
                                    <option value="">{t("filter.Religions")}</option>
                                    {/* Render Religions options */}
                                    {religions.map((religion) => (
                                        <option key={religion.id} value={religion.name}>
                                        {religion.name}
                                        </option>
                                    ))}
                                </select>
                            </div>  
                            
                        </div>
                        
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                
                                <table className="min-w-full border-separate border-spacing-0">
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
                                                className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                                            >
                                                {t("HouseholdNo")}
                                            </th> 
                                            <th
                                                scope="col"
                                                className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-8 lg:pl-8"
                                            >
                                               {t("Name")}
                                            </th>
                                            <th
                                                scope="col"
                                                className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-8 lg:pl-8"
                                            >
                                               {t("DOB")}
                                            </th>
                                            <th
                                                scope="col"
                                                className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-8 lg:pl-8"
                                            >
                                                {t("Age")}
                                            </th>
                                            <th
                                                scope="col"
                                                className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-8 lg:pl-8"
                                            >
                                                {t("NRC")}
                                            </th>
                                            <th
                                                scope="col"
                                                className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-8 lg:pl-8"
                                            >
                                                {t("Gender")}
                                            </th>
                                            <th
                                                scope="col"
                                                className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-8 lg:pl-8"
                                            >
                                                {t("FatherName")}
                                            </th> 
                                            <th
                                                scope="col"
                                                className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-8 lg:pl-8"
                                            >
                                                {t("MotherName")}
                                            </th>  
                                            <th
                                                scope="col"
                                                className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-8 lg:pl-8"
                                            >
                                                {t("Relationship")}
                                            </th>   
                                            <th
                                                scope="col"
                                                className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-8 lg:pl-8"
                                            >
                                                {t("Occupation")}
                                            </th> 
                                            <th
                                                scope="col"
                                                className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-8 lg:pl-8"
                                            >
                                                {t("Education")}
                                            </th>  
                                            <th
                                                scope="col"
                                                className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-8 lg:pl-8"
                                            >
                                                {t("Ethnicity")}
                                            </th>   
                                            <th
                                                scope="col"
                                                className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-8 lg:pl-8"
                                            >
                                                {t("Nationality")}
                                            </th>  
                                            <th
                                                scope="col"
                                                className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-8 lg:pl-8"
                                            >
                                                {t("Religion")}
                                            </th> 
                                            <th
                                                scope="col"
                                                className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-8 lg:pl-8"
                                            >
                                                {t("resident")}
                                            </th> 
                                            <th
                                                scope="col"
                                                className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-8 lg:pl-8"
                                            >
                                                {t("Remarks")}
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
                                            {family.household_no}
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
                                                'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                                            )}
                                            >
                                            {formatDate(family.date_of_birth)}
                                            </td>
                                            <td
                                            className={classNames(
                                                familyIdx !== family.length - 1 ? 'border-b border-gray-200' : '',
                                                'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
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
                                                'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                                            )}
                                            >
                                            {family.nrc_id}
                                            </td>
                                            <td
                                            className={classNames(
                                                familyIdx !== family.length - 1 ? 'border-b border-gray-200' : '',
                                                'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                                            )}
                                            >
                                            {family.gender}
                                            </td>
                                            <td
                                            className={classNames(
                                                familyIdx !== family.length - 1 ? 'border-b border-gray-200' : '',
                                                'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                                            )}
                                            >
                                            {family.father_name}
                                            </td>
                                            <td
                                            className={classNames(
                                                familyIdx !== family.length - 1 ? 'border-b border-gray-200' : '',
                                                'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                                            )}
                                            >
                                            {family.mother_name}
                                            </td>
                                            <td
                                            className={classNames(
                                                familyIdx !== family.length - 1 ? 'border-b border-gray-200' : '',
                                                'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                                            )}
                                            >
                                            {family.relationships.name}
                                            </td>
                                            <td
                                            className={classNames(
                                                familyIdx !== family.length - 1 ? 'border-b border-gray-200' : '',
                                                'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                                            )}
                                            >
                                            {family.occupations.name}
                                            </td>
                                            <td
                                            className={classNames(
                                                familyIdx !== family.length - 1 ? 'border-b border-gray-200' : '',
                                                'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                                            )}
                                            >
                                            {family.educations.name}
                                            </td>
                                            <td
                                            className={classNames(
                                                familyIdx !== family.length - 1 ? 'border-b border-gray-200' : '',
                                                'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                                            )}
                                            >
                                            {family.ethnicities.name}
                                            </td>
                                            <td
                                            className={classNames(
                                                familyIdx !== family.length - 1 ? 'border-b border-gray-200' : '',
                                                'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                                            )}
                                            >
                                            {family.nationalities.name}
                                            </td>
                                            <td
                                            className={classNames(
                                                familyIdx !== family.length - 1 ? 'border-b border-gray-200' : '',
                                                'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                                            )}
                                            >
                                            {family.religions && family.religions.name}
                                            </td>
                                            <td
                                            className={classNames(
                                                familyIdx !== family.length - 1 ? 'border-b border-gray-200' : '',
                                                'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                                            )}
                                            >
                                            {family.resident}
                                            </td>
                                            <td
                                            className={classNames(
                                                familyIdx !== family.length - 1 ? 'border-b border-gray-200' : '',
                                                'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                                            )}
                                            >
                                            {family.remark}
                                            </td>
                                            <td className={classNames(
                                                familyIdx !== family.length - 1 ? 'border-b border-gray-200' : '',
                                                'relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-8 lg:pr-8'
                                            )}>
                                                <Link href={`/admin/families/${family.id}`} className="text-sky-600 hover:text-sky-900">
                                                    <PencilSquareIcon className="inline-block w-4 h-4 mr-1 align-text-bottom" aria-hidden="true" />
                                                    <span className="inline-block align-middle">{t("other.Edit")}</span>
                                                    <span className="sr-only">, {family.id}</span>
                                                </Link>
                                            </td>
                                            <td className={classNames(
                                                familyIdx !== family.length - 1 ? 'border-b border-gray-200' : '',
                                                'relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-8 lg:pr-8'
                                                )}>
                                                <button
                                                    onClick={() => handleDeleteFamily(family.id)}
                                                    className="text-red-600 hover:text-red-400"
                                                >
                                                    <TrashIcon className="inline-block w-4 h-4 mr-1 align-text-bottom" aria-hidden="true" />
                                                    <span className="inline-block align-middle">{t("other.Trash")}</span>
                                                    <span className="sr-only">{family.id}</span>
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
                                        <span className="font-medium">{filteredFamilies.length}</span> {t("other.Results")}
                                    </p>
                                    </div>
                                    <div className="flex justify-between flex-1 sm:justify-end">
                                    <button
                                        onClick={goToPreviousPage}
                                        className="relative inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                                        disabled={currentPage === 0}
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={goToNextPage}
                                        className="relative inline-flex items-center px-3 py-2 ml-3 text-sm font-semibold text-gray-900 bg-white rounded-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                                        disabled={currentPage === Math.ceil(filteredFamilies.length / perPage) - 1}
                                    >
                                        Next
                                    </button>
                                    </div>
                                </nav>
                            </div>
                        </div>
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