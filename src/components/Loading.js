import React from 'react';

const loadingMessages = {
    'ADDING YOUR DATA...': {
        title: 'Saving your rate',
        subtitle: 'Writing the latest calculation to your records.',
    },
    'Deleting the data': {
        title: 'Removing record',
        subtitle: 'Cleaning up the selected entry.',
    },
    'Loading data...': {
        title: 'Loading records',
        subtitle: 'Getting your saved data ready.',
    },
};

const Loading = ({ value = 'Loading...' }) => {
    const message = loadingMessages[value] || {
        title: value,
        subtitle: 'Please wait a moment.',
    };

    return (
        <div className="min-h-[70vh] w-full flex items-center justify-center px-4">
            <div className="relative flex w-full max-w-sm flex-col items-center overflow-hidden rounded-lg border border-white/10 bg-neutral-900/80 px-8 py-10 text-center shadow-2xl">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-500 via-yellow-300 to-cyan-400" />

                <div className="relative h-24 w-24">
                    <div className="absolute inset-0 rounded-full border-4 border-white/10" />
                    <div
                        className="absolute inset-0 rounded-full border-4 border-transparent border-t-pink-400 border-r-yellow-300"
                        style={{ animation: 'spin 1s linear infinite' }}
                    />
                    <div
                        className="absolute inset-4 rounded-full border-4 border-transparent border-b-cyan-300 border-l-pink-300"
                        style={{ animation: 'spin 1.4s linear infinite reverse' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-3 w-3 rounded-full bg-yellow-300 shadow-[0_0_24px_rgba(253,224,71,0.9)]" />
                    </div>
                </div>

                <h1 className="mt-7 text-2xl font-semibold tracking-wide text-white">{message.title}</h1>
                <p className="mt-3 text-sm leading-6 text-gray-300">{message.subtitle}</p>

                <div className="mt-7 flex gap-2">
                    {[0, 1, 2].map((item) => (
                        <span
                            key={item}
                            className="h-2 w-2 rounded-full bg-cyan-300"
                            style={{ animation: `pulse 1s ease-in-out ${item * 0.18}s infinite` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Loading;
