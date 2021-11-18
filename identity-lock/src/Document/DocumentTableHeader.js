import { PlusIcon } from "@heroicons/react/outline"


export const DocumentTableHeader = ({count}) => {

    return (
        <div className="flex flex-col px-5 mx-10 w-full mt-2">
            <div className="overflow-hidden rounded-t-lg bg-blue-800 flex flex-row justify-between h-20">
                <div className="text-white text-2xl text-left ml-5 my-auto font-bold">{`Uploaded Documents (${count})`}</div>
                <button
                    type="button"
                    onClick={() => console.log("clicked")}
                    className="bg-white-800 p-1 mr-5 my-auto rounded-full hover:bg-gray-800"
                >
                    <PlusIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </button>
            </div>
        </div>
    )
}