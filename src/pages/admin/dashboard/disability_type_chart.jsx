import Head from 'next/head'
import Sidebar from '@/components/admin/layouts/Sidebar'
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import React, { useState, useEffect, useRef } from "react";
import { BookOpenIcon, DocumentArrowDownIcon, FolderPlusIcon, PencilSquareIcon, PrinterIcon, Squares2X2Icon, TrashIcon } from '@heroicons/react/24/outline';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useUserRoleCheck } from '/src/components/utilities/useUserRoleCheck.js';
import { useReactToPrint } from 'react-to-print';
import { CSVLink } from "react-csv";
import Options from '@/components/admin/Options';


import { useRouter } from 'next/router';
import { formatDate, classNames } from '/src/components/utilities/tools.js';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { GridFilterListIcon } from '@mui/x-data-grid';

import { Bar, Pie } from 'react-chartjs-2';
import { Chart, LinearScale, CategoryScale, BarController, BarElement, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(LinearScale, CategoryScale, BarController, BarElement, ArcElement, ChartDataLabels, Tooltip, Legend, Title);

export default function DisabilityChart() {
    const router = useRouter();
    const supabase = useSupabaseClient();
    const user = useUser()
    
    const { t } = useTranslation("");
    
    const [isLoading, setIsLoading] = useState(false);
    const [csvData, setCSVData] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    const [villages, setVillages] = useState([]);
    const [selectedVillage, setSelectedVillage] = useState('');
    const [types, setTypes] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [genders, setGenders] = useState([]);
    const [selectedGender, setSelectedGender] = useState('');
    const [minAge, setMinAge] = useState('');
    const [maxAge, setMaxAge] = useState('');

    const [searchQuery, setSearchQuery] = useState('');
    const [disabilities, setDisabilities] = useState([]);
    const [disabilityTypeData, setDisabilityTypeData] = useState({});
    const [genderData, setGenderData] = useState({});
    const [filteredDisabilities, setFilteredDisabilities] = useState([]);

    
    useEffect(() => {
        fetchDisabilities();
        fetchVillages();
        fetchDisabilityType();
        fetchGenders();
    }, []);

    useEffect(() => {
        filterDisabilities();
    }, [searchQuery, selectedVillage, selectedType, selectedGender, minAge, maxAge, disabilities]);
      
      
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

    const filterDisabilities = () => {
        const filtered = disabilities.filter((disability) => {
          const isMatchingSearchQuery =
            (disability.type_of_disabilities.name &&
              disability.type_of_disabilities.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (disability.families.gender &&
              disability.families.gender.toLowerCase().includes(searchQuery.toLowerCase()));
      
          const isMatchingVillage =
            selectedVillage === '' || disability.families.households.villages.name === selectedVillage;
      
          const isMatchingDisabilityType =
            selectedType === '' || disability.type_of_disabilities.name === selectedType;
          const isMatchingGender = selectedGender === '' || disability.families.gender === selectedGender;
      
          const isMatchingAge = checkAge(disability.families.date_of_birth);
      
          return (
            isMatchingVillage &&
            isMatchingDisabilityType &&
            isMatchingSearchQuery &&
            isMatchingGender &&
            isMatchingAge
          );
        });
      
        setFilteredDisabilities(filtered);
    };

    useEffect(() => {
        prepareDisabilityTypeData();
        prepareGenderData();
    }, [filteredDisabilities]);
      
    const prepareDisabilityTypeData = () => {
        // Count the occurrences of each disability type in filtered disabilities
        const typeCounts = {};
        filteredDisabilities.forEach((disability) => {
          const type = disability.type_of_disabilities.name;
          if (typeCounts[type]) {
            typeCounts[type]++;
          } else {
            typeCounts[type] = 1;
          }
        });
      
        // Prepare data for bar chart
        const typeLabels = Object.keys(typeCounts);
        const typeValues = Object.values(typeCounts);
        
        const barChartData = {
          labels: typeLabels,
          datasets: [
            {
                
                label: 'Total Case',
                data: typeValues,
                backgroundColor: ['#87CEFA'],
                hoverBackgroundColor: ['#00BFFF'],
            },
          ],
        };
      
        setDisabilityTypeData(barChartData);
    };
      
    const prepareGenderData = () => {
        // Count the occurrences of each gender in filtered disabilities
        const genderCounts = {};
        filteredDisabilities.forEach((disability) => {
          const gender = disability.families.gender;
          if (genderCounts[gender]) {
            genderCounts[gender]++;
          } else {
            genderCounts[gender] = 1;
          }
        });
      
        // Prepare data for pie chart
        const genderLabels = Object.keys(genderCounts);
        const genderValues = Object.values(genderCounts);
      
        const pieChartData = {
          labels: genderLabels,
          datasets: [
            {
                label: 'Total',
                data: genderValues,
                backgroundColor: ['rgba(255, 205, 86, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                hoverBackgroundColor: ['rgba(255, 205, 86, 0.9)', 'rgba(255, 99, 132, 0.9)'],
            },
            
          ],
          
        };
      
        setGenderData(pieChartData);
    };

    // Function to check if the age matches the selected age filter
    const checkAge = (dateOfBirth) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();
        const isMatchingAge =
          (minAge === '' || (age >= minAge) || (age === minAge && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)))) &&
          (maxAge === '' || (age <= maxAge) || (age === maxAge && (monthDiff < 0 || (monthDiff === 0 && dayDiff <= 0))));
        
        return isMatchingAge;
    };  

    const [showFilter, setShowFilter] = useState(false);

    const handleToggleFilter = () => {
        setShowFilter(!showFilter);
    };

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

    async function fetchDisabilityType() {
        try {
          const { data, error } = await supabase.from('type_of_disabilities').select('id, name');
          if (error) {
            throw new Error(error.message);
          }
          setTypes(data);
        } catch (error) {
          console.log('Error fetching death types:', error.message);
        }
    }

    async function fetchGenders() {
        try {
          const { data, error } = await supabase
            .from('families')
            .select('gender');
        
          if (error) {
            throw new Error(error.message);
          }
      
          const uniqueGenders = [];
          data.forEach(row => {
            if (!uniqueGenders.includes(row.gender)) {
              uniqueGenders.push(row.gender);
            }
          });
      
          setGenders(uniqueGenders);
        } catch (error) {
          console.log('Error fetching gender:', error.message);
        }
    }
    
    const handleMinAgeChange = (e) => {
        const inputMinAge = e.target.value !== '' ? parseInt(e.target.value) : '';
        setMinAge(inputMinAge);
    };
    const handleMaxAgeChange = (e) => {
        const inputMaxAge = e.target.value !== '' ? parseInt(e.target.value) : '';
        setMaxAge(inputMaxAge);
    };

    const calculateAge = (dateOfBirth) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        const yearDiff = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();

        const age = yearDiff + (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? -1 : 0 );
        
        return age;
    };  
    
    //Table Start
    const villageCounts = {};
    const householdCounts = {};
    let totalFamilies = 0;
    let totalHouseholds = 0;
    let totalDisabilities = 0;

    filteredDisabilities.forEach((disability) => {
        const villageName = disability.families.households?.villages?.name;
        const gender = disability.families.gender;
        // const disabilities = disability?.length || 0; // Set default value as 0
        const disabilities = disability?.length || 0;

        const householdNo = disability.families.households?.household_no;
        const age = calculateAge(disability.families.date_of_birth);

        if (!villageCounts[villageName]) {
            villageCounts[villageName] = {
            maleCount: 0,
            femaleCount: 0,
            familyCount: 0,
            householdCount: 0,
            disabilities: {},
            totalAge: 0,
            totalMembers: 0,
            };
        }

        if (gender === 'ကျား') {
            villageCounts[villageName].maleCount++;
        } else if (gender === 'မ') {
            villageCounts[villageName].femaleCount++;
        }

        villageCounts[villageName].familyCount++;
        totalFamilies++;

        villageCounts[villageName].disabilities[disability.type_of_disabilities.name] =
            (villageCounts[villageName].disabilities[disability.type_of_disabilities.name] || 0) + disabilities; // Increment the count for each disability type
        totalDisabilities += disabilities;
        
        // if (disabilities) {
        //     villageCounts[villageName].disabilityCount += disabilities;
        //     totalDisabilities += disabilities;
        // }
        
        if (householdNo) {
            if (!householdCounts[villageName]) {
            householdCounts[villageName] = {};
            }
            householdCounts[villageName][householdNo] = true;
            villageCounts[villageName].householdCount = Object.keys(
            householdCounts[villageName]
            ).length;
        }

        if (householdNo && !householdCounts[householdNo]) {
            householdCounts[householdNo] = 0;
            totalHouseholds++;
        }

        householdCounts[householdNo]++;

        villageCounts[villageName].totalAge += age;
        villageCounts[villageName].totalMembers++;
    });
    
    for (const villageName in villageCounts) {
        const village = villageCounts[villageName];
        const averageAge = village.totalMembers !== 0 ? village.totalAge / village.totalMembers : 0;
        console.log(`Average Age for ${villageName}: ${averageAge}`);
    }

    const sortedVillages = Object.keys(villageCounts).sort((a, b) => {
        return villageCounts[b].familyCount - villageCounts[a].familyCount;
    });

    //Table End

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    return (
        <>
            <Head>
                <title>VIMS - Distribution of Disability Types</title>
                <meta
                name=""
                content=""
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
                                    VIMS
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
                                        {t("dashboard.DistributionDisabilityTypes")}
                                    </a>
                                </div>
                                </li>
                            </ol>
                        </nav>
                    </div>
                    {/* Breadcrumbs End */}
                    
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h2 className="py-4 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight"> {t("dashboard.DistributionDisabilityTypes")}</h2>
                        </div>
                        <div className="flex mt-4 md:ml-4 md:mt-0">
                            <Options />
                        </div>
                    </div>
                    
                    <div className="flow-root mt-8">
                        <div class="flex flex-wrap py-8">
                            <div class="w-full sm:w-2/3 md:w-2/3 lg:w-2/3 xl:w-2/3">
                                
                                <div className="mt-4">
                                {Object.keys(disabilityTypeData).length > 0 ? (
                                    <Bar 
                                        data={disabilityTypeData} 
                                        options={{
                                            indexAxis: 'x',
                                            responsive: true,
                                            plugins: {
                                              title: {
                                                display: true,
                                                text:  t("dashboard.DistributionDisabilityTypes"),
                                                position: 'top',
                                                font: {
                                                  weight: 'bold',
                                                  size: 18,
                                                },
                                              },
                                              legend: {
                                                display: false,
                                                position: 'bottom',
                                                labels: {
                                                    usePointStyle: true,
                                                },
                                              },
                                              datalabels: {
                                                anchor: 'end',
                                                align: 'bottom',
                                                formatter: (value) => value,
                                                color: 'black',
                                                font: {
                                                  weight: 'bold',
                                                },
                                              },
                                            },
                                            scales: {
                                              x: {
                                                display: true,
                                                title: {
                                                  display: true,
                                                  text:  t("dashboard.TypeOfDisability"),
                                                  font: {
                                                    weight: 'bold',
                                                    size: 14,
                                                  },
                                                },
                                              },
                                              y: {
                                                display: true,
                                                title: {
                                                  display: true,
                                                  text: t("dashboard.TotalCase"),
                                                  font: {
                                                    weight: 'bold',
                                                    size: 14,
                                                  },
                                                },
                                              },
                                            },
                                        }}
                                    />
                                ) : (
                                    <p>No data available</p>
                                )}
                                </div>
                            </div>
                            <div class="w-full sm:w-1/3 md:w-1/3 lg:w-1/3 xl:w-1/3">
                                <div className="mt-4">
                                    {Object.keys(genderData).length > 0 ? (
                                        <Pie 
                                            data={genderData} 
                                            options={{
                                                responsive: true,
                                                plugins: {
                                                    title: {
                                                        display: true,
                                                        text: t('dashboard.GenderRatio'),
                                                        position: 'top',
                                                        font: {
                                                            weight: 'bold',
                                                            size: 18,
                                                        },
                                                    },
                                                    legend: {
                                                        position: 'bottom',
                                                        reverse: true,
                                                        labels: {
                                                            usePointStyle: true,
                                                        },
                                                    },
                                                },
                                                layout: {
                                                    padding: {
                                                    bottom: 30, // Adjust bottom padding to make room for axis title
                                                    },
                                                },
                                            }}
                                        />
                                    ) : (
                                        <p>No data available</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {/* Search & Filter */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="p-2 mr-2 border border-gray-300 rounded-md"
                                    placeholder={t("filter.Search")}
                                />
                                <button
                                    onClick={handleToggleFilter}
                                    className="px-4 py-2 text-white rounded-md bg-sky-600 hover:bg-sky-700"
                                >
                                <GridFilterListIcon className="w-5 h-5 mr-2"></GridFilterListIcon>
                                    Filter
                                </button>
                            </div>
                            <p className="text-gray-500">{t("filter.TotalResults")}: {filteredDisabilities.length}</p>
                        </div>

                        {showFilter && (
                        <div className="py-4 sm:grid sm:grid-cols-5 sm:gap-4">
                            <div>
                                <select value={selectedVillage} onChange={(e) => setSelectedVillage(e.target.value)} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6">
                                    <option value="">{t("filter.Villages")}</option>
                                        {villages && villages.map((village) => (
                                        <option key={village.id} value={village.name}>
                                        {village.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <select 
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6">
                                    <option value="">{t("filter.DisabilityType")}</option>
                                    {/* Render Disabiltiy Type options */}
                                    {types && types.map((type) => (
                                        <option key={type.id} value={type.name}>
                                        {type.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <select
                                    value={selectedGender}
                                    onChange={(e) => setSelectedGender(e.target.value)}
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6"
                                >
                                    <option value="">{t("filter.Gender")}</option>
                                    {genders && genders.map((gender) => (
                                    <option key={gender} value={gender}>
                                        {gender}
                                    </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <input
                                type="number"
                                value={minAge}
                                onChange={handleMinAgeChange}
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6"
                                placeholder={t("filter.MinAge")}
                                />
                            </div>
                            <div>
                                <input
                                type="number"
                                value={maxAge}
                                onChange={handleMaxAgeChange}
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6"
                                placeholder={t("filter.MaxAge")}
                                />
                            </div>
                        </div>
                    
                        )}

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
                                                className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                                            >
                                                {t("table.Village")}
                                            </th>
                                            <th
                                                scope="col"
                                                className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                                            >
                                                {t("table.Population")}
                                            </th>
                                            <th
                                                scope="col"
                                                className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                                            >
                                                {t("table.Gender")}
                                            </th>
                                            <th
                                                scope="col"
                                                className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                                            >
                                                {t("table.DisabilityType")}
                                            </th>
                                            <th
                                                scope="col"
                                                className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                                            >
                                                {t("table.AverageAge")}
                                            </th>
                                            <th
                                                scope="col"
                                                className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                                            >
                                                {t("table.Household")}
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

                                            {sortedVillages.map((villageName, familyIdx) => {
                                                const counts = villageCounts[villageName];
                                                const disabilityTypes = Object.keys(counts.disabilities);
                                                if (!counts) return null; // Add null check
                                                const averageAge = counts.totalMembers !== 0 ? (counts.totalAge / counts.totalMembers).toFixed(0) : 0;

                                            return (
                                            <tr key={villageName} className="transition duration-300 ease-in-out border-b hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600">
                                                <td
                                                className={classNames(
                                                    familyIdx !== villageName.length - 1 ? "border-b border-gray-200" : "",
                                                    "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"
                                                )}
                                                >
                                                {familyIdx + 1}
                                                </td>
                                                <td
                                                className={classNames(
                                                    familyIdx !== villageName.length - 1 ? "border-b border-gray-200" : "",
                                                    "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"
                                                )}
                                                >
                                                {villageName}
                                                </td>
                                                <td
                                                className={classNames(
                                                    familyIdx !== villageName.length - 1 ? "border-b border-gray-200" : "",
                                                    "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"
                                                )}
                                                >
                                                {counts.familyCount}
                                                </td>
                                                <td
                                                className={classNames(
                                                    familyIdx !== villageName.length - 1 ? "border-b border-gray-200" : "",
                                                    "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"
                                                )}
                                                >
                                                ကျား - {counts.maleCount}, မ - {counts.femaleCount}
                                                </td>
                                                <td
                                                className={classNames(
                                                    familyIdx !== villageName.length - 1 ? "border-b border-gray-200" : "",
                                                    "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"
                                                )}
                                                >
                                                {disabilityTypes.length}
                                                </td>
                                                <td
                                                className={classNames(
                                                    familyIdx !== villageName.length - 1 ? "border-b border-gray-200" : "",
                                                    "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"
                                                )}
                                                >
                                                {averageAge}
                                                </td>
                                                <td
                                                className={classNames(
                                                    familyIdx !== villageName.length - 1 ? "border-b border-gray-200" : "",
                                                    "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"
                                                )}
                                                >
                                                {counts.householdCount}
                                                </td>
                                                
                                            </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {/* Print/CSV */}
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