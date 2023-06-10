import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image';
import { AuthLayout } from '@/components/AuthLayout'
import { Button } from '@/components/Button'
import { TextField } from '@/components/Fields'
import { Logo } from '@/components/Logo'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { HCaptcha } from '@hcaptcha/react-hcaptcha'; // Import hCaptcha component

export default function Login() {
  const supabaseClient = useSupabaseClient()
  const user = useUser()
  const router = useRouter();

  const [data, setData] = useState()
  const logo = "/images/logo.png";

  useEffect(() => {
    async function loadData() {
      const { data } = await supabaseClient.from('test').select('*')
      setData(data)
    }
    // Only run query once user is logged in.
    if (user) loadData()
  }, [user])

  // Callback function for hCaptcha verification
  const handleHcaptchaVerify = async (token) => {
    const response = await fetch(`/api/verify-hcaptcha?apikey=7511e771-9dcc-4936-8506-4368eb00a3f1&token=${token}`);
    const data = await response.json();
    console.log(data);
  }

  return (
    <>
      <Head>
        <title>Sign In - VIMS</title>
      </Head>
      <AuthLayout>
        <div className="flex flex-col">
          <Link href="/" passHref>
            <div className="flex flex-col items-center">
              <Image
                src={logo}
                alt="Logo"
                width={80}
                height={10}
              />
              <p className="mt-2 text-sm font-semibold text-gray-900">
                Village Information Management System
              </p>
            </div>
          </Link>
          <div className="mt-20">
            <h2 className="text-lg font-semibold text-gray-900">
              Sign in to your account
            </h2>
          </div>
        </div>
        {user ? (
          <div>
            {/* User is logged in */}
            <p>Welcome, {user.email}</p>
            <Button onClick={() => supabaseClient.auth.signOut()}>Sign Out</Button>
          </div>
        ) : (
          <Auth
            redirectTo={router.asPath}
            supabaseClient={supabaseClient}
            providers={['google', 'facebook', 'github']}
            socialLayout="horizontal"
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#1E90FF',
                    brandAccent: '#00BFFF',
                  },
                },
              },
            }}
            // Custom render function to include hCaptcha
            customComponents={{
              postSocial: () => (
                <div>
                  <p>Complete hCaptcha to continue</p>
                  <HCaptcha
                    sitekey="7511e771-9dcc-4936-8506-4368eb00a3f1"
                    onVerify={handleHcaptchaVerify}
                  />
                </div>
              ),
            }}
          />
        )}
      </AuthLayout>
    </>
  )
}