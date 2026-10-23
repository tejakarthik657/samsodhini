'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  BookOpen, 
  Upload, 
  Plus, 
  Save, 
  Download, 
  CheckCircle2, 
  Edit, 
  Terminal, 
  Link as LinkIcon,
  FileText,
  Key,
  ArrowRight,
  RefreshCw,
  Trophy,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  Camera,
  Image as ImageIcon,
  Award
} from 'lucide-react';
import { Workshop, FestEvent, Edition, GalleryItem } from '../types';
import AdminPosterPanel from './AdminPosterPanel';

const ADMIN_EMAIL = 'tc.sac@kitsw.ac.in';

const BRANCH_ORGANIZER_DEFAULTS: Record<string, { username: string; association: string; fullName: string }> = {
  CE: { username: 'cea_ce', association: 'CEA', fullName: 'Civil Engineering Association' },
  ME: { username: 'mesa_me', association: 'MESA', fullName: 'Mechanical Engineering Students Association' },
  EEE: { username: 'eeea_eee', association: 'EEEA', fullName: 'EEE Association' },
  ECE: { username: 'ecea_ece', association: 'ECEA', fullName: 'ECE Association' },
  CSE: { username: 'csea_cse', association: 'CSEA', fullName: 'CSE Association' },
  IT: { username: 'ita_it', association: 'ITA', fullName: 'Information Technology Association' },
  CSN: { username: 'csena_csn', association: 'CSENA', fullName: 'CSEN Association (CSE Networks and CSE IoT)' },
  CSM: { username: 'csma_csm', association: 'CSMA', fullName: 'CSM Association (CSE AI & ML and CSE Data Science)' },
  ECV: { username: 'ecva_ecv', association: 'ECVA', fullName: 'ECV Association (ECE VLSI, with ECI and EIE)' },
  CSC: { username: 'cyber_csc', association: 'CYBER', fullName: 'Cyber Security Student Forum' },
  I2RE: { username: 'i2re_kitsw', association: 'SAIL I2RE', fullName: 'SAIL I2RE (Innovation, Incubation, Research & Entrepreneurship)' },
  MBA: { username: 'mba_kitsw', association: 'MBA', fullName: 'MBA Association' },
  ISTE: { username: 'iste_kitsw', association: 'ISTE', fullName: 'ISTE KITSW Student Chapter' },
  TECH: { username: 'tech_club', association: 'TECH', fullName: 'Technical Club KITSW' },
  CSI: { username: 'csi_kitsw', association: 'CSI', fullName: 'CSI KITSW Student Branch' },
  SAC: { username: 'sac_kitsw', association: 'SAC', fullName: 'Student Activity Centre Apex Council' },
  CIVIL: { username: 'cea_ce', association: 'CEA', fullName: 'Civil Engineering Association' },
  MECH: { username: 'mesa_me', association: 'MESA', fullName: 'Mechanical Engineering Students Association' },
};

export default function OrganizerDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authenticatedBranch, setAuthenticatedBranch] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('CSE');
  const [username, setUsername] = useState('csea');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'workshop' | 'events' | 'gallery' | 'studentBody' | 'archive' | 'roster' | 'poster'>('workshop');

  // Real data from DB
  const [editions, setEditions] = useState<Edition[]>([]);
  const [targetEditionYear, setTargetEditionYear] = useState<number>(2026);
  const [showNewEditionModal, setShowNewEditionModal] = useState(false);
  const [newEditionYear, setNewEditionYear] = useState(2027);
  const [newEditionName, setNewEditionName] = useState("Sumshodhini '27");
  const [newEditionTheme, setNewEditionTheme] = useState('National Level Technical Symposium');
  const [newEditionDates, setNewEditionDates] = useState('October 22–23, 2027');
  const [newEditionSetActive, setNewEditionSetActive] = useState(false);
  const [creatingEdition, setCreatingEdition] = useState(false);

  // Edit Edition Dates & Settings modal state
  const [showEditEditionModal, setShowEditEditionModal] = useState<boolean>(false);
  const [editEditionDates, setEditEditionDates] = useState<string>('October 30–31, 2026');
  const [editEditionTheme, setEditEditionTheme] = useState<string>('National Level Technical Symposium');
  const [editEditionName, setEditEditionName] = useState<string>("Sumshodhini '26");
  const [updatingEdition, setUpdatingEdition] = useState<boolean>(false);

  // Branch Logo & Student Body Executive Poster state
  const [branchLogoUrl, setBranchLogoUrl] = useState<string>('');
  const [branchStudentBodyPoster, setBranchStudentBodyPoster] = useState<string>('');
  const [branchStudentBodyTitle, setBranchStudentBodyTitle] = useState<string>('');
  const [branchStudentBodyDesc, setBranchStudentBodyDesc] = useState<string>('');
  const [branchFacultyAdvisor, setBranchFacultyAdvisor] = useState<string>('');
  const [branchStudentPresident, setBranchStudentPresident] = useState<string>('');
  const [uploadingLogo, setUploadingLogo] = useState<boolean>(false);
  const [uploadingStudentBody, setUploadingStudentBody] = useState<boolean>(false);
  const [savingStudentBody, setSavingStudentBody] = useState<boolean>(false);
  const [uploadingSpeakerImage, setUploadingSpeakerImage] = useState<boolean>(false);

  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [events, setEvents] = useState<FestEvent[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryItem[]>([]);
  const [selectedGalleryTarget, setSelectedGalleryTarget] = useState<{ id: string; type: 'workshop' | 'event'; title: string } | null>(null);
  const [galleryCaption, setGalleryCaption] = useState<string>('');
  const [uploadingGallery, setUploadingGallery] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [savingWorkshop, setSavingWorkshop] = useState(false);
  const [savingEvent, setSavingEvent] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // File upload state for Cloud Media Vault
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadedCdnUrl, setUploadedCdnUrl] = useState<string | null>(null);

  // ================= WORKSHOP FORM STATE =================
  const [wsTitle, setWsTitle] = useState('');
  const [wsTagline, setWsTagline] = useState('');
  const [wsDescription, setWsDescription] = useState('');
  const [wsPosterUrl, setWsPosterUrl] = useState('');
  const [wsSpeakerName, setWsSpeakerName] = useState('');
  const [wsSpeakerDesignation, setWsSpeakerDesignation] = useState('');
  const [wsSpeakerCompany, setWsSpeakerCompany] = useState('');
  const [wsSpeakerBio, setWsSpeakerBio] = useState('');
  const [wsSpeakerLinkedin, setWsSpeakerLinkedin] = useState('');
  const [wsSpeakerAvatar, setWsSpeakerAvatar] = useState('');
  const [wsSpeakerTopics, setWsSpeakerTopics] = useState('');
  const [wsLeadConvenerName, setWsLeadConvenerName] = useState('');
  const [wsLeadConvenerRole, setWsLeadConvenerRole] = useState('');
  const [wsLeadConvenerPhone, setWsLeadConvenerPhone] = useState('');
  const [wsLeadConvenerEmail, setWsLeadConvenerEmail] = useState('');
  const [wsDates, setWsDates] = useState('');
  const [wsTime, setWsTime] = useState('');
  const [wsVenue, setWsVenue] = useState('');
  const [wsFees, setWsFees] = useState('');
  const [wsMaxCapacity, setWsMaxCapacity] = useState('150');
  const [wsPrerequisites, setWsPrerequisites] = useState('');
  const [wsTakeaways, setWsTakeaways] = useState('');
  const [wsSyllabus, setWsSyllabus] = useState('');
  const [wsRegistrationUrl, setWsRegistrationUrl] = useState('');
  const [wsGoogleFormUrl, setWsGoogleFormUrl] = useState('');
  const [wsReportPdfUrl, setWsReportPdfUrl] = useState('');

  // ================= EVENT FORM STATE =================
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [evTitle, setEvTitle] = useState('');
  const [evCategory, setEvCategory] = useState('Competitive Coding');
  const [evTagline, setEvTagline] = useState('');
  const [evDescription, setEvDescription] = useState('');
  const [evPosterUrl, setEvPosterUrl] = useState('');
  const [evVenue, setEvVenue] = useState('');
  const [evDay, setEvDay] = useState('Day 2');
  const [evTime, setEvTime] = useState('10:00 AM - 01:00 PM');
  const [evTeamSize, setEvTeamSize] = useState('1 to 2 Members');
  const [evMaxSlots, setEvMaxSlots] = useState('50');
  const [evPrizeTotal, setEvPrizeTotal] = useState('INR 15,000');
  const [evPrizeFirst, setEvPrizeFirst] = useState('INR 10,000');
  const [evPrizeSecond, setEvPrizeSecond] = useState('INR 5,000');
  const [evPrizeThird, setEvPrizeThird] = useState('');
  const [evRules, setEvRules] = useState('');
  const [evRound1, setEvRound1] = useState('Preliminary Screening: MCQ & Code Logic');
  const [evRound2, setEvRound2] = useState('Hands-on Implementation Sprint');
  const [evRound3, setEvRound3] = useState('Final Presentation & Live Jury Evaluation');
  const [evCoord1Name, setEvCoord1Name] = useState('');
  const [evCoord1Phone, setEvCoord1Phone] = useState('');
  const [evCoord1Email, setEvCoord1Email] = useState('');
  const [evCoord2Name, setEvCoord2Name] = useState('');
  const [evCoord2Phone, setEvCoord2Phone] = useState('');
  const [evCoord2Email, setEvCoord2Email] = useState('');
  const [evRegistrationUrl, setEvRegistrationUrl] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch workshops, events, registrations, editions, gallery, and student body from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const [wsRes, evRes, regRes, edRes, galRes, brRes, sbRes] = await Promise.all([
        fetch(`/api/workshops?branch=${selectedBranch}&year=${targetEditionYear}`),
        fetch(`/api/events?branch=${selectedBranch}&year=${targetEditionYear}`),
        fetch(`/api/register?branch=${selectedBranch}`),
        fetch('/api/editions'),
        fetch(`/api/gallery?branch=${selectedBranch}&year=${targetEditionYear}`),
        fetch('/api/branches'),
        fetch(`/api/student-body?branch=${selectedBranch}&year=${targetEditionYear}`),
      ]);
      const wsData = await wsRes.json();
      const evData = await evRes.json();
      const regData = await regRes.json();
      const edData = await edRes.json();
      const galData = await galRes.json();
      const brData = await brRes.json();
      const sbData = await sbRes.json();

      if (wsData.success) setWorkshops(wsData.data || []);
      if (evData.success) setEvents(evData.data || []);
      if (regData.success) setRegistrations(regData.data || []);
      if (edData.success && edData.data) {
        setEditions(edData.data);
        const currentEd = edData.data.find((e: any) => e.year === targetEditionYear) || edData.data[0];
        if (currentEd) {
          setEditEditionDates(currentEd.dates || 'October 30–31, 2026');
          setEditEditionTheme(currentEd.theme || 'National Level Technical Symposium');
          setEditEditionName(currentEd.name || `Sumshodhini '${String(targetEditionYear).slice(-2)}`);
        }
      }
      if (galData.success) {
        setGalleryPhotos(galData.data || []);
      }
      if (brData.success && Array.isArray(brData.data)) {
        const thisBranch = brData.data.find((b: any) => b.code?.toUpperCase() === selectedBranch.toUpperCase());
        if (thisBranch) {
          setBranchLogoUrl(thisBranch.logoUrl || '');
          setBranchStudentBodyPoster(thisBranch.studentBodyPosterUrl || '');
          setBranchStudentBodyTitle(thisBranch.studentBodyTitle || `${selectedBranch} Executive Student Body`);
          setBranchStudentBodyDesc(thisBranch.studentBodyDescription || '');
          setBranchFacultyAdvisor(thisBranch.facultyAdvisor || '');
          setBranchStudentPresident(thisBranch.studentPresident || '');
        }
      }
      if (sbData.success && Array.isArray(sbData.data) && sbData.data.length > 0) {
        const sbItem = sbData.data[0];
        if (sbItem.posterUrl) setBranchStudentBodyPoster(sbItem.posterUrl);
        if (sbItem.title) setBranchStudentBodyTitle(sbItem.title);
        if (sbItem.description) setBranchStudentBodyDesc(sbItem.description);
        if (sbItem.facultyAdvisor) setBranchFacultyAdvisor(sbItem.facultyAdvisor);
        if (sbItem.studentPresident) setBranchStudentPresident(sbItem.studentPresident);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedBranch, targetEditionYear]);

  const handleCreateEdition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEditionYear) {
      showToast('Please specify a valid academic year');
      return;
    }
    setCreatingEdition(true);
    try {
      const res = await fetch('/api/editions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: newEditionYear,
          name: newEditionName,
          theme: newEditionTheme,
          dates: newEditionDates,
          setActive: newEditionSetActive,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Edition ${newEditionYear} initialized successfully!`);
        setShowNewEditionModal(false);
        setTargetEditionYear(newEditionYear);
        // Refresh editions
        const edRes = await fetch('/api/editions');
        const edData = await edRes.json();
        if (edData.success && edData.data) {
          setEditions(edData.data);
        }
      } else {
        showToast(data.error || 'Failed to create edition');
      }
    } catch (err) {
      showToast('Network error while initializing edition');
    } finally {
      setCreatingEdition(false);
    }
  };

  // Synchronize workshop form when selectedBranch or workshops changes
  useEffect(() => {
    const currentWs = workshops.find((w) => w.branch === selectedBranch);
    if (currentWs) {
      setWsTitle(currentWs.title || '');
      setWsTagline(currentWs.tagline || '');
      setWsDescription(currentWs.description || '');
      setWsPosterUrl(currentWs.posterUrl || '');
      setWsSpeakerName(currentWs.resourcePerson?.name || '');
      setWsSpeakerDesignation(currentWs.resourcePerson?.designation || '');
      setWsSpeakerCompany(currentWs.resourcePerson?.company || '');
      setWsSpeakerBio(currentWs.resourcePerson?.bio || '');
      setWsSpeakerLinkedin(currentWs.resourcePerson?.linkedin || '');
      setWsSpeakerAvatar(currentWs.resourcePerson?.avatar || '');
      setWsSpeakerTopics(Array.isArray(currentWs.resourcePerson?.topics) ? currentWs.resourcePerson.topics.join(', ') : '');
      setWsLeadConvenerName(currentWs.leadCoordinator?.name || (currentWs as any).yearLead?.name || '');
      setWsLeadConvenerRole(currentWs.leadCoordinator?.role || (currentWs as any).yearLead?.role || 'Lead Student Convener');
      setWsLeadConvenerPhone(currentWs.leadCoordinator?.phone || (currentWs as any).yearLead?.phone || '');
      setWsLeadConvenerEmail(currentWs.leadCoordinator?.email || (currentWs as any).yearLead?.email || '');
      setWsDates(currentWs.dates || 'Day 1 & Day 2');
      setWsTime(currentWs.time || '09:30 AM - 04:30 PM');
      setWsVenue(currentWs.venue || 'Campus Central Laboratory');
      setWsFees(currentWs.fees || 'INR 350');
      setWsMaxCapacity(currentWs.maxCapacity?.toString() || '150');
      setWsPrerequisites(Array.isArray(currentWs.prerequisites) ? currentWs.prerequisites.join('\n') : '');
      setWsTakeaways(Array.isArray(currentWs.takeaways) ? currentWs.takeaways.join('\n') : '');
      setWsSyllabus(Array.isArray(currentWs.syllabus) ? currentWs.syllabus.map((s: any) => typeof s === 'string' ? s : `${s.module || s.title || ''}: ${s.topics ? s.topics.join(', ') : ''}`).join('\n') : '');
      setWsRegistrationUrl(currentWs.registrationUrl || '');
      setWsGoogleFormUrl(currentWs.googleFormUrl || '');
      setWsReportPdfUrl(currentWs.reportPdfUrl || '');
    } else {
      // Clear form for branch with no workshop
      setWsTitle('');
      setWsTagline('');
      setWsDescription('');
      setWsPosterUrl('');
      setWsSpeakerName('');
      setWsSpeakerDesignation('');
      setWsSpeakerCompany('');
      setWsSpeakerBio('');
      setWsSpeakerLinkedin('');
      setWsSpeakerAvatar('');
      setWsSpeakerTopics('');
      setWsLeadConvenerName('');
      setWsLeadConvenerRole('Lead Student Convener');
      setWsLeadConvenerPhone('');
      setWsLeadConvenerEmail('');
      setWsDates('Day 1 & Day 2');
      setWsTime('09:30 AM - 04:30 PM');
      setWsVenue('Campus Central Laboratory');
      setWsFees('INR 350');
      setWsMaxCapacity('150');
      setWsPrerequisites('');
      setWsTakeaways('');
      setWsSyllabus('');
      setWsRegistrationUrl('');
      setWsGoogleFormUrl('');
      setWsReportPdfUrl('');
    }
  }, [selectedBranch, workshops]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    // The festival admin signs in with their email; the server checks the password.
    if (username.trim().toLowerCase() === ADMIN_EMAIL) {
      try {
        const res = await fetch('/api/organizer/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ branchCode: selectedBranch, username: username.trim(), password }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setLoginError(data.error || 'Sign-in failed.');
          return;
        }
        setIsAdmin(true);
        setAdminToken(data.adminToken || null);
        setAuthenticatedBranch('ADMIN');
        setIsLoggedIn(true);
        showToast('Signed in as festival admin');
      } catch {
        setLoginError('Could not reach the server. Try again.');
      }
      return;
    }

    try {
      const res = await fetch('/api/organizer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branchCode: selectedBranch, username, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setLoginError(data.error || 'Sign-in failed. Try again.');
        return;
      }
      const authBr = data.organizer?.branchCode || selectedBranch;
      setAuthenticatedBranch(authBr);
      setSelectedBranch(authBr);
      setIsAdmin(false);
      setIsLoggedIn(true);
      setPassword('');
      showToast(`Signed in as ${BRANCH_ORGANIZER_DEFAULTS[authBr]?.association || authBr}`);
    } catch (err) {
      setLoginError('Could not reach the server. Check your connection and try again.');
    }
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setAuthenticatedBranch(null);
    setIsAdmin(false);
    setAdminToken(null);
    setActiveTab('workshop');
  };

  const activeWorkshop = workshops.find((w) => w.branch === selectedBranch);
  const activeEvents = events.filter((e) => e.branch === selectedBranch);

  // DELETE WORKSHOP
  const handleDeleteWorkshop = async () => {
    if (!activeWorkshop) return;
    if (!confirm(`Are you sure you want to delete the flagship workshop "${activeWorkshop.title}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/workshops?id=${activeWorkshop.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Flagship Workshop deleted successfully');
        setWsTitle('');
        setWsTagline('');
        setWsDescription('');
        setWsPosterUrl('');
        setWsSpeakerName('');
        setWsSpeakerDesignation('');
        setWsSpeakerCompany('');
        setWsSpeakerBio('');
        setWsSpeakerLinkedin('');
        setWsSpeakerAvatar('');
        setWsSpeakerTopics('');
        setWsLeadConvenerName('');
        setWsLeadConvenerPhone('');
        setWsLeadConvenerEmail('');
        setWsDates('Day 1 & Day 2');
        setWsTime('09:30 AM - 04:30 PM');
        setWsVenue('');
        setWsFees('INR 350');
        setWsMaxCapacity('150');
        setWsPrerequisites('');
        setWsTakeaways('');
        setWsSyllabus('');
        setWsRegistrationUrl('');
        setWsGoogleFormUrl('');
        setWsReportPdfUrl('');
        fetchData();
      } else {
        showToast(data.error || 'Failed to delete workshop');
      }
    } catch (err) {
      showToast('Error deleting workshop');
    }
  };

  // Update live attendance counter via PATCH /api/telemetry/live-count
  const handleUpdateLiveCount = async (delta: number) => {
    if (!activeWorkshop) return;
    try {
      const res = await fetch('/api/telemetry/live-count', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'workshop',
          id: activeWorkshop.branch,
          delta,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWorkshops((prev) =>
          prev.map((w) =>
            w.branch === selectedBranch
              ? { ...w, currentRegistered: data.currentRegistered }
              : w
          )
        );
        showToast(`Live attendee count updated to ${data.currentRegistered}`);
      }
    } catch (err) {
      console.error(err);
      showToast('Live count updated');
    }
  };

  // Upload file to institutional cloud media vault (GitHub Storage with jsDelivr CDN)
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    folder: string,
    target: 'workshopPoster' | 'speakerAvatar' | 'eventPoster' | 'document'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      formData.append('branch', selectedBranch);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        const cdnUrl = data.cdnUrl || data.url;
        setUploadedCdnUrl(cdnUrl);
        if (target === 'workshopPoster') setWsPosterUrl(cdnUrl);
        if (target === 'speakerAvatar') setWsSpeakerAvatar(cdnUrl);
        if (target === 'eventPoster') setEvPosterUrl(cdnUrl);
        showToast('Securely stored in Institutional Media Vault!');
      } else {
        showToast(`Upload failed: ${data.error}`);
      }
    } catch (err: any) {
      console.error('File upload error:', err);
      showToast('Failed to upload file');
    } finally {
      setUploadingFile(false);
    }
  };

  // SAVE WORKSHOP (Comprehensive fields to PostgreSQL)
  const handleSaveWorkshop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wsTitle) {
      showToast('Please enter the Workshop Title');
      return;
    }

    setSavingWorkshop(true);
    try {
      const topicsArray = wsSpeakerTopics
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const prereqArray = wsPrerequisites
        .split('\n')
        .map((p) => p.trim())
        .filter(Boolean);

      const takeawaysArray = wsTakeaways
        .split('\n')
        .map((t) => t.trim())
        .filter(Boolean);

      const syllabusArray = wsSyllabus
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        branchCode: selectedBranch,
        editionYear: targetEditionYear,
        title: wsTitle,
        tagline: wsTagline,
        description: wsDescription,
        posterUrl: wsPosterUrl,
        yearLeadName: wsLeadConvenerName,
        yearLeadRole: wsLeadConvenerRole,
        yearLeadPhone: wsLeadConvenerPhone,
        yearLeadEmail: wsLeadConvenerEmail,
        resourcePersonName: wsSpeakerName,
        resourcePersonDesignation: wsSpeakerDesignation,
        resourcePersonCompany: wsSpeakerCompany,
        resourcePersonBio: wsSpeakerBio,
        resourcePersonAvatar: wsSpeakerAvatar,
        resourcePersonLinkedin: wsSpeakerLinkedin,
        resourcePersonTopics: topicsArray,
        dates: wsDates,
        time: wsTime,
        venue: wsVenue,
        fees: wsFees,
        maxCapacity: parseInt(wsMaxCapacity, 10) || 150,
        prerequisites: prereqArray,
        takeaways: takeawaysArray,
        syllabus: syllabusArray,
        registrationUrl: wsRegistrationUrl,
        googleFormUrl: wsGoogleFormUrl,
        reportPdfUrl: wsReportPdfUrl,
      };

      const res = await fetch('/api/workshops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Flagship Workshop for ${selectedBranch} saved successfully!`);
        fetchData();
      } else {
        showToast(data.error || 'Failed to save workshop');
      }
    } catch (err: any) {
      console.error(err);
      showToast('Error saving workshop details');
    } finally {
      setSavingWorkshop(false);
    }
  };

  // OPEN EDIT EVENT MODAL
  const handleStartEditEvent = (ev: FestEvent) => {
    setEditingEventId(ev.id);
    setEvTitle(ev.title || '');
    setEvCategory(ev.category || 'Competitive Coding');
    setEvTagline(ev.tagline || '');
    setEvDescription(ev.description || '');
    setEvPosterUrl(ev.posterUrl || '');
    setEvVenue(ev.venue || 'Campus Lab');
    setEvDay(ev.day || 'Day 2');
    setEvTime(ev.time || '10:00 AM - 01:00 PM');
    setEvTeamSize(ev.teamSize || '1 to 2 Members');
    setEvMaxSlots(ev.maxSlots?.toString() || '50');
    setEvPrizeTotal(ev.prizePool?.total || 'INR 15,000');
    setEvPrizeFirst(ev.prizePool?.first || 'INR 10,000');
    setEvPrizeSecond(ev.prizePool?.second || 'INR 5,000');
    setEvPrizeThird(ev.prizePool?.third || '');
    setEvRules(Array.isArray(ev.rules) ? ev.rules.join('\n') : '');
    
    if (Array.isArray(ev.rounds) && ev.rounds.length > 0) {
      setEvRound1(ev.rounds[0]?.description || ev.rounds[0]?.name || '');
      setEvRound2(ev.rounds[1]?.description || ev.rounds[1]?.name || '');
      setEvRound3(ev.rounds[2]?.description || ev.rounds[2]?.name || '');
    } else {
      setEvRound1('Preliminary Screening: MCQ & Code Logic');
      setEvRound2('Hands-on Implementation Sprint');
      setEvRound3('Final Presentation & Live Jury Evaluation');
    }

    const coords = ev.juniorCoordinators || ev.coordinators || [];
    if (coords[0]) {
      setEvCoord1Name(coords[0].name || '');
      setEvCoord1Phone(coords[0].phone || '');
      setEvCoord1Email(coords[0].email || '');
    } else {
      setEvCoord1Name('');
      setEvCoord1Phone('');
      setEvCoord1Email('');
    }

    if (coords[1]) {
      setEvCoord2Name(coords[1].name || '');
      setEvCoord2Phone(coords[1].phone || '');
      setEvCoord2Email(coords[1].email || '');
    } else {
      setEvCoord2Name('');
      setEvCoord2Phone('');
      setEvCoord2Email('');
    }

    setEvRegistrationUrl(ev.registrationUrl || '');
    setShowEventForm(true);
  };

  const handleResetEventForm = () => {
    setEditingEventId(null);
    setEvTitle('');
    setEvCategory('Competitive Coding');
    setEvTagline('');
    setEvDescription('');
    setEvPosterUrl('');
    setEvVenue('');
    setEvDay('Day 2');
    setEvTime('10:00 AM - 01:00 PM');
    setEvTeamSize('1 to 2 Members');
    setEvMaxSlots('50');
    setEvPrizeTotal('INR 15,000');
    setEvPrizeFirst('INR 10,000');
    setEvPrizeSecond('INR 5,000');
    setEvPrizeThird('');
    setEvRules('');
    setEvRound1('Preliminary Screening: MCQ & Code Logic');
    setEvRound2('Hands-on Implementation Sprint');
    setEvRound3('Final Presentation & Live Jury Evaluation');
    setEvCoord1Name('');
    setEvCoord1Phone('');
    setEvCoord1Email('');
    setEvCoord2Name('');
    setEvCoord2Phone('');
    setEvCoord2Email('');
    setEvRegistrationUrl('');
    setShowEventForm(false);
  };

  // SAVE OR UPDATE TECHNICAL COMPETITION
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evTitle) {
      showToast('Please enter the Competition Title');
      return;
    }

    setSavingEvent(true);
    try {
      const rulesArray = evRules
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean);

      const roundsArray = [
        { roundNumber: 1, name: 'Round 1', description: evRound1 },
        { roundNumber: 2, name: 'Round 2', description: evRound2 },
        { roundNumber: 3, name: 'Final Round', description: evRound3 },
      ].filter((r) => Boolean(r.description));

      const coordinatorsArray = [];
      if (evCoord1Name) {
        coordinatorsArray.push({
          name: evCoord1Name,
          phone: evCoord1Phone,
          email: evCoord1Email,
          role: 'Lead Student Coordinator',
        });
      }
      if (evCoord2Name) {
        coordinatorsArray.push({
          name: evCoord2Name,
          phone: evCoord2Phone,
          email: evCoord2Email,
          role: 'Technical Coordinator',
        });
      }

      const payload = {
        id: editingEventId || undefined,
        branchCode: selectedBranch,
        editionYear: targetEditionYear,
        title: evTitle,
        category: evCategory,
        tagline: evTagline,
        description: evDescription,
        posterUrl: evPosterUrl,
        venue: evVenue || 'Campus Lab',
        day: evDay,
        time: evTime,
        prizePoolTotal: evPrizeTotal,
        prizePoolFirst: evPrizeFirst,
        prizePoolSecond: evPrizeSecond,
        prizePoolThird: evPrizeThird || null,
        teamSize: evTeamSize,
        maxSlots: parseInt(evMaxSlots, 10) || 50,
        rules: rulesArray,
        rounds: roundsArray,
        juniorCoordinators: coordinatorsArray,
        registrationUrl: evRegistrationUrl,
      };

      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showToast(editingEventId ? 'Competition updated successfully!' : 'New Competition published successfully!');
        handleResetEventForm();
        fetchData();
      } else {
        showToast(data.error || 'Failed to save competition');
      }
    } catch (err: any) {
      console.error(err);
      showToast('Error saving competition');
    } finally {
      setSavingEvent(false);
    }
  };

  // DELETE TECHNICAL EVENT
  const handleDeleteEvent = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to remove competition "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/events?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Competition removed successfully');
        fetchData();
      } else {
        showToast(data.error || 'Failed to delete event');
      }
    } catch (err) {
      showToast('Error deleting event');
    }
  };

  // Export roster to CSV
  const handleExportCSV = () => {
    if (registrations.length === 0) {
      showToast(`No registrations recorded yet for ${selectedBranch}`);
      return;
    }

    let csvContent = 'data:text/csv;charset=utf-8,Pass ID,Full Name,Roll Number,College,Branch,Target Event,Status\n';
    registrations.forEach((r) => {
      csvContent += `${r.passToken || ''},"${r.fullName || ''}",${r.rollNumber || ''},"${r.college || ''}",${r.branch || ''},"${r.targetTitle || ''}",${r.paymentStatus || 'Verified'}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `samshodhani_${selectedBranch}_roster.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${registrations.length} delegate records to CSV`);
  };

  // UPLOAD ACTIVITY GALLERY PHOTOS (UP TO 12 PER WORKSHOP / EVENT)
  const handleUploadGalleryPhotos = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!selectedGalleryTarget) {
      showToast('Please select a Workshop or Event to attach photos to');
      return;
    }

    const currentPhotos = galleryPhotos.filter((p) => p.itemId === selectedGalleryTarget.id);
    const remainingSlots = 12 - currentPhotos.length;

    if (remainingSlots <= 0) {
      showToast(`Maximum limit of 12 photos reached for "${selectedGalleryTarget.title}". Delete a photo to upload more.`);
      return;
    }

    const uploadCount = Math.min(files.length, remainingSlots);
    if (files.length > remainingSlots) {
      showToast(`Uploading first ${remainingSlots} photos (12 photo limit per activity).`);
    }

    setUploadingGallery(true);
    let successCount = 0;

    try {
      for (let i = 0; i < uploadCount; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'gallery');
        formData.append('branch', selectedBranch);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadRes.json();

        if (uploadData.success && (uploadData.cdnUrl || uploadData.url)) {
          const imgUrl = uploadData.cdnUrl || uploadData.url;
          const galRes = await fetch('/api/gallery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              editionYear: targetEditionYear,
              branchCode: selectedBranch,
              itemType: selectedGalleryTarget.type,
              itemId: selectedGalleryTarget.id,
              itemTitle: selectedGalleryTarget.title,
              imageUrl: imgUrl,
              caption: galleryCaption || `${selectedGalleryTarget.title} capture`,
            }),
          });
          const galData = await galRes.json();
          if (galData.success) {
            successCount++;
          }
        }
      }

      if (successCount > 0) {
        showToast(`Successfully archived ${successCount} photos to the symposium gallery!`);
        setGalleryCaption('');
        fetchData();
      } else {
        showToast('Failed to upload photos to gallery');
      }
    } catch (err) {
      console.error(err);
      showToast('Error uploading photos to gallery');
    } finally {
      setUploadingGallery(false);
    }
  };

  // DELETE GALLERY PHOTO
  const handleDeleteGalleryPhoto = async (id: number, itemTitle: string) => {
    if (!confirm(`Are you sure you want to remove this photo for "${itemTitle}"?`)) return;
    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Photo removed from symposium gallery');
        fetchData();
      } else {
        showToast(data.error || 'Failed to remove photo');
      }
    } catch (err) {
      showToast('Error removing gallery photo');
    }
  };

  // UPLOAD & UPDATE BRANCH ASSOCIATION LOGO
  const handleUploadBranchLogo = async (file: File | undefined) => {
    if (!file) return;
    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'logo');
      formData.append('branch', selectedBranch);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (uploadData.success && (uploadData.cdnUrl || uploadData.url)) {
        const logoUrl = uploadData.cdnUrl || uploadData.url;
        setBranchLogoUrl(logoUrl);

        const patchRes = await fetch('/api/branches', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            branchCode: selectedBranch,
            logoUrl,
          }),
        });
        const patchData = await patchRes.json();
        if (patchData.success) {
          showToast(`Official logo for ${selectedBranch} updated! Reflected on all workshops and events.`);
          fetchData();
        } else {
          showToast(patchData.error || 'Failed to update branch logo in repository');
        }
      } else {
        showToast('Logo upload failed');
      }
    } catch (err) {
      console.error(err);
      showToast('Error uploading branch logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  // UPLOAD STUDENT BODY EXECUTIVE POSTER
  const handleUploadStudentBodyPoster = async (file: File | undefined) => {
    if (!file) return;
    setUploadingStudentBody(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'student-body');
      formData.append('branch', selectedBranch);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (uploadData.success && (uploadData.cdnUrl || uploadData.url)) {
        const posterUrl = uploadData.cdnUrl || uploadData.url;
        setBranchStudentBodyPoster(posterUrl);
        showToast('Executive poster uploaded! Fill in leadership details and click Save.');
      } else {
        showToast('Executive poster upload failed');
      }
    } catch (err) {
      console.error(err);
      showToast('Error uploading student body poster');
    } finally {
      setUploadingStudentBody(false);
    }
  };

  // SAVE STUDENT BODY EXECUTIVE POSTER & LEADERSHIP DETAILS
  const handleRemoveStudentBodyPoster = async () => {
    if (!confirm('Remove the executive poster? The title and details stay, and you can upload another later.')) return;
    try {
      const res = await fetch(`/api/student-body?branch=${selectedBranch}&year=${targetEditionYear}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setBranchStudentBodyPoster('');
        showToast('Executive poster removed');
        fetchData();
      } else {
        showToast(data.error || 'Could not remove the poster');
      }
    } catch (err) {
      console.error(err);
      showToast('Error removing the poster');
    }
  };

  const handleRemoveBranchLogo = async () => {
    if (!confirm(`Remove the ${selectedBranch} association logo?`)) return;
    try {
      const res = await fetch('/api/branches', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branchCode: selectedBranch, logoUrl: '' }),
      });
      const data = await res.json();
      if (data.success) {
        setBranchLogoUrl('');
        showToast('Association logo removed');
        fetchData();
      } else {
        showToast(data.error || 'Could not remove the logo');
      }
    } catch (err) {
      console.error(err);
      showToast('Error removing the logo');
    }
  };

  const handleSaveStudentBody = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingStudentBody(true);
    try {
      const res = await fetch('/api/student-body', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          editionYear: targetEditionYear,
          branchCode: selectedBranch,
          posterUrl: branchStudentBodyPoster,
          title: branchStudentBodyTitle || `${selectedBranch} Executive Student Body`,
          description: branchStudentBodyDesc,
          facultyAdvisor: branchFacultyAdvisor,
          studentPresident: branchStudentPresident,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(branchStudentBodyPoster ? `Student body details and poster saved for Edition ${targetEditionYear}` : `Student body details saved for Edition ${targetEditionYear}`);
        fetchData();
      } else {
        showToast(data.error || 'Failed to publish student body poster');
      }
    } catch (err) {
      console.error(err);
      showToast('Error publishing student body poster');
    } finally {
      setSavingStudentBody(false);
    }
  };

  // UPLOAD SPEAKER / RESOURCE PERSON PHOTO
  const handleUploadSpeakerImage = async (file: File | undefined) => {
    if (!file) return;
    setUploadingSpeakerImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'speakers');
      formData.append('branch', selectedBranch);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (uploadData.success && (uploadData.cdnUrl || uploadData.url)) {
        const avatarUrl = uploadData.cdnUrl || uploadData.url;
        setWsSpeakerAvatar(avatarUrl);
        showToast('Resource Person photograph uploaded successfully!');
      } else {
        showToast('Speaker photo upload failed');
      }
    } catch (err) {
      console.error(err);
      showToast('Error uploading speaker image');
    } finally {
      setUploadingSpeakerImage(false);
    }
  };

  // UPDATE CURRENT EDITION DATES & SETTINGS
  const handleUpdateEditionDates = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingEdition(true);
    try {
      const res = await fetch('/api/editions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: targetEditionYear,
          dates: editEditionDates,
          theme: editEditionTheme,
          name: editEditionName,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Edition ${targetEditionYear} dates updated to "${editEditionDates}"!`);
        setShowEditEditionModal(false);
        fetchData();
      } else {
        showToast(data.error || 'Failed to update edition dates');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error while updating edition dates');
    } finally {
      setUpdatingEdition(false);
    }
  };


  if (!isLoggedIn) {
    const LOGIN_BRANCHES = ['CSE', 'CSM', 'CSN', 'IT', 'ECE', 'ECV', 'EEE', 'ME', 'CE', 'I2RE', 'MBA', 'ISTE', 'TECH', 'CSI', 'CSC', 'SAC'];
    const isAdminLogin = username.trim().toLowerCase() === ADMIN_EMAIL;
    const assoc = BRANCH_ORGANIZER_DEFAULTS[selectedBranch];
    const fieldClass =
      'w-full px-4 py-3 text-sm font-medium bg-paper border-2 border-ink rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-cobalt-200 transition-colors placeholder-slate-500';

    return (
      <div className="max-w-5xl mx-auto my-2 grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* Left: context */}
        <div className="lg:col-span-5 relative rounded-[28px] border-2 border-ink bg-cobalt-500 text-white p-7 sm:p-9 overflow-hidden shadow-pop-lg flex flex-col justify-between min-h-[320px]">
          <div className="absolute inset-0 dots" aria-hidden="true" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-marigold-400 text-ink border-2 border-ink text-sm font-bold -rotate-2">
              <ShieldCheck className="w-4 h-4" /> Organizer portal
            </span>
            <h2 className="mt-6 font-display uppercase text-2xl sm:text-3xl leading-[1.05] text-white break-words">Run your association&apos;s fest</h2>
            <p className="mt-4 text-base text-white/90 leading-snug max-w-sm">
              Publish your workshop and competitions, add photos, set the registration link and update your student body page.
            </p>
          </div>
          <ul className="relative mt-8 space-y-2.5 text-sm font-semibold">
            {['Workshop and competition listings', 'Photos and posters', 'Registration form link', 'Student body details'].map((t) => (
              <li key={t} className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-white text-ink border-2 border-ink flex items-center justify-center text-[0.7rem]" aria-hidden="true">✓</span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: form */}
        <form onSubmit={handleLogin} className="lg:col-span-7 rounded-[28px] border-2 border-ink bg-white p-6 sm:p-9 shadow-pop-lg space-y-6" noValidate>
          <div>
            <h3 className="font-display text-2xl sm:text-3xl text-ink leading-[1.05]">Sign in</h3>
            <p className="mt-1.5 text-sm text-slate-600">Pick your association, then enter your username and password.</p>
          </div>

          {loginError && (
            <p role="alert" className="p-3.5 rounded-2xl bg-coral-50 border-2 border-coral-300 text-sm font-semibold text-coral-700">
              {loginError}
            </p>
          )}

          <fieldset>
            <legend className="text-sm font-bold text-ink mb-2.5">Association</legend>
            <div className="flex flex-wrap gap-2">
              {LOGIN_BRANCHES.map((b) => {
                const on = selectedBranch === b && !isAdminLogin;
                return (
                  <button
                    type="button"
                    key={b}
                    aria-pressed={on}
                    onClick={() => {
                      setSelectedBranch(b);
                      setUsername((BRANCH_ORGANIZER_DEFAULTS[b]?.association || b).toLowerCase().replace(/\s+/g, ''));
                      setPassword('');
                      setLoginError(null);
                    }}
                    className={`px-3.5 py-1.5 rounded-full border-2 text-sm font-bold transition-colors ${
                      on ? 'bg-ink text-white border-ink' : 'bg-white text-ink border-slate-300 hover:border-ink hover:bg-lilac-100'
                    }`}
                    title={BRANCH_ORGANIZER_DEFAULTS[b]?.fullName}
                  >
                    {BRANCH_ORGANIZER_DEFAULTS[b]?.association || b}
                  </button>
                );
              })}
            </div>
            {!isAdminLogin && assoc && <p className="mt-2.5 text-sm text-slate-600">{assoc.fullName}</p>}
          </fieldset>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="org-username" className="block text-sm font-bold text-ink mb-1.5">Username</label>
              <input
                id="org-username"
                type="text"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                value={username}
                onChange={(e) => { setUsername(e.target.value); setLoginError(null); }}
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="org-password" className="block text-sm font-bold text-ink mb-1.5">Password</label>
              <div className="relative">
                <input
                  id="org-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  placeholder={isAdminLogin ? 'Admin password' : 'dept@sumshodhini'}
                  onChange={(e) => { setPassword(e.target.value); setLoginError(null); }}
                  className={`${fieldClass} pr-20`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full text-xs font-bold text-ink hover:bg-lilac-100"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="pop w-full py-3.5 rounded-full bg-marigold-400 text-ink font-bold text-base flex items-center justify-center gap-2"
          >
            <Key className="w-4 h-4" />
            Sign in
          </button>

          <p className="text-sm text-slate-600">
            Your password is your department code followed by <span className="font-mono font-semibold text-ink">@sumshodhini</span>.
            Forgot it? Ask the festival admin.
          </p>

          <div className="pt-5 border-t-2 border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-slate-600">Festival organiser?</span>
            <button
              type="button"
              onClick={() => { setUsername(ADMIN_EMAIL); setPassword(''); setLoginError(null); }}
              className="px-4 py-2 rounded-full border-2 border-ink bg-white hover:bg-marigold-200 text-sm font-bold text-ink"
            >
              Admin sign in
            </button>
          </div>
        </form>
      </div>
    );
  }

  const branchMeta = BRANCH_ORGANIZER_DEFAULTS[selectedBranch] || BRANCH_ORGANIZER_DEFAULTS['CSE'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-teal-900 text-white px-4 py-3 rounded-2xl shadow-xl text-sm font-bold flex items-center gap-2.5 border border-slate-700 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 rounded-[28px] bg-cobalt-500 border-2 border-ink shadow-pop text-white flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative group shrink-0">
            {branchLogoUrl ? (
              <div className="w-14 h-14 rounded-2xl bg-white p-1 shadow-md border border-white/40 overflow-hidden flex items-center justify-center">
                <img src={branchLogoUrl} alt={branchMeta.association} className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-ink text-white/80 border border-white/40 flex flex-col items-center justify-center text-center p-1">
                <span className="font-bold text-sm text-white">{selectedBranch}</span>
                <span className="text-sm text-white/80 font-mono">Logo</span>
              </div>
            )}
            <label 
              className="absolute inset-0 bg-black/75 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-sm font-bold text-white text-center p-1"
              title="Upload or Change Official Association Logo"
            >
              <span>Upload Logo</span>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => handleUploadBranchLogo(e.target.files?.[0])}
                disabled={uploadingLogo}
              />
            </label>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-sm font-semibold bg-ink text-white border border-white/40">
                KITSW SAMSHODHINI &apos;{String(targetEditionYear).slice(-2)}
              </span>
              <span className="px-2.5 py-0.5 rounded text-sm font-bold bg-white/20 text-white border border-white/40">
                {branchMeta.association}
              </span>
              {isAdmin && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-marigold-300 text-ink border-2 border-ink">
                  Festival admin
                </span>
              )}
              {uploadingLogo && (
                <span className="text-sm text-marigold-300 font-bold animate-pulse">Uploading logo...</span>
              )}
            </div>
            <h1 className="font-display text-2xl sm:text-2xl leading-[1.05] text-white">
              {branchMeta.fullName} ({selectedBranch})
            </h1>
            <p className="text-sm text-white/80 flex items-center gap-2">
              <span>Official Department Portal</span>
              <span>•</span>
              <label className="text-marigold-300 hover:text-marigold-200 font-bold cursor-pointer underline text-sm">
                {branchLogoUrl ? 'Change Logo' : 'Upload Association Logo'}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => handleUploadBranchLogo(e.target.files?.[0])}
                  disabled={uploadingLogo}
                />
              </label>
              {branchLogoUrl && (
                <>
                  <span>•</span>
                  <button type="button" onClick={handleRemoveBranchLogo} className="text-white/90 hover:text-white font-bold underline text-sm">
                    Remove logo
                  </button>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Target Academic Edition Selector */}
          <div className="flex items-center gap-1.5 bg-ink px-3 py-1.5 rounded-xl border border-white/40">
            <Calendar className="w-3.5 h-3.5 text-marigold-300 shrink-0" />
            <span className="text-sm font-mono text-white/80 font-bold">Year:</span>
            <select
              value={targetEditionYear}
              onChange={(e) => setTargetEditionYear(parseInt(e.target.value, 10))}
              className="bg-transparent text-white text-sm font-bold outline-none cursor-pointer"
            >
              {editions.map((ed) => (
                <option key={ed.year} value={ed.year} className="bg-teal-900 text-white">
                  {ed.year} {ed.isActive ? '(Live)' : '(Archived)'}
                </option>
              ))}
            </select>
          </div>

          {/* Edit Current Edition Dates Button */}
          <button
            type="button"
            onClick={() => setShowEditEditionModal(true)}
            className="px-3 py-2 rounded-full bg-ink hover:bg-cobalt-800 text-sm font-bold text-white border border-white/40 transition-all flex items-center gap-1.5 "
            title="Change Dates for this Edition"
          >
            <Clock className="w-3.5 h-3.5 text-marigold-300" />
            <span>Dates: {editEditionDates.split(',')[0]}</span>
          </button>

          {/* New Year Edition Modal Opener */}
          <button
            type="button"
            onClick={() => setShowNewEditionModal(true)}
            className="px-3 py-2 rounded-full bg-marigold-400 text-ink hover:bg-marigold-300 text-sm font-bold text-white transition-all flex items-center gap-1.5 "
            title="Initialize New Academic Edition (e.g., 2027, 2028)"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Year</span>
          </button>

          {/* STRICT ACCESS CONTROL: Locked to Authenticated Branch */}
          {isAdmin ? (
            <label className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-marigold-300 border-2 border-ink text-sm font-bold text-ink">
              <span>Managing</span>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="bg-transparent font-bold outline-none cursor-pointer"
                aria-label="Branch to manage"
              >
                {['CE', 'ME', 'EEE', 'ECE', 'CSE', 'IT', 'CSN', 'CSM', 'ECV', 'CSC', 'I2RE', 'MBA', 'ISTE', 'TECH', 'CSI', 'SAC'].map((b) => (
                  <option key={b} value={b}>
                    {b} ({BRANCH_ORGANIZER_DEFAULTS[b]?.association})
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-ink border-2 border-white/40 text-sm font-bold text-white">
              <span className="w-2 h-2 rounded-full bg-mint-300"></span>
              <span>{selectedBranch} ({branchMeta.association})</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleSignOut}
            className="px-3.5 py-2 rounded-full bg-white hover:bg-coral-100 text-sm font-bold text-ink border-2 border-ink transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 text-sm font-bold overflow-x-auto scrollbar-none pb-2 px-1">
        <button
          onClick={() => setActiveTab('workshop')}
          className={`px-4 py-2 rounded-full border-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'workshop'
              ? 'bg-ink text-white border-ink font-bold'
              : 'bg-white text-ink border-slate-300 hover:border-ink'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Flagship Workshop (1 per Branch)</span>
          {activeWorkshop && (
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 rounded-full border-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'events'
              ? 'bg-ink text-white border-ink font-bold'
              : 'bg-white text-ink border-slate-300 hover:border-ink'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Technical Competitions & Events ({activeEvents.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('gallery');
            if (!selectedGalleryTarget) {
              if (activeWorkshop) {
                setSelectedGalleryTarget({
                  id: activeWorkshop.id || activeWorkshop.branch,
                  type: 'workshop',
                  title: activeWorkshop.title,
                });
              } else if (activeEvents.length > 0) {
                setSelectedGalleryTarget({
                  id: activeEvents[0].id,
                  type: 'event',
                  title: activeEvents[0].title,
                });
              }
            }
          }}
          className={`px-4 py-2 rounded-full border-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'gallery'
              ? 'bg-ink text-white border-ink font-bold'
              : 'bg-white text-ink border-slate-300 hover:border-ink'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Activity Photo Gallery ({galleryPhotos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('studentBody')}
          className={`px-4 py-2 rounded-full border-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'studentBody'
              ? 'bg-ink text-white border-ink font-bold'
              : 'bg-white text-ink border-slate-300 hover:border-ink'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Student Body Poster</span>
          {branchStudentBodyPoster && (
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('archive')}
          className={`px-4 py-2 rounded-full border-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'archive'
              ? 'bg-ink text-white border-ink font-bold'
              : 'bg-white text-ink border-slate-300 hover:border-ink'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Event Media & Posters Vault</span>
        </button>

        {isAdmin && (
          <button
            onClick={() => setActiveTab('poster')}
            className={`px-4 py-2 rounded-full border-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'poster' ? 'bg-ink text-white border-ink font-bold' : 'bg-marigold-300 text-ink border-ink hover:bg-marigold-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Main poster (admin)</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('roster')}
          className={`px-4 py-2 rounded-full border-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'roster'
              ? 'bg-ink text-white border-ink font-bold'
              : 'bg-white text-ink border-slate-300 hover:border-ink'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Registered Delegates ({registrations.length})</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: FLAGSHIP WORKSHOP MANAGEMENT (EXACTLY 1 PER BRANCH) */}
      {/* ======================================================== */}
      {isAdmin && activeTab === 'poster' && (
        <AdminPosterPanel
          year={targetEditionYear}
          posterUrl={editions.find((ed) => ed.year === targetEditionYear)?.posterUrl}
          adminToken={adminToken}
          notify={showToast}
          onSaved={(url) =>
            setEditions((list) => list.map((ed) => (ed.year === targetEditionYear ? { ...ed, posterUrl: url } : ed)))
          }
        />
      )}

      {activeTab === 'workshop' && (
        <form onSubmit={handleSaveWorkshop} className="space-y-6">
          <div className="bg-white rounded-[28px] border-2 border-ink shadow-pop p-6 sm:p-8 space-y-8 ">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-200 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-2xl text-ink">
                    Flagship Workshop Registration & Management
                  </h3>
                  <span className="px-2 py-0.5 rounded text-sm font-bold bg-blue-50 text-blue-800 border border-blue-200">
                    {selectedBranch} Association Flagship
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  Every engineering branch organizes exactly one authoritative, hands-on workshop led by senior student conveners and domain specialists.
                </p>
              </div>

              {/* ACTIONS: ATTENDANCE & DELETE */}
              {activeWorkshop ? (
                <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-2xl border-2 border-ink text-sm">
                    <span className="font-bold text-slate-700">Attendees:</span>
                    <button
                      type="button"
                      onClick={() => handleUpdateLiveCount(-1)}
                      className="w-6 h-6 rounded bg-white border border-slate-300 font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-center transition-colors"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-slate-900 text-sm px-1">
                      {activeWorkshop.currentRegistered}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateLiveCount(1)}
                      className="w-6 h-6 rounded bg-teal-900 text-white font-bold hover:bg-teal-800 flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleDeleteWorkshop}
                    className="px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-700 text-sm font-bold border border-red-200 transition-colors flex items-center gap-1.5 "
                    title="Delete this Flagship Workshop"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                    <span>Delete Workshop</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedGalleryTarget({
                        id: activeWorkshop.id || activeWorkshop.branch,
                        type: 'workshop',
                        title: activeWorkshop.title,
                      });
                      setActiveTab('gallery');
                    }}
                    className="px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-800 text-sm font-bold border border-blue-200 transition-colors flex items-center gap-1.5 "
                    title="Upload or manage photos for this workshop (up to 12 photos)"
                  >
                    <Camera className="w-3.5 h-3.5 text-blue-600" />
                    <span>Gallery Photos ({galleryPhotos.filter((p) => p.itemId === (activeWorkshop.id || activeWorkshop.branch)).length}/12)</span>
                  </button>
                </div>
              ) : (
                <span className="text-sm px-3 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-bold">
                  New Workshop Record
                </span>
              )}
            </div>

            {/* SECTION 1: Core Workshop Details & Poster */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Poster Column */}
              <div className="md:col-span-4 space-y-3">
                <label className="block text-sm font-bold text-slate-800">
                  Dedicated Workshop Poster *
                </label>
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-50 border-2 border-slate-300 flex items-center justify-center relative ">
                  {wsPosterUrl ? (
                    <img 
                      src={wsPosterUrl} 
                      alt="Workshop Poster Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400">
                      <BookOpen className="w-10 h-10 text-slate-300 mb-2" />
                      <span className="text-sm font-bold text-slate-700">No Workshop Poster Set</span>
                      <span className="text-sm text-slate-400 mt-1">Upload official poster below</span>
                    </div>
                  )}
                </div>

                {/* File Upload to Media Vault */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-300 space-y-2">
                  <label className="block text-sm font-bold text-slate-700">
                    Upload Official Poster File
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'workshops', 'workshopPoster')}
                    className="block w-full text-sm text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-teal-900 file:text-white hover:file:bg-slate-800 cursor-pointer"
                  />
                  {uploadingFile && (
                    <p className="text-sm text-blue-600 font-medium">Uploading official poster file...</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Direct Poster URL (or paste external link)
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={wsPosterUrl}
                    onChange={(e) => setWsPosterUrl(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border-2 border-ink rounded-2xl outline-none font-mono text-slate-800"
                  />
                  {wsPosterUrl && (
                    <button
                      type="button"
                      onClick={() => { setWsPosterUrl(''); showToast('Poster removed. Save the workshop to apply.'); }}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-ink bg-white hover:bg-coral-100 text-sm font-bold"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove poster
                    </button>
                  )}
                </div>
              </div>

              {/* Title & Tagline & Description Column */}
              <div className="md:col-span-8 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1.5">
                    Flagship Workshop Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Architecting Distributed Intelligence & Scalable Cloud Microservices"
                    value={wsTitle}
                    onChange={(e) => setWsTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm font-bold bg-white border-2 border-ink rounded-2xl outline-none focus:border-slate-400 focus:bg-white transition-colors text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1.5">
                    Workshop Tagline / Catchphrase *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Master modern enterprise architecture with hands-on systems engineering labs"
                    value={wsTagline}
                    onChange={(e) => setWsTagline(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border-2 border-ink rounded-2xl outline-none focus:border-slate-400 focus:bg-white transition-colors text-slate-800 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1.5">
                    Comprehensive Abstract & Syllabus Overview
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Detailed academic description of the workshop, technologies covered, real-world relevance, and laboratory execution flow..."
                    value={wsDescription}
                    onChange={(e) => setWsDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border-2 border-ink rounded-2xl outline-none focus:border-slate-400 focus:bg-white transition-colors text-slate-800 leading-relaxed resize-none"
                  />
                </div>

                {/* Logistics Sub-Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Dates</label>
                    <input
                      type="text"
                      placeholder="Day 1 & Day 2"
                      value={wsDates}
                      onChange={(e) => setWsDates(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border-2 border-ink rounded-2xl outline-none text-slate-800 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Time</label>
                    <input
                      type="text"
                      placeholder="09:30 AM - 04:30 PM"
                      value={wsTime}
                      onChange={(e) => setWsTime(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border-2 border-ink rounded-2xl outline-none text-slate-800 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Campus Venue / Hall</label>
                    <input
                      type="text"
                      placeholder="Silver Jubilee Seminar Hall"
                      value={wsVenue}
                      onChange={(e) => setWsVenue(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border-2 border-ink rounded-2xl outline-none text-slate-800 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Fee (INR)</label>
                    <input
                      type="text"
                      placeholder="INR 350"
                      value={wsFees}
                      onChange={(e) => setWsFees(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border-2 border-ink rounded-2xl outline-none text-slate-800 font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Max Delegate Capacity</label>
                    <input
                      type="number"
                      placeholder="150"
                      value={wsMaxCapacity}
                      onChange={(e) => setWsMaxCapacity(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border-2 border-ink rounded-2xl outline-none text-slate-800 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Registration link (Google Form)</label>
                    <input
                      type="url"
                      placeholder="https://forms.gle/..."
                      value={wsRegistrationUrl}
                      onChange={(e) => setWsRegistrationUrl(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border-2 border-ink rounded-2xl outline-none text-slate-800 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Keynote Speaker / Resource Person Full Dossier */}
            <div className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-300 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-600" />
                  <span>Keynote Speaker & Resource Person Dossier</span>
                </h4>
                <span className="text-sm text-slate-500 font-medium">Industry Expert / Research Scientist</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Speaker Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Anand Ramakrishnan"
                    value={wsSpeakerName}
                    onChange={(e) => setWsSpeakerName(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border-2 border-ink rounded-2xl outline-none font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. Principal Systems Architect"
                    value={wsSpeakerDesignation}
                    onChange={(e) => setWsSpeakerDesignation(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border-2 border-ink rounded-2xl outline-none text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Company / Institution *</label>
                  <input
                    type="text"
                    placeholder="e.g. Microsoft Research India"
                    value={wsSpeakerCompany}
                    onChange={(e) => setWsSpeakerCompany(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border-2 border-ink rounded-2xl outline-none font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">LinkedIn Profile Link</label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/..."
                    value={wsSpeakerLinkedin}
                    onChange={(e) => setWsSpeakerLinkedin(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border-2 border-ink rounded-2xl outline-none font-mono text-slate-800"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-bold text-slate-700">Speaker / Resource Person Photo</label>
                    {uploadingSpeakerImage && <span className="text-sm text-blue-600 animate-pulse font-bold">Uploading...</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    {wsSpeakerAvatar ? (
                      <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-300 shrink-0 bg-slate-100">
                        <img src={wsSpeakerAvatar} alt="Speaker" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full border border-dashed border-slate-300 flex items-center justify-center shrink-0 bg-white text-slate-400">
                        <Users className="w-4 h-4" />
                      </div>
                    )}
                    <input
                      type="url"
                      placeholder="Paste image URL or upload photo"
                      value={wsSpeakerAvatar}
                      onChange={(e) => setWsSpeakerAvatar(e.target.value)}
                      className="flex-1 px-3 py-2 text-sm bg-white border-2 border-ink rounded-2xl outline-none font-mono text-slate-800"
                    />
                    {wsSpeakerAvatar && (
                      <button
                        type="button"
                        onClick={() => setWsSpeakerAvatar('')}
                        aria-label="Remove speaker photo"
                        title="Remove speaker photo"
                        className="shrink-0 w-9 h-9 rounded-full border-2 border-ink bg-white hover:bg-coral-100 flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <label className="cursor-pointer px-3 py-2 bg-teal-900 hover:bg-teal-800 text-white rounded-full text-sm font-bold transition-colors flex items-center gap-1.5 shrink-0 ">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingSpeakerImage ? '...' : 'Upload'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleUploadSpeakerImage(e.target.files?.[0])}
                        disabled={uploadingSpeakerImage}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Topics / Modules Instructed (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Consensus Algorithms, Event-Driven Streaming, Kubernetes Internals, Zero-Trust Architecture"
                  value={wsSpeakerTopics}
                  onChange={(e) => setWsSpeakerTopics(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border-2 border-ink rounded-2xl outline-none text-slate-800"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Speaker Biography & Research Credentials</label>
                <textarea
                  rows={2}
                  placeholder="20+ years in distributed compute systems, led low-latency query engine engineering, published at ACM SIGCOMM..."
                  value={wsSpeakerBio}
                  onChange={(e) => setWsSpeakerBio(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border-2 border-ink rounded-2xl outline-none text-slate-800 resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* SECTION 3: Lead Student Convener & Faculty Coordination */}
            <div className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-300 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-slate-600" />
                  <span>Lead Student Convener & Faculty In-Charge</span>
                </h4>
                <span className="text-sm text-slate-500 font-medium">Departmental Organizing Committee</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Lead Convener Name</label>
                  <input
                    type="text"
                    placeholder="e.g. K. Sai Srinivas"
                    value={wsLeadConvenerName}
                    onChange={(e) => setWsLeadConvenerName(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border-2 border-ink rounded-2xl outline-none font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Role / Designation</label>
                  <input
                    type="text"
                    placeholder="Lead Student Convener (Final Year)"
                    value={wsLeadConvenerRole}
                    onChange={(e) => setWsLeadConvenerRole(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border-2 border-ink rounded-2xl outline-none text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98480 12345"
                    value={wsLeadConvenerPhone}
                    onChange={(e) => setWsLeadConvenerPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border-2 border-ink rounded-2xl outline-none font-mono text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">College Email</label>
                  <input
                    type="email"
                    placeholder="ace_conveners@kitsw.ac.in"
                    value={wsLeadConvenerEmail}
                    onChange={(e) => setWsLeadConvenerEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border-2 border-ink rounded-2xl outline-none font-mono text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 4: Academic Curriculum, Prerequisites & Takeaways */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-300 space-y-2">
                <label className="block text-sm font-bold text-slate-800">
                  Prerequisites (1 per line)
                </label>
                <textarea
                  rows={4}
                  placeholder="Basic familiarity with algorithms&#10;Laptop with Linux or macOS/WSL&#10;Installed Docker Desktop"
                  value={wsPrerequisites}
                  onChange={(e) => setWsPrerequisites(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border-2 border-ink rounded-2xl outline-none text-slate-800 resize-none font-medium leading-relaxed"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-300 space-y-2">
                <label className="block text-sm font-bold text-slate-800">
                  Key Takeaways & Benefits (1 per line)
                </label>
                <textarea
                  rows={4}
                  placeholder="ISTE KITSW Accredited Certificate&#10;Production-grade microservices repo&#10;Direct placement internship referrals"
                  value={wsTakeaways}
                  onChange={(e) => setWsTakeaways(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border-2 border-ink rounded-2xl outline-none text-slate-800 resize-none font-medium leading-relaxed"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-300 space-y-2">
                <label className="block text-sm font-bold text-slate-800">
                  Syllabus Outline (1 module per line)
                </label>
                <textarea
                  rows={4}
                  placeholder="Day 1 Morning: Distributed Fundamentals & CAP Theorem&#10;Day 1 Afternoon: Hands-on gRPC and Event Streams&#10;Day 2: Live Cluster Orchestration Lab"
                  value={wsSyllabus}
                  onChange={(e) => setWsSyllabus(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border-2 border-ink rounded-2xl outline-none text-slate-800 resize-none font-medium leading-relaxed"
                />
              </div>
            </div>

            {/* Save / Delete Workshop Actions */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-slate-100">
              {activeWorkshop && (
                <button
                  type="button"
                  onClick={handleDeleteWorkshop}
                  className="px-5 py-3 rounded-full bg-red-50 hover:bg-red-100 text-red-700 font-bold text-sm border border-red-200 transition-colors flex items-center gap-1.5 "
                  title="Permanently remove this flagship workshop"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                  <span>Delete Workshop</span>
                </button>
              )}
              <button
                type="submit"
                disabled={savingWorkshop}
                className="px-6 py-3 rounded-full bg-teal-900 hover:bg-teal-800 text-white font-bold text-sm shadow-md transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>
                  {savingWorkshop ? 'Saving...' : activeWorkshop ? 'Update Flagship Workshop' : 'Publish Flagship Workshop'}
                </span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ======================================================== */}
      {/* TAB 2: TECHNICAL COMPETITIONS & EVENTS (MULTIPLE PER BRANCH) */}
      {/* ======================================================== */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="bg-white rounded-[28px] border-2 border-ink shadow-pop p-6 sm:p-8 space-y-6 ">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-200 pb-5">
              <div>
                <h3 className="font-display text-2xl text-ink">
                  Technical Competitions & Challenges
                </h3>
                <p className="text-sm text-slate-500 mt-0.5">
                  Every branch organizes multiple competitive contests (Hackathons, Coding Sprints, Paper Presentations, Robotics, Circuit Debugging, Quizzes).
                </p>
              </div>

              {!showEventForm && (
                <button
                  type="button"
                  onClick={() => {
                    handleResetEventForm();
                    setShowEventForm(true);
                  }}
                  className="px-4 py-2.5 rounded-full bg-teal-900 hover:bg-teal-800 text-white font-bold text-sm flex items-center gap-2 transition-colors self-start sm:self-auto "
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Competition</span>
                </button>
              )}
            </div>

            {/* EXPANDABLE ADD/EDIT COMPETITION FORM */}
            {showEventForm && (
              <form onSubmit={handleSaveEvent} className="p-6 rounded-2xl bg-slate-50 border-2 border-slate-300 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span>{editingEventId ? 'Edit Technical Competition' : `Register New Competition for ${selectedBranch}`}</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleResetEventForm}
                    className="p-1 rounded-lg hover:bg-slate-200 text-slate-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Dedicated Event Poster Column */}
                  <div className="md:col-span-4 space-y-3">
                    <label className="block text-sm font-bold text-slate-800">
                      Dedicated Competition Poster *
                    </label>
                    <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-white border-2 border-slate-300 flex items-center justify-center relative ">
                      {evPosterUrl ? (
                        <img 
                          src={evPosterUrl} 
                          alt="Competition Poster"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400">
                          <Trophy className="w-10 h-10 text-slate-300 mb-2" />
                          <span className="text-sm font-bold text-slate-700">No Event Poster Set</span>
                          <span className="text-sm text-slate-400 mt-1">Upload event poster below</span>
                        </div>
                      )}
                    </div>

                    <div className="p-3 rounded-xl bg-white border-2 border-slate-300 space-y-2">
                      <label className="block text-sm font-bold text-slate-700">
                        Upload to Institutional Media Vault
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'events', 'eventPoster')}
                        className="block w-full text-sm text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-teal-900 file:text-white hover:file:bg-slate-800 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">
                        Direct Poster URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={evPosterUrl}
                        onChange={(e) => setEvPosterUrl(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border-2 border-ink rounded-2xl outline-none font-mono text-slate-800"
                      />
                      {evPosterUrl && (
                        <button
                          type="button"
                          onClick={() => { setEvPosterUrl(''); showToast('Poster removed. Save the competition to apply.'); }}
                          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-ink bg-white hover:bg-coral-100 text-sm font-bold"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove poster
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Fields Column */}
                  <div className="md:col-span-8 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-bold text-slate-800 mb-1">
                          Competition Title *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. CodeSprint 2026: Algorithmic Grand Prix"
                          value={evTitle}
                          onChange={(e) => setEvTitle(e.target.value)}
                          className="w-full px-3 py-2 text-sm font-bold bg-white border-2 border-ink rounded-2xl outline-none text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-800 mb-1">
                          Competition Category *
                        </label>
                        <select
                          value={evCategory}
                          onChange={(e) => setEvCategory(e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-white border-2 border-ink rounded-2xl outline-none font-semibold text-slate-800"
                        >
                          <option value="Competitive Coding">Competitive Coding</option>
                          <option value="24-Hour Hackathon">24-Hour Hackathon</option>
                          <option value="Paper & Poster Presentation">Paper & Poster Presentation</option>
                          <option value="Combat Robotics & Line Follower">Combat Robotics & Line Follower</option>
                          <option value="Circuit Debugging & Hardware Sprint">Circuit Debugging & Hardware Sprint</option>
                          <option value="CAD Modeling & Structural Design">CAD Modeling & Structural Design</option>
                          <option value="Project Innovation Expo">Project Innovation Expo</option>
                          <option value="Technical Quiz & Brainstorm">Technical Quiz & Brainstorm</option>
                          <option value="Web Development Sprint">Web Development Sprint</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-800 mb-1">
                        Tagline / Short Pitch *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 3-hour speed coding marathon evaluating runtime complexity and algorithmic mastery"
                        value={evTagline}
                        onChange={(e) => setEvTagline(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border-2 border-ink rounded-2xl outline-none text-slate-800 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-800 mb-1">
                        Detailed Problem Scope & Guidelines
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Provide deep contest description, problem statements, allowed programming languages, libraries, and hardware specifications..."
                        value={evDescription}
                        onChange={(e) => setEvDescription(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border-2 border-ink rounded-2xl outline-none text-slate-800 resize-none leading-relaxed"
                      />
                    </div>

                    {/* Logistics Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Event Day</label>
                        <select
                          value={evDay}
                          onChange={(e) => setEvDay(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-sm bg-white border-2 border-ink rounded-2xl outline-none font-semibold text-slate-800"
                        >
                          <option value="Day 1">Day 1</option>
                          <option value="Day 2">Day 2</option>
                          <option value="Day 3">Day 3</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Time Slot</label>
                        <input
                          type="text"
                          placeholder="10:00 AM - 01:00 PM"
                          value={evTime}
                          onChange={(e) => setEvTime(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-sm bg-white border-2 border-ink rounded-2xl outline-none font-semibold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Campus Venue</label>
                        <input
                          type="text"
                          placeholder="CSE Central Lab 3"
                          value={evVenue}
                          onChange={(e) => setEvVenue(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-sm bg-white border-2 border-ink rounded-2xl outline-none font-semibold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Team Size</label>
                        <input
                          type="text"
                          placeholder="1 to 2 Members"
                          value={evTeamSize}
                          onChange={(e) => setEvTeamSize(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-sm bg-white border-2 border-ink rounded-2xl outline-none font-semibold text-slate-800"
                        />
                      </div>
                    </div>

                    {/* Cash Prize Pool Breakdown */}
                    <div className="p-3.5 rounded-xl bg-white border-2 border-slate-300 space-y-2">
                      <span className="block text-sm font-bold text-slate-800">
                        Cash Prize Pool Breakdown
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div>
                          <label className="text-sm text-slate-500 font-semibold block">Total Pool</label>
                          <input
                            type="text"
                            placeholder="INR 15,000"
                            value={evPrizeTotal}
                            onChange={(e) => setEvPrizeTotal(e.target.value)}
                            className="w-full px-2 py-1 bg-white border-2 border-ink rounded-2xl text-sm font-bold text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-slate-500 font-semibold block">1st Prize</label>
                          <input
                            type="text"
                            placeholder="INR 10,000"
                            value={evPrizeFirst}
                            onChange={(e) => setEvPrizeFirst(e.target.value)}
                            className="w-full px-2 py-1 bg-white border-2 border-ink rounded-2xl text-sm font-bold text-emerald-800"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-slate-500 font-semibold block">2nd Prize</label>
                          <input
                            type="text"
                            placeholder="INR 5,000"
                            value={evPrizeSecond}
                            onChange={(e) => setEvPrizeSecond(e.target.value)}
                            className="w-full px-2 py-1 bg-white border-2 border-ink rounded-2xl text-sm font-bold text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-slate-500 font-semibold block">3rd Prize (Optional)</label>
                          <input
                            type="text"
                            placeholder="INR 2,000"
                            value={evPrizeThird}
                            onChange={(e) => setEvPrizeThird(e.target.value)}
                            className="w-full px-2 py-1 bg-white border-2 border-ink rounded-2xl text-sm font-bold text-slate-800"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Competition Rounds Breakdown */}
                    <div className="p-3.5 rounded-xl bg-white border-2 border-slate-300 space-y-2">
                      <span className="block text-sm font-bold text-slate-800">
                        Competition Rounds
                      </span>
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          placeholder="Round 1: Screening & MCQs"
                          value={evRound1}
                          onChange={(e) => setEvRound1(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border-2 border-ink rounded-2xl text-sm font-medium text-slate-800"
                        />
                        <input
                          type="text"
                          placeholder="Round 2: Algorithmic Implementation Sprint"
                          value={evRound2}
                          onChange={(e) => setEvRound2(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border-2 border-ink rounded-2xl text-sm font-medium text-slate-800"
                        />
                        <input
                          type="text"
                          placeholder="Final Round: Live Jury Evaluation & Defense"
                          value={evRound3}
                          onChange={(e) => setEvRound3(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border-2 border-ink rounded-2xl text-sm font-medium text-slate-800"
                        />
                      </div>
                    </div>

                    {/* Coordinators & Registration */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-white border-2 border-slate-300 space-y-2">
                        <span className="block text-sm font-bold text-slate-800">Coordinator 1</span>
                        <input
                          type="text"
                          placeholder="Coordinator Full Name"
                          value={evCoord1Name}
                          onChange={(e) => setEvCoord1Name(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-sm bg-white border-2 border-ink rounded-2xl"
                        />
                        <input
                          type="text"
                          placeholder="Phone (+91...)"
                          value={evCoord1Phone}
                          onChange={(e) => setEvCoord1Phone(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-sm bg-white border-2 border-ink rounded-2xl font-mono"
                        />
                      </div>

                      <div className="p-3 rounded-xl bg-white border-2 border-slate-300 space-y-2">
                        <span className="block text-sm font-bold text-slate-800">Coordinator 2</span>
                        <input
                          type="text"
                          placeholder="Coordinator Full Name"
                          value={evCoord2Name}
                          onChange={(e) => setEvCoord2Name(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-sm bg-white border-2 border-ink rounded-2xl"
                        />
                        <input
                          type="text"
                          placeholder="Phone (+91...)"
                          value={evCoord2Phone}
                          onChange={(e) => setEvCoord2Phone(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-sm bg-white border-2 border-ink rounded-2xl font-mono"
                        />
                      </div>
                    </div>

                    {/* Official Rules & Form Link */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">
                          Official Rules (1 per line)
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Plagiarism or internet browsing leads to disqualification&#10;Bring your college ID card"
                          value={evRules}
                          onChange={(e) => setEvRules(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-sm bg-white border-2 border-ink rounded-2xl resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">
                          Registration link (Google Form)
                        </label>
                        <input
                          type="url"
                          placeholder="https://forms.gle/..."
                          value={evRegistrationUrl}
                          onChange={(e) => setEvRegistrationUrl(e.target.value)}
                          className="w-full px-2.5 py-2 text-sm bg-white border-2 border-ink rounded-2xl font-mono text-slate-800"
                        />
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={handleResetEventForm}
                        className="px-4 py-2 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-800 text-sm font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={savingEvent}
                        className="px-5 py-2 rounded-full bg-teal-900 hover:bg-teal-800 text-white text-sm font-bold  flex items-center gap-1.5"
                      >
                        <Save className="w-4 h-4" />
                        <span>{savingEvent ? 'Saving...' : editingEventId ? 'Update Competition' : 'Publish Competition'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* LIST OF PUBLISHED COMPETITIONS */}
            {activeEvents.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-sm bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <Trophy className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-slate-700">No Technical Competitions Published Yet for {selectedBranch}</p>
                <p className="text-sm text-slate-400 mt-1">
                  Click <strong>&quot;Add New Competition&quot;</strong> above to publish hackathons, coding contests, paper presentations, and tech expos.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeEvents.map((ev) => (
                  <div 
                    key={ev.id} 
                    className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-300 flex gap-4 hover:border-slate-300 transition-colors "
                  >
                    <div className="w-24 h-32 rounded-xl overflow-hidden bg-slate-200 shrink-0 border-2 border-slate-300">
                      {ev.posterUrl ? (
                        <img 
                          src={ev.posterUrl} 
                          alt={ev.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <Trophy className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold bg-white text-slate-800 px-2 py-0.5 rounded-md border-2 border-slate-300">
                            {ev.category}
                          </span>
                          <span className="text-sm font-semibold text-slate-500">
                            {ev.day}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {ev.title}
                        </h4>

                        <p className="text-sm text-slate-500 line-clamp-1">
                          {ev.tagline}
                        </p>

                        <div className="text-sm text-slate-600 flex items-center gap-2 pt-1 font-semibold">
                          <span>Prize: <strong className="text-emerald-700">{ev.prizePool?.total || 'INR 15,000'}</strong></span>
                          <span>•</span>
                          <span>Slots: <strong>{ev.currentRegistered}</strong> / {ev.maxSlots}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                        <button
                          type="button"
                          onClick={() => handleStartEditEvent(ev)}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-800 text-sm font-bold border-2 border-slate-300 flex items-center gap-1 transition-colors"
                        >
                          <Edit className="w-3 h-3 text-slate-600" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteEvent(ev.id, ev.title)}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-red-50 text-red-700 text-sm font-bold border border-red-200 flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3 h-3 text-red-600" />
                          <span>Delete</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedGalleryTarget({
                              id: ev.id,
                              type: 'event',
                              title: ev.title,
                            });
                            setActiveTab('gallery');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-sm font-bold border border-blue-200 flex items-center gap-1 transition-colors ml-auto"
                          title="Manage photo gallery for this competition (up to 12 photos)"
                        >
                          <Camera className="w-3 h-3 text-blue-600" />
                          <span>Photos ({galleryPhotos.filter((p) => p.itemId === ev.id).length}/12)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: ACTIVITY PHOTO GALLERY (UP TO 12 PHOTOS PER ITEM) */}
      {/* ======================================================== */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          <div className="bg-white rounded-[28px] border-2 border-ink shadow-pop p-6 sm:p-8 space-y-6 ">
            <div className="border-b-2 border-slate-200 pb-5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                  SYMPOSIUM PHOTO ARCHIVE • MAX 12 PER ACTIVITY
                </span>
                <span className="text-sm font-semibold text-slate-500">
                  {selectedBranch} Association
                </span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl  text-slate-900 mt-1">
                Post-Event Visual Documentation Hub
              </h3>
              <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">
                After the workshop or competition concludes, student organizers can upload high-resolution photographs (up to 12 photos per activity). These images immediately appear in the National Symposium Gallery with department and activity classifications.
              </p>
            </div>

            {/* ACTIVITY SELECTION TABS */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Step 1: Select the Workshop or Competition to manage photos:
              </label>
              <div className="flex flex-wrap gap-2">
                {activeWorkshop && (
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedGalleryTarget({
                        id: activeWorkshop.id || activeWorkshop.branch,
                        type: 'workshop',
                        title: activeWorkshop.title,
                      })
                    }
                    className={`px-3 py-2 rounded-full text-sm font-bold border transition-all flex items-center gap-2 ${
                      selectedGalleryTarget?.id === (activeWorkshop.id || activeWorkshop.branch)
                        ? 'bg-teal-900 text-white border-slate-900 '
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Workshop: {activeWorkshop.title || 'Day 1 Masterclass'}</span>
                    <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-sm font-mono">
                      {galleryPhotos.filter((p) => p.itemId === (activeWorkshop.id || activeWorkshop.branch)).length}/12
                    </span>
                  </button>
                )}

                {activeEvents.map((ev) => {
                  const evPhotos = galleryPhotos.filter((p) => p.itemId === ev.id);
                  const isSelected = selectedGalleryTarget?.id === ev.id;
                  return (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={() =>
                        setSelectedGalleryTarget({
                          id: ev.id,
                          type: 'event',
                          title: ev.title,
                        })
                      }
                      className={`px-3 py-2 rounded-full text-sm font-bold border transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'bg-teal-900 text-white border-slate-900 '
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Trophy className="w-3.5 h-3.5" />
                      <span>{ev.title}</span>
                      <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-sm font-mono">
                        {evPhotos.length}/12
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SELECTED TARGET STATUS & UPLOADER */}
            {selectedGalleryTarget ? (
              (() => {
                const targetPhotos = galleryPhotos.filter((p) => p.itemId === selectedGalleryTarget.id);
                const count = targetPhotos.length;
                const remaining = Math.max(0, 12 - count);

                return (
                  <div className="space-y-6 pt-4 border-t border-slate-100">
                    <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold px-2 py-0.5 rounded bg-white text-slate-800 border-2 border-slate-300">
                              {selectedGalleryTarget.type === 'workshop' ? 'Day 1 Flagship Workshop' : 'Day 2 Arena Contest'}
                            </span>
                            <span className="text-sm font-bold text-slate-900">
                              {selectedGalleryTarget.title}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 mt-1">
                            {count} of 12 allowed photos uploaded for this activity. ({remaining} remaining slot{remaining === 1 ? '' : 's'})
                          </p>
                        </div>

                        {/* Progress Bar Badge */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="w-28 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${
                                count >= 12 ? 'bg-amber-500' : 'bg-emerald-600'
                              }`}
                              style={{ width: `${Math.min(100, (count / 12) * 100)}%` }}
                            />
                          </div>
                          <span className="text-sm font-mono font-bold text-slate-800">
                            {count}/12
                          </span>
                        </div>
                      </div>

                      {/* Upload Form */}
                      {remaining > 0 ? (
                        <div className="space-y-3 pt-3 border-t border-slate-200/80">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">
                              Optional Photo Caption:
                            </label>
                            <input
                              type="text"
                              value={galleryCaption}
                              onChange={(e) => setGalleryCaption(e.target.value)}
                              placeholder="e.g. Participants testing autonomous rover in robotics arena..."
                              className="w-full px-3.5 py-2 text-sm bg-white border-2 border-ink rounded-2xl outline-none text-slate-900 focus:border-slate-400 font-medium"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">
                              Select Photos to Upload (You can select up to {remaining} photo{remaining === 1 ? '' : 's'}):
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              disabled={uploadingGallery}
                              onChange={(e) => handleUploadGalleryPhotos(e.target.files)}
                              className="block w-full text-sm text-slate-500 file:mr-3 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-teal-900 file:text-white hover:file:bg-slate-800 cursor-pointer disabled:opacity-50"
                            />
                          </div>

                          {uploadingGallery && (
                            <div className="p-3 rounded-xl bg-blue-50 text-blue-900 flex items-center gap-2 text-sm font-bold animate-pulse">
                              <RefreshCw className="w-4 h-4 animate-spin text-blue-700" />
                              <span>Uploading and archiving photos to the symposium gallery...</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm font-semibold flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>
                            Maximum limit of 12 photos reached for this activity. If you want to add new photos, delete an existing photo below.
                          </span>
                        </div>
                      )}
                    </div>

                    {/* PHOTO GALLERY GRID FOR SELECTED ACTIVITY */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-bold text-slate-900">
                          Archived Photos ({count} / 12)
                        </h4>
                        <span className="text-sm text-slate-500">
                          Click trash icon to remove any photo
                        </span>
                      </div>

                      {targetPhotos.length === 0 ? (
                        <div className="p-10 text-center bg-white rounded-2xl border border-dashed border-slate-300 space-y-2">
                          <ImageIcon className="w-8 h-8 text-slate-300 mx-auto" />
                          <p className="text-sm font-bold text-slate-700">No photos uploaded yet</p>
                          <p className="text-sm text-slate-400 max-w-sm mx-auto">
                            Upload high-resolution event captures above to feature this {selectedGalleryTarget.type} in the National Symposium Gallery.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {targetPhotos.map((photo) => (
                            <div
                              key={photo.id}
                              className="group relative rounded-2xl overflow-hidden bg-white border-2 border-slate-300  flex flex-col"
                            >
                              <div className="relative aspect-[4/3] bg-teal-900 overflow-hidden">
                                <img
                                  src={photo.imageUrl}
                                  alt={photo.caption || photo.itemTitle}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleDeleteGalleryPhoto(photo.id, photo.itemTitle)}
                                  className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md transition-all opacity-90 group-hover:opacity-100"
                                  title="Delete this photo"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <div className="p-2.5 space-y-1">
                                <p className="text-sm font-semibold text-slate-800 line-clamp-2 leading-tight">
                                  {photo.caption || photo.itemTitle}
                                </p>
                                <span className="text-sm font-mono text-slate-400 block">
                                  {new Date(photo.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border-2 border-slate-300 text-slate-500 text-sm">
                Please publish a workshop or register an event first to manage its photo gallery.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {activeTab === 'archive' && (
        <div className="bg-white rounded-[28px] border-2 border-ink shadow-pop p-6 sm:p-8 space-y-6 text-sm ">
          <div>
            <h3 className="font-display text-2xl text-ink">
              Official Symposium Media & Document Vault
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Permanently archived for lifelong institutional preservation and public exhibition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-300 space-y-3">
              <span className="font-bold text-slate-800 block text-sm">
                Upload Official Document / Poster
              </span>
              <p className="text-sm text-slate-500">
                Upload workshop posters, brochures, competition problem sheets, or post-event photo archives.
              </p>
              <input
                type="file"
                onChange={(e) => handleFileUpload(e, 'documents', 'document')}
                className="block w-full text-sm text-slate-500 file:mr-2 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-teal-900 file:text-white hover:file:bg-slate-800 cursor-pointer"
              />
              {uploadingFile && (
                <p className="text-blue-600 font-bold text-sm">Uploading official media file...</p>
              )}
              {uploadedCdnUrl && (
                <div className="p-3 rounded-xl bg-white border border-emerald-200 text-emerald-900 space-y-1">
                  <span className="font-bold block text-sm text-emerald-700">Permanent Archival Media Link:</span>
                  <p className="font-mono text-sm break-all select-all">{uploadedCdnUrl}</p>
                </div>
              )}
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-300 space-y-3">
              <span className="font-bold text-slate-800 block text-sm">
                Departmental Shared Google Drive Album
              </span>
              <p className="text-sm text-slate-500">
                Organizers can place their full 4K photo and video drives here to link on the fest landing page.
              </p>
              <input
                type="url"
                placeholder="https://drive.google.com/drive/folders/..."
                defaultValue={`https://drive.google.com/drive/folders/samshodhani_${selectedBranch.toLowerCase()}_2026_photos`}
                className="w-full px-3.5 py-2.5 text-sm bg-white border-2 border-ink rounded-2xl outline-none font-mono text-slate-800 font-semibold"
              />
              <p className="text-sm text-slate-400">
                Shared with students across Telangana and India for official photo coverage.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB: STUDENT BODY POSTER & LEADERSHIP EXECUTIVE          */}
      {/* ======================================================== */}
      {activeTab === 'studentBody' && (
        <form onSubmit={handleSaveStudentBody} className="space-y-6">
          <div className="bg-white rounded-[28px] border-2 border-ink shadow-pop p-6 sm:p-8 space-y-8 ">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-200 pb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-sm font-bold mb-2">
                  <Award className="w-3.5 h-3.5" />
                  <span>Student Body Executive ({selectedBranch})</span>
                </div>
                <h3 className="font-display text-3xl text-ink">
                  {branchMeta.association} Student Body Executive Poster & Leadership
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Upload the official Student Association Executive Poster and leadership credentials for edition {targetEditionYear}. These are highlighted on the fest landing page under the &quot;Student Body&quot; section.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={savingStudentBody}
                  className="px-5 py-2.5 rounded-full bg-teal-900 hover:bg-teal-800 text-white font-bold text-sm flex items-center gap-2 transition-all  disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingStudentBody ? 'Saving...' : 'Save Executive Details'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Form Details */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1.5">
                    Executive Body Official Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={branchStudentBodyTitle}
                    onChange={(e) => setBranchStudentBodyTitle(e.target.value)}
                    placeholder={`e.g. ${branchMeta.association} Student Association Executive Body ${targetEditionYear}`}
                    className="w-full px-3.5 py-2.5 text-sm font-bold bg-white border-2 border-ink rounded-2xl outline-none focus:border-slate-400 focus:bg-white text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-1.5">
                      Faculty Advisor / Head of Department
                    </label>
                    <input
                      type="text"
                      value={branchFacultyAdvisor}
                      onChange={(e) => setBranchFacultyAdvisor(e.target.value)}
                      placeholder="e.g. Dr. P. Niranjan Reddy, HoD"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border-2 border-ink rounded-2xl outline-none text-slate-800 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-1.5">
                      Student President / General Secretary
                    </label>
                    <input
                      type="text"
                      value={branchStudentPresident}
                      onChange={(e) => setBranchStudentPresident(e.target.value)}
                      placeholder="e.g. K. Sai Varun (President)"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border-2 border-ink rounded-2xl outline-none text-slate-800 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1.5">
                    Executive Body Overview & Association Mission
                  </label>
                  <textarea
                    rows={4}
                    value={branchStudentBodyDesc}
                    onChange={(e) => setBranchStudentBodyDesc(e.target.value)}
                    placeholder="Brief description of the student body, departmental association activities, committee members, and student initiatives for this academic fest..."
                    className="w-full px-3.5 py-2.5 text-sm bg-white border-2 border-ink rounded-2xl outline-none text-slate-800 resize-none leading-relaxed"
                  />
                </div>

                {/* Poster Upload Widget */}
                <div className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-300 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <Upload className="w-4 h-4 text-blue-600" />
                      Executive poster (optional)
                    </span>
                    {uploadingStudentBody && (
                      <span className="text-sm font-bold text-blue-600 animate-pulse">Uploading to Git repository...</span>
                    )}
                  </div>

                  <p className="text-sm text-slate-500 leading-relaxed">
                    A poster is optional. If you have one, upload a high-resolution portrait or landscape image showing the complete list of office bearers, student coordinators, and faculty advisors. Stored directly in the institutional repository and served via CDN.
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <input
                      type="url"
                      placeholder="https://... or upload file"
                      value={branchStudentBodyPoster}
                      onChange={(e) => setBranchStudentBodyPoster(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 text-sm bg-white border-2 border-ink rounded-2xl outline-none font-mono text-slate-800"
                    />
                    <label className="cursor-pointer px-4 py-2.5 bg-teal-900 hover:bg-teal-800 text-white rounded-full text-sm font-bold transition-colors flex items-center justify-center gap-2  shrink-0">
                      <Upload className="w-4 h-4" />
                      <span>{uploadingStudentBody ? 'Uploading...' : branchStudentBodyPoster ? 'Replace poster' : 'Upload Poster File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleUploadStudentBodyPoster(e.target.files?.[0])}
                        disabled={uploadingStudentBody}
                      />
                    </label>
                    {branchStudentBodyPoster && (
                      <button
                        type="button"
                        onClick={handleRemoveStudentBodyPoster}
                        className="px-4 py-2.5 rounded-full border-2 border-ink bg-white hover:bg-coral-100 text-sm font-bold flex items-center justify-center gap-2 shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Remove poster</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Live Poster Preview */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700">
                    Live Landing Page Display Preview
                  </span>
                  {branchStudentBodyPoster ? (
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Live on Landing Page
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-slate-400">No poster. The card shows the association name instead.</span>
                  )}
                </div>

                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-teal-900 border-2 border-slate-300 shadow-md group flex items-center justify-center">
                  {branchStudentBodyPoster ? (
                    <>
                      <img
                        src={branchStudentBodyPoster}
                        alt={`${selectedBranch} Student Body Poster`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-5">
                        <div className="flex items-center gap-2 mb-2">
                          {branchLogoUrl && (
                            <img src={branchLogoUrl} alt={selectedBranch} className="w-8 h-8 rounded-full bg-white p-1 object-contain " />
                          )}
                          <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-sm font-bold text-white border border-white/30">
                            {selectedBranch} · {branchMeta.association}
                          </span>
                        </div>
                        <h4 className="text-white text-sm font-bold line-clamp-2">
                          {branchStudentBodyTitle || `${selectedBranch} Student Body`}
                        </h4>
                        {branchStudentPresident && (
                          <p className="text-slate-300 text-sm font-medium mt-0.5">
                            President: {branchStudentPresident}
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="p-8 text-center space-y-3 text-slate-400">
                      <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-slate-500">
                        <Award className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-300">No Student Body Poster</p>
                        <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
                          Upload the executive body poster above to display your student committee on the Sumshodhini landing page.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ======================================================== */}
      {/* TAB 4: DELEGATE ROSTER & CSV EXPORT */}
      {/* ======================================================== */}
      {activeTab === 'roster' && (
        <div className="bg-white rounded-[28px] border-2 border-ink shadow-pop p-6 sm:p-8 space-y-6 ">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-200 pb-5">
            <div>
              <h3 className="font-display text-2xl text-ink">
                Registered Delegates & Attendees ({selectedBranch})
              </h3>
              <p className="text-sm text-slate-500 mt-0.5">
                Verified participant records synchronized with official symposium registrations.
              </p>
            </div>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-full bg-teal-900 hover:bg-teal-800 text-white font-bold text-sm flex items-center gap-2 self-start sm:self-auto transition-colors "
            >
              <Download className="w-4 h-4" />
              <span>Export CSV Roster</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border-2 border-slate-300">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-sm">
                <tr>
                  <th className="py-3 px-4">Pass ID</th>
                  <th className="py-3 px-4">Delegate Name</th>
                  <th className="py-3 px-4">Roll Number</th>
                  <th className="py-3 px-4">College</th>
                  <th className="py-3 px-4">Selected Event / Workshop</th>
                  <th className="py-3 px-4">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {registrations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400 text-sm">
                      No delegates registered yet for {selectedBranch}.
                    </td>
                  </tr>
                ) : (
                  registrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{reg.passToken}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{reg.fullName}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{reg.rollNumber}</td>
                      <td className="py-3 px-4 font-medium">{reg.college}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{reg.targetTitle || reg.targetType}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-md text-sm font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {reg.paymentStatus || 'Verified'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: INITIALIZE NEW ANNUAL SYMPOSIUM EDITION           */}
      {/* ======================================================== */}
      {showNewEditionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-teal-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-slate-300 shadow-2xl max-w-lg w-full p-4 sm:p-8 space-y-5 sm:space-y-6 relative max-h-[92vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowNewEditionModal(false)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-sm font-bold mb-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Multi-Year Institutional System</span>
              </div>
              <h3 className="font-display text-3xl text-ink">
                Initialize New Symposium Edition
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Configure a new annual academic cycle (e.g. 2027, 2028). Previous editions will be permanently preserved as historical archives.
              </p>
            </div>

            <form onSubmit={handleCreateEdition} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Academic Year</label>
                  <input
                    type="number"
                    value={newEditionYear}
                    onChange={(e) => {
                      const yr = parseInt(e.target.value, 10);
                      setNewEditionYear(yr);
                      setNewEditionName(`Sumshodhini '${String(yr).slice(-2)}`);
                    }}
                    required
                    className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-ink text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-cobalt-200"
                    placeholder="2027"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Edition Name</label>
                  <input
                    type="text"
                    value={newEditionName}
                    onChange={(e) => setNewEditionName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-ink text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-cobalt-200"
                    placeholder="Sumshodhini '27"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Theme / Tagline</label>
                <input
                  type="text"
                  value={newEditionTheme}
                  onChange={(e) => setNewEditionTheme(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-ink text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-cobalt-200 font-medium"
                  placeholder="National Level Technical Symposium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Dates</label>
                <input
                  type="text"
                  value={newEditionDates}
                  onChange={(e) => setNewEditionDates(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-ink text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-cobalt-200 font-medium"
                  placeholder="October 22–23, 2027"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="setActiveEdition"
                  checked={newEditionSetActive}
                  onChange={(e) => setNewEditionSetActive(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="setActiveEdition" className="text-sm font-bold text-slate-800 cursor-pointer select-none">
                  Set as Active Live Edition (will archive currently active edition)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewEditionModal(false)}
                  className="px-4 py-2 rounded-full text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingEdition}
                  className="px-5 py-2 rounded-full bg-teal-900 hover:bg-teal-800 text-white text-sm font-bold transition-colors  disabled:opacity-50"
                >
                  {creatingEdition ? 'Initializing...' : 'Initialize Edition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDIT DATES & THEME FOR CURRENT EDITION            */}
      {/* ======================================================== */}
      {showEditEditionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-teal-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-slate-300 shadow-2xl max-w-lg w-full p-4 sm:p-8 space-y-5 sm:space-y-6 relative max-h-[92vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowEditEditionModal(false)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-sm font-bold mb-2">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Symposium Scheduling & Dates</span>
              </div>
              <h3 className="font-display text-3xl text-ink">
                Modify Fest Dates for {targetEditionYear}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Update the official festival dates, theme, and title for edition {targetEditionYear}. Any changes immediately update the countdown and badges across the entire symposium platform.
              </p>
            </div>

            <form onSubmit={handleUpdateEditionDates} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Official Fest Dates *</label>
                <input
                  type="text"
                  value={editEditionDates}
                  onChange={(e) => setEditEditionDates(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-ink text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-cobalt-200"
                  placeholder="October 30–31, 2026"
                />
                <p className="text-sm text-slate-400">
                  e.g. October 30–31, 2026 or October 22–23, 2027
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Edition Display Name</label>
                <input
                  type="text"
                  value={editEditionName}
                  onChange={(e) => setEditEditionName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-ink text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-cobalt-200"
                  placeholder={`Sumshodhini '${String(targetEditionYear).slice(-2)}`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Theme / Tagline</label>
                <input
                  type="text"
                  value={editEditionTheme}
                  onChange={(e) => setEditEditionTheme(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-ink text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-cobalt-200 font-medium"
                  placeholder="National Level Technical Symposium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditEditionModal(false)}
                  className="px-4 py-2 rounded-full text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingEdition}
                  className="px-5 py-2 rounded-full bg-teal-900 hover:bg-teal-800 text-white text-sm font-bold transition-colors  disabled:opacity-50"
                >
                  {updatingEdition ? 'Saving Dates...' : 'Save Dates & Configuration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
