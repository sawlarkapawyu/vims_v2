import Link from "next/link";
import { useState, useEffect } from 'react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import Avatar from '/src/components/users/Avatar'
import { useTranslation } from "next-i18next";

export default function UserProfile( { session } ) {

    const supabase = useSupabaseClient()
    const user = useUser()
    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState(null)
    const [full_name, setFullname] = useState(null)
    const [website, setWebsite] = useState(null)
    const [avatar_url, setAvatarUrl] = useState(null)
    const { t } = useTranslation("");
    useEffect(() => {
        getProfile()
    }, [session])

    async function getProfile() {
        try {
            setLoading(true)

            let { data, error, status } = await supabase
            .from('profiles')
            .select(`username, full_name, website, avatar_url`)
            .eq('id', user.id)
            .single()

            if (error && status !== 406) {
            throw error
            }

            if (data) {
            setUsername(data.username)
            setFullname(data.full_name)
            setWebsite(data.website)
            setAvatarUrl(data.avatar_url)
            }
        } catch (error) {
            alert('Error loading user data!')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    async function updateProfile({ username, full_name, website, avatar_url }) {
        try {
            setLoading(true)

            const updates = {
            id: user.id,
            username,
            full_name,
            website,
            avatar_url,
            updated_at: new Date().toISOString(),
            }

            let { error } = await supabase.from('profiles').upsert(updates)
            if (error) throw error
            alert('Profile updated!')
        } catch (error) {
            alert('Error updating the data!')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flow-root mt-8">
            
                <div className="px-4 py-4 mx-auto max-w-7xl lg:px-8">
                    <div className="max-w-2xl mx-auto space-y-16 divide-y divide-gray-100 lg:mx-0 lg:max-w-none">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
                            <p>Hello</p>
                            
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-end px-4 py-4 border-t gap-x-6 border-gray-900/10 sm:px-8">
                    <button type="button" 
                        onClick={() => supabase.auth.signOut()}
                        className="text-sm font-semibold leading-6 text-gray-900">
                        {t("profile.SignOut")}
                    </button>
                    <button
                        onClick={() => updateProfile({ username,full_name, website, avatar_url })}
                        disabled={loading}
                        className="px-3 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                    {loading ? 'Loading ...' : t('profile.Update')}
                    
                    </button>
                </div>
           
        </div>
        


    )
}


