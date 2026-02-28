// India agricultural location data: State → Districts → Mandis

export interface MandiInfo {
    name: string;
    code: string;
}

export interface DistrictInfo {
    name: string;
    mandis: MandiInfo[];
}

export interface StateInfo {
    name: string;
    code: string;
    districts: DistrictInfo[];
}

export const locationData: StateInfo[] = [
    {
        name: 'Haryana',
        code: 'HR',
        districts: [
            { name: 'Sirsa', mandis: [{ name: 'Sirsa Mandi', code: 'SR' }, { name: 'Dabwali Mandi', code: 'DB' }, { name: 'Rania Mandi', code: 'RN' }] },
            { name: 'Hisar', mandis: [{ name: 'Hisar Grain Market', code: 'HS' }, { name: 'Adampur Mandi', code: 'AD' }, { name: 'Hansi Mandi', code: 'HN' }] },
            { name: 'Karnal', mandis: [{ name: 'Karnal Mandi', code: 'KN' }, { name: 'Taraori Mandi', code: 'TR' }, { name: 'Gharaunda Mandi', code: 'GH' }] },
            { name: 'Kurukshetra', mandis: [{ name: 'Kurukshetra Mandi', code: 'KK' }, { name: 'Pehowa Mandi', code: 'PH' }, { name: 'Shahabad Mandi', code: 'SH' }] },
            { name: 'Ambala', mandis: [{ name: 'Ambala Mandi', code: 'AM' }, { name: 'Naraingarh Mandi', code: 'NR' }, { name: 'Shahzadpur Mandi', code: 'SZ' }] },
            { name: 'Fatehabad', mandis: [{ name: 'Fatehabad Mandi', code: 'FB' }, { name: 'Tohana Mandi', code: 'TH' }, { name: 'Ratia Mandi', code: 'RT' }] },
        ]
    },
    {
        name: 'Punjab',
        code: 'PB',
        districts: [
            { name: 'Ludhiana', mandis: [{ name: 'Ludhiana Grain Market', code: 'LD' }, { name: 'Sahnewal Mandi', code: 'SW' }, { name: 'Jagraon Mandi', code: 'JG' }] },
            { name: 'Amritsar', mandis: [{ name: 'Amritsar Mandi', code: 'AS' }, { name: 'Attari Mandi', code: 'AT' }, { name: 'Ajnala Mandi', code: 'AJ' }] },
            { name: 'Bhatinda', mandis: [{ name: 'Bhatinda Mandi', code: 'BT' }, { name: 'Goniana Mandi', code: 'GO' }, { name: 'Rampura Phul Mandi', code: 'RP' }] },
            { name: 'Patiala', mandis: [{ name: 'Patiala Mandi', code: 'PT' }, { name: 'Nabha Mandi', code: 'NB' }, { name: 'Samana Mandi', code: 'SM' }] },
            { name: 'Sangrur', mandis: [{ name: 'Sangrur Mandi', code: 'SG' }, { name: 'Moonak Mandi', code: 'MN' }, { name: 'Lehragaga Mandi', code: 'LH' }] },
        ]
    },
    {
        name: 'Uttar Pradesh',
        code: 'UP',
        districts: [
            { name: 'Agra', mandis: [{ name: 'Agra Mandi', code: 'AG' }, { name: 'Firozabad Mandi', code: 'FZ' }, { name: 'Tundla Mandi', code: 'TN' }] },
            { name: 'Meerut', mandis: [{ name: 'Meerut Mandi', code: 'MR' }, { name: 'Hapur Mandi', code: 'HP' }, { name: 'Sardhana Mandi', code: 'SR' }] },
            { name: 'Lucknow', mandis: [{ name: 'Lucknow Mandi', code: 'LK' }, { name: 'Malihabad Mandi', code: 'ML' }, { name: 'Bakshi Ka Talab Mandi', code: 'BK' }] },
            { name: 'Varanasi', mandis: [{ name: 'Varanasi Mandi', code: 'VN' }, { name: 'Mughal Sarai Mandi', code: 'MS' }, { name: 'Jaunpur Mandi', code: 'JP' }] },
            { name: 'Bareilly', mandis: [{ name: 'Bareilly Mandi', code: 'BR' }, { name: 'Aonla Mandi', code: 'AN' }, { name: 'Faridpur Mandi', code: 'FP' }] },
        ]
    },
    {
        name: 'Madhya Pradesh',
        code: 'MP',
        districts: [
            { name: 'Indore', mandis: [{ name: 'Indore Mandi', code: 'IN' }, { name: 'Sanwer Mandi', code: 'SN' }, { name: 'Depalpur Mandi', code: 'DP' }] },
            { name: 'Ujjain', mandis: [{ name: 'Ujjain Mandi', code: 'UJ' }, { name: 'Nagda Mandi', code: 'NG' }, { name: 'Mahidpur Mandi', code: 'MH' }] },
            { name: 'Bhopal', mandis: [{ name: 'Bhopal Mandi', code: 'BP' }, { name: 'Berasia Mandi', code: 'BS' }, { name: 'Sehore Mandi', code: 'SE' }] },
            { name: 'Hoshangabad', mandis: [{ name: 'Hoshangabad Mandi', code: 'HB' }, { name: 'Pipariya Mandi', code: 'PP' }, { name: 'Seoni Malwa Mandi', code: 'SM' }] },
        ]
    },
    {
        name: 'Rajasthan',
        code: 'RJ',
        districts: [
            { name: 'Jaipur', mandis: [{ name: 'Jaipur Mandi', code: 'JP' }, { name: 'Amer Mandi', code: 'AM' }, { name: 'Shahpura Mandi', code: 'SP' }] },
            { name: 'Sri Ganganagar', mandis: [{ name: 'Sri Ganganagar Mandi', code: 'SG' }, { name: 'Suratgarh Mandi', code: 'ST' }, { name: 'Padampur Mandi', code: 'PD' }] },
            { name: 'Sikar', mandis: [{ name: 'Sikar Mandi', code: 'SK' }, { name: 'Neem Ka Thana Mandi', code: 'NK' }, { name: 'Fatehpur Mandi', code: 'FT' }] },
            { name: 'Jodhpur', mandis: [{ name: 'Jodhpur Mandi', code: 'JD' }, { name: 'Pali Mandi', code: 'PL' }, { name: 'Bilara Mandi', code: 'BL' }] },
        ]
    },
    {
        name: 'Maharashtra',
        code: 'MH',
        districts: [
            { name: 'Nashik', mandis: [{ name: 'Nashik Mandi', code: 'NK' }, { name: 'Lasalgaon Mandi', code: 'LS' }, { name: 'Pimpalgaon Mandi', code: 'PG' }] },
            { name: 'Pune', mandis: [{ name: 'Pune Mandi', code: 'PN' }, { name: 'Talegaon Mandi', code: 'TL' }, { name: 'Uruli Kanchan Mandi', code: 'UK' }] },
            { name: 'Aurangabad', mandis: [{ name: 'Aurangabad Mandi', code: 'AU' }, { name: 'Lasur Mandi', code: 'LR' }, { name: 'Vaijapur Mandi', code: 'VJ' }] },
            { name: 'Solapur', mandis: [{ name: 'Solapur Mandi', code: 'SL' }, { name: 'Pandharpur Mandi', code: 'PF' }, { name: 'Sangola Mandi', code: 'SG' }] },
        ]
    },
    {
        name: 'Gujarat',
        code: 'GJ',
        districts: [
            { name: 'Ahmedabad', mandis: [{ name: 'Ahmedabad Mandi', code: 'AH' }, { name: 'Bavla Mandi', code: 'BV' }, { name: 'Detroj Mandi', code: 'DT' }] },
            { name: 'Rajkot', mandis: [{ name: 'Rajkot Mandi', code: 'RK' }, { name: 'Gondal Mandi', code: 'GN' }, { name: 'Jetpur Mandi', code: 'JT' }] },
            { name: 'Junagadh', mandis: [{ name: 'Junagadh Mandi', code: 'JN' }, { name: 'Keshod Mandi', code: 'KS' }, { name: 'Veraval Mandi', code: 'VR' }] },
        ]
    },
    {
        name: 'Bihar',
        code: 'BR',
        districts: [
            { name: 'Patna', mandis: [{ name: 'Patna Mandi', code: 'PT' }, { name: 'Danapur Mandi', code: 'DN' }, { name: 'Phulwari Mandi', code: 'PH' }] },
            { name: 'Muzaffarpur', mandis: [{ name: 'Muzaffarpur Mandi', code: 'MZ' }, { name: 'Motipur Mandi', code: 'MT' }, { name: 'Saraiya Mandi', code: 'SR' }] },
            { name: 'Gaya', mandis: [{ name: 'Gaya Mandi', code: 'GY' }, { name: 'Sherghati Mandi', code: 'SH' }, { name: 'Bodh Gaya Mandi', code: 'BG' }] },
        ]
    },
];

export const cropOptions = [
    'All Crops',
    'Wheat',
    'Rice (Basmati)',
    'Cotton',
    'Sugarcane',
    'Maize',
    'Onion',
    'Potato',
    'Tomato',
    'Mustard',
    'Soybean',
    'Sorghum',
    'Bajra',
    'Groundnut',
    'Chana (Chickpea)',
    'Turmeric',
    'Ginger',
    'Garlic',
];
