import Head from 'next/head'
import Sidebar from '@/components/admin/layouts/Sidebar'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import React, { useState, useEffect } from "react";

import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useUserRoleCheck } from '/src/components/utilities/useUserRoleCheck.js';

import { useRouter } from 'next/router';
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import { getDateValue } from '/src/components/utilities/tools.js';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export const getStaticPaths = async () => {
    return {
      fallback: true,
      paths: [
        '/admin/families/id',
        { params: { id: '1' } },
      ],
    };
};
  

export default function HouseholdEdit() {
    const router = useRouter();
    const supabase = useSupabaseClient();
    const user = useUser()
    
    const { id } = router.query; // Retrieve the `id` parameter from the route
    const { t } = useTranslation("");
    
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [fatherName, setFatherName] = useState('');
    const [motherName, setMotherName] = useState('');
    const [remark, setRemark] = useState('');
    const [resident, setResident] = useState("");
    
    useUserRoleCheck();

    
    //Occupation
    const [occupations, setOccupations] = useState([]);
    const [selectedOccupation, setSelectedOccupation] = useState('');
    const [newOccupation, setNewOccupation] = useState('');
    const [showModalOccupation, setShowModalOccupation] = useState(false);

    const handleCloseModalOccupation = () => {
        setShowModalOccupation(false);
        setNewOccupation('');
    };

    const fetchOccupations = async () => {
        const { data, error } = await supabase.from('occupations').select('*');
    
        if (error) {
          console.log(error);
        } else {
          setOccupations(data);
        }
    };

    const handleOccupationChange = (e) => {
        setSelectedOccupation(e.target.value);
        if (e.target.value === "new") {
            setShowModalOccupation(true);
        }
    };

    const handleNewOccupationChange = (e) => {
        setNewOccupation(e.target.value);
    };

    const handleNewOccupationSubmit = async () => {
        if (newOccupation) {
          const { data, error } = await supabase.from('occupations').insert({ name: newOccupation });
      
          // Call fetchOccupations to refresh the list
          fetchOccupations();
      
          // Close the modal box
          setShowModalOccupation(false);
      
          if (error) {
            console.log(error);
          } else {
            if (data) {
              setOccupations([...occupations, data[0]]);
              setSelectedOccupation(data[0].id); // Set the selected occupation to the newly added occupation
            }
            setNewOccupation('');
            setShowModalOccupation(false);
          }
        }
    };

    //Education
    const [educations, setEducations] = useState([]);
    const [selectedEducation, setSelectedEducation] = useState('');
    const [newEducation, setNewEducation] = useState('');
    const [showModalEducation, setShowModalEducation] = useState(false);

    const handleCloseModalEducation = () => {
        setShowModalEducation(false);
        setNewEducation('');
    };

    const fetchEducations = async () => {
        const { data, error } = await supabase.from('educations').select('*');

        if (error) {
            console.log(error);
        } else {
            setEducations(data);
        }
    };

    const handleEducationChange = (e) => {
        setSelectedEducation(e.target.value);
        if (e.target.value === "new") {
            setShowModalEducation(true);
        }
    };

    const handleNewEducationChange = (e) => {
        setNewEducation(e.target.value);
    };
    
    const handleNewEducationSubmit = async () => {
        if (newEducation) {
          const { data, error } = await supabase.from('educations').insert({ name: newEducation });
      
          // Call fetchOccupations to refresh the list
          fetchEducations();
      
          // Close the modal box
          setShowModalEducation(false);
      
          if (error) {
            console.log(error);
          } else {
            if (data) {
              setEducations([...educations, data[0]]);
              setSelectedEducation(data[0].id); // Set the selected education to the newly added education
            }
            setNewEducation('');
            setShowModalEducation(false);
          }
        }
    };

    //Relationship
    const [relationships, setRelationships] = useState([]);
    const [selectedRelationship, setSelectedRelationship] = useState(null);
    const [newRelationship, setNewRelationship] = useState('');
    const [showModalRelationship, setShowModalRelationship] = useState(false);

    const handleCloseModalRelationship = () => {
        setShowModalRelationship(false);
        setNewRelationship('');
    };

    // const fetchRelationships = async () => {
    //     const { data: relationshipData, error } = await supabase.from('relationships').select('id, name');

    //     if (error) {
    //         console.log(error);
    //     } else {
    //         setRelationships(relationshipData);
    //     }
    // };
    
    const fetchRelationships = async () => {
        try {
          const { data, error } = await supabase.from('relationships').select('id, name');
          if (error) {
            console.log(error);
          } else {
            setRelationships(data || []); // Ensure data is an array or set it to an empty array
          }
        } catch (error) {
          console.error(error);
        }
    };

    const handleRelationshipChange = (e) => {
        setSelectedRelationship(e.target.value);
        if (e.target.value === "new") {
            setShowModalRelationship(true);
        }
    };

    const handleNewRelationshipChange = (e) => {
        setNewRelationship(e.target.value);
    };
    
    const handleNewRelationshipSubmit = async () => {
        if (newRelationship) {
          const { data, error } = await supabase.from('relationships').insert({ name: newRelationship });
      
          // Call fetchRelationship to refresh the list
          fetchRelationships();
      
          // Close the modal box
          setShowModalRelationship(false);
      
          if (error) {
            console.log(error);
          } else {
            if (data) {
              setRelationships([...relationships, data[0]]);
              setSelectedRelationship(data[0].id); // Set the selected Relationship to the newly added Relationship
            }
            setNewRelationship('');
            setShowModalRelationship(false);
          }
        }
    };

    // Ethnicity
    const [ethnicities, setEthnicities] = useState([]);
    const [selectedEthnicity, setSelectedEthnicity] = useState('');
    const [newEthnicity, setNewEthnicity] = useState('');
    const [showModalEthnicity, setShowModalEthnicity] = useState(false);

    const handleCloseModalEthnicity = () => {
        setShowModalEthnicity(false);
        setNewEthnicity('');
    };

    const fetchEthnicities = async () => {
        const { data, error } = await supabase.from('ethnicities').select('*');

        if (error) {
            console.log(error);
        } else {
            setEthnicities(data);
        }
    };

    const handleEthnicityhipChange = (e) => {
        setSelectedEthnicity(e.target.value);
        if (e.target.value === "new") {
            setShowModalEthnicity(true);
        }
    };

    const handleNewEthnicityChange = (e) => {
        setNewEthnicity(e.target.value);
    };
    
    const handleNewEthnicitySubmit = async () => {
        if (newEthnicity) {
          const { data, error } = await supabase.from('ethnicities').insert({ name: newEthnicity });
      
          // Call fetchEthnicity to refresh the list
          fetchEthnicities();
      
          // Close the modal box
          setShowModalEthnicity(false);
      
          if (error) {
            console.log(error);
          } else {
            if (data) {
              setEthnicities([...ethnicities, data[0]]);
              setSelectedEthnicity(data[0].id); // Set the selected Ethnicity to the newly added Ethnicity
            }
            setNewEthnicity('');
            setShowModalEthnicity(false);
          }
        }
    };

    // Nationality
    const [nationalities, setNationalities] = useState([]);
    const [selectedNationality, setSelectedNationality] = useState('');
    const [newNationality, setNewNationality] = useState('');
    const [showModalNationality, setShowModalNationality] = useState(false);

    const handleCloseModalNationality = () => {
        setShowModalNationality(false);
        setNewNationality('');
    };

    const fetchNationalities = async () => {
        const { data, error } = await supabase.from('nationalities').select('*');

        if (error) {
            console.log(error);
        } else {
            setNationalities(data);
        }
    };

    const handleNationalityChange = (e) => {
        setSelectedNationality(e.target.value);
        if (e.target.value === "new") {
            setShowModalNationality(true);
        }
    };

    const handleNewNationalityChange = (e) => {
        setNewNationality(e.target.value);
    };
    
    const handleNewNationalitySubmit = async () => {
        if (newNationality) {
          const { data, error } = await supabase.from('nationalities').insert({ name: newNationality });
      
          // Call fetchNationality to refresh the list
          fetchNationalities();
      
          // Close the modal box
          setShowModalNationality(false);
      
          if (error) {
            console.log(error);
          } else {
            if (data) {
              setNationalities([...nationalities, data[0]]);
              setSelectedNationality(data[0].id); // Set the selected Nationality to the newly added Nationality
            }
            setNewNationality('');
            setShowModalNationality(false);
          }
        }
    };

    // Religion
    const [religions, setReligions] = useState([]);
    const [selectedReligion, setSelectedReligion] = useState('');
    const [newReligion, setNewReligion] = useState('');
    const [showModalReligion, setShowModalReligion] = useState(false);

    const handleCloseModalReligion = () => {
        setShowModalReligion(false);
        setNewReligion('');
    };

    const fetchReligions = async () => {
        const { data, error } = await supabase.from('religions').select('*');

        if (error) {
            console.log(error);
        } else {
            setReligions(data);
        }
    };

    const handleReligionChange = (e) => {
        setSelectedReligion(e.target.value);
        if (e.target.value === "new") {
            setShowModalReligion(true);
        }
    };

    const handleNewReligionChange = (e) => {
        setNewReligion(e.target.value);
    };
    
    const handleNewReligionSubmit = async () => {
        if (newReligion) {
          const { data, error } = await supabase.from('religions').insert({ name: newReligion });
      
          // Call fetchReligion to refresh the list
          fetchReligions();
      
          // Close the modal box
          setShowModalReligion(false);
      
          if (error) {
            console.log(error);
          } else {
            if (data) {
              setReligions([...religions, data[0]]);
              setSelectedReligion(data[0].id); // Set the selected Religion to the newly added Religion
            }
            setNewReligion('');
            setShowModalReligion(false);
          }
        }
    };

    //Households
    const [searchTerm, setSearchTerm] = useState("");
    const [households, setHouseholds] = useState([]);
    const [selectedHousehold, setSelectedHousehold] = useState(null)

    useEffect(() => {
        async function fetchHouseholds() {
          const { data } = await supabase
            .from("households")
            .select("id, household_no")
            .filter("household_no", "ilike", `%${searchTerm}%`)
            .order("household_no")
            .limit(10);
          setHouseholds(data);
        }
    
        if (searchTerm.length > 0) {
          fetchHouseholds();
        } else {
          setHouseholds([]);
        }
    }, [searchTerm]);

    function handleSelectHousehold(id) {
        const household = households.find((h) => h.id === id);
        if (household) {
          setSelectedHousehold(household.household_no);
          setSearchTerm(household.household_no);
        }
    }
    
    // NRC
    const [searchTermNrc, setSearchTermNrc] = useState('');
    const [nrcCodes, setNrcCodes] = useState([]);
    // const [selectedNrc, setSelectedNrc] = useState(null);
    const [nrc, setNrc] = useState('');

    useEffect(() => {
        async function fetchNrcCodes() {
            const { data } = await supabase
                .from('nrc_codes')
                .select('name')
                .ilike('name', `%${searchTermNrc}%`);
            setNrcCodes(data);
        }
        if (searchTermNrc.length >= 3) {
            fetchNrcCodes();
        }
    }, [searchTermNrc]);

    const handleNrcInput = (e) => {
        setNrc(e.target.value);
        setSearchTermNrc(e.target.value);
    };

    const handleSelectNrc = (nrcName) => {
        setNrc(nrcName);
        setSearchTermNrc('');
    };


    // async function handleSubmit(event) {
    //     event.preventDefault();
    //     if (!selectedNrc) return;
    //     const { data: families, error } = await supabase
    //       .from('families')
    //       .insert({ nrc: `${selectedNrc}/${number}` });
    //     if (error) console.error(error);
    //     else console.log(families);
    // }

    useEffect(() => {
        fetchOccupations();
        fetchEducations();
        fetchRelationships();
        fetchEthnicities();
        fetchNationalities();
        fetchReligions();
        
        const fetchFamilyData = async () => {
            const { data: familyData, error: familyError } = await supabase
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
                resident,
                isDeath,
                relationship_id,
                occupation_id,
                education_id,
                ethnicity_id,
                nationality_id,
                religion_id,
                household_no
                `)
                .eq('id', id)
                .single();
        
            if (familyError) {
                throw familyError;
            }
            setName(familyData.name);
            setDob(familyData.date_of_birth);
            setNrc(familyData.nrc_id);
            setGender(familyData.gender);
            setFatherName(familyData.father_name);
            setMotherName(familyData.mother_name);
            setRemark(familyData.remark);
            setResident(familyData.resident);
            
            setSelectedRelationship(familyData.relationship_id);
            setSelectedOccupation(familyData.occupation_id);
            setSelectedEthnicity(familyData.ethnicity_id);
            setSelectedEducation(familyData.education_id);
            setSelectedNationality(familyData.nationality_id);
            setSelectedReligion(familyData.religion_id);
            setSelectedHousehold(familyData.household_no);
            };
    
        if (id) {
            fetchFamilyData();
        }
    }, [id]);
    
    // Handle edit household
    const handleEditFamily = async (e) => {
        e.preventDefault();

        // Check if all required fields are filled
        if (
        !name ||
        !dob ||
        !nrc ||
        !gender ||
        !fatherName ||
        !motherName ||
        !remark ||
        !selectedRelationship ||
        !selectedOccupation ||
        !selectedEducation ||
        !selectedEthnicity ||
        !selectedNationality ||
        !selectedReligion ||
        !selectedHousehold
        ) {
        alert('Please fill all required fields!');
        return;
        }

        const { data: familyData, error: familyError } = await supabase
        .from('families')
        .update({
            name: name,
            date_of_birth: dob,
            nrc_id: nrc,
            gender: gender,
            father_name: fatherName,
            mother_name: motherName,
            remark: remark,
            resident: resident,
            relationship_id: selectedRelationship,
            occupation_id: selectedOccupation,
            education_id: selectedEducation,
            ethnicity_id: selectedEthnicity,
            nationality_id: selectedNationality,
            religion_id: selectedReligion,
            household_no: selectedHousehold
        })
        .eq('id', id)
        .single();

        console.log(familyData);
        if (familyError) {
        alert('Failed to update family!');
        console.error(familyError);
        } else {
        alert('Family updated successfully!');
        router.push('/admin/families');
        }
    };


    const handleBackClick = () => {
        router.push('/admin/families');
    };

    const handleCancel = () => {
        const fetchFamilyData = async () => {
            const { data: familyData, error: familyError } = await supabase
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
                resident,
                isDeath,
                relationship_id,
                occupation_id,
                education_id,
                ethnicity_id,
                nationality_id,
                religion_id,
                household_no
                `)
                .eq('id', id)
                .single();
        
            if (familyError) {
                throw familyError;
            }
            setName(familyData.name);
            setDob(familyData.date_of_birth);
            setNrc(familyData.nrc_id);
            setGender(familyData.gender);
            setFatherName(familyData.father_name);
            setMotherName(familyData.mother_name);
            setRemark(familyData.remark);
            setResident(familyData.resident);
            
            setSelectedRelationship(familyData.relationship_id);
            setSelectedOccupation(familyData.occupation_id);
            setSelectedEthnicity(familyData.ethnicity_id);
            setSelectedEducation(familyData.education_id);
            setSelectedNationality(familyData.nationality_id);
            setSelectedReligion(familyData.religion_id);
            setSelectedHousehold(familyData.household_no);
            };
    
            fetchFamilyData();
    }
    
    return (
        <>
            <Head>
                <title>VIMS - Family Add</title>
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
                                {t("sidebar.Families")}
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
                            {t("sidebar.Families")}
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
                
                <div className="grid grid-cols-1 pt-10 gap-x-8 gap-y-8 md:grid-cols-3">
                    <form onSubmit={handleEditFamily} className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-3">
                        <div className="grid grid-cols-1 px-3 py-3 md:grid-cols-3"> {/* Updated className */}
                            <div className="col-span-1 px-3 py-3 mt-3 md:col-span-1">
                                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                    {t("Name")}
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            {/* Gender */}
                            <div className="col-span-1 px-3 py-3 mt-3 md:col-span-1">
                                <label htmlFor="gender" className="block text-sm font-medium leading-6 text-gray-900">
                                    {t("Gender")}
                                </label>
                                <div className="mt-2">
                                    <select name="gender" 
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)} 
                                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                    >
                                        <option value="">{t("other.Choose")}</option>
                                        <option value="ကျား">ကျား</option>
                                        <option value="မ">မ</option>
                                    </select>
                                </div>
                            </div>
                            {/* DOB */}
                            <div className="col-span-1 px-3 py-3 mt-3 md:col-span-1">
                                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                    {t("DOB")}
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="date"
                                        id="dob"
                                        value={getDateValue(dob)}
                                        onChange={(e) => setDob(e.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            {/* NRC */}
                            <div className="col-span-1 px-3 py-3 mt-3 md:col-span-1">
                                <label htmlFor="nrc" className="block text-sm font-medium leading-6 text-gray-900">
                                    {t("NRC")}
                                </label>
                                <div className="relative mt-2">
                                    <input
                                        type="text"
                                        id="nrc"
                                        name="nrc"
                                        value={nrc}
                                        onChange={handleNrcInput}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                    />
                                    {nrcCodes.filter((code) => code.name.includes(searchTermNrc)).length > 0 && (
                                        <ul className="absolute z-10 w-full mt-1 bg-white border rounded-md">
                                            {nrcCodes
                                                .filter((code) => code.name.includes(searchTermNrc))
                                                .map((code) => (
                                                    <li
                                                        key={code.name}
                                                        onClick={() => handleSelectNrc(code.name)}
                                                        className="px-2 py-1 cursor-pointer hover:bg-gray-200"
                                                    >
                                                        {code.name}
                                                    </li>
                                                ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            
                            <div className="col-span-1 px-3 py-3 mt-3 md:col-span-1">
                                <label htmlFor="father_name" className="block text-sm font-medium leading-6 text-gray-900">
                                    {t("FatherName")}
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        id="father_name"
                                        value={fatherName}
                                        onChange={(e) => setFatherName(e.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="col-span-1 px-3 py-3 mt-3 md:col-span-1">
                                <label htmlFor="mother_name" className="block text-sm font-medium leading-6 text-gray-900">
                                    {t("MotherName")}
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        id="mother_name"
                                        value={motherName}
                                        onChange={(e) => setMotherName(e.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            
                            {/* Relationship */}
                            <div className="col-span-1 px-3 py-3 mt-3 md:col-span-1">
                                <label htmlFor="" className="block text-sm font-medium leading-6 text-gray-900">
                                    {t("Relationship")}
                                </label>
                                <div className="relative mt-2">
                                    <select
                                        id="relationship"
                                        value={selectedRelationship}
                                        onChange={handleRelationshipChange}
                                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                    >
                                        <option value="">{t("other.Choose")}</option>
                                        {relationships.map((relationship) => (
                                        <option key={relationship.id} value={relationship.id}>
                                            {relationship.name}
                                        </option>
                                        ))}
                                        <option disabled>──────────</option>
                                        <option value="new" className="font-medium text-blue-500">
                                            {t("other.Add")}
                                        </option>
                                    </select>
                                </div>
                                
                                {showModalRelationship && (
                                    <div className="fixed inset-0 z-10 overflow-y-auto">
                                        <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                                <div className="absolute inset-0 bg-gray-300 opacity-75"></div>
                                            </div>
                                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                                            <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
                                            <div>
                                                <div className="mt-3 text-center sm:mt-5">
                                                    <h3 className="text-lg font-medium leading-6 text-gray-900">{t("other.Add")} - {t("Relationship")}</h3>
                                                    <div className="mt-2">
                                                        <input
                                                        type="text"
                                                        name="newRelationship"
                                                        id="newRelationship"
                                                        value={newRelationship}
                                                        onChange={handleNewRelationshipChange}
                                                        className="block w-full px-3 py-2 mt-2 mb-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-between mt-5 sm:mt-6">
                                                    <button
                                                        type="button"
                                                        className="inline-block w-full py-2 text-base font-medium text-white border border-transparent rounded-md shadow-sm bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 sm:text-sm disabled:opacity-50"
                                                        disabled={!selectedRelationship && !newRelationship}
                                                        onClick={handleNewRelationshipSubmit}
                                                    >
                                                        {t("other.Submit")}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="inline-block w-full px-4 py-2 ml-2 text-base font-medium text-gray-700 bg-gray-200 border border-transparent rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:text-sm"
                                                        onClick={handleCloseModalRelationship}
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

                            {/* Occupation */}
                            <div className="col-span-1 px-3 py-3 mt-3 md:col-span-1">
                                <label htmlFor="" className="block text-sm font-medium leading-6 text-gray-900">
                                    {t("Occupation")}
                                </label>
                                <div className="relative mt-2">
                                    <select
                                        id="occupation"
                                        value={selectedOccupation}
                                        onChange={handleOccupationChange}
                                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                    >
                                        <option value="">{t("other.Choose")}</option>
                                        {occupations.map((occupation) => (
                                        <option key={occupation.id} value={occupation.id}>
                                            {occupation.name}
                                        </option>
                                        ))}
                                        <option disabled>──────────</option>
                                        <option value="new" className="font-medium text-blue-500">
                                            {t("other.Add")}
                                        </option>
                                    </select>
                                </div>
                                {showModalOccupation && (
                                    <div className="fixed inset-0 z-10 overflow-y-auto">
                                        <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                                <div className="absolute inset-0 bg-gray-300 opacity-75"></div>
                                            </div>
                                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                                            <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
                                            <div>
                                                <div className="mt-3 text-center sm:mt-5">
                                                    <h3 className="text-lg font-medium leading-6 text-gray-900">{t("other.Add")} - {t("Occupation")}</h3>
                                                    <div className="mt-2">
                                                        <input
                                                        type="text"
                                                        name="newOccupation"
                                                        id="newOccupation"
                                                        value={newOccupation}
                                                        onChange={handleNewOccupationChange}
                                                        className="block w-full px-3 py-2 mt-2 mb-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-between mt-5 sm:mt-6">
                                                    <button
                                                        type="button"
                                                        className="inline-block w-full py-2 text-base font-medium text-white border border-transparent rounded-md shadow-sm bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 sm:text-sm disabled:opacity-50"
                                                        disabled={!selectedOccupation && !newOccupation}
                                                        onClick={handleNewOccupationSubmit}
                                                    >
                                                        {t("other.Submit")}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="inline-block w-full px-4 py-2 ml-2 text-base font-medium text-gray-700 bg-gray-200 border border-transparent rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:text-sm"
                                                        onClick={handleCloseModalOccupation}
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
                            
                            {/* Education */}
                            <div className="col-span-1 px-3 py-3 mt-3 md:col-span-1">
                                <label htmlFor="" className="block text-sm font-medium leading-6 text-gray-900">
                                    {t("Education")}
                                </label>
                                <div className="relative mt-2">
                                    <select
                                        id="education"
                                        value={selectedEducation}
                                        onChange={handleEducationChange}
                                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                    >
                                        <option value="">{t("other.Choose")}</option>
                                        {educations.map((education) => (
                                        <option key={education.id} value={education.id}>
                                            {education.name}
                                        </option>
                                        ))}
                                        <option disabled>──────────</option>
                                        <option value="new" className="font-medium text-blue-500">
                                            {t("other.Add")}
                                        </option>
                                    </select>
                                </div>
                                {showModalEducation && (
                                    <div className="fixed inset-0 z-10 overflow-y-auto">
                                        <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                                <div className="absolute inset-0 bg-gray-300 opacity-75"></div>
                                            </div>
                                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                                            <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
                                            <div>
                                                <div className="mt-3 text-center sm:mt-5">
                                                    <h3 className="text-lg font-medium leading-6 text-gray-900">{t("other.Add")} - {t("Education")}</h3>
                                                    <div className="mt-2">
                                                        <input
                                                        type="text"
                                                        name="newEducation"
                                                        id="newEducation"
                                                        value={newEducation}
                                                        onChange={handleNewEducationChange}
                                                        className="block w-full px-3 py-2 mt-2 mb-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-between mt-5 sm:mt-6">
                                                    <button
                                                        type="button"
                                                        className="inline-block w-full py-2 text-base font-medium text-white border border-transparent rounded-md shadow-sm bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 sm:text-sm disabled:opacity-50"
                                                        disabled={!selectedEducation && !newEducation}
                                                        onClick={handleNewEducationSubmit}
                                                    >
                                                        {t("other.Submit")}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="inline-block w-full px-4 py-2 ml-2 text-base font-medium text-gray-700 bg-gray-200 border border-transparent rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:text-sm"
                                                        onClick={handleCloseModalEducation}
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

                            {/* Ethnicity */}
                            <div className="col-span-1 px-3 py-3 mt-3 md:col-span-1">
                                <label htmlFor="" className="block text-sm font-medium leading-6 text-gray-900">
                                    {t("Ethnicity")}
                                </label>
                                <div className="relative mt-2">
                                    <select
                                        id="ethnicity"
                                        value={selectedEthnicity}
                                        onChange={handleEthnicityhipChange}
                                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                    >
                                        <option value="">{t("other.Choose")}</option>
                                        {ethnicities.map((ethnicity) => (
                                        <option key={ethnicity.id} value={ethnicity.id}>
                                            {ethnicity.name}
                                        </option>
                                        ))}
                                        <option disabled>──────────</option>
                                        <option value="new" className="font-medium text-blue-500">
                                            {t("other.Add")}
                                        </option>
                                    </select>
                                </div>
                                {showModalEthnicity && (
                                    <div className="fixed inset-0 z-10 overflow-y-auto">
                                        <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                                <div className="absolute inset-0 bg-gray-300 opacity-75"></div>
                                            </div>
                                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                                            <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                                            <div>
                                                <div className="mt-3 text-center sm:mt-5">
                                                    <h3 className="text-lg font-medium leading-6 text-gray-900">{t("other.Add")} - {t("Ethnicity")}</h3>
                                                    <div className="mt-2">
                                                        <input
                                                        type="text"
                                                        name="newethnicity"
                                                        id="newethnicity"
                                                        value={newEthnicity}
                                                        onChange={handleNewEthnicityChange}
                                                        className="block w-full px-3 py-2 mt-2 mb-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-between mt-5 sm:mt-6">
                                                    <button
                                                        type="button"
                                                        className="inline-block w-full py-2 text-base font-medium text-white border border-transparent rounded-md shadow-sm bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 sm:text-sm disabled:opacity-50"
                                                        disabled={!selectedEthnicity && !newEthnicity}
                                                        onClick={handleNewEthnicitySubmit}
                                                    >
                                                        {t("other.Submit")}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="inline-block w-full px-4 py-2 ml-2 text-base font-medium text-gray-700 bg-gray-200 border border-transparent rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:text-sm"
                                                        onClick={handleCloseModalEthnicity}
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

                            {/* Nationality */}
                            <div className="col-span-1 px-3 py-3 mt-3 md:col-span-1">
                                <label htmlFor="" className="block text-sm font-medium leading-6 text-gray-900">
                                    {t("Nationality")}
                                </label>
                                <div className="relative mt-2">
                                    <select
                                        id="nationality"
                                        value={selectedNationality}
                                        onChange={handleNationalityChange}
                                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                    >
                                        <option value="">{t("other.Choose")}</option>
                                        {nationalities.map((nationality) => (
                                        <option key={nationality.id} value={nationality.id}>
                                            {nationality.name}
                                        </option>
                                        ))}
                                        <option disabled>──────────</option>
                                        <option value="new" className="font-medium text-blue-500">
                                            {t("other.Add")}
                                        </option>
                                    </select>
                                </div>
                                {showModalNationality && (
                                    <div className="fixed inset-0 z-10 overflow-y-auto">
                                        <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                                <div className="absolute inset-0 bg-gray-300 opacity-75"></div>
                                            </div>
                                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                                            <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                                            <div>
                                                <div className="mt-3 text-center sm:mt-5">
                                                    <h3 className="text-lg font-medium leading-6 text-gray-900">{t("other.Add")} - {t("Nationality")}</h3>
                                                    <div className="mt-2">
                                                        <input
                                                        type="text"
                                                        name="newnationality"
                                                        id="newnationality"
                                                        value={newNationality}
                                                        onChange={handleNewNationalityChange}
                                                        className="block w-full px-3 py-2 mt-2 mb-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-between mt-5 sm:mt-6">
                                                    <button
                                                        type="button"
                                                        className="inline-block w-full py-2 text-base font-medium text-white border border-transparent rounded-md shadow-sm bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 sm:text-sm disabled:opacity-50"
                                                        disabled={!selectedNationality && !newNationality}
                                                        onClick={handleNewNationalitySubmit}
                                                    >
                                                        {t("other.Submit")}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="inline-block w-full px-4 py-2 ml-2 text-base font-medium text-gray-700 bg-gray-200 border border-transparent rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:text-sm"
                                                        onClick={handleCloseModalNationality}
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

                            {/* Religion */}
                            <div className="col-span-1 px-3 py-3 mt-3 md:col-span-1">
                                <label htmlFor="" className="block text-sm font-medium leading-6 text-gray-900">
                                    {t("Religion")}
                                </label>
                                <div className="relative mt-2">
                                    <select
                                        id="religion"
                                        value={selectedReligion}
                                        onChange={handleReligionChange}
                                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                    >
                                        <option value="">{t("other.Choose")}</option>
                                        {religions.map((religion) => (
                                        <option key={religion.id} value={religion.id}>
                                            {religion.name}
                                        </option>
                                        ))}
                                        <option disabled>──────────</option>
                                        <option value="new" className="font-medium text-blue-500">
                                            {t("other.Add")}
                                        </option>
                                    </select>
                                </div>
                                {showModalReligion && (
                                    <div className="fixed inset-0 z-10 overflow-y-auto">
                                        <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                                <div className="absolute inset-0 bg-gray-300 opacity-75"></div>
                                            </div>
                                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                                            <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                                            <div>
                                                <div className="mt-3 text-center sm:mt-5">
                                                    <h3 className="text-lg font-medium leading-6 text-gray-900">{t("other.Add")} - {t("Religion")}</h3>
                                                    <div className="mt-2">
                                                        <input
                                                        type="text"
                                                        name="newreligion"
                                                        id="newreligion"
                                                        value={newReligion}
                                                        onChange={handleNewReligionChange}
                                                        className="block w-full px-3 py-2 mt-2 mb-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-between mt-5 sm:mt-6">
                                                    <button
                                                        type="button"
                                                        className="inline-block w-full py-2 text-base font-medium text-white border border-transparent rounded-md shadow-sm bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 sm:text-sm disabled:opacity-50"
                                                        disabled={!selectedReligion && !newReligion}
                                                        onClick={handleNewReligionSubmit}
                                                    >
                                                        {t("other.Submit")}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="inline-block w-full px-4 py-2 ml-2 text-base font-medium text-gray-700 bg-gray-200 border border-transparent rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:text-sm"
                                                        onClick={handleCloseModalReligion}
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

                            {/* Household */}
                            <div className="col-span-1 px-3 py-3 mt-3 md:col-span-1">
                                <label htmlFor="householdId" className="block text-sm font-medium leading-6 text-gray-900">
                                    {t("HouseholdNo")}
                                </label>
                                <div className="relative mt-2">
                                    <input
                                        type="text"
                                        id="searchTerm"
                                        name="searchTerm"
                                        // value={selectedHousehold ? selectedHousehold.id : ""}
                                        value={selectedHousehold || searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                    />
                                    {searchTerm && !selectedHousehold && (
                                        <ul className="absolute z-10 w-full mt-1 bg-white border rounded-md">
                                            {households.map((household) => (
                                                <li
                                                    key={household.id}
                                                    onClick={() => handleSelectHousehold(household.id)}
                                                    className="px-2 py-1 cursor-pointer hover:bg-gray-200"
                                                >
                                                    {household.household_no}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {/* {selectedHousehold && <p>Selected Household ID: {selectedHousehold}</p>} */}
                                    {selectedHousehold && (
                                    <div>
                                        <button
                                        className="text-sm text-gray-500 underline hover:text-gray-700 focus:outline-none focus:underline"
                                        onClick={() => setSelectedHousehold(null)}
                                        >
                                        {t("filter.Search")}
                                        </button>
                                    </div>
                                    )}
                                </div>
                            </div>

                            {/* resident */}
                            <div className="col-span-1 px-3 py-3 mt-3 md:col-span-1">
                                <label htmlFor="resident" className="block text-sm font-medium leading-6 text-gray-900">
                                    resident
                                </label>
                                <div className="mt-2">
                                    <select
                                    name="resident" 
                                    value={resident}
                                    onChange={(e) => setResident(e.target.value)} 
                                    className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                    >
                                    <option value="">Select resident</option>
                                    <option value="ရှိ">ရှိ</option>
                                    <option value="နိုင်ငံခြား">နိုင်ငံခြား</option>
                                    <option value="အခြား">အခြား</option>
                                    </select>
                                </div>
                            </div>
                            
                            {/* Remark */}
                            <div className="col-span-1 px-3 py-3 mt-3 md:col-span-1">
                                <label htmlFor="remark" className="block text-sm font-medium leading-6 text-gray-900">
                                    {t("Remarks")}
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        id="remark"
                                        value={remark}
                                        onChange={(e) => setRemark(e.target.value)}
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
        ...(await serverSideTranslations(locale, ["common"])),
      },
    };
}