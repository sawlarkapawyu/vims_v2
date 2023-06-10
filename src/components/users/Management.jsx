import Link from "next/link";
import { useState, useEffect } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useTranslation } from "next-i18next";
import ImageUser from '/src/components/users/Image';
import Image from 'next/image';
import { formatDate, classNames } from '/src/components/utilities/tools.js';

export default function UserManagement() {
  const supabase = useSupabaseClient();
  const { t } = useTranslation("");
  const user = useUser();
  const [people, setPeople] = useState([]);
  const userImage = "/images/users/avatar-4.png";
  const [loading, setLoading] = useState(true);
  const [editedRoles, setEditedRoles] = useState({});
  const [roles, setRoles] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, created_at, email, roles (id, name)');

        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url');

        if (usersError) {
          throw new Error(usersError.message);
        }

        if (profilesError) {
          throw new Error(profilesError.message);
        }

        // Merge user and profiles data based on the common ID
        const users = usersData.map((user) => {
          const profile = profilesData.find((profile) => profile.id === user.id);
          return {
            ...user,
            profile,
          };
        });

        setPeople(users);
      } catch (error) {
        console.error('Error fetching users:', error.message);
        // Handle the error or show an error message
      } finally {
        setLoading(false);
      }
    }

    async function fetchRoles() {
      try {
        const { data: rolesData, error: rolesError } = await supabase
          .from('roles')
          .select('id, name');

        if (rolesError) {
          throw new Error(rolesError.message);
        }

        setRoles(rolesData);
      } catch (error) {
        console.error('Error fetching roles:', error.message);
        // Handle the error or show an error message
      }
    }

    if (user) {
      fetchUsers();
      fetchRoles();
    }
  }, [user, supabase]);

  if (loading) {
    return <div>Loading...</div>;
  }

  function handleRoleEdit(userId, roleId) {
    setEditedRoles((prevEditedRoles) => ({
      ...prevEditedRoles,
      [userId]: roleId,
    }));
  }

  async function handleSave() {
    const confirmed = window.confirm('Are you sure you want to change this user?');
    if (!confirmed) {
      return;
    }
    try {
      setIsSaving(true);
      await Promise.all(
        Object.entries(editedRoles).map(async ([userId, roleId]) => {
          await supabase.from('users').update({ role_id: roleId }).eq('id', userId);
        })
      );

      setEditedRoles({});
      refresh(); // Call the refresh function after saving
    } catch (error) {
      console.error('Error updating roles:', error.message);
      // Handle the error or show an error message
    } finally {
      setIsSaving(false);
    }
  }
  
  async function handleDelete(userId) {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (!confirmed) {
      return;
    }
    try {
      // Fetch the user's avatar URL from the profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', userId)
        .single();
  
      if (profileError) {
        throw new Error(profileError.message);
      }
  
      const avatarUrl = profileData?.avatar_url;
  
      if (avatarUrl) {
        // Extract the file name from the avatar URL
        const fileName = avatarUrl.split('/').pop();
  
        // Delete the avatar file using the Supabase Storage API
        await supabase.storage.from('avatars').remove([fileName]);
      }
  
      // Proceed with deleting the user and related data
      await supabase.from('users').delete().eq('id', userId);
      await supabase.from('profiles').delete().eq('id', userId);

      await supabase.auth.deleteUser(userId);
      
      if (error) {
        console.error('Error deleting user:', error.message);
      } else {
        console.log('User deleted successfully.');
      }




      console.log('User and related data deleted successfully.');
    } catch (error) {
      console.error('Error deleting user and related data:', error.message);
      // Handle the error or show an error message
    }
  }

  async function refresh() {
    setLoading(true);
    try {
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, created_at, email, roles (id, name: name)');

      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url');

      if (usersError) {
        throw new Error(usersError.message);
      }

      if (profilesError) {
        throw new Error(profilesError.message);
      }

      // Merge user and profiles data based on the common ID
      const users = usersData.map((user) => {
        const profile = profilesData.find((profile) => profile.id === user.id);
        return {
          ...user,
          profile,
        };
      });

      setPeople(users);
    } catch (error) {
      console.error('Error fetching users:', error.message);
      // Handle the error or show an error message
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <div className="flow-root mt-8">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                  {t("user.No")}
                </th>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                {t("user.Name")}
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                {t("user.Role")}
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                {t("user.Created")}
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                {t("user.Action")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {people.map((person, index) => (
                <tr key={person.id}>
                  <td className="px-3 py-5 text-sm text-gray-500 whitespace-nowrap">{index + 1}</td>
                  <td className="py-5 pl-4 pr-3 text-sm whitespace-nowrap sm:pl-0">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-11 w-11">
                          {person.profile?.avatar_url ? (
                            <ImageUser
                              className="rounded-full h-11 w-11"
                              url={person.profile.avatar_url}
                              size={40}
                            />
                          ) : (
                            <Image
                              className="rounded-full h-11 w-11"
                              src={userImage}
                              width={44}
                              height={44}
                              alt=""
                            />
                          )}
                        </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{person.profile?.full_name}</div>
                        <div className="mt-1 text-gray-500">{person.profile ? person.email : 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-5 text-sm text-gray-500 whitespace-nowrap">
                    <select
                      className="block w-full py-1.5 px-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={editedRoles[person.id] || person.roles?.id || ''}
                      onChange={(e) => handleRoleEdit(person.id, e.target.value)}
                    >
                      <option value="">N/A</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-5 text-sm text-gray-500 whitespace-nowrap">
                    {formatDate(person.created_at)}
                  </td>
                  <td className="px-3 py-5 text-sm text-gray-500 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {editedRoles[person.id] ? (
                        <div>
                          <button
                            className="px-4 py-1 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
                            onClick={handleSave}
                            disabled={isSaving}
                          >
                            {isSaving ? 'Saving...' :  t("user.Save")}
                          </button>
                        </div>
                      ) : null}
                      <div>
                        <button
                          className="px-4 py-1 font-semibold text-white bg-red-500 rounded hover:bg-red-600"
                          onClick={() => handleDelete(person.id)}
                        >
                           {t("user.Delete")}
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}