import Head from 'next/head'
import Sidebar from '@/components/admin/layouts/Sidebar'
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import React, { useState, useEffect, useRef } from "react";
import { BookOpenIcon, DocumentArrowDownIcon, FolderPlusIcon, PencilSquareIcon, PrinterIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useUserRoleCheck } from '/src/components/utilities/useUserRoleCheck.js';
import { useReactToPrint } from 'react-to-print';
import { CSVLink } from "react-csv";


import { useRouter } from 'next/router';
import { formatDate, classNames } from '/src/components/utilities/tools.js';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export default function Disability() {
    const router = useRouter();
    const supabase = useSupabaseClient();
    const user = useUser()
    
    const { t } = useTranslation("");
    
    const [isLoading, setIsLoading] = useState(false);
    const [disabilities, setDisabilities] = useState([]);
    const [csvData, setCSVData] = useState([]);

    useUserRoleCheck();

    useEffect(() => {
        fetchDisabilities();
    }, []);
    
    const fetchDisabilities = async () => {
        setIsLoading(true);
    
        const { data: disabilityData, error: disabilityError } = await supabase
          .from('disabilities')
          .select(`
            id,
            description,
            type_of_disabilities (name),
            families (
              name,
              date_of_birth,
              nrc_id,
              gender,
              households (
                household_no,
                state_regions(name),
                townships(name),
                districts(name),
                ward_village_tracts(name),
                villages(name)
              )
            )
          `)
          .order('id', { ascending: false });
    
        if (disabilityError) {
          throw disabilityError;
        }
    
        setDisabilities(disabilityData);
        setIsLoading(false);
    
        return disabilityData;
    };
    
    const handleRegisterClick = () => {
        router.push('/admin/disabilities/register');
    };

    // Search and filter state
    const [searchQuery, setSearchQuery] = useState('');
    const filteredDisabilities = disabilities.filter((disability) => {
        const isMatchingSearchQuery =
        (disability.type_of_disabilities.name && disability.type_of_disabilities.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (disability.description && disability.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (disability.families.name && disability.families.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (disability.families.date_of_birth && formatDate(disability.families.date_of_birth).startsWith(searchQuery)) ||
        (disability.families.nrc_id && disability.families.nrc_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (disability.families.gender && disability.families.gender.toLowerCase().includes(searchQuery.toLowerCase()));

        return (
        isMatchingSearchQuery
        );
    });

    const checkAge = (dateOfBirth) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        const yearDiff = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();

        const age = yearDiff + (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? -1 : 0 );
        
        return age;
    };    

    //CSV Export Start
    useEffect(() => {
        const formattedData = filteredDisabilities.map((disability) => {
            const typeOfDisability = disability.type_of_disabilities?.name;
            const familyName = disability.families?.name;
            const familyGender = disability.families?.gender;
            const familyDob = formatDate(disability.families?.date_of_birth);
            // const householdNo = disability.families?.households?.household_no;
            const villageName = disability.families?.households?.villages?.name;
            const wardVillageTractName = disability.families?.households?.ward_village_tracts?.name;
            const townshipName = disability.families?.households?.townships?.name;
            const districtName = disability.families?.households?.districts?.name;
            const stateRegionName = disability.families?.households?.state_regions?.name;

            const age = checkAge(disability.families?.date_of_birth)
            ? Math.floor((new Date() - new Date(disability.families?.date_of_birth)) / (365.25 * 24 * 60 * 60 * 1000))
            : '';

            return {
                id: disability.id.toString(),
                name: familyName ? familyName : '',
                description: disability.description,
                type_of_disabilities: typeOfDisability ? typeOfDisability : '',
                gender: familyGender ? familyGender : '',
                dob: familyDob ? familyDob : '',
                age: age,
                // householdNo: householdNo ? householdNo : '',
                village: villageName ? villageName : '',
                ward_village_tract: wardVillageTractName ? wardVillageTractName : '',
                township: townshipName ? townshipName : '',
                district: districtName ? districtName : '',
                state_region: stateRegionName ? stateRegionName : '',
            };
        });
        setCSVData(formattedData);
    }, [disabilities, searchQuery]);
    //CSV Export End

    // Pagination Start
    const [currentPage, setCurrentPage] = useState(0);
    const [perPage] = useState(10);
    const offset = currentPage * perPage;
    const currentPageData = filteredDisabilities.slice(offset, offset + perPage);
    const goToPreviousPage = () => {
        if (currentPage > 0) {
          setCurrentPage(currentPage - 1);
        }
    };
    const goToNextPage = () => {
    if (currentPage < Math.ceil(filteredDisabilities.length / perPage) - 1) {
        setCurrentPage(currentPage + 1);
    }
    };
    // Pagination End

    //Delete
    const handleDeleteDisability = async (disabilityId) => {        
        
        const confirmed = window.confirm('Are you sure you want to delete?');
        if (confirmed) {
            try {
                const { error: deleteError } = await supabase
                .from('disabilities')
                .delete()
                .eq('id', disabilityId);
        
                if (deleteError) {
                alert('Failed to delete!');
                console.error(deleteError);
                } else {
                alert('Deleted successfully!');
                
                fetchDisabilities();
                router.push('/admin/disabilities');
                }
            } catch (error) {
                alert('An error occurred while deleting!');
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
          titleElement.innerHTML = `<h1 class="py-4 px-8 font-semibold">${t("sidebar.Disabilities")}</h1>`; // Customize the page title as per your needs
      
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
            if (cells.length >= 12) {
              row.removeChild(cells[11]); // Remove column 13 (Edit/Delete)
              row.removeChild(cells[10]); // Remove column 12 (Address)
            }
          }
      
          return tableWrapper;
        },
    });
    //Print end
    
    return (
        <>
            <Head>
                <title>VIMS - Disability</title>
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
                                    {t("sidebar.Disabilities")}
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
                            <h2 className="py-4 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">{t("sidebar.Disabilities")}</h2>
                            {/* <p className="mt-2 text-sm text-gray-700">
                                A list of all the users in your account including their name, title, email and role.
                            </p> */}
                        </div>
                        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                            <button
                                type="button"
                                onClick={handleRegisterClick}
                                className="flex items-center justify-center px-3 py-2 text-sm font-semibold text-white rounded-md shadow-sm bg-sky-600 hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                            >
                                <FolderPlusIcon className="w-6 h-6 mr-2"></FolderPlusIcon>
                                {t("Register")}
                            </button>
                        </div>
                    </div>
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <div className="relative flex items-center mt-2">
                                <input
                                type="text"
                                name="search"
                                id="search"
                                placeholder= {t("filter.Search")}
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
                        </div>
                        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                            <p className="text-right text-gray-500">
                                {t("filter.TotalResults")}: {filteredDisabilities.length}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flow-root mt-8">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                
                                <table ref={componentRef} className="min-w-full border-separate border-spacing-0">
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
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                                        >
                                             {t("Gender")}
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                                        >
                                             {t("DOB")}
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                                        >
                                             {t("Age")}
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                                        >
                                             {t("NRC")}
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                                        >
                                             {t("TypeOfDisability")}
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                                        >
                                            {t("Description")}
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                                        >
                                            {t("HouseholdNo")}
                                        </th>
                                        <th
                                            scope="col"
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                                        >
                                            {t("Address")}
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
                                    {currentPageData.length === 0 ? (
                                    <tr>
                                        <td className="py-4 pl-4 pr-3 text-lg">
                                            {isLoading ? 'Loading...' : 'No records found.'}
                                        </td>
                                    </tr>
                                    ) : (
                                    
                                    currentPageData.map((disability, disabilityIdx) => (
                                    <tr key={disabilityIdx} className='transition duration-300 ease-in-out border-b hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600'>
                                        <td
                                        className={classNames(
                                            disabilityIdx !== disability.length - 1 ? 'border-b border-gray-200' : '',
                                            'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                                        )}
                                        >
                                        {(currentPage * perPage) + disabilityIdx + 1}
                                        </td>
                                        <td
                                        className={classNames(
                                            disabilityIdx !== disability.length - 1 ? 'border-b border-gray-200' : '',
                                            'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                                        )}
                                        >
                                        {disability.families.name}
                                        </td>
                                        <td
                                        className={classNames(
                                            disabilityIdx !== disability.length - 1 ? 'border-b border-gray-200' : '',
                                            'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                                        )}
                                        >
                                        {disability.families.gender}
                                        </td>
                                        <td
                                        className={classNames(
                                            disabilityIdx !== disability.length - 1 ? 'border-b border-gray-200' : '',
                                            'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                                        )}
                                        >
                                        {new Date(disability.families.date_of_birth).toLocaleDateString()}
                                        </td>
                                        <td
                                        className={classNames(
                                            disabilityIdx !== disability.length - 1 ? 'border-b border-gray-200' : '',
                                            'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                                        )}
                                        >
                                            {Math.floor(
                                            (new Date() - new Date(disability.families.date_of_birth)) /
                                                (365.25 * 24 * 60 * 60 * 1000)
                                            )}
                                        </td>
                                        <td
                                        className={classNames(
                                            disabilityIdx !== disability.length - 1 ? 'border-b border-gray-200' : '',
                                            'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                                        )}
                                        >
                                        {disability.families.nrc_id}
                                        </td>
                                        
                                        <td
                                        className={classNames(
                                            disabilityIdx !== disability.length - 1 ? 'border-b border-gray-200' : '',
                                            'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                                        )}
                                        >
                                        {disability.type_of_disabilities.name}
                                        </td>
                                        <td
                                        className={classNames(
                                            disabilityIdx !== disability.length - 1 ? 'border-b border-gray-200' : '',
                                            'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                                        )}
                                        >
                                        {disability.description}
                                        </td>
                                        <td
                                        className={classNames(
                                            disabilityIdx !== disability.length - 1 ? 'border-b border-gray-200' : '',
                                            'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                                        )}
                                        >
                                        {disability.families.households.household_no}
                                        </td>
                                        <td
                                        className={classNames(
                                            disabilityIdx !== disability.length - 1 ? 'border-b border-gray-200' : '',
                                            'whitespace-pre-line px-3 py-1 text-sm text-gray-500'
                                        )}
                                        >
                                        {`${disability.families.households.villages.name}\n${disability.families.households.ward_village_tracts.name}\n${disability.families.households.townships.name}, ${disability.families.households.districts.name},${disability.families.households.state_regions.name}`}
                                        </td>
                                        <td
                                            className={classNames(
                                                disabilityIdx !== disability.length - 1 ? 'border-b border-gray-200' : '',
                                                'relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-8 lg:pr-8'
                                            )}
                                            >
                                            <Link href={`/admin/disabilities/${disability.id}`} className="text-sky-600 hover:text-sky-900">
                                                <PencilSquareIcon className="inline-block w-4 h-4 mr-1 align-text-bottom" aria-hidden="true" />
                                                <span className="inline-block align-middle">{t("other.Edit")}</span>
                                                <span className="sr-only">, {disability.id}</span>
                                            </Link>
                                        </td>
                                        <td className={classNames(
                                            disabilityIdx !== disability.length - 1 ? 'border-b border-gray-200' : '',
                                            'relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-8 lg:pr-8'
                                            )}>
                                            <button
                                                onClick={() => handleDeleteDisability(disability.id)}
                                                className="text-red-600 hover:text-red-400"
                                            >
                                                <TrashIcon className="inline-block w-4 h-4 mr-1 align-text-bottom" aria-hidden="true" />
                                                <span className="inline-block align-middle">{t("other.Trash")}</span>
                                                <span className="sr-only">{disability.id}</span>
                                            </button>
                                        </td>
                                    </tr>
                                    ))
                                    )}
                                </tbody>
                            </table>
                            {/* Pagination */}
                            <nav className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6" aria-label="Pagination">
                                <div className="hidden sm:block">
                                <p className="text-sm text-gray-700">
                                    {t("other.Showing")} <span className="font-medium">{offset + 1}</span> {t("other.To")}{' '}
                                    <span className="font-medium">{offset + currentPageData.length}</span> {t("other.Of")}{' '}
                                    <span className="font-medium">{filteredDisabilities.length}</span> {t("other.Results")}
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
                                    disabled={currentPage === Math.ceil(filteredDisabilities.length / perPage) - 1}
                                >
                                    {t("other.Next")}
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
                        <button className="flex px-4 py-2 mr-2 text-white rounded-md bg-sky-600 hover:bg-sky-700">
                            <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
                            <CSVLink
                                data={csvData}
                                filename={`disabilities_${filteredDisabilities.length}.csv`}
                            >
                                Export CSV
                            </CSVLink>
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