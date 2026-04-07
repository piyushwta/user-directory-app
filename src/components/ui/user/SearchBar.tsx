import { useState } from "react";

export const SearchBar = ({ onSearch }: { onSearch: (v: string) => void }) => {
    const [value, setValue] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        console.log("Typing:", val); 
        setValue(val);
        onSearch(val);
    };

    return (
        <input
            value={value}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            placeholder="Search by name or email..."
        />
    );
};