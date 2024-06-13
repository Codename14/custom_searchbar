'use client';
import { useSearchContext } from '@/context/SearchContext';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';

export default function SearchBar({ searchResults }: { searchResults: SnomedConceptType[] }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { setSelectedSearchItem } = useSearchContext();
    const [isLoading, setIsLoading] = useState(false);

    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
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

    useEffect(() => {
        setIsLoading(false);
    }, [searchParams]);

    // console.log('searchResults', searchResults);

    const filteredResults = searchResults.filter((result: SnomedConceptType) => result.pt.term.toLowerCase().includes(watch('term').toLowerCase()));

    const haveParams = searchParams.get('limit') && searchParams.get('term');
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
                <div className='flex gap-2 search-limit'>
                    <p>Search Limit</p>
                    <input className='search__slider' {...register('limit')} type='range' min={1} max={40} />
                    <p className='w-8'>{limitValue}</p>
                </div>
                <div className={`search-item ${isLoading ? 'loading' : ''}`}>
                    <div className='flex gap-2'>
                        <input
                            className='search__input'
                            onKeyDown={(event) => {
                                if (event.key === 'Escape') {
                                    event.currentTarget.blur();
                                }
                            }}
                            {...register('term', {
                                required: 'Please enter a search term',
                                minLength: { value: 2, message: 'Please enter at least 2 characters' },
                            })}
                            placeholder='Type for search...'
                        />
                        <button className='search__button' type='submit'>
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
                        {filteredResults.map((result: SnomedConceptType) => (
                            <li key={result.id}>
                                <button
                                    type='button'
                                    onClick={() => {
                                        setValue('term', result.pt.term),
                                            setSelectedSearchItem(result.id),
                                            console.log('clicked', result.id, result.pt.term);
                                    }}
                                    className='result__item'
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
