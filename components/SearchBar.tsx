'use client';
import { useSearchContext } from '@/context/SearchContext';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';

export default function SearchBar({ searchResults }: { searchResults: SnomedConceptType[] }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { setSelectedSearchItem } = useSearchContext();
    const [isLoading, setIsLoading] = useState(false);

    const [selectedIndex, setSelectedIndex] = useState<number>(-1);
    const activeItemRef = useRef<HTMLButtonElement>(null);

    //Form
    const {
        handleSubmit,
        register,
        formState: { errors },
        watch,
        setValue,
        setError,
    } = useForm({ defaultValues: { term: searchParams.get('') ?? '', limit: searchParams.get('limit') ?? '10' } });
    const limitValue = watch('limit');

    const onSubmit = async (data: FieldValues) => {
        console.log('data', data);
        // console.log('url change');
        if (searchParams.get('term') !== data?.term || searchParams.get('limit') !== data?.limit) {
            setIsLoading(true);
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.set('term', data?.term);
            newSearchParams.set('limit', data?.limit);
            router.replace('?' + newSearchParams.toString());
        }
        if (searchParams.get('term') === data?.term && searchParams.get('limit') === data?.limit) {
            setError('term', {
                type: 'manual',
                message: "The search parameters haven't changed.",
            });
        }
    };

    //scrolling effect
    useEffect(() => {
        if (activeItemRef.current) {
            activeItemRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }
    }, [selectedIndex]);

    useEffect(() => {
        setIsLoading(false);
    }, [searchParams]);

    //List keyboard events
    const handleArrowKeys = (event: any) => {
        let newIndex: number;
        //checking if the index is out of bounds
        if (selectedIndex > filteredResults.length) {
            setSelectedIndex(0);
        }

        if (event.key === 'Escape') {
            event.currentTarget.blur();
        } else if (event.key === 'ArrowDown') {
            newIndex = selectedIndex < filteredResults.length - 1 ? selectedIndex + 1 : -1;
            setSelectedIndex(newIndex);
        } else if (event.key === 'ArrowUp') {
            newIndex = selectedIndex > -1 ? selectedIndex - 1 : filteredResults.length - 1;
            setSelectedIndex(newIndex);
        } else if (event.key === 'Enter' && selectedIndex >= 0 && filteredResults.length > 0 && selectedIndex < filteredResults.length) {
            //setting the value of the input
            if (selectedIndex >= 0) {
                handleSelect({ result: filteredResults[selectedIndex] });
                event.preventDefault();
                event.currentTarget.blur();
            }
            setSelectedIndex(-1);
        }
    };
    const handleSelect = ({ result }: { result: SnomedConceptType }) => {
        setValue('term', result.pt.term), setSelectedSearchItem(result.id);
    };

    const filteredResults = searchResults.filter((result: SnomedConceptType) => result.pt.term.toLowerCase().includes(watch('term').toLowerCase()));

    const haveParams = searchParams.get('limit') && searchParams.get('term');
    return (
        <>
            {/* <p>Selected: {selectedIndex}</p>
            <p>Length: {filteredResults.length}</p> */}
            <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
                <div className='flex gap-2 search-limit'>
                    <p>Search Limit</p>
                    <input className='search__slider' {...register('limit')} type='range' min={1} max={40} />
                    <p className='w-8'>{limitValue}</p>
                </div>
                <div className={`search-item ${isLoading ? 'loading' : ''}`}>
                    <div className='flex gap-2'>
                        <input
                            className={`search__input ${selectedIndex === -1 ? 'selected' : ''}`}
                            onKeyDown={(event) => {
                                handleArrowKeys(event);
                            }}
                            {...register('term', {
                                required: 'Please enter a search term',
                                minLength: { value: 2, message: 'Please enter at least 2 characters' },
                            })}
                            placeholder='Type for search...'
                        />
                        <button className='search__button' type='submit' disabled={isLoading}>
                            Search
                        </button>
                    </div>
                    {filteredResults.length === 0 && haveParams && !isLoading && (
                        <div className='relative cursor-default select-none py-2 px-4'>
                            <p>No records found</p>
                            <p className='text-sm'>Please type and press enter to search</p>
                        </div>
                    )}
                    {isLoading && <p className='loading__message py-6'>Data fetching...</p>}
                    {errors.term?.message && <p className='text-red-500 absolute top-1 left-4 backdrop-blur-2xl text-xs'>{errors.term?.message}</p>}
                    {!haveParams && !isLoading && <p className='text-left mt-2 text-sm py-1 px-2  pl-4 '>Press type and enter to search</p>}
                    <ul className='search__result-wrapper'>
                        {filteredResults.map((result: SnomedConceptType, i: number) => (
                            <li key={result.id}>
                                <button
                                    type='button'
                                    onClick={() => handleSelect({ result })}
                                    className={`result__item ${selectedIndex === i ? 'selected' : ''}`}
                                    ref={selectedIndex === i ? activeItemRef : null}
                                >
                                    {result.pt.term.split(' ').map((word: string, index: number) => {
                                        const match = word.toLowerCase().includes(searchParams.get('term')!.toLowerCase());
                                        return (
                                            <span key={index}>
                                                {match ? <strong>{word}</strong> : word}
                                                {index < result.pt.term.split(' ').length - 1 ? ' ' : ''}
                                            </span>
                                        );
                                    })}
                                </button>
                            </li>
                        ))}
                    </ul>
                    {haveParams && (
                        <p className=' text-left mt-2 text-sm pt-1 px-2  pl-4 '>
                            Results: <span className={``}>{isLoading ? '...' : filteredResults.length}</span>
                        </p>
                    )}
                </div>
            </form>
        </>
    );
}
