import { GridFilterListIcon } from '@mui/x-data-grid';
import React, { useState, useEffect } from "react";
import { useSupabaseClient } from '@supabase/auth-helpers-react'
// import { supabase } from "/src/components/utilities/supabase";
import { UserGroupIcon, HomeModernIcon, DocumentDuplicateIcon, StarIcon } from '@heroicons/react/24/outline';
import DropdownSelect from 'react-dropdown-select';
import { useTranslation } from "next-i18next";


import { Bar, Pie } from 'react-chartjs-2';
import { Chart, LinearScale, CategoryScale, BarController, BarElement, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { UserIcon } from '@heroicons/react/20/solid';

Chart.register(LinearScale, CategoryScale, BarController, BarElement, ArcElement, ChartDataLabels, Tooltip, Legend, Title);


const Dashboard = () => {
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

    const [occupations, setOccupations] = useState([]);
    const [selectedOccupation, setSelectedOccupation] = useState('');
    const [educations, setEducations] = useState([]);
    const [selectedEducation, setSelectedEducation] = useState('');
    const [ethnicities, setEthnicities] = useState([]);
    const [selectedEthnicity, setSelectedEthnicity] = useState('');
    const [religions, setReligions] = useState([]);
    const [selectedReligion, setSelectedReligion] = useState('');
    const [deaths, setDeaths] = useState([]);
    const [selectedDeath, setSelectedDeath] = useState('');
    const [minAge, setMinAge] = useState('');
    const [maxAge, setMaxAge] = useState('');
    const [resident, setResident] = useState([]);
    const [selectedResident, setSelectedResident] = useState([]);
    const [isDisability, setDisability] = useState([]);
    const [selectedDisability, setSelectedDisability] = useState('');
    const [genders, setGenders] = useState([]);
    const [selectedGender, setSelectedGender] = useState('');

    //Count user
    const [users, setUsers] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
      
    useEffect(() => {
        const fetchData = async () => {
          try {
            fetchFamilies();
            fetchOccupation();
            fetchEducation();
            fetchEthnicity();
            fetchReligion();
            fetchDeaths();
            fetchGenders(),
            fetchHouseholds();
            fetchStateRegions();
            fetchDistricts();
            fetchTownships();
            fetchWardVillageTracts();
            fetchVillages();
            fetchResident();
            fetchIsDisability();
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
      
        fetchData();
    }, [selectedDeath, minAge, maxAge]);
    
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
          educations (id, name),
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

    useEffect(() => {
        fetchUsers();
      }, []);
    
      async function fetchUsers() {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('*');
    
          if (error) {
            throw new Error(error.message);
          }
    
          setUsers(data);
          setTotalCount(data.length);
        } catch (error) {
          console.error('Error fetching users:', error.message);
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
      
    // async function fetchDeaths() {
    //     try {
    //       const { data, error } = await supabase
    //       .from('families')
    //       .select('isDeath');
      
    //       if (error) {
    //         throw new Error(error.message);
    //       }
      
    //       const uniqueDeaths = [...new Set(data.map((row) => row.isDeath))];
      
    //       setDeaths(uniqueDeaths);
    //     } catch (error) {
    //       console.log('Error fetching deaths:', error.message);
    //     }
    // }

    async function fetchIsDisability() {
        try {
          const { data, error } = await supabase
            .from('families')
            .select('id, name, isDisability');
            
          if (error) {
            throw new Error(error.message);
          }
      
          // Extract unique Disability values
          const uniqueIsDisability = [];
          data.forEach(family => {
            if (!uniqueIsDisability.includes(family.isDisability)) {
              uniqueIsDisability.push(family.isDisability);
            }
          });
      
          // Group families by the Disability property
          const groupedFamilies = {};
          uniqueIsDisability.forEach(isDisabilityValue => {
            groupedFamilies[isDisabilityValue] = data.filter(family => family.isDisability === isDisabilityValue);
          });
      
          setDisability(groupedFamilies);
        } catch (error) {
          console.log('Error fetching isDisability:', error.message);
        }
    }
      
    // async function fetchIsDisability() {
    //     try {
    //       const { data, error } = await supabase
    //         .from('families')
    //         .select('id, name, isDisability');
          
    //       if (error) {
    //         throw new Error(error.message);
    //       }
      
    //       // Extract unique Disability values
    //       const uniqueIsDisability = [...new Set(data.map(family => family.isDisability))];
      
    //       // Group families by the Disability property
    //       const groupedFamilies = uniqueIsDisability.reduce((groups, isDisabilityValue) => {
    //         groups[isDisabilityValue] = data.filter(family => family.isDisability === isDisabilityValue);
    //         return groups;
    //       }, {});
      
    //       setDisability(groupedFamilies);
    //     } catch (error) {
    //       console.log('Error fetching isDisability:', error.message);
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

    async function fetchReligion() {
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

    async function fetchResident() {
        try {
          const { data, error } = await supabase
            .from('families')
            .select('id, name, resident');
        
          if (error) {
            throw new Error(error.message);
          }
      
          const uniqueResident = [];
          const groupedFamilies = {};
      
          data.forEach(family => {
            if (!uniqueResident.includes(family.resident)) {
              uniqueResident.push(family.resident);
              groupedFamilies[family.resident] = [];
            }
            groupedFamilies[family.resident].push(family);
          });
      
          setResident(groupedFamilies);
        } catch (error) {
          console.log('Error fetching resident:', error.message);
        }
    }
      
    // async function fetchResident() {
    //     try {
    //       const { data, error } = await supabase
    //         .from('families')
    //         .select('id, name, resident');
          
    //       if (error) {
    //         throw new Error(error.message);
    //       }
      
    //       // Extract unique resident values
    //       const uniqueResident = [...new Set(data.map(family => family.resident))];
      
    //       // Group families by the resident property
    //       const groupedFamilies = uniqueResident.reduce((groups, residentValue) => {
    //         groups[residentValue] = data.filter(family => family.resident === residentValue);
    //         return groups;
    //       }, {});
      
    //       setResident(groupedFamilies);
    //     } catch (error) {
    //       console.log('Error fetching resident:', error.message);
    //     }
    // }
    
    // Function to check if the age matches the selected age filter
    const checkAge = (dateOfBirth) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        const age = today.getFullYear() - birthDate.getFullYear();
        // const monthDiff = today.getMonth() - birthDate.getMonth();
        const isMatchingAge =
          (minAge === '' || age >= minAge) && (maxAge === '' || age <= maxAge);
    
        return isMatchingAge;
    };
    const handleMinAgeChange = (e) => {
        const inputMinAge = e.target.value !== '' ? parseInt(e.target.value) : '';
        setMinAge(inputMinAge);
    };
    const handleMaxAgeChange = (e) => {
        const inputMaxAge = e.target.value !== '' ? parseInt(e.target.value) : '';
        setMaxAge(inputMaxAge);
    };
    
    //Multi Select resident start
    const options = Object.keys(resident).map((residentValue) => ({
        value: residentValue,
        label: `${residentValue} (${resident[residentValue].length})`,
    }));

    const handleSelectChange = (selectedItems) => {
    const selectedValues = selectedItems.map((item) => item.value);
    setSelectedResident(selectedValues);
    };
    //Multi Select resident End
    
    // Filtered faimiles based on search and filters
    const filterFamilies = families.filter((family) => {
        const isMatchingSearchQuery =
        family.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        family.gender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        family.father_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        family.mother_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        family.remark.toLowerCase().includes(searchQuery.toLowerCase()) ||
        family.date_of_birth.toLowerCase().includes(searchQuery.toLowerCase()) ||
        family.nrc_id.toLowerCase().includes(searchQuery.toLowerCase()) ||

        family.occupations.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        family.educations.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        family.ethnicities.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        family.households.household_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
        family.religions.name.toLowerCase().includes(searchQuery.toLowerCase());

        const isMatchingDeath =
        selectedDeath === '' || family.isDeath === selectedDeath;

        const isMatchingOccupation =
        selectedOccupation === '' || family.occupations.name === selectedOccupation;

        const isMatchingEducation =
        selectedEducation === '' || family.educations.name === selectedEducation;

        const isMatchingEthnicity =
        selectedEthnicity === '' ||
        family.ethnicities.name === selectedEthnicity;

        const isMatchingReligion = selectedReligion === '' || family.religions.name === selectedReligion;
        
        const isMatchingAge = checkAge(family.date_of_birth);

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
        
        const isMatchingResident = selectedResident.length === 0 || selectedResident.includes(family.resident);

        const isMatchingIsDisability = selectedDisability.length === 0 || selectedDisability.includes(family.isDisability);

        return (
            isMatchingDeath &&
            isMatchingOccupation &&
            isMatchingEducation &&
            isMatchingEthnicity &&
            isMatchingReligion &&
            isMatchingAge &&
            isMatchingHousehold &&
            isMatchingSearchQuery &&
            isMatchingStateRegion &&
            isMatchingDistrict &&
            isMatchingTownship &&
            isMatchingWardVillageTract &&
            isMatchingResident &&
            isMatchingIsDisability &&
            isMatchingGender &&
            isMatchingVillage
        );
    });

    // Calculate total gender counts, family count, and household count for each village start
    const villageCounts = {};
    const householdCounts = {};
    let totalFamilies = 0;
    let totalHouseholds = 0;
    let totalDeaths = 0;
    let totalDisabilities = 0;

    filterFamilies.forEach((family) => {
    const villageName = family.households?.villages?.name;
    const gender = family.gender;
    const isDeath = family.isDeath;
    const deaths = family.deaths?.length;
    const disabilities = family.disabilities?.length;
    const householdNo = family.households?.household_no;

    if (villageName && isDeath === 'No') {
        if (!villageCounts[villageName]) {
        villageCounts[villageName] = {
            maleCount: 0,
            femaleCount: 0,
            familyCount: 0,
            householdCount: 0,
            deathCount: 0,
            disabilityCount: 0,
        };
        }

        if (gender === 'ကျား') {
        villageCounts[villageName].maleCount++;
        } else if (gender === 'မ') {
        villageCounts[villageName].femaleCount++;
        }

        villageCounts[villageName].familyCount++;
        totalFamilies++;

        if (deaths) {
        villageCounts[villageName].deathCount++;
        totalDeaths++;
        }

        if (disabilities) {
        villageCounts[villageName].disabilityCount += disabilities;
        totalDisabilities += disabilities;
        }

        if (householdNo) {
        if (!householdCounts[villageName]) {
            householdCounts[villageName] = {};
        }
        householdCounts[villageName][householdNo] = true;
        villageCounts[villageName].householdCount = Object.keys(householdCounts[villageName]).length;
        }

        if (householdNo && !householdCounts[householdNo]) {
        householdCounts[householdNo] = 0;
        totalHouseholds++;
        }

        householdCounts[householdNo]++;
    }

    if (isDeath === 'Yes') {
        if (!villageCounts[villageName]) {
        villageCounts[villageName] = {
            maleCount: 0,
            femaleCount: 0,
            familyCount: 0,
            householdCount: 0,
            deathCount: 0,
            disabilityCount: 0,
        };
        }

        if (gender === 'ကျား') {
        villageCounts[villageName].maleCount++;
        } else if (gender === 'မ') {
        villageCounts[villageName].femaleCount++;
        }

        if (deaths) {
        villageCounts[villageName].deathCount++;
        totalDeaths++;
        }

        villageCounts[villageName].familyCount++;
        totalFamilies++;

        if (disabilities) {
        villageCounts[villageName].disabilityCount += disabilities;
        totalDisabilities += disabilities;
        }

        if (householdNo) {
        if (!householdCounts[villageName]) {
            householdCounts[villageName] = {};
        }
        householdCounts[villageName][householdNo] = true;
        villageCounts[villageName].householdCount = Object.keys(householdCounts[villageName]).length;
        }

        if (householdNo && !householdCounts[householdNo]) {
        householdCounts[householdNo] = 0;
        totalHouseholds++;
        }

        householdCounts[householdNo]++;
    }
    });

    // const villageSet = new Set();
    // const villageCounts = {};
    // const householdCounts = {};
    // let totalFamilies = 0;
    // let totalHouseholds = 0;
    // let totalDeaths = 0;
    // let totalDisabilities = 0;

    // filterFamilies.forEach((family) => {
    // const villageName = family.households?.villages?.name;
    // const gender = family.gender;
    // const isDeath = family.isDeath;
    // const deaths = family.deaths?.length;
    // const disabilities = family.disabilities?.length; // Update disabilities variable
    // const householdNo = family.households?.household_no;
        
    // if (villageName && isDeath === 'No') {
    //     if (!villageSet.has(villageName)) {
    //     villageSet.add(villageName);
    //     villageCounts[villageName] = {
    //         maleCount: 0,
    //         femaleCount: 0,
    //         familyCount: 0,
    //         householdCount: 0,
    //         deathCount: 0,
    //         disabilityCount: 0,
    //     };
    //     }

    //     // Gender
    //     if (gender === 'ကျား') {
    //     villageCounts[villageName].maleCount++;
    //     } else if (gender === 'မ') {
    //     villageCounts[villageName].femaleCount++;
    //     }

    //     villageCounts[villageName].familyCount++;
    //     totalFamilies++;
    
    //     if (deaths) {
    //         villageCounts[villageName].deathCount++;
    //         totalDeaths++;
    //     }

    //     if (disabilities) {
    //     villageCounts[villageName].disabilityCount += disabilities;
    //     totalDisabilities += disabilities;
    //     }

    //     if (householdNo) {
    //     if (!householdCounts[villageName]) {
    //         householdCounts[villageName] = new Set();
    //     }
    //     householdCounts[villageName].add(householdNo);
    //     villageCounts[villageName].householdCount = householdCounts[villageName].size;
    //     }

    //     if (householdNo && !householdCounts[householdNo]) {
    //     householdCounts[householdNo] = 0;
    //     totalHouseholds++;
    //     }

    //     householdCounts[householdNo]++;
    // }

    // if (isDeath === 'Yes') {
    //     if (!villageSet.has(villageName)) {
    //     villageSet.add(villageName);
    //     villageCounts[villageName] = {
    //         maleCount: 0,
    //         femaleCount: 0,
    //         familyCount: 0,
    //         householdCount: 0,
    //         deathCount: 0,
    //         disabilityCount: 0,
    //     };
    //     }

    //     if (gender === 'ကျား') {
    //     villageCounts[villageName].maleCount++;
    //     } else if (gender === 'မ') {
    //     villageCounts[villageName].femaleCount++;
    //     }

    //     if (deaths) {
    //     villageCounts[villageName].deathCount++;
    //     totalDeaths++;
    //     }

    //     villageCounts[villageName].familyCount++;
    //     totalFamilies++;

    //     if (disabilities) {
    //     villageCounts[villageName].disabilityCount += disabilities;
    //     totalDisabilities += disabilities;
    //     }

    //     if (householdNo) {
    //     if (!householdCounts[villageName]) {
    //         householdCounts[villageName] = new Set();
    //     }
    //     householdCounts[villageName].add(householdNo);
    //     villageCounts[villageName].householdCount = householdCounts[villageName].size;
    //     }

    //     if (householdNo && !householdCounts[householdNo]) {
    //     householdCounts[householdNo] = 0;
    //     totalHouseholds++;
    //     }

    //     householdCounts[householdNo]++;
    // }
    // });

    const sortedVillages = Object.keys(villageCounts).sort((a, b) => {
    return villageCounts[b].familyCount - villageCounts[a].familyCount;
    });
    // Calculate total gender counts, family count, and household count for each village end
    

    //Chart start
    const barChartLabels = sortedVillages;
    const barChartData = sortedVillages.map((village) => villageCounts[village].familyCount);
    const barChartDataHousehold = sortedVillages.map((village) => villageCounts[village].householdCount);
    
    const genderData = [
        totalFamilies - sortedVillages.reduce((acc, village) => acc + villageCounts[village].femaleCount, 0),
        sortedVillages.reduce((acc, village) => acc + villageCounts[village].femaleCount, 0),
    ];
    //Chart End

    const [showFilter, setShowFilter] = useState(false);

    const handleToggleFilter = () => {
        setShowFilter(!showFilter);
    };
    
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }
    
    return (
        <div className='py-4'>
            <section className="grid gap-6 py-4 md:grid-cols-2 xl:grid-cols-5">
                <div className="relative flex items-center p-8 bg-white rounded-lg shadow hover:bg-gray-100">
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-16 h-16 mr-6 text-blue-700 bg-blue-100 rounded-full">
                        <svg
                        aria-hidden="true"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6"
                        >
                        <UserGroupIcon className="inline w-6 h-6 mr-2"></UserGroupIcon>
                        </svg>
                    </div>
                    <div>
                        <span className="block text-2xl font-bold">{totalFamilies}</span>
                        <span className="block text-sm text-gray-500">{t("dashboard.TotalPopulations")}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-700" />
                </div>
                <div className="relative flex items-center p-8 bg-white rounded-lg shadow hover:bg-gray-100">
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-16 h-16 mr-6 text-blue-900 bg-blue-100 rounded-full">
                        <svg
                        aria-hidden="true"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6"
                        >
                        <HomeModernIcon className="inline w-6 h-6 mr-2" />
                        </svg>
                    </div>
                    <div>
                        <span className="block text-2xl font-bold">{totalHouseholds}</span>
                        <span className="block text-sm text-gray-500">{t("dashboard.TotalHouseholds")}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-900" />
                </div>
                
                <div className="relative flex items-center p-8 bg-white rounded-lg shadow hover:bg-gray-100">
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-16 h-16 mr-6 text-blue-400 bg-blue-100 rounded-full">
                        <svg
                        aria-hidden="true"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6"
                        >
                        <DocumentDuplicateIcon className="inline w-6 h-6 mr-2" />
                        </svg>
                    </div>
                    <div>
                        <span className="inline-block text-2xl font-bold">{totalDeaths}</span>
                        <span className="block text-sm text-gray-500">{t("dashboard.TotalDeaths")}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-400" />
                </div>
                <div className="relative flex items-center p-8 bg-white rounded-lg shadow hover:bg-gray-100">
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-16 h-16 mr-6 text-blue-400 bg-blue-100 rounded-full">
                        <svg
                        aria-hidden="true"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6"
                        >
                        <StarIcon className="inline w-6 h-6 mr-2" />
                        </svg>
                    </div>
                    <div>
                        <span className="inline-block text-2xl font-bold">{totalDisabilities}</span>
                        <span className="block text-sm text-gray-500">{t("dashboard.TotalDisabilities")}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-400" />
                </div>

                <div className="relative flex items-center p-8 bg-white rounded-lg shadow hover:bg-gray-100">
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-16 h-16 mr-6 text-blue-400 bg-blue-100 rounded-full">
                        <svg
                        aria-hidden="true"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6"
                        >
                        <UserIcon className="inline w-6 h-6 mr-2" />
                        </svg>
                    </div>
                    <div>
                        <span className="block text-2xl font-bold">{totalCount}</span>
                        <span className="block text-sm text-gray-500">{t("dashboard.TotalUsers")}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-200" />
                </div>
            </section>

          
            {/* Chart */}
            <section className="grid grid-cols-1 gap-4 py-4 md:grid-cols-3">
                <div className="relative flex items-center col-span-2 p-8 bg-white rounded-lg shadow hover:bg-gray-100">

                    <Bar
                        data={{
                        labels: barChartLabels,
                        datasets: [
                            {
                            label: t('dashboard.Populations'),
                            data: barChartData,
                            backgroundColor: 'rgba(54, 162, 235, 0.6)',
                            },
                            {
                            label: t('dashboard.Households'),
                            data: barChartDataHousehold,
                            backgroundColor: 'rgba(155, 99, 132, 0.6)',
                            },
                        ],
                        }}
                        options={{
                        indexAxis: 'x',
                        responsive: true,
                        plugins: {
                            title: {
                            display: true,
                            text: t('dashboard.PopulationAndHouseholdRation'),
                            position: 'top',
                            font: {
                                weight: 'bold',
                                size: 18,
                            },
                            },
                            legend: {
                            display: true,
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
                            y: {
                            display: true,
                            title: {
                                display: true,
                                text: t('dashboard.TotalPopulations'),
                                font: {
                                weight: 'bold',
                                size: 14,
                                padding: { top: 40, bottom: 0 }
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
                    className="px-4 py-2 text-white bg-blue-400 rounded-md"
                >
                <GridFilterListIcon className="w-5 h-5 mr-2"></GridFilterListIcon>
                    Filter
                </button>
                </div>
                <p className="text-gray-500">{t("filter.TotalResults")}: {filterFamilies.length}</p>
            </div>

            {showFilter && (
            <div className="py-4 sm:grid sm:grid-cols-6 sm:gap-4">
                <div>
                    <select
                    value={selectedHousehold}
                    onChange={(e) => setSelectedHousehold(e.target.value)}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6"
                    >
                    <option value="">{t("filter.Households")}</option>
                        {/* Render state region options */}
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
                            {villages.map((village) => (
                            <option key={village.id} value={village.name}>
                            {village.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <select 
                    value={selectedOccupation}
                    onChange={(e) => setSelectedOccupation(e.target.value)}
                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6">
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
                        value={selectedDisability}
                        onChange={(e) => setSelectedDisability(e.target.value)}
                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-sky-600 sm:text-sm sm:leading-6"
                    >
                        <option value="">{t("filter.IsDisabilities")}</option>
                        {Object.keys(isDisability).map((d) => (
                        <option key={d} value={d}>
                            {d} ({isDisability[d].length})
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
                <div>
                    <DropdownSelect
                        multi
                        values={selectedResident}
                        options={options}
                        onChange={handleSelectChange}
                        placeholder={t("filter.resident")}
                        style={{
                        zIndex: 40,
                        marginTop: 9,
                        borderRadius: '0.375rem',
                        padding: '0.375rem 0.75rem',
                        color: '#4b5563',
                        ring: '1px inset #e2e8f0',
                        focusRing: '2px solid #93c5fd',
                        lineHeight: '1.25rem',
                        fontSize: '1rem',
                        }}
                    />
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
                                    {t("dashboard.VillageName")}
                                </th>
                                <th
                                    scope="col"
                                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                                >
                                    {t("dashboard.TotalGender")}
                                </th>
                                <th
                                    scope="col"
                                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                                >
                                    {t("dashboard.TotalPopulations")}
                                </th>
                                <th
                                    scope="col"
                                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                                >
                                    {t("dashboard.TotalHouseholds")}
                                </th>
                                <th
                                    scope="col"
                                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                                >
                                    {t("dashboard.TotalDeaths")}
                                </th>
                                <th
                                    scope="col"
                                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                                >
                                    {t("dashboard.TotalDisabilities")}
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
                                    ကျား - {counts.maleCount}, မ - {counts.femaleCount}
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
                                    {counts.householdCount}
                                    </td>
                                    <td
                                    className={classNames(
                                        familyIdx !== villageName.length - 1 ? "border-b border-gray-200" : "",
                                        "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"
                                    )}
                                    >
                                    {counts.deathCount}
                                    </td>
                                    <td
                                    className={classNames(
                                        familyIdx !== villageName.length - 1 ? "border-b border-gray-200" : "",
                                        "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"
                                    )}
                                    >
                                    {counts.disabilityCount}
                                    </td>
                                </tr>
                                );
                            })}
                            </tbody>

                    </table>
                </div>
            </div>
        </div>
)};

export default Dashboard;

