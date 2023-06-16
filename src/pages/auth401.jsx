import React from 'react';
import Image from 'next/image';
import logo from '/src/images/logos/logo.png';
import Link from 'next/link';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';

const Auth401Page = () => {
  const user = useUser();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <Link href="/">
          <div className="logo">
            <Image className="w-auto h-20 mx-auto" src={logo} alt="Logo" />
            <h1 className="text-sm">Village Information Management System - VIMS</h1>
          </div>
        </Link>
        <div className="unauthorized-content">
          <h2 className="text-4xl font-bold">401 Unauthorized</h2>
          <p className="mb-4 text-lg">Sorry, you do not have authorization to access this page.</p>
          <button
            className="block px-3 py-2 mx-auto text-sm leading-6 text-gray-900"
            onClick={async () => {
              await supabaseClient.auth.signOut();
              router.push('/');
            }}
          >
            Please Sign Out and connect with an authorized account.
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth401Page;