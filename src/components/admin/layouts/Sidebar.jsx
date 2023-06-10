import { Fragment, useState, useEffect } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  HomeIcon,
  HomeModernIcon,
  Squares2X2Icon,
  StarIcon,
  UserGroupIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import Image from 'next/image';
import logo from '/src/images/logos/logo.png';
import { useRouter } from "next/router";
import LocaleSwitcher from "./locale-switcher";
import { useTranslation } from "next-i18next";
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import UserImage from '/src/components/users/UserImage'
import Link from "next/link";

export default function Sidebar({children}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const router = useRouter();
    const user = useUser()
    const supabaseClient = useSupabaseClient()
    const { t } = useTranslation("");
    const user_image = "/images/users/avatar-4.png";

    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState(null);
    const [full_name, setFullname] = useState(null);
    const [avatar_url, setAvatarUrl] = useState(null);
    
    useEffect(() => {
      const fetchUserProfile = async () => {
        if (user) {
          setLoading(true);
          const { data, error } = await supabaseClient
            .from('profiles')
            .select(`username, full_name, avatar_url`)
            .eq('id', user.id)
            .single();
  
          if (error) {
            console.error('Error fetching user profile:', error);
          } else {
            setUsername(data?.username || null);
            setFullname(data?.full_name || null);
            setAvatarUrl(data?.avatar_url || null);
          }
  
          setLoading(false);
        }
      };
  
      fetchUserProfile();
    }, [user, supabaseClient]);
    
    useEffect(() => {
      let dir = router.locale == "mm" ? "mm" : "mm";
      let lang = router.locale == "mm" ? "mm" : "en";
      document.querySelector("html").setAttribute("dir", dir);
      document.querySelector("html").setAttribute("lang", lang);
    }, [router.locale]);
    
    function classNames(...classes) {
      return classes.filter(Boolean).join(' ')
    }
    
    const navigation = [
      { name: t('sidebar.Home'), href: '/', icon: HomeIcon },
      { name: t('sidebar.Dashboard'), href: '/admin/dashboard', icon: Squares2X2Icon },
      { name: t('sidebar.Households'), href: '/admin/households', icon: HomeModernIcon },
      { name: t('sidebar.Families'), href: '/admin/families', icon: UserGroupIcon },
      { name: t('sidebar.Deaths'), href: '/admin/deaths', icon: DocumentDuplicateIcon },
      { name: t('sidebar.Disabilities'), href: '/admin/disabilities', icon: StarIcon },
      { name: t('sidebar.Reports'), href: '/admin/reports', icon: ChartPieIcon },
    ];

    return (
      <>
        <div>
          <Transition.Root show={sidebarOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-gray-900/80" />
              </Transition.Child>
  
              <div className="fixed inset-0 flex">
                <Transition.Child
                  as={Fragment}
                  enter="transition ease-in-out duration-300 transform"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition ease-in-out duration-300 transform"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <Dialog.Panel className="relative flex flex-1 w-full max-w-xs mr-16">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-300"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute top-0 flex justify-center w-16 pt-5 left-full">
                        <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                          <span className="sr-only">Close sidebar</span>
                          <XMarkIcon className="w-6 h-6 text-white" aria-hidden="true" />
                        </button>
                      </div>
                    </Transition.Child>
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex flex-col px-6 pb-4 overflow-y-auto bg-sky-600 grow gap-y-5">
                      <Link href="/">
                        <div className="flex items-center h-16 shrink-0">
                          
                            <Image 
                                className="w-auto h-10"
                                src={logo} 
                                alt="Logo" 
                            />
                          
                          <span className='px-2 font-semibold text-left text-white'>{t("sidebar.VIMS")}</span>
                        </div>
                      </Link>
                      <nav className="flex flex-col flex-1">
                        <ul role="list" className="flex flex-col flex-1 gap-y-7">
                          <li>
                            <ul role="list" className="-mx-2 space-y-1">
                              {navigation.map((item) => (
                                <li key={item.name} className={item.href === router.asPath ? 'active' : ''}>
                                  <Link href={`/${router.locale}${item.href}`}
                                    className={classNames(
                                      item.href === router.asPath ? 'bg-sky-700 text-white' : 'text-sky-200 hover:text-white hover:bg-sky-700',
                                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                    )}
                                  >
                                    <item.icon
                                      className={classNames(
                                        item.href === router.asPath ? 'text-white' : 'text-sky-200 group-hover:text-white',
                                        'h-6 w-6 shrink-0'
                                      )}
                                      aria-hidden="true"
                                    />
                                    {item.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </li>
                          
                          <li className="mt-auto">
                            <Link
                              href="/admin/users"
                              className="flex p-2 -mx-2 text-sm font-semibold leading-6 rounded-md text-sky-200 group gap-x-3 hover:bg-sky-700 hover:text-white"
                            >
                              <UserIcon
                                className="w-6 h-6 text-sky-200 shrink-0 group-hover:text-white"
                                aria-hidden="true"
                              />
                              {t("sidebar.UserManagement")}
                            </Link>
                          </li>
                         
                        </ul>
                      </nav>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>
  
          {/* Static sidebar for desktop */}
          <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex flex-col px-6 pb-4 overflow-y-auto bg-sky-600 grow gap-y-5">
              <Link href="/">
                <div className="flex items-center h-16 shrink-0">
                    
                      <Image 
                          className="w-auto h-10"
                          src={logo} 
                          alt="Logo" 
                      />
                  
                    <span className='px-2 text-sm font-semibold text-left text-white'>{t("sidebar.VIMS")}</span>
                </div>
              </Link>
              
              {/* Web */}
              <nav className="flex flex-col flex-1">
                <ul role="list" className="flex flex-col flex-1 gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name} className={item.href === router.asPath ? 'active' : ''}>
                          <Link href={`/${router.locale}${item.href}`}
                            className={classNames(
                              item.href === router.asPath ? 'bg-sky-700 text-white' : 'text-sky-200 hover:text-white hover:bg-sky-700',
                              'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                            )}
                          >
                            <item.icon
                              className={classNames(
                                item.href === router.asPath ? 'text-white' : 'text-sky-200 group-hover:text-white',
                                'h-6 w-6 shrink-0'
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                 
                  <li className="mt-auto">
                    <Link
                      href="/admin/users"
                      className="flex p-2 -mx-2 text-sm font-semibold leading-6 rounded-md text-sky-200 group gap-x-3 hover:bg-sky-700 hover:text-white"
                    >
                      <UserIcon
                        className="w-6 h-6 text-sky-200 shrink-0 group-hover:text-white"
                        aria-hidden="true"
                      />
                      {t("sidebar.UserManagement")}
                    </Link>
                  </li>
                 
                </ul>
              </nav>
            </div>
          </div>
  
          <div className="lg:pl-72">
            <div className="sticky top-0 z-40 flex items-center h-16 px-4 bg-white border-b border-gray-200 shadow-sm shrink-0 gap-x-4 sm:gap-x-6 sm:px-6 lg:px-8">
              <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="w-6 h-6" aria-hidden="true" />
              </button>
  
              {/* Separator */}
              <div className="w-px h-6 bg-gray-900/10 lg:hidden" aria-hidden="true" />
  
              <div className="flex self-stretch flex-1 gap-x-4 lg:gap-x-6">
                <form className="relative flex flex-1" action="#" method="GET">
                  <label htmlFor="search-field" className="sr-only">
                    {t("filter.Search")}
                  </label>
                  <MagnifyingGlassIcon
                    className="absolute inset-y-0 left-0 w-5 h-full text-gray-400 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    id="search-field"
                    className="block w-full h-full py-0 pl-8 pr-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                    placeholder={t("filter.Search")}
                    type="search"
                    name="search"
                  />
                </form>
                
                  <div className="flex items-center gap-x-4 lg:gap-x-6">
                    <LocaleSwitcher/>
                    {/* Separator */}
                    <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" aria-hidden="true" />
                    
                    {!user && (
                    <Link href="/login" legacyBehavior>
                      <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 flex items-center">
                        <ArrowRightOnRectangleIcon className="flex-shrink-0 mr-1 -ml-1 text-gray-400 w-7 h-7" aria-hidden="true" />
                        <span>{t("sidebar.LogIn")}</span>
                      </button>
                    </Link>
                     )}
                  <div>
                </div>
  
                  {/* Separator */}
                  {/* <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" aria-hidden="true" /> */}
  
                  {/* Profile dropdown */}
                  {user && (
                  <Menu as="div" className="relative">
                    <Menu.Button className="-m-1.5 flex items-center p-1.5">
                      <span className="sr-only">Open user menu</span>
                        
                        {avatar_url ? (
                          <UserImage
                            className="w-6 h-6 rounded-full"
                            url={avatar_url ? `/${avatar_url}` : ''}
                            size={30}
                          />
                        ) : (
                          <Image
                            className="w-8 h-8 rounded-full"
                            src={user_image}
                            width={44}
                            height={44}
                            alt=""
                          />
                        )}
                        
                      <span className="hidden lg:flex lg:items-center">
                        <span className="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                          {full_name}
                        </span>
                        <ChevronDownIcon className="w-5 h-5 ml-2 text-gray-400" aria-hidden="true" />
                      </span>
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                        <Menu.Item>
                          <button
                              className="block px-3 py-2 text-sm leading-6 text-gray-900"
                              onClick={async () => {
                                router.push('/admin/users/profile');
                              }}
                            >
                              {t("sidebar.Profile")}
                            </button>
                        </Menu.Item>
                        <Menu.Item>
                          <button
                            className="block px-3 py-2 text-sm leading-6 text-gray-900"
                            onClick={async () => {
                              await supabaseClient.auth.signOut();
                              router.push('/');
                            }}
                          >
                            {t("sidebar.SignOut")}
                          </button>
                        </Menu.Item>
                      </Menu.Items>
                      {/* <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <a
                                href={item.href}
                                className={classNames(
                                  active ? 'bg-gray-50' : '',
                                  'block px-3 py-1 text-sm leading-6 text-gray-900'
                                )}
                                onClick={item.onClick}
                              >
                                {item.name}
                              </a>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items> */}
                    </Transition>
                  </Menu>
                  )}
                </div>
              </div>
            </div>
  
            <main className="py-10">
              <div className="px-4 sm:px-6 lg:px-8">{children}</div>
            </main>
          </div>
        </div>
      </>
    )
}