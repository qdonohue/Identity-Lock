/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'

import { Link, useLocation, useHistory } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

import { formatName } from './Utility/name'
import { classNames } from './Utility/tailwindHelper'

import logo from './FullLogo.jpg'
import useNetwork from './Network/useNetwork'

const signedInNavigation = [
    { name: 'Home', path: '/home', id: 1 },
    { name: 'Documents', path: '/documents', id: 2 },
    { name: 'Contacts', path: '/contacts', id: 3 },
    { name: 'Alerts', path: '/alerts', id: 4 },
    { name: 'Tech demo', path: '/test', id: 5 },
]

const signedOutNavigation = [
    { name: 'Home', path: '/home', id: 5 },
    { name: 'Sign up', path: '/signup', id: 6 },
]

export default function NavBar() {
    const { isAuthenticated, user, loginWithPopup, logout } = useAuth0();
    const { registered } = useNetwork()
    const location = useLocation();
    const history = useHistory();

    const formattedName = isAuthenticated && formatName(user.name)

    const navigation = isAuthenticated && registered ? signedInNavigation : signedOutNavigation

    return (
        <Disclosure as="nav" className="bg-gray-800">
            {({ open }) => (
                <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                    <div className="relative flex items-center justify-between h-16">
                        <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                            <div className="flex-shrink-0 flex items-center">
                                <img
                                    className="hidden lg:block h-8 w-auto"
                                    src={logo}
                                    alt="Identity Lock"
                                />
                            </div>
                            <div className="hidden sm:block sm:ml-6">
                                <div className="flex space-x-4">
                                    {navigation.map((item) => (
                                        <Link to={item.path} key={item.id}>
                                            <div
                                                className={classNames(
                                                    item.path == location.pathname ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                    'px-3 py-2 rounded-md text-sm font-medium'
                                                )}
                                                aria-current={item.path == location.pathname ? 'page' : undefined}
                                            >
                                                {item.name}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            {/* <button
                                    type="button"
                                    className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                                >
                                    <span className="sr-only">View notifications</span>
                                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                                </button> */}

                            {/* Profile dropdown */}
                            {isAuthenticated ? (registered ? <Menu as="div" className="ml-3 relative">
                                <div>
                                    <Menu.Button className={'text-gray-300 hover:bg-gray-700 hover:text-white' +
                                        'px-3 py-2 rounded-md text-sm font-medium'}>
                                        <span className="sr-only">Open user menu</span>
                                        <div className="">{formattedName}</div>
                                    </Menu.Button>
                                </div>
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link to={'/profile'}>
                                                    <div onClick={() => { history.push('/profile') }} className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                                                        Profile
                                                    </div>
                                                </Link>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <div onClick={() => { logout(); history.push('/') }} className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                                                    Log out
                                                </div>
                                            )}
                                        </Menu.Item>
                                    </Menu.Items>
                                </Transition>
                            </Menu> : <div onClick={() => {history.push('/signup')}} className={'text-white hover:bg-gray-700 hover:text-white' +
                                'px-3 py-2 rounded-md text-sm font-medium'}>Registration Incomplete</div>
                                ) : <div onClick={loginWithPopup} className={'text-gray-300 hover:bg-gray-700 hover:text-white' +
                                'px-3 py-2 rounded-md text-sm font-medium'}>Log in</div>}
                        </div>
                    </div>
                </div>
            )}
        </Disclosure>
    )
}
