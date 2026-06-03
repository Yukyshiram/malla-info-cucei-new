import React, { useState, useEffect, useMemo } from 'react';
import {
  AREAS,
  COMPETENCIAS,
  CORE_SUBJECTS,
  SPECIALTY_MODULES,
  getPrereqsRecursive,
  getPostreqsRecursive,
  getPrereqsDirect
} from './mockDatabase';
import './App.css';

function App() {
  // --- STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [filterArea, setFilterArea] = useState('');
  const [filterCompetency, setFilterCompetency] = useState('');

  // Theme state supporting multiple themes
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('malla-theme') || 'sunset';
    return (saved === 'dark' || saved === 'dark-theme') ? 'sunset' : saved;
  });
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  const themesList = useMemo(() => [
    { id: 'sunset', name: 'Atardecer (Sunset)', previewGradient: 'linear-gradient(135deg, #fb9b7e, #855278)' },
    { id: 'purple', name: 'Crepúsculo Morado', previewGradient: 'linear-gradient(135deg, #c084fc, #8b5cf6)' },
    { id: 'emerald', name: 'Bosque Esmeralda', previewGradient: 'linear-gradient(135deg, #34d399, #10b981)' },
    { id: 'space', name: 'Espacio Profundo', previewGradient: 'linear-gradient(135deg, #38bdf8, #3b82f6)' },
    { id: 'light', name: 'Modo Claro Pastel', previewGradient: 'linear-gradient(135deg, #fda4af, #bae6fd)' }
  ], []);

  const handleCycleTheme = () => {
    const ids = themesList.map(t => t.id);
    const currentIndex = ids.indexOf(theme);
    const nextIndex = (currentIndex + 1) % ids.length;
    setTheme(ids[nextIndex]);
  };

  // Career compatibility warning state
  const [careerWarning, setCareerWarning] = useState('');

  // Interactive state
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [approvedCourses, setApprovedCourses] = useState([]);
  const [currentCourses, setCurrentCourses] = useState([]);
  const [selectedModules, setSelectedModules] = useState([]); // Array of IDs, e.g., ['MODULO_V']

  // API and Login state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [studentCode, setStudentCode] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [studentName, setStudentName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [apiStats, setApiStats] = useState(null);

  // Mobile layout state
  const [openSemesters, setOpenSemesters] = useState({ 1: true }); // Accordeon state on mobile
  const [isDetailsSidebarOpen, setIsDetailsSidebarOpen] = useState(false);

  // Sync theme with body class
  useEffect(() => {
    // Remove all theme classes first
    document.body.classList.remove('theme-sunset', 'theme-purple', 'theme-emerald', 'theme-space', 'light-theme');
    
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.add(`theme-${theme}`);
    }
    localStorage.setItem('malla-theme', theme);
  }, [theme]);

  // Handle click outside theme selector popover
  useEffect(() => {
    if (!isThemeMenuOpen) return;
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.theme-selector-container')) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isThemeMenuOpen]);

  // --- RECURSIVE RELATION SHIPS FOR SELECTED SUBJECT ---
  const { activePrereqs, activePostreqs } = useMemo(() => {
    if (!selectedSubject) {
      return { activePrereqs: [], activePostreqs: [] };
    }

    // Get all subjects currently in grid (including filled modules)
    const allActiveSubjects = [...CORE_SUBJECTS];
    selectedModules.forEach((mId, index) => {
      const module = SPECIALTY_MODULES.find(m => m.id === mId);
      if (module) {
        module.subjects.forEach(sub => {
          allActiveSubjects.push({
            ...sub,
            claveSlot: `${sub.clave}_MOD${index + 1}`
          });
        });
      }
    });

    const prereqs = getPrereqsRecursive(selectedSubject.clave, allActiveSubjects);
    const postreqs = getPostreqsRecursive(selectedSubject.clave, allActiveSubjects);

    return { activePrereqs: prereqs, activePostreqs: postreqs };
  }, [selectedSubject, selectedModules]);

  // --- AUTOFILL SPECIALTY MODULES FROM HISTORIAL ---
  // Detect if any course in approved or current belongs to a module and auto-activate it
  useEffect(() => {
    const detectedModules = [];
    SPECIALTY_MODULES.forEach(module => {
      const hasTakenSubject = module.subjects.some(sub =>
        approvedCourses.includes(sub.clave) || currentCourses.includes(sub.clave)
      );
      if (hasTakenSubject && !detectedModules.includes(module.id)) {
        detectedModules.push(module.id);
      }
    });

    // Merge detected modules with currently selected ones up to a maximum of 2
    setSelectedModules(prev => {
      const combined = Array.from(new Set([...detectedModules, ...prev]));
      return combined.slice(0, 2);
    });
  }, [approvedCourses, currentCourses]);

  // --- GET ACTIVE SUBJECTS MAPPED TO GRID COLUMNS ---
  // Returns all courses to render per semester I to IX
  const gridData = useMemo(() => {
    const data = {};
    for (let s = 1; s <= 9; s++) {
      data[s] = [];
    }

    // Add core subjects
    CORE_SUBJECTS.forEach(sub => {
      data[sub.semestre].push({ ...sub, isCore: true });
    });

    // Populate module slots in Semestres VI, VII, VIII
    // Slot 1 (Module 1)
    const mod1 = SPECIALTY_MODULES.find(m => m.id === selectedModules[0]);
    // Slot 2 (Module 2)
    const mod2 = SPECIALTY_MODULES.find(m => m.id === selectedModules[1]);

    // Semestre VI - UA 1
    if (mod1) {
      data[6].push({ ...mod1.subjects[0], isCore: false, moduleSlot: 1 });
    } else {
      data[6].push({ isPlaceholder: true, semester: 6, moduleSlot: 1, titleSlot: 'UA 1 del Módulo Uno' });
    }
    if (mod2) {
      data[6].push({ ...mod2.subjects[0], isCore: false, moduleSlot: 2 });
    } else {
      data[6].push({ isPlaceholder: true, semester: 6, moduleSlot: 2, titleSlot: 'UA 1 del Módulo Dos' });
    }

    // Semestre VII - UA 2
    if (mod1) {
      data[7].push({ ...mod1.subjects[1], isCore: false, moduleSlot: 1 });
    } else {
      data[7].push({ isPlaceholder: true, semester: 7, moduleSlot: 1, titleSlot: 'UA 2 del Módulo Uno' });
    }
    if (mod2) {
      data[7].push({ ...mod2.subjects[1], isCore: false, moduleSlot: 2 });
    } else {
      data[7].push({ isPlaceholder: true, semester: 7, moduleSlot: 2, titleSlot: 'UA 2 del Módulo Dos' });
    }

    // Semestre VIII - UA 3
    if (mod1) {
      data[8].push({ ...mod1.subjects[2], isCore: false, moduleSlot: 1 });
    } else {
      data[8].push({ isPlaceholder: true, semester: 8, moduleSlot: 1, titleSlot: 'UA 3 del Módulo Uno' });
    }
    if (mod2) {
      data[8].push({ ...mod2.subjects[2], isCore: false, moduleSlot: 2 });
    } else {
      data[8].push({ isPlaceholder: true, semester: 8, moduleSlot: 2, titleSlot: 'UA 3 del Módulo Dos' });
    }

    // Sort subjects inside columns to maintain vertical alignment logic
    // We sort such that placeholder or module slot items are grouped at the bottom, just like the official grid
    for (let s = 1; s <= 9; s++) {
      data[s].sort((a, b) => {
        if (a.isPlaceholder || a.moduleSlot) return 1;
        if (b.isPlaceholder || b.moduleSlot) return -1;
        return 0; // maintain original database order
      });
    }

    return data;
  }, [selectedModules]);

  // --- STATS CALCULATION ---
  const stats = useMemo(() => {
    if (isLoggedIn && apiStats) {
      return {
        approvedCredits: apiStats.approvedCredits,
        totalCreditsAvailable: apiStats.totalCreditsAvailable,
        approvedPercentage: apiStats.approvedPercentage,
        approvedCount: approvedCourses.length,
        currentCount: currentCourses.length
      };
    }

    const totalCreditsAvailable = 375; // Official total credits for CUCEI Informatica (INFO)

    // Calculate approved credits
    let approvedCredits = CORE_SUBJECTS.filter(s => approvedCourses.includes(s.clave))
      .reduce((sum, s) => sum + s.creditos, 0);

    selectedModules.forEach(mId => {
      const module = SPECIALTY_MODULES.find(m => m.id === mId);
      if (module) {
        module.subjects.forEach(s => {
          if (approvedCourses.includes(s.clave)) {
            approvedCredits += s.creditos;
          }
        });
      }
    });

    return {
      approvedCredits,
      totalCreditsAvailable,
      approvedPercentage: totalCreditsAvailable > 0 ? Math.round((approvedCredits / totalCreditsAvailable) * 100) : 0,
      approvedCount: approvedCourses.length,
      currentCount: currentCourses.length
    };
  }, [approvedCourses, currentCourses, selectedModules, isLoggedIn, apiStats]);

  // --- MATCH CARD CLASS/HIGHLIGHT ---
  const getCardClasses = (sub) => {
    if (sub.isPlaceholder) {
      let classes = 'subject-card is-empty-slot';
      if (selectedSubject) {
        classes += ' is-dimmed';
      }
      return classes;
    }

    let classes = 'subject-card glass-effect';

    // 1. DIMMING: if something is selected and this card is NOT related
    if (selectedSubject) {
      const isSelected = selectedSubject.clave === sub.clave;
      const isPrereq = activePrereqs.includes(sub.clave);
      const isPostreq = activePostreqs.includes(sub.clave);

      if (isSelected) {
        classes += ' is-selected';
      } else if (isPrereq) {
        classes += ' is-active-prereq';
      } else if (isPostreq) {
        classes += ' is-active-postreq';
      } else {
        classes += ' is-dimmed';
      }
    }

    // 2. STATUS COLOR HIGHLIGHTS (Kardex / Cursando)
    if (approvedCourses.includes(sub.clave)) {
      classes += ' is-approved';
    } else if (currentCourses.includes(sub.clave)) {
      classes += ' is-current';
    }

    return classes;
  };

  // --- LOGIC FOR INDIVIDUAL SUBJECT CARD CLICK ---
  const handleSubjectClick = (sub) => {
    if (sub.isPlaceholder) {
      // Directs focus to module tray at the bottom
      const el = document.getElementById('tray-especialidad');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (selectedSubject && selectedSubject.clave === sub.clave) {
      setSelectedSubject(null);
      setIsDetailsSidebarOpen(false);
    } else {
      setSelectedSubject(sub);
      setIsDetailsSidebarOpen(true);
    }
  };

  // --- MANUAL SUBJECT STATE SIMULATOR ---
  const handleToggleApproved = (clave) => {
    setApprovedCourses(prev =>
      prev.includes(clave) ? prev.filter(c => c !== clave) : [...prev, clave]
    );
    // Remove from current if marking as approved
    setCurrentCourses(prev => prev.filter(c => c !== clave));
  };

  const handleToggleCurrent = (clave) => {
    setCurrentCourses(prev =>
      prev.includes(clave) ? prev.filter(c => c !== clave) : [...prev, clave]
    );
    // Remove from approved if marking as current
    setApprovedCourses(prev => prev.filter(c => c !== clave));
  };

  const handleResetSubject = (clave) => {
    setApprovedCourses(prev => prev.filter(c => c !== clave));
    setCurrentCourses(prev => prev.filter(c => c !== clave));
  };

  // --- SPECIALTY MODULE SELECTION ---
  const handleToggleModule = (mId) => {
    setSelectedModules(prev => {
      if (prev.includes(mId)) {
        return prev.filter(id => id !== mId);
      } else {
        if (prev.length >= 2) {
          // Replace second module or alert
          return [prev[0], mId];
        } else {
          return [...prev, mId];
        }
      }
    });
  };

  // --- API SYNC SERVICE (LOGIN FOR KARDEX & SCHEDULES) ---
  const handleApiLogin = async (e) => {
    e.preventDefault();
    if (!studentCode || !studentPassword) {
      setApiError('Por favor ingresa tu código y contraseña');
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      // 1. Fetch Profile info to get name
      const resProfile = await fetch('/api/leo/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: studentCode, password: studentPassword })
      });
      const dataProfile = await resProfile.json();

      if (!dataProfile.ok) {
        throw new Error(dataProfile.message || 'Error en autenticación');
      }

      setStudentName(dataProfile.profile.student.nombre);

      // Check career compatibility (must be INFO)
      if (dataProfile.profile && dataProfile.profile.plan) {
        const plan = dataProfile.profile.plan;
        if (plan.id !== 'INFO') {
          setCareerWarning(`${plan.name} (${plan.id})`);
        } else {
          setCareerWarning('');
        }
      }

      if (dataProfile.profile && dataProfile.profile.stats) {
        const s = dataProfile.profile.stats;
        setApiStats({
          approvedCredits: s.creditosAdquiridos,
          totalCreditsAvailable: s.creditosTotales,
          approvedPercentage: s.porcentajeCreditos
        });
      }

      // 2. Fetch Kardex
      const resKardex = await fetch('/api/leo/kardex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: studentCode, password: studentPassword })
      });
      const dataKardex = await resKardex.json();

      if (!dataKardex.ok) {
        throw new Error(dataKardex.message || 'Error al obtener Kardex');
      }

      // Map approved claves
      const completedClaves = dataKardex.data.completedCourses.map(course => course.clave);
      setApprovedCourses(completedClaves);

      // 3. Fetch Schedules
      const resSched = await fetch('/api/leo/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: studentCode, password: studentPassword })
      });
      const dataSched = await resSched.json();

      if (dataSched.ok && dataSched.data) {
        const activeCycle = dataSched.data.activeCycle;
        const currentSched = dataSched.data.schedules.find(s => s.ciclo === activeCycle);
        if (currentSched) {
          const currentClaves = currentSched.materias.map(m => m.clave);
          setCurrentCourses(currentClaves);
        }
      }

      setIsLoggedIn(true);
      setIsLoginModalOpen(false);
      setStudentPassword(''); // Clear sensitive password
    } catch (err) {
      console.error(err);
      setApiError(err.message || 'Error de conexión con LEO API. Verifica tus datos o intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setApprovedCourses([]);
    setCurrentCourses([]);
    setSelectedModules([]);
    setStudentName('');
    setIsLoggedIn(false);
    setSelectedSubject(null);
    setApiStats(null);
    setCareerWarning('');
  };

  // --- SEARCH AND FILTER FILTERING ---
  const filteredGridData = useMemo(() => {
    const normalizeString = (str) => {
      if (!str) return '';
      return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    };

    const res = {};
    const query = searchQuery.trim();
    const normalizedQuery = normalizeString(query);

    for (let s = 1; s <= 9; s++) {
      res[s] = gridData[s].map(sub => {
        if (sub.isPlaceholder) return sub;

        let match = true;

        if (normalizedQuery) {
          const normalizedName = normalizeString(sub.nombre);
          const normalizedClave = normalizeString(sub.clave);
          match = normalizedName.includes(normalizedQuery) || normalizedClave.includes(normalizedQuery);
        }
        if (filterArea) {
          match = match && sub.area === filterArea;
        }
        if (filterCompetency) {
          match = match && sub.competencia === filterCompetency;
        }

        return { ...sub, isFilteredMatch: match };
      });
    }

    return res;
  }, [gridData, searchQuery, filterArea, filterCompetency]);

  // --- SEMESTER ACCORDEON TOGGLE FOR MOBILE ---
  const toggleSemesterAccordion = (semesterNum) => {
    setOpenSemesters(prev => ({
      ...prev,
      [semesterNum]: !prev[semesterNum]
    }));
  };

  return (
    <div className="app-container">
      {/* HEADER SECTION */}
      <header className="app-header glass-effect">
        <div className="header-left">
          <img
            className="header-logo"
            src="https://leo.sklconnect.com/leo_bg_logo_borded.png"
            alt="LEO Logo"
            width="48"
            height="48"
            style={{ borderRadius: '10px' }}
          />
          <div className="header-title-container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1 className="header-title">LEO Malla Curricular</h1>
              <button
                onClick={handleCycleTheme}
                className="btn-theme-toggle title-inline-theme-btn"
                aria-label="Cycle theme"
                title="Cambiar tema visual (Ciclo)"
              >
                {theme === 'sunset' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#fb9b7e" viewBox="0 0 16 16">
                    <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.278 7.277a7.2 7.2 0 0 0 3.46-.878.77.77 0 0 1 .858.08.77.77 0 0 1 .08.858 8.002 8.002 0 0 1-14.778-3.413A8 8 0 0 1 6 .278"/>
                  </svg>
                )}
                {theme === 'purple' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#c084fc" viewBox="0 0 16 16">
                    <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.278 7.277a7.2 7.2 0 0 0 3.46-.878.77.77 0 0 1 .858.08.77.77 0 0 1 .08.858 8.002 8.002 0 0 1-14.778-3.413A8 8 0 0 1 6 .278"/>
                  </svg>
                )}
                {theme === 'emerald' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#34d399" viewBox="0 0 16 16">
                    <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.278 7.277a7.2 7.2 0 0 0 3.46-.878.77.77 0 0 1 .858.08.77.77 0 0 1 .08.858 8.002 8.002 0 0 1-14.778-3.413A8 8 0 0 1 6 .278"/>
                  </svg>
                )}
                {theme === 'space' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#38bdf8" viewBox="0 0 16 16">
                    <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.278 7.277a7.2 7.2 0 0 0 3.46-.878.77.77 0 0 1 .858.08.77.77 0 0 1 .08.858 8.002 8.002 0 0 1-14.778-3.413A8 8 0 0 1 6 .278"/>
                  </svg>
                )}
                {theme === 'light' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#eab308" viewBox="0 0 16 16">
                    <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1-.5.5m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/>
                  </svg>
                )}
              </button>
            </div>
            <span className="header-subtitle">Ingeniería en Informática - CUCEI</span>
          </div>
        </div>

        <div className="header-actions">
          {/* SEARCH */}
          <div className="search-container">
            <span className="search-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Buscar materia o clave..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {/* THEME TOGGLE POPOVER (DESKTOP) */}
          <div className="theme-selector-container">
            <button
              onClick={() => setIsThemeMenuOpen(prev => !prev)}
              className="btn-theme-toggle"
              aria-label="Toggle theme selection"
              title="Cambiar tema visual"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0m-.5 15c.118-.061.229-.143.33-.243l3-3a1.5 1.5 0 0 0 .44-1.06v-1.1c0-.276-.224-.5-.5-.5H9.17c-.456 0-.893-.18-1.21-.508L5.592 6.223A1.5 1.5 0 0 0 4.53 5.75H2.5c-.276 0-.5.224-.5.5v5.82a1.5 1.5 0 0 0 .44 1.06l3 3a1.5 1.5 0 0 0 1.06.44z"/>
              </svg>
            </button>
            {isThemeMenuOpen && (
              <div className="theme-popover glass-effect">
                <div className="theme-popover-header">Elige un Tema</div>
                <div className="theme-options-list">
                  {themesList.map(t => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id);
                        setIsThemeMenuOpen(false);
                      }}
                      className={`theme-option-btn ${theme === t.id ? 'is-active' : ''}`}
                    >
                      <span className="theme-option-dot" style={{ background: t.previewGradient }} />
                      <span className="theme-option-name">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SYNC USER KARDEX BUTTON */}
          {isLoggedIn ? (
            <div className="user-account-badge">
              <span className="user-name">👋 {studentName || studentCode}</span>
              <button onClick={handleLogout} className="btn-logout">Salir</button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="btn-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0M14 0a1.5 1.5 0 0 1 1.5 1.5v12A1.5 1.5 0 0 1 14 15H2a1.5 1.5 0 0 1-1.5-1.5v-12A1.5 1.5 0 0 1 2 0zM1.5 1.5v12a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5v-12a.5.5 0 0 0-.5-.5H2a.5.5 0 0 0-.5.5" />
              </svg>
              Sincronizar mi Kardex
            </button>
          )}
        </div>
      </header>

      {/* CAREER WARNING */}
      {careerWarning && (
        <div className="career-warning-banner glass-effect">
          <span className="warning-icon">⚠️</span>
          <div className="warning-text">
            <strong>Aviso de Compatibilidad:</strong> Tu carrera registrada en LEO es <strong>{careerWarning}</strong>. 
            Esta malla interactiva está diseñada específicamente para <strong>Ingeniería en Informática (INFO)</strong>. 
            Algunos códigos de materias de tu carrera podrían diferir o no aparecer en la cuadrícula.
          </div>
        </div>
      )}

      {/* DESKTOP STATS OVERVIEW */}
      <section className="stats-banner desktop-stats-banner glass-effect">
        <div className="stat-item">
          <span className="stat-label">Progreso del Plan</span>
          <span className="stat-value">{stats.approvedPercentage}%</span>
          <div className="stat-progress-bar">
            <div className="stat-progress-fill" style={{ width: `${stats.approvedPercentage}%` }}></div>
          </div>
        </div>
        <div className="stat-item">
          <span className="stat-label">Créditos Obtenidos</span>
          <span className="stat-value">{stats.approvedCredits} <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>/ {stats.totalCreditsAvailable} C</span></span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Materias Aprobadas</span>
          <span className="stat-value">{stats.approvedCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Materias en Curso</span>
          <span className="stat-value" style={{ color: 'var(--color-current)' }}>{stats.currentCount}</span>
        </div>
      </section>

      {/* MOBILE STATS OVERVIEW */}
      <section className="stats-banner mobile-stats-banner glass-effect">
        <div className="stat-item">
          <span className="stat-label">Progreso del Plan</span>
          <span className="stat-value" style={{ fontSize: '1.25rem' }}>
            {stats.approvedPercentage}%
            <span className="stat-subvalue" style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}> ({stats.approvedCredits}/{stats.totalCreditsAvailable} C)</span>
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Materias</span>
          <div className="mobile-stats-row" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span className="stat-value approved-value" style={{ fontSize: '1.25rem' }}>{stats.approvedCount} <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Aprobadas</span></span>
            <span className="stat-value current-value" style={{ fontSize: '1.25rem', color: 'var(--color-current)' }}>{stats.currentCount} <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Cursando</span></span>
          </div>
        </div>
      </section>

      {/* MOBILE/TABLET SEARCH BAR (Positioned below stats and above filters) */}
      <div className="mobile-search-container">
        <span className="search-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Buscar materia o clave..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* FILTERS CONTAINER */}
      <div className="glass-effect" style={{ padding: '1rem 2rem', borderRadius: '18px', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Área:</label>
          <select
            value={filterArea}
            onChange={(e) => setFilterArea(e.target.value)}
            style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
          >
            <option value="">Todas</option>
            {Object.entries(AREAS).map(([key, val]) => (
              <option key={key} value={key}>{val.name}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Competencia:</label>
          <select
            value={filterCompetency}
            onChange={(e) => setFilterCompetency(e.target.value)}
            style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
          >
            <option value="">Todas</option>
            {Object.entries(COMPETENCIAS).map(([key, val]) => (
              <option key={key} value={key}>{val.name}</option>
            ))}
          </select>
        </div>

        {selectedSubject && (
          <button
            onClick={() => { setSelectedSubject(null); setIsDetailsSidebarOpen(false); }}
            className="btn-secondary"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', marginLeft: 'auto' }}
          >
            Limpiar Resaltado
          </button>
        )}
      </div>

      {/* MAIN WORKSPACE */}
      <main className="workspace-layout">
        <div className="grid-wrapper">
          {/* SCROLL HELPER FOR MOBILE */}
          <div className="scroll-helper-indicator">
            <span>← Desliza horizontalmente para navegar los semestres →</span>
          </div>

          {/* GRID VIEW (DESKTOP: 9 COLUMNS) */}
          <div className="malla-grid-container glass-effect">
            {Object.entries(filteredGridData).map(([sem, subjects]) => (
              <div key={sem} className="semester-column">
                <div className="semester-header">Semestre {sem}</div>
                {subjects.map((sub, idx) => {
                  if (sub.isPlaceholder) {
                    return (
                      <div
                        key={`placeholder-${sem}-${idx}`}
                        className={getCardClasses(sub)}
                        onClick={() => handleSubjectClick(sub)}
                      >
                        <div className="empty-slot-content">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 8v8M8 12h8" />
                          </svg>
                          <span className="empty-slot-title">Módulo Especialidad</span>
                          <span className="empty-slot-desc">Elegir abajo en módulos</span>
                        </div>
                      </div>
                    );
                  }

                  const isMatch = sub.isFilteredMatch !== false;

                  return (
                    <div
                      key={sub.clave}
                      className={`${getCardClasses(sub)} ${!isMatch ? 'is-dimmed' : ''}`}
                      onClick={() => handleSubjectClick(sub)}
                    >
                      <div className="area-dot" style={{ backgroundColor: `var(--area-color-${sub.area}, ${AREAS[sub.area]?.color})` }} />
                      <div className="card-header-row">
                        <span className="card-clave">{sub.clave}</span>
                        <div className="card-hours-credits">
                          <span className="card-stat">{sub.horas}H</span>
                          <span className="card-stat">{sub.creditos}C</span>
                        </div>
                      </div>
                      <div className="card-name">{sub.nombre}</div>
                      <div className="card-sequence-row is-lab-sequence">
                        <div className="lab-prereqs-row">
                          {sub.prereqSeq ? (
                            <span className="sequence-tag">{sub.prereqSeq}</span>
                          ) : (
                            <span style={{ width: '1px', opacity: 0 }} />
                          )}
                          <span className="sequence-tag">{sub.postreqSeq || '—'}</span>
                        </div>
                        <span
                          className="sequence-tag is-sequence-self"
                          style={{
                            backgroundColor: `var(--comp-color-${sub.competencia}, ${COMPETENCIAS[sub.competencia]?.color})`,
                            color: `var(--comp-text-${sub.competencia}, ${sub.competencia === 'INICIAL' ? '#000000' : '#ffffff'})`
                          }}
                        >
                          {sub.sequenceCode}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* ACCORDEON VIEW (MOBILE & TABLET COLLAPSED STACK) */}
          <div className="mobile-semesters-accordion">
            {Object.entries(filteredGridData).map(([sem, subjects]) => {
              const isOpen = openSemesters[sem];
              return (
                <div key={sem} className={`mobile-semester-group ${isOpen ? 'is-open' : ''}`}>
                  <button
                    onClick={() => toggleSemesterAccordion(sem)}
                    className="mobile-semester-trigger"
                  >
                    <span>Semestre {sem}</span>
                    <span className="mobile-semester-indicator">
                      {subjects.filter(s => !s.isPlaceholder).length} materias {isOpen ? '▼' : '▲'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="mobile-semester-content">
                      {subjects.map((sub, idx) => {
                        if (sub.isPlaceholder) {
                          return (
                            <div
                              key={`mob-placeholder-${sem}-${idx}`}
                              className={getCardClasses(sub)}
                              onClick={() => handleSubjectClick(sub)}
                            >
                              <div className="empty-slot-content">
                                <span className="empty-slot-title">Doble toque para elegir Módulo Especialidad</span>
                              </div>
                            </div>
                          );
                        }

                        const isMatch = sub.isFilteredMatch !== false;

                        return (
                          <div
                            key={`mob-${sub.clave}`}
                            className={`${getCardClasses(sub)} ${!isMatch ? 'is-dimmed' : ''}`}
                            onClick={() => handleSubjectClick(sub)}
                            style={{ minHeight: '90px' }}
                          >
                            <div className="area-dot" style={{ backgroundColor: `var(--area-color-${sub.area}, ${AREAS[sub.area]?.color})` }} />
                            <div className="card-header-row">
                              <span className="card-clave">{sub.clave}</span>
                              <div className="card-hours-credits">
                                <span className="card-stat">{sub.horas}H</span>
                                <span className="card-stat">{sub.creditos}C</span>
                              </div>
                            </div>
                            <div className="card-name" style={{ fontSize: '0.8rem' }}>{sub.nombre}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* SPECIALIZATION MODULES BOTTOM TRAY */}
          <section id="tray-especialidad" className="modules-section glass-effect">
            <div className="modules-section-header">
              <div className="modules-title-group">
                <h2 className="modules-section-title">Módulos de Especialización</h2>
                <span className="modules-section-desc">Selecciona hasta 2 módulos para autocompletar la malla curricular principal.</span>
              </div>
              <span className="badge-item" style={{ borderColor: '#ea580c', color: '#ea580c', fontWeight: 700 }}>
                {selectedModules.length} / 2 seleccionados
              </span>
            </div>

            <div className="modules-container">
              {SPECIALTY_MODULES.map(module => {
                const isActive = selectedModules.includes(module.id);
                return (
                  <div
                    key={module.id}
                    className={`module-card ${isActive ? 'is-active-module' : ''}`}
                    onClick={() => handleToggleModule(module.id)}
                  >
                    <div className="module-header">
                      <span className="module-name">{module.name}</span>
                      <span className="module-checkbox">
                        {isActive ? '✓' : ''}
                      </span>
                    </div>

                    <div className="module-subjects-list">
                      {module.subjects.map(sub => {
                        const isApproved = approvedCourses.includes(sub.clave);
                        const isCurrent = currentCourses.includes(sub.clave);
                        let subClass = "module-subject-item";
                        if (isApproved) subClass += " is-approved";
                        else if (isCurrent) subClass += " is-current";

                        return (
                          <div 
                            key={sub.clave} 
                            className={subClass}
                            onClick={(e) => {
                              e.stopPropagation(); // Avoid triggering module card toggle
                              handleSubjectClick(sub);
                            }}
                            style={{ cursor: 'pointer' }}
                            title="Ver detalles de esta materia"
                          >
                            <span className="module-subject-clave">{sub.clave}</span>
                            <span className="module-subject-name">{sub.nombre}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* LEGEND PANEL */}
          <section className="legend-panel glass-effect">
            <div className="legend-group">
              <span className="legend-title">Áreas de Conocimiento</span>
              <div className="legend-items">
                {Object.entries(AREAS).map(([key, val]) => (
                  <div key={key} className="legend-item">
                    <span className="legend-color-dot" style={{ backgroundColor: `var(--area-color-${key}, ${val.color})` }} />
                    <span>{val.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="legend-group">
              <span className="legend-title">Competencias / Secuencias</span>
              <div className="legend-items">
                {Object.entries(COMPETENCIAS).map(([key, val]) => (
                  <div key={key} className="legend-item">
                    <span className="legend-color-dot" style={{ backgroundColor: `var(--comp-color-${key}, ${val.color})` }} />
                    <span>{val.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="legend-group">
              <span className="legend-title">Relaciones y Filtro de Flujo</span>
              <div className="legend-items">
                <div className="legend-item">
                  <span className="legend-border-dot" style={{ borderColor: 'var(--color-prereq)' }} />
                  <span style={{ color: 'var(--color-prereq)', fontWeight: 600 }}>Prerrequisitos</span>
                </div>
                <div className="legend-item">
                  <span className="legend-border-dot" style={{ borderColor: 'var(--color-postreq)' }} />
                  <span style={{ color: 'var(--color-postreq)', fontWeight: 600 }}>Postrequisitos</span>
                </div>
                <div className="legend-item">
                  <span className="legend-border-dot" style={{ borderColor: 'var(--color-selected)' }} />
                  <span style={{ color: 'var(--color-selected)', fontWeight: 600 }}>Materia Seleccionada</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* SIDEBAR OVERLAY FOR MOBILE */}
        <div 
          className={`sidebar-overlay ${isDetailsSidebarOpen ? 'is-open' : ''}`} 
          onClick={() => setIsDetailsSidebarOpen(false)}
        />

        {/* DETAILS SIDEBAR PANEL */}
        <aside className={`details-sidebar glass-effect ${isDetailsSidebarOpen ? 'is-open' : ''}`}>
          {selectedSubject ? (
            <>
              <div className="details-header">
                <div className="details-clave">{selectedSubject.clave}</div>
                <h2 className="details-name">{selectedSubject.nombre}</h2>
              </div>

              <div className="details-grid">
                <div className="detail-metric">
                  <span className="detail-metric-label">Horas Totales</span>
                  <div className="detail-metric-value">{selectedSubject.horas}H</div>
                </div>
                <div className="detail-metric">
                  <span className="detail-metric-label">Créditos</span>
                  <div className="detail-metric-value">{selectedSubject.creditos}C</div>
                </div>
              </div>

              <div className="detail-badge-group">
                <div className="badge-item">
                  <span className="badge-color-dot" style={{ backgroundColor: `var(--area-color-${selectedSubject.area}, ${AREAS[selectedSubject.area]?.color})` }} />
                  <span>Área: <strong>{AREAS[selectedSubject.area]?.name}</strong></span>
                </div>
                <div className="badge-item">
                  <span className="badge-color-dot" style={{ backgroundColor: `var(--comp-color-${selectedSubject.competencia}, ${COMPETENCIAS[selectedSubject.competencia]?.color})` }} />
                  <span>Competencia: <strong>{COMPETENCIAS[selectedSubject.competencia]?.name}</strong></span>
                </div>
              </div>

              {/* TEMARIO OFICIAL PDF */}
              <a
                href={`https://www.cucei.udg.mx/carreras/informatica/sites/default/files/${selectedSubject.clave.toLowerCase()}.pdf`}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                style={{ justifyContent: 'center', textDecoration: 'none' }}
              >
                Descargar Temario Oficial (PDF)
              </a>

              {/* PRERREQUISITOS DIRECTOS EN SIDEBAR */}
              <div className="details-relations">
                <span className="relations-title">Prerrequisitos</span>
                <div className="relations-list">
                  {getPrereqsDirect(selectedSubject.clave).length > 0 ? (
                    getPrereqsDirect(selectedSubject.clave).map(pClave => {
                      const prereqSub = CORE_SUBJECTS.find(s => s.clave === pClave) ||
                        SPECIALTY_MODULES.flatMap(m => m.subjects).find(s => s.clave === pClave);
                      return (
                        <div
                          key={pClave}
                          onClick={() => setSelectedSubject(prereqSub)}
                          className="relation-chip"
                        >
                          <div className="relation-chip-info">
                            <span className="relation-chip-clave">{pClave}</span>
                            <span className="relation-chip-name">{prereqSub?.nombre || 'Materia previa'}</span>
                          </div>
                          <span>➜</span>
                        </div>
                      );
                    })
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sin prerrequisitos</span>
                  )}
                </div>
              </div>

              {/* MANUAL ACTION TOOLS FOR STATE CHANGE */}
              <div className="details-actions">
                <span className="action-title">Simular Estado (Manual)</span>
                <div className="status-button-group">
                  <button
                    onClick={() => handleToggleApproved(selectedSubject.clave)}
                    className={`status-btn ${approvedCourses.includes(selectedSubject.clave) ? 'is-active-btn-approved' : ''}`}
                  >
                    <span>✓</span> Aprobada (Kardex)
                  </button>

                  <button
                    onClick={() => handleToggleCurrent(selectedSubject.clave)}
                    className={`status-btn ${currentCourses.includes(selectedSubject.clave) ? 'is-active-btn-current' : ''}`}
                  >
                    <span>✎</span> Cursando actualmente
                  </button>

                  {(approvedCourses.includes(selectedSubject.clave) || currentCourses.includes(selectedSubject.clave)) && (
                    <button
                      onClick={() => handleResetSubject(selectedSubject.clave)}
                      className="status-btn"
                      style={{ color: '#ef4444' }}
                    >
                      Restablecer estado
                    </button>
                  )}
                </div>
              </div>

              {/* MOBILE CLOSE DRAWER BUTTON */}
              <button
                onClick={() => setIsDetailsSidebarOpen(false)}
                className="btn-primary mobile-only-close-btn"
                style={{ marginTop: '1rem' }}
              >
                Cerrar Detalles
              </button>
            </>
          ) : (
            <div className="no-selection">
              <span className="no-selection-icon">✦</span>
              <p>Selecciona una materia para visualizar sus prerrequisitos, consecuentes y temarios oficiales.</p>
            </div>
          )}
        </aside>
      </main>

      {/* FOOTER SECTION */}
      <footer className="app-footer glass-effect">
        <div className="footer-left">
          <span className="footer-present">SKL PROJECT PRESENTS</span>
          <span className="footer-brand">SKL Connect</span>
        </div>
        <div className="footer-right">
          <div className="footer-links">
            <a 
              href="https://www.instagram.com/im_jvallejo/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-link-ig"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04 1.804.577 2.76 1.418 3.6a3.9 3.9 0 0 0 1.417.923c.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.84-.839 1.187-1.8 1.417-3.6.04-.853.048-1.126.048-3.298c0-2.172-.01-2.444-.048-3.298-.04-.145-.578-2.76-1.417-3.6a3.9 3.9 0 0 0-1.416-.923c-.51-.198-1.09-.333-1.943-.372C10.443.01 10.172 0 7.999 0zm-.008 1.528c2.146 0 2.399.008 3.246.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
              </svg>
              Colaborar / Contacto (@im_jvallejo)
            </a>
          </div>
          <span className="footer-copyright">
            &copy; SKL Connect. Todos los derechos reservados.
          </span>
        </div>
      </footer>

      {/* LOGIN MODAL */}
      {isLoginModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-effect">
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="modal-close-btn"
            >
              ✕
            </button>

            <div className="modal-header">
              <div className="modal-icon">⚛</div>
              <h2 className="modal-title">Sincronizar con LEO</h2>
              <p className="modal-desc">Ingresa tus credenciales oficiales de LEO para importar tu Kardex y materias en curso.</p>
            </div>

            <form onSubmit={handleApiLogin} className="modal-form">
              <div className="form-group">
                <label className="form-label">Código de Estudiante</label>
                <input
                  type="text"
                  placeholder="Ej. 219769682"
                  value={studentCode}
                  onChange={(e) => setStudentCode(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">NIP / Contraseña</label>
                <input
                  type="password"
                  placeholder="Tu contraseña oficial de LEO"
                  value={studentPassword}
                  onChange={(e) => setStudentPassword(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              {apiError && (
                <div className="modal-error">
                  {apiError}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary modal-submit-btn"
                style={{ justifyContent: 'center' }}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Conectando con LEO...
                  </>
                ) : (
                  'Iniciar Sincronización'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;