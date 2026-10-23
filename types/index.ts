export interface Edition {
  year: number;
  name: string;
  theme?: string;
  dates?: string;
  posterUrl?: string | null;
  isActive: boolean;
  status: 'upcoming' | 'live' | 'archived';
  createdAt?: string;
}

export interface ResourcePerson {
  name: string;
  designation: string;
  company: string;
  bio: string;
  avatar: string;
  linkedin?: string;
  topics: string[];
}

export interface Coordinator {
  name: string;
  role: string;
  phone: string;
  email: string;
  avatar: string;
}

export interface SyllabusItem {
  time: string;
  topic: string;
  description: string;
}

export interface Workshop {
  id: string;
  slug: string;
  branch: string;
  title: string;
  tagline: string;
  description?: string;
  posterUrl: string;
  leadCoordinator: Coordinator;
  resourcePerson: ResourcePerson;
  dates: string;
  time: string;
  venue: string;
  fees: string;
  maxCapacity: number;
  currentRegistered: number;
  liveStatus: 'upcoming' | 'live' | 'housefull' | 'completed';
  syllabus: SyllabusItem[];
  prerequisites: string[];
  takeaways: string[];
  registrationUrl: string;
  googleFormUrl?: string;
  reportPdfUrl?: string;
  isFlagship: boolean;
  editionYear?: number;
  associationName?: string;
  associationShort?: string;
  branchLogo?: string | null;
}

export interface EventRound {
  roundNumber: number;
  name: string;
  description: string;
}

export interface EventPrizePool {
  first: string;
  second: string;
  third?: string;
  total: string;
}

export interface FestEvent {
  id: string;
  slug: string;
  branch: string;
  title: string;
  category: string;
  tagline: string;
  description?: string;
  posterUrl: string;
  coordinators: Coordinator[];
  juniorCoordinators?: Coordinator[];
  venue: string;
  day: string;
  time: string;
  prizePool: EventPrizePool;
  teamSize: string;
  currentRegistered: number;
  maxSlots: number;
  status: 'upcoming' | 'live' | 'completed';
  rules: string[];
  rounds: EventRound[];
  registrationUrl: string;
  editionYear?: number;
  associationName?: string;
  associationShort?: string;
  branchLogo?: string | null;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  shortName: string;
  associationName: string;
  associationShort: string;
  iconName: string;
  facultyAdvisor: string;
  studentPresident: string;
  contactEmail: string;
  contactPhone: string;
  accentColor: string;
  bgLightColor: string;
  description: string;
  logoUrl?: string;
  studentBodyPosterUrl?: string;
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  type: string;
  branch?: string;
  venue: string;
  day: string;
  speakerOrLead?: string;
}

export interface LegacyEdition {
  year: number;
  theme: string;
  dates: string;
  totalAttendees: number;
  totalEvents: number;
  totalWorkshops: number;
  prizeMoneyDisbursed: string;
  highlights: string[];
  souvenirPdfUrl: string;
  coverImage: string;
  galleryPreview: string[];
  chiefGuest: {
    name: string;
    title: string;
  };
}

export interface Registration {
  id: string;
  passToken: string;
  fullName: string;
  college: string;
  rollNumber: string;
  branch: string;
  yearOfStudy: string;
  email: string;
  phone: string;
  teamName?: string;
  targetTitle: string;
  targetType: string;
  paymentStatus: string;
  createdAt: string;
}

export interface CampusVenue {
  name: string;
  capacity: number;
  type: string;
  landmark: string;
  mapCoord: string;
}

export interface OrganizerSession {
  id: string;
  branchCode: string;
  username: string;
  name: string;
  role: string;
  branchName: string;
  associationName: string;
  associationShort: string;
}

export interface GalleryItem {
  id: number;
  editionYear: number;
  branchCode: string;
  itemType: 'workshop' | 'event';
  itemId: string;
  itemTitle: string;
  imageUrl: string;
  caption?: string;
  createdAt: string;
}

export interface StudentBodyPoster {
  id: number;
  editionYear: number;
  branchCode: string;
  posterUrl: string;
  title: string;
  description?: string;
  facultyAdvisor?: string;
  studentPresident?: string;
  createdAt: string;
  branchName?: string;
  associationName?: string;
  associationShort?: string;
  accentColor?: string;
  bgLightColor?: string;
  logoUrl?: string;
}
