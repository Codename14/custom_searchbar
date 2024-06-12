import Link from 'next/link';
import React from 'react';
import { FaGithub } from 'react-icons/fa';

export default function Header() {
    return (
        <>
            <header>
                <nav className='flex justify-between limit-width p-2'>
                    <h2 className='text-2xl'>Hello</h2>
                    <Link href='https://github.com/Codename14/custom_searchbar'>
                        <FaGithub size={40} />
                    </Link>
                </nav>
            </header>
        </>
    );
}
