import React, { useEffect } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';

export function useUserRoleCheckIsAdmin() {
  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();

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

        if (userData?.roles?.name === 'Super Admin') {
        } else {
          console.log('User does not have the required role');
          router.push('/login'); // Redirect to the register page
        }
      } catch (error) {
        console.error('Error checking user role:', error.message);
        router.push('/');
      }
    }

    if (user) {
      checkUserRole();
    } else {
      router.push('/login');
    }
  }, [user, router, supabase]);

  return null;
}