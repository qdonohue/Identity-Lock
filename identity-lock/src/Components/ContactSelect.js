import React, { useState } from 'react';

import AsyncSelect from 'react-select/async';

const options = [
    { value: "Quinn Donohue", label: "Quinn Donohue" },
    { value: "Amory Donohue", label: "Amory Donohue" },
    { value: "Will Donohue", label: "Will Donohue" },
    { value: "Scott Donohue", label: "Scott Donohue" },
]

export const ContactSelect = ({setSharedList}) => {

    const loadOptions = async (inputValue) => {
        return options
    }

    const manageChange = (selected) => {
        setSharedList(selected)
    }

    return (
        <AsyncSelect className="w-full"
            isMulti
            cacheOptions
            defaultOptions
            loadOptions={loadOptions}
            onChange={manageChange}
            onInputChange={manageChange}
        />
    );
}