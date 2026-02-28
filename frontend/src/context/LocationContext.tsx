'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { locationData } from '@/data/locationData';

interface LocationContextType {
    state: string;
    district: string;
    mandi: string;
    setState: (s: string) => void;
    setDistrict: (d: string) => void;
    setMandi: (m: string) => void;
    displayLabel: string;
}

const LocationContext = createContext<LocationContextType>({
    state: '',
    district: '',
    mandi: '',
    setState: () => { },
    setDistrict: () => { },
    setMandi: () => { },
    displayLabel: 'Select Location',
});

export function LocationProvider({ children }: { children: ReactNode }) {
    const [state, setState_] = useState('');
    const [district, setDistrict_] = useState('');
    const [mandi, setMandi_] = useState('');

    const handleSetState = (s: string) => {
        setState_(s);
        setDistrict_('');
        setMandi_('');
    };

    const handleSetDistrict = (d: string) => {
        setDistrict_(d);
        setMandi_('');
    };

    const displayLabel = mandi
        ? `${mandi}`
        : district
            ? `${district}${state ? `, ${state}` : ''}`
            : state || 'Select Location';

    return (
        <LocationContext.Provider value={{
            state,
            district,
            mandi,
            setState: handleSetState,
            setDistrict: handleSetDistrict,
            setMandi: handleSetMandi,
            displayLabel,
        }}>
            {children}
        </LocationContext.Provider>
    );

    function handleSetMandi(m: string) {
        setMandi_(m);
    }
}

export function useLocation() {
    return useContext(LocationContext);
}
