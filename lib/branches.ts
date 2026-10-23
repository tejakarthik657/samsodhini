export interface BranchInfo {
  code: string;
  name: string;
  shortName: string;
  associationName: string;
  associationShort: string;
  defaultUsername: string;
  category: 'Computing' | 'Core' | 'Circuits' | 'Institutional';
  accentColor: string;
  bgLightColor: string;
  logoUrl?: string;
  studentBodyPosterUrl?: string;
  studentBodyTitle?: string;
  facultyAdvisor?: string;
  studentPresident?: string;
}

export const KITSW_BRANCHES: BranchInfo[] = [
  {
    code: 'CE',
    name: 'Civil Engineering',
    shortName: 'Civil',
    associationName: 'Civil Engineering Association',
    associationShort: 'CEA',
    defaultUsername: 'cea_ce',
    category: 'Core',
    accentColor: '#059669',
    bgLightColor: '#ECFDF5',
  },
  {
    code: 'ME',
    name: 'Mechanical Engineering',
    shortName: 'Mechanical',
    associationName: 'Mechanical Engineering Students Association',
    associationShort: 'MESA',
    defaultUsername: 'mesa_me',
    category: 'Core',
    accentColor: '#E11D48',
    bgLightColor: '#FFF1F2',
  },
  {
    code: 'EEE',
    name: 'Electrical & Electronics Engineering',
    shortName: 'EEE',
    associationName: 'EEE Association',
    associationShort: 'EEEA',
    defaultUsername: 'eeea_eee',
    category: 'Circuits',
    accentColor: '#D97706',
    bgLightColor: '#FFFBEB',
  },
  {
    code: 'ECE',
    name: 'Electronics & Communication Engineering',
    shortName: 'ECE',
    associationName: 'ECE Association',
    associationShort: 'ECEA',
    defaultUsername: 'ecea_ece',
    category: 'Circuits',
    accentColor: '#4F46E5',
    bgLightColor: '#EEF2FF',
  },
  {
    code: 'CSE',
    name: 'Computer Science & Engineering',
    shortName: 'CSE',
    associationName: 'CSE Association',
    associationShort: 'CSEA',
    defaultUsername: 'csea_cse',
    category: 'Computing',
    accentColor: '#2563EB',
    bgLightColor: '#EFF6FF',
  },
  {
    code: 'IT',
    name: 'Information Technology',
    shortName: 'IT',
    associationName: 'Information Technology Association',
    associationShort: 'ITA',
    defaultUsername: 'ita_it',
    category: 'Computing',
    accentColor: '#0D9488',
    bgLightColor: '#F0FDFA',
  },
  {
    code: 'CSN',
    name: 'CSE (Networks) and CSE (IoT)',
    shortName: 'Networks & IoT',
    associationName: 'CSEN Association',
    associationShort: 'CSENA',
    defaultUsername: 'csena_csn',
    category: 'Computing',
    accentColor: '#3B82F6',
    bgLightColor: '#EFF6FF',
  },
  {
    code: 'CSM',
    name: 'CSE (AI & ML) and CSE (Data Science)',
    shortName: 'AI, ML & Data Science',
    associationName: 'CSM Association',
    associationShort: 'CSMA',
    defaultUsername: 'csma_csm',
    category: 'Computing',
    accentColor: '#7C3AED',
    bgLightColor: '#F5F3FF',
  },
  {
    code: 'ECV',
    name: 'ECE (VLSI Design & Technology), with ECI and EIE',
    shortName: 'ECV',
    associationName: 'ECV Association',
    associationShort: 'ECVA',
    defaultUsername: 'ecva_ecv',
    category: 'Circuits',
    accentColor: '#9333EA',
    bgLightColor: '#FAF5FF',
  },
  {
    code: 'CSC',
    name: 'CSE (Cyber Security)',
    shortName: 'Cyber Security',
    associationName: 'Cyber Security Student Forum',
    associationShort: 'CYBER',
    defaultUsername: 'cyber_csc',
    category: 'Computing',
    accentColor: '#DC2626',
    bgLightColor: '#FEF2F2',
  },
  {
    code: 'I2RE',
    name: 'Innovation, Incubation, Research & Entrepreneurship',
    shortName: 'I2RE',
    associationName: 'SAIL I2RE',
    associationShort: 'SAIL I2RE',
    defaultUsername: 'i2re_kitsw',
    category: 'Institutional',
    accentColor: '#FF5A4D',
    bgLightColor: '#FFF0EE',
  },
  {
    code: 'MBA',
    name: 'Master of Business Administration',
    shortName: 'MBA',
    associationName: 'MBA Association',
    associationShort: 'MBA',
    defaultUsername: 'mba_kitsw',
    category: 'Institutional',
    accentColor: '#1FBF80',
    bgLightColor: '#EAFDF5',
  },
  {
    code: 'ISTE',
    name: 'ISTE Student Chapter',
    shortName: 'ISTE Chapter',
    associationName: 'Indian Society for Technical Education',
    associationShort: 'ISTE',
    defaultUsername: 'iste_kitsw',
    category: 'Institutional',
    accentColor: '#1E40AF',
    bgLightColor: '#EFF6FF',
  },
  {
    code: 'TECH',
    name: 'Technical Club KITSW',
    shortName: 'Technical Club',
    associationName: 'Technical Club & Innovations Guild',
    associationShort: 'TECH',
    defaultUsername: 'tech_club',
    category: 'Institutional',
    accentColor: '#7C3AED',
    bgLightColor: '#F5F3FF',
  },
  {
    code: 'CSI',
    name: 'CSI Student Branch',
    shortName: 'CSI Chapter',
    associationName: 'Computer Society of India KITSW',
    associationShort: 'CSI',
    defaultUsername: 'csi_kitsw',
    category: 'Institutional',
    accentColor: '#0D9488',
    bgLightColor: '#F0FDFA',
  },
  {
    code: 'SAC',
    name: 'Student Activity Centre',
    shortName: 'SAC Central',
    associationName: 'Student Activity Centre Apex Council',
    associationShort: 'SAC',
    defaultUsername: 'sac_kitsw',
    category: 'Institutional',
    accentColor: '#D97706',
    bgLightColor: '#FFFBEB',
  },
];

export const BRANCH_LOOKUP: Record<string, BranchInfo> = KITSW_BRANCHES.reduce(
  (acc, b) => {
    acc[b.code] = b;
    // Map legacy alias codes if any
    if (b.code === 'CE') acc['CIVIL'] = b;
    if (b.code === 'ME') acc['MECH'] = b;
    return acc;
  },
  {} as Record<string, BranchInfo>
);

/**
 * Some departments share one association: ECI, EIE and EVL belong to ECV, CSD to CSM, and CSO to CSN.
 * Older records may still carry the old codes, so every filter maps them to the parent first.
 */
export const BRANCH_ALIASES: Record<string, string> = {
  ECI: 'ECV',
  EIE: 'ECV',
  EVL: 'ECV',
  CSD: 'CSM',
  CSO: 'CSN',
};

export function canonicalBranchCode(code?: string | null): string {
  const c = (code || '').toUpperCase();
  return BRANCH_ALIASES[c] || c;
}
