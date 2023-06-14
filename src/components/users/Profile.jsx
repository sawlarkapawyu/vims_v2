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
            <div className="py-24 bg-white sm:py-32">
                <div className="px-4 py-4 mx-auto max-w-7xl lg:px-8">
                    <div className="max-w-2xl mx-auto space-y-16 divide-y divide-gray-100 lg:mx-0 lg:max-w-none">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
                            
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2 lg:gap-8">
                                <div className="p-10 rounded-2xl bg-gray-50">
                                    <h3 className="text-base font-semibold leading-7 text-gray-900">{t("profile.Email")}</h3>
                                    <dl className="mt-3 space-y-1 text-sm leading-6 text-gray-600">
                                        <div>
                                            <dt className="sr-only">Email</dt>
                                            <dd>
                                            <input
                                                id="email" 
                                                type="text" 
                                                value={session.user.email} 
                                                disabled
                                                autoComplete="email"
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                                <div className="p-10 rounded-2xl bg-gray-50">
                                    <h3 className="text-base font-semibold leading-7 text-gray-900">{t("profile.FullName")}</h3>
                                    <dl className="mt-3 space-y-1 text-sm leading-6 text-gray-600">
                                        <div>
                                            <dt className="sr-only">FullName</dt>
                                            <dd>
                                            <input
                                                type="text"
                                                name="full_name"
                                                id="full_name"
                                                value={full_name || ''}
                                                onChange={(e) => setFullname(e.target.value)}
                                                autoComplete="full_name"
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                                <div className="p-10 rounded-2xl bg-gray-50">
                                    <h3 className="text-base font-semibold leading-7 text-gray-900">{t("profile.Username")}</h3>
                                    <dl className="mt-3 space-y-1 text-sm leading-6 text-gray-600">
                                        <div>
                                            <dt className="sr-only">Username</dt>
                                            <dd>
                                            <input
                                                type="text"
                                                name="username"
                                                id="username"
                                                value={username || ''}
                                                onChange={(e) => setUsername(e.target.value)}
                                                autoComplete="given-name"
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                                <div className="p-10 rounded-2xl bg-gray-50">
                                    <h3 className="text-base font-semibold leading-7 text-gray-900">{t("profile.Website")}</h3>
                                    <dl className="mt-3 space-y-1 text-sm leading-6 text-gray-600">
                                        <div>
                                            <dt className="sr-only">Website</dt>
                                            <dd>
                                            <input
                                                type="url"
                                                name="website"
                                                id="website"
                                                value={website || ''}
                                                onChange={(e) => setWebsite(e.target.value)}
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                placeholder="www.example.com"
                                                />
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                            <div className="text-center">
                                <h2 className="py-4 text-3xl font-bold tracking-tight text-gray-900">{t("profile.UserImage")}</h2>
                                <div className="inline-block p-2 border border-gray-300">
                                    <Avatar
                                    uid={user.id}
                                    url={avatar_url}
                                    size={150}
                                    onUpload={(url) => {
                                        setAvatarUrl(url)
                                        updateProfile({ username, website, avatar_url: url })
                                    }}
                                    />
                                </div>
                            </div>
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
        </div>
        


    )
}


