'use client';

import { useSearchContext } from '@/context/SearchContext';

export default function SelectedItem({ searchResults }: { searchResults: any }) {
    const { selectedSearchItem } = useSearchContext();
    // console.log('searchResults', searchResults);

    const result = searchResults?.find((result: any) => result.id === selectedSearchItem);
    return (
        <>
            {result && (
                <div className='data-holder'>
                    <h2 className='text-xl'>Selected item</h2>
                    <div className='flex justify-between  items-start'>
                        <p className='font-semibold'>ID</p>
                        <p className='text-right'>{result.id}</p>
                    </div>
                    <div className='flex justify-between  items-start mt-2'>
                        <p className='font-semibold'>TERM</p>
                        <p className='text-right '>{result.pt.term}</p>
                    </div>
                </div>
            )}
        </>
    );
}
