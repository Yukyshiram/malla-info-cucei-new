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
            <h1 className="header-title">LEO Malla Curricular</h1>
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

      {/* STATS OVERVIEW */}
      <section className="stats-banner glass-effect">
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
                      <div className="area-dot" style={{ backgroundColor: AREAS[sub.area]?.color }} />
                      <div className="card-header-row">
                        <span className="card-clave">{sub.clave}</span>
                        <div className="card-hours-credits">
                          <span className="card-stat">{sub.horas}H</span>
                          <span className="card-stat">{sub.creditos}C</span>
                        </div>
                      </div>
                      <div className="card-name">{sub.nombre}</div>
                      <div className={`card-sequence-row ${sub.competencia === 'LAB' ? 'is-lab-sequence' : ''}`}>
                        {sub.competencia === 'LAB' ? (
                          <>
                            <div className="lab-prereqs-row">
                              <span className="sequence-tag">{sub.prereqSeq}</span>
                              <span className="sequence-tag">{sub.postreqSeq || '—'}</span>
                            </div>
                            <span
                              className="sequence-tag is-sequence-self"
                              style={{
                                backgroundColor: COMPETENCIAS[sub.competencia]?.color,
                                color: '#ffffff'
                              }}
                            >
                              {sub.sequenceCode}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="sequence-tag">{sub.prereqSeq}</span>
                            <span
                              className="sequence-tag is-sequence-self"
                              style={{
                                backgroundColor: COMPETENCIAS[sub.competencia]?.color,
                                color: sub.competencia === 'INICIAL' ? '#000000' : '#ffffff'
                              }}
                            >
                              {sub.sequenceCode}
                            </span>
                            <span className="sequence-tag">{sub.postreqSeq || '—'}</span>
                          </>
                        )}
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
                            <div className="area-dot" style={{ backgroundColor: AREAS[sub.area]?.color }} />
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
                      {module.subjects.map(sub => (
                        <div key={sub.clave} className="module-subject-item">
                          <span className="module-subject-clave">{sub.clave}</span>
                          <span className="module-subject-name">{sub.nombre}</span>
                        </div>
                      ))}
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
                    <span className="legend-color-dot" style={{ backgroundColor: val.color }} />
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
                    <span className="legend-color-dot" style={{ backgroundColor: val.color }} />
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
                  <span className="legend-border-dot" style={{ borderColor: '#ffffff' }} />
                  <span>Materia Seleccionada</span>
                </div>
              </div>
            </div>
          </section>
        </div>

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
                  <span className="badge-color-dot" style={{ backgroundColor: AREAS[selectedSubject.area]?.color }} />
                  <span>Área: <strong>{AREAS[selectedSubject.area]?.name}</strong></span>
                </div>
                <div className="badge-item">
                  <span className="badge-color-dot" style={{ backgroundColor: COMPETENCIAS[selectedSubject.competencia]?.color }} />
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
                className="btn-primary"
                style={{ marginTop: '1rem', display: 'none' /* handled via media queries */ }}
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