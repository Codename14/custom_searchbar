'use client';
import React, { createContext, useContext, useState } from 'react';

type SearchContext = {
    selectedSearchItem: string | null;
    setSelectedSearchItem: React.Dispatch<React.SetStateAction<string | null>>;
};

const SearchContext = createContext<SearchContext | null>(null);

export default function SearchContextProvider({ children }: { children: React.ReactNode }) {
    const [selectedSearchItem, setSelectedSearchItem] = useState<string | null>(null); //Search

    return <SearchContext.Provider value={{ selectedSearchItem, setSelectedSearchItem }}>{children}</SearchContext.Provider>;
}

//custom hook for easier access
export function useSearchContext() {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('SearchContext must should be used within a SearchContextProvider');
    } else return context;
}
