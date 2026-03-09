type DisabilityCode = string;
type DisabilityName = string;

interface DisabilityMapping {
    code: DisabilityCode;
    name: DisabilityName;
}

const DISABILITY_MAP: Record<DisabilityCode, DisabilityName> = {
    '01': 'Amputation',
    '02': 'Athetosis',
    '03': 'Cerebral Palsy',
    '04': 'Dwarfism',
    '05': 'Intellectual Disability',
    '06': 'Les Autres',
    '07': 'Partial Paralysis',
    '07a': 'Visual Impairment (11)',
    '07b': 'Visual Impairment (12)',
    '07c': 'Visual Impairment (13)',
    '20': 'Intellectual Disability (20)',
    '31': 'Hypertonia (31)',
    '32': 'Athetosis (32)',
    '33': 'Ataxia (33)',
    '34': 'Mixed (34)',
    '40': 'Leg Length Difference (40)',
    '41': 'Leg Amputation (41)',
    '42': 'Arm Amputation (42)',
    '43': 'Arm Deficiency (43)',
    '44': 'Leg Deficiency (44)',
    '45': 'Short Stature (45)',
    '50': 'Wheelchair Users - Tetraplegia (50)',
    '51': 'Wheelchair Users - Paraplegia (51)',
    '52': 'Wheelchair Users - Polio (52)',
    '53': 'Wheelchair Users - Amputee (53)',
    '54': 'Wheelchair Users - Les Autres (54)',
    '08': 'Spinal Cord Injury',
    '09': 'Visual Impairment',
    '10': 'Hearing Impairment',
};

export function mapDisabilityNameToCode(name: DisabilityName): DisabilityCode | null {
    const entry = Object.entries(DISABILITY_MAP).find(([, value]) => value === name);
    return entry ? entry[0] : null;
}

export function mapDisabilityCodeToName(code: DisabilityCode): DisabilityName | null {
    return DISABILITY_MAP[code] ?? null;
}

export function getAllDisabilities(): DisabilityMapping[] {
    return Object.entries(DISABILITY_MAP).map(([code, name]) => ({ code, name }));
}

export function isValidDisabilityCode(code: DisabilityCode): boolean {
    return code in DISABILITY_MAP;
}