
export const Profile = ({user}) => {
    return (
        <div>
            <div className="mt-5 border-t border-white-200">
                <dl className="sm:divide-y sm:divide-white-200">
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-white-500">Full name</dt>
                        <dd className="mt-1 text-sm text-white-900 sm:mt-0 sm:col-span-2">{user.name}</dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-white-500">Email address</dt>
                        <dd className="mt-1 text-sm text-white-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-white-500">Nickname</dt>
                        <dd className="mt-1 text-sm text-white-900 sm:mt-0 sm:col-span-2">{user.nickname}</dd>
                    </div>
                </dl>
            </div>
        </div>
    )
}
