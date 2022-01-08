
export const AlertTableHeader = ({count}) => {

    return (
        <div className="flex flex-col px-5 mx-10 w-full mt-2">
            <div className="overflow-hidden rounded-t-lg bg-blue-800 flex flex-row h-20">
                <div className="text-white text-2xl text-left ml-5 my-auto font-bold">{`Alerts (${count})`}</div>
            </div>
        </div>
    )
}