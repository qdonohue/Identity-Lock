import { SearchIcon } from '@heroicons/react/solid'

export const ContactTableHeader = ({ count, search }) => {

    const searchContacts = (val) => {
        search(val.target.value)
    }

    return (
        <div className="flex flex-col px-5 mx-10 w-full mt-2">
            <div className="overflow-hidden rounded-t-lg bg-blue-800 flex flex-row justify-between h-20">
                <div className="text-white text-2xl text-left ml-5 my-auto font-bold">{`Contacts (${count})`}</div>
                <div className="relative rounded-md shadow-sm my-auto w-1/2 mr-5">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                        name="search"
                        id="search"
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-2xl border-gray-300 rounded-md"
                        placeholder="Search all contacts"
                        onChange={searchContacts}
                    />
                </div>
            </div>
        </div>
    )
}