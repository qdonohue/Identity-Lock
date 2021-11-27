import React, { useState } from 'react';

import AsyncSelect from 'react-select/async';

const options = [
    { value: "Quinn Donohue", label: "Quinn Donohue" },
    { value: "Amory Donohue", label: "Amory Donohue" },
    { value: "Will Donohue", label: "Will Donohue" },
    { value: "Scott Donohue", label: "Scott Donohue" },
]

export const ContactSelect = () => {
    const [inputValue, setInputValue] = useState(null)

    const loadOptions = async (inputValue) => {
        return options
    }

    return (
        <AsyncSelect className="w-full"
            isMulti
            cacheOptions
            defaultOptions
            loadOptions={loadOptions}
            onInputChange={(input) => setInputValue(input)}
        />
    );
}