'use client';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <div>
            <div className='flex w-full h-screen flex-col'>
                <p className='error__message'>{error?.message}</p>
            </div>
        </div>
    );
}
