import SearchBar from '@/components/SearchBar';
import SelectedItem from '@/components/SelectedItem';

async function fetchData({ limit, term }: { limit: string; term: string }) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
        const response = await fetch(`https://api.snowray.app/snowowl/snomedct/SNOMEDCT/concepts?term=${term}&limit=${limit}&expand=pt()`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.SNOWOWL_KEY}`,
            },
        });

        if (!response.ok) {
            throw new Error('Network error: ' + response.statusText);
        }

        const data = await response.json();
        // console.log(JSON.stringify(data, null, 2));

        return data.items;
    } catch (error) {
        console.error('Error occurred while fetching data:', error);
    }
}

export default async function Home({ searchParams }: { searchParams: any }) {
    let snowData;
    if (!searchParams.limit || !searchParams.term) {
        snowData = [];
    } else {
        snowData = await fetchData({ limit: searchParams.limit, term: searchParams.term });
    }

    return (
        <main className='mt-10 min-h-screen'>
            <h1 className='text-2xl md:text-3xl mb-2 font-semibold'>SNOMED CT Quick Search</h1>
            <SearchBar searchResults={snowData} />
            <SelectedItem searchResults={snowData} />
        </main>
    );
}
