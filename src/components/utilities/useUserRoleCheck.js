import React, { useEffect, useState } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';

export function useUserRoleCheck() {
  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    async function checkUserRole() {
      try {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*, roles(name)')
          .eq('id', user?.id)
          .single();

        if (userError) {
          throw new Error(userError.message);
        }

        if (userData?.roles?.name === 'Super Admin' || userData?.roles?.name === 'Village Officer') {
          // User has the required role
        } else {
          setAlertMessage('User does not have the required role');
          router.push('/login'); // Redirect to the login page
        }
      } catch (error) {
        console.error('Error checking user role:', error.message);
        setAlertMessage('Error checking user role');
        router.push('/');
      }
    }

    if (user) {
      checkUserRole();
    } else {
      setAlertMessage('User not logged in');
      router.push('/login');
    }
  }, [user, router, supabase]);

  return <div>{alertMessage && <p>{alertMessage}</p>}</div>;
}