import Head from 'next/head'
import Sidebar from '@/components/admin/layouts/Sidebar'
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import React, { useState, useEffect, useRef } from "react";
import { BookOpenIcon, DocumentArrowDownIcon, FolderPlusIcon, PencilSquareIcon, PrinterIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
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


export default function AgeGroupChart() {

    const supabase = useSupabaseClient();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { t } = useTranslation("");

    const [families, setFamilies] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [households, setHouseholds] = useState([]);
    const [selectedHousehold, setSelectedHousehold] = useState('');
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
    const [deaths, setDeaths] = useState([]);
    const [selectedDeath, setSelectedDeath] = useState('');

    const [genders, setGenders] = useState([]);
    const [selectedGender, setSelectedGender] = useState('');

    useEffect(() => {
        const fetchData = async () => {
          try {
            fetchFamilies();
            fetchGenders(),
            fetchHouseholds();
            fetchStateRegions();
            fetchDistricts();
            fetchTownships();
            fetchWardVillageTracts();
            fetchVillages();
            fetchDeaths();
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
      
        fetchData();
    }, []);

    const fetchFamilies = async () => {
        setIsLoading(true);
        setErrorMessage(null);
      
        let query = supabase.from('families').select(`
          id, 
          name, 
          date_of_birth,
          nrc_id,
          gender,
          father_name,
          mother_name,
          remark,
          resident,
          isDeath,
          deaths(id),
          isDisability,
          disabilities (id),
          relationships (id, name),
          occupations (id, name),
          ethnicities (id, name),
          nationalities (id, name),
          religions (id, name),
          households (household_no, state_regions(name), townships(name), districts(name), ward_village_tracts(name), villages(name)),
          household_no
        `);
      
        if (selectedDeath === 'No') {
          query = query.eq('isDeath', 'No');
        } else if (selectedDeath === 'Yes') {
          query = query.eq('isDeath', 'Yes');
        }
      
        try {
          const { data: familiesData, error: familiesError } = await query;
      
          if (familiesError) throw new Error(familiesError.message);
      
          setFamilies(familiesData);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching families:', error);
        }
    };

    async function fetchGenders() {
        try {
          const { data, error } = await supabase
            .from('families')
            .select('gender');
      
          if (error) {
            throw new Error(error.message);
          }
      
          const uniqueGenders = [];
          data.forEach((row) => {
            if (!uniqueGenders.includes(row.gender)) {
              uniqueGenders.push(row.gender);
            }
          });
      
          setGenders(uniqueGenders);
        } catch (error) {
          console.log('Error fetching gender:', error.message);
        }
    }

    async function fetchHouseholds() {
        try {
          const { data, error } = await supabase.from('households').select('id, household_no').order("household_no");
          if (error) {
            throw new Error(error.message);
          }
          setHouseholds(data);
        } catch (error) {
          console.log('Error fetching households:', error.message);
        }
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

    async function fetchDeaths() {
        try {
          const { data, error } = await supabase
            .from('families')
            .select('isDeath');
        
          if (error) {
            throw new Error(error.message);
          }
      
          const uniqueDeaths = [];
          data.forEach(row => {
            if (!uniqueDeaths.includes(row.isDeath)) {
              uniqueDeaths.push(row.isDeath);
            }
          });
      
          setDeaths(uniqueDeaths);
        } catch (error) {
          console.log('Error fetching deaths:', error.message);
        }
    }

    // 1. Create a function to calculate the age group for each family member
    const checkAge = (dateOfBirth) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();

        // Adjust age based on the month and day difference
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
        }

        return age;
    };

    // 1. Create a function to calculate the age group for each family member
    const checkAgeGroup = (age) => {
        if (age <= 10) {
            return "<=10";
        } else if (age >= 11 && age <= 20) {
            return "11-20";
        } else if (age >= 21 && age <= 30) {
            return "21-30";
        } else if (age >= 31 && age <= 40) {
            return "31-40";
        } else if (age >= 41 && age <= 50) {
            return "41-50";
        } else if (age >= 51 && age <= 60) {
            return "51-60";
        } else if (age >= 61 && age <= 70) {
            return "61-70";
        } else {
            return ">=71";
        }
    };    
    
    const filterFamilies = families.filter((family) => {
        const isMatchingSearchQuery =
        family.gender.toLowerCase().includes(searchQuery.toLowerCase()) ||

        family.households.villages.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        family.households.townships.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        family.households.ward_village_tracts.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        family.households.districts.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        family.households.state_regions.name.toLowerCase().includes(searchQuery.toLowerCase());

        const isMatchingDeath =
        selectedDeath === '' || family.isDeath === selectedDeath;

        const isMatchingGender =
        selectedGender === '' || family.gender === selectedGender;
        
        const isMatchingStateRegion =
            selectedStateRegion === '' || family.households.state_regions.name === selectedStateRegion;
    
        const isMatchingDistrict = selectedDistrict === '' || family.households.districts.name === selectedDistrict;
    
        const isMatchingTownship =
            selectedTownship === '' || family.households.townships.name === selectedTownship;
    
        const isMatchingWardVillageTract =
            selectedWardVillageTract === '' || family.households.ward_village_tracts.name === selectedWardVillageTract;
    
        const isMatchingVillage = selectedVillage === '' || family.households.villages.name === selectedVillage;

        const isMatchingHousehold = selectedHousehold === '' || family.household_no === selectedHousehold;
        
        return (
            isMatchingDeath &&
            isMatchingHousehold &&
            isMatchingSearchQuery &&
            isMatchingStateRegion &&
            isMatchingDistrict &&
            isMatchingTownship &&
            isMatchingWardVillageTract &&
            isMatchingGender &&
            isMatchingVillage
        );
    });

    // Calculate total gender counts, family count, and household count for each age group
    const ageGroupCounts = {
        "<=10": { maleCount: 0, femaleCount: 0, familyCount: 0, householdCount: 0, totalAge: 0, totalMembers: 0, ageGroup: {} },
        "11-20": { maleCount: 0, femaleCount: 0, familyCount: 0, householdCount: 0, totalAge: 0, totalMembers: 0, ageGroup: {} },
        "21-30": { maleCount: 0, femaleCount: 0, familyCount: 0, householdCount: 0, totalAge: 0, totalMembers: 0, ageGroup: {} },
        "31-40": { maleCount: 0, femaleCount: 0, familyCount: 0, householdCount: 0, totalAge: 0, totalMembers: 0, ageGroup: {} },
        "41-50": { maleCount: 0, femaleCount: 0, familyCount: 0, householdCount: 0, totalAge: 0, totalMembers: 0, ageGroup: {} },
        "51-60": { maleCount: 0, femaleCount: 0, familyCount: 0, householdCount: 0, totalAge: 0, totalMembers: 0, ageGroup: {} },
        "61-70": { maleCount: 0, femaleCount: 0, familyCount: 0, householdCount: 0, totalAge: 0, totalMembers: 0, ageGroup: {} },
        ">=71": { maleCount: 0, femaleCount: 0, familyCount: 0, householdCount: 0, totalAge: 0, totalMembers: 0, ageGroup: {} },
    };
    
    // Calculate total gender counts, family count, and household count for each village start
    let totalMaleCount = 0;
    let totalFemaleCount = 0;
    let totalPopulation = 0;
    let totalFamilies = 0;
    let totalHousehold = 0;
    const householdCounts = {};
    const villageCounts = {};

    filterFamilies.forEach((family) => {
        const gender = family.gender;
        const age = checkAge(family.date_of_birth);
        const ageGroup = checkAgeGroup(age);
        const villageName = family.households?.villages?.name;
        const householdNo = family.households?.household_no;

        // Counting male and female based on age group
        if (ageGroupCounts[ageGroup]) {
            if (gender === "ကျား") {
                ageGroupCounts[ageGroup].maleCount++;
                totalMaleCount++;
            } else if (gender === "မ") {
                ageGroupCounts[ageGroup].femaleCount++;
                totalFemaleCount++;
            }

            ageGroupCounts[ageGroup].familyCount++;
            totalPopulation++;
            totalFamilies++;
        }

        if (ageGroupCounts) {
            // Counting households in each village
            if (!householdCounts[ageGroup]) {
                householdCounts[ageGroup] = {};
            }
            if (householdNo && !householdCounts[ageGroup][householdNo]) {
                householdCounts[ageGroup][householdNo] = true;
                if (!villageCounts[ageGroup]) {
                    villageCounts[ageGroup] = {};
                }
                ageGroupCounts[ageGroup].householdCount = Object.keys(householdCounts[ageGroup]).length;
                totalHousehold++;
            }
        }

        // Update totalAge and totalMembers for average age calculation
        if (ageGroupCounts[ageGroup]) {
            ageGroupCounts[ageGroup].totalAge += age;
            ageGroupCounts[ageGroup].totalMembers++;
        }
    });


    // Calculate average age for each age group
    for (const ageGroup in ageGroupCounts) {
        const group = ageGroupCounts[ageGroup];
        const averageAge = group.totalMembers !== 0 ? group.totalAge / group.totalMembers : 0;
        group.ageGroup[ageGroup] = averageAge;
    }
  
    // Sort villages based on family count
    const sortedGroups = Object.keys(ageGroupCounts).sort((a, b) => {
        return ageGroupCounts[b].familyCount - ageGroupCounts[a].familyCount;
    });
    
    // Chart start
    //Chart start
    // const barChartLabels = sortedGroups;
    // const barChartData = sortedGroups.map((group) => ageGroupCounts[group].familyCount);    

    const barChartLabels = [
        "<=10",
        "11-20",
        "21-30",
        "31-40",
        "41-50",
        "51-60",
        "61-70",
        ">=71",
    ];
    const barChartData = barChartLabels.map((group) => ageGroupCounts[group].familyCount);


    const genderData = [
        totalFamilies - sortedGroups.reduce((acc, group) => acc + ageGroupCounts[group].femaleCount, 0),
        sortedGroups.reduce((acc, group) => acc + ageGroupCounts[group].femaleCount, 0),
    ];
    // Chart End


    const [showFilter, setShowFilter] = useState(false);

    const handleToggleFilter = () => {
        setShowFilter(!showFilter);
    };
    
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }
    
    return (
        <>
         <Head>
            <title>VIMS - Data for Age All Groups</title>
            <meta
            name="description"
            content="Most bookkeeping software is accurate, but hard to use. We make the opposite trade-off, and hope you don’t get audited."
            />
        </Head>
        <Sidebar>
            <div className='py-4'>
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
                                    {t("dashboard.DistributionAgeGroup")}
                                </a>
                            </div>
                            </li>
                        </ol>
                    </nav>
                </div>
                {/* Breadcrumbs End */}
                
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h2 className="py-4 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight"> {t("dashboard.DistributionAgeGroup")}</h2>
                    </div>
                    <div className="flex mt-4 md:ml-4 md:mt-0">
                        <Options />
                    </div>
                </div>
                    
                {/* Chart */}
                <section className="grid grid-cols-1 gap-4 py-4 md:grid-cols-3">
                    <div className="relative flex items-center col-span-2 p-8 bg-white rounded-lg shadow hover:bg-gray-100">
                        <Bar
                            data={{
                                labels: barChartLabels,
                                datasets: [
                                    {
                                        label: 'Age Groups',
                                        data: barChartData,
                                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                                    },
                                ],
                            }}
                            options={{
                                indexAxis: 'x',
                                responsive: true,
                                plugins: {
                                    title: {
                                        display: true,
                                        text: t("dashboard.DistributionAgeGroup"),
                                        position: 'top',
                                        font: {
                                            weight: 'bold',
                                            size: 18,
                                        },
                                    },
                                    legend: {
                                    display: false,
                                    position: 'bottom',
                                    },
                                    datalabels: {
                                        anchor: 'end',
                                        align: 'top',
                                        formatter: (value) => value,
                                        color: 'black',
                                        font: {
                                            weight: 'bold',
                                        },
                                    },
                                    tooltip: {
                                    callbacks: {
                                        title: (context) => barChartLabels[context[0].dataIndex],
                                        label: (context) => `Count: ${context.raw}`,
                                    },
                                },
                            },
                            scales: {
                                x: { // X-axis configuration
                                    display: true,
                                    title: {
                                        display: true,
                                        text: t("dashboard.AgeGroup"), // X-axis title "Age Groups"
                                        font: {
                                            weight: 'bold',
                                            size: 14,
                                            padding: { top: 40, bottom: 0 },
                                        },
                                    },
                                },
                                y: {
                                    display: true,
                                    title: {
                                        display: true,
                                        text: t('dashboard.TotalPopulations'),
                                        font: {
                                            weight: 'bold',
                                            size: 14,
                                            padding: { top: 40, bottom: 0 },
                                            },
                                        },
                                    },
                                },
                            }}
                        />
                    </div>

                    <div className="relative flex items-center col-span-1 p-8 bg-white rounded-lg shadow hover:bg-gray-100">
                        
                        <Pie
                            data={{
                            labels: [t('dashboard.Male'), t('dashboard.Female')],
                            datasets: [
                                {
                                data: genderData,
                                backgroundColor: ['rgba(255, 205, 86, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                                },
                            ],
                            }}
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
                                tooltip: {
                                callbacks: {
                                    label: (context) => `${context.label}: ${context.formattedValue}`,
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
                    </div>
                </section>
                {/* Chart End       */}
                
                {/* Search & Filter */}
                <div className="flex items-center justify-between py-4 mb-4">
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
                    <p className="text-gray-500">{t("filter.TotalResults")}: {filterFamilies.length}</p>
                </div>

                {showFilter && (
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">

                    <div>
                        <select value={selectedVillage} onChange={(e) => setSelectedVillage(e.target.value)} className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6">
                            <option value="">{t("filter.Villages")}</option>
                                {villages.map((village) => (
                                <option key={village.id} value={village.name}>
                                {village.name}
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
                            {genders.map((gender) => (
                            <option key={gender} value={gender}>
                                {gender}
                            </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <select
                            value={selectedDeath}
                            onChange={(e) => setSelectedDeath(e.target.value)}
                            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6"
                        >
                            <option value="">{t("filter.IsDeath")}</option>
                            {deaths.map((death) => (
                            <option key={death} value={death}>
                                {death}
                            </option>
                            ))}
                        </select>
                    </div>
                </div>
                )}

                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    
                    <table className="min-w-full border-separate border-spacing-0">
                            <thead className='bg-gray-300'>
                                <tr>
                                    <th scope="col" className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8">
                                        {t("No")}
                                    </th>
                                    <th scope="col" className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8">
                                        {t("dashboard.AgeGroup")}
                                    </th>
                                    <th scope="col" className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8">
                                        {t("table.Population")}
                                    </th>
                                    <th scope="col" className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8">
                                        {t("dashboard.MaleFemale")}
                                    </th>
                                    <th scope="col" className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8">
                                        {t("table.AverageAge")}
                                    </th>
                                    <th scope="col" className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8">
                                        {t("table.Household")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedGroups.map((age, index) => {
                                    const counts = ageGroupCounts[age];
                                    const averageAge = counts.ageGroup[age] || 0;
                                    
                                    console.log(averageAge)
                                    return (
                                        <tr key={age} className="transition duration-300 ease-in-out border-b hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600">
                                            <td className={classNames(index !== age.length - 1 ? "border-b border-gray-200" : "", "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8")}>
                                                {index + 1}
                                            </td>
                                            <td className={classNames(index !== age.length - 1 ? "border-b border-gray-200" : "", "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8")}>
                                                {age}
                                            </td>
                                            <td className={classNames(index !== age.length - 1 ? "border-b border-gray-200" : "", "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8")}>
                                                {counts.familyCount}
                                            </td>
                                            <td className={classNames(index !== age.length - 1 ? "border-b border-gray-200" : "", "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8")}>
                                                {`${counts.maleCount}/${counts.femaleCount}`}
                                            </td>
                                            <td className={classNames(index !== age.length - 1 ? "border-b border-gray-200" : "", "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8")}>
                                                {averageAge.toFixed(0)}
                                            </td>
                                            <td className={classNames(index !== age.length - 1 ? "border-b border-gray-200" : "", "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8")}>
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
        </Sidebar>
        </>
    )
};

export async function getStaticProps({ locale }) {
    return {
      props: {
        ...(await serverSideTranslations(locale, ["common"])),
      },
    };
}