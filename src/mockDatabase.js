export const AREAS = {
  IA: { name: 'Inteligencia Artificial', color: '#0284c7', textColor: '#ffffff' },
  SI: { name: 'Sistemas de Información', color: '#ec4899', textColor: '#000000' },
  CD: { name: 'Ciencia de Datos', color: '#ef4444', textColor: '#ffffff' },
  EA: { name: 'Electrónica Aplicada', color: '#f97316', textColor: '#000000' },
  GS: { name: 'Gestión y Sociedad', color: '#8b5cf6', textColor: '#ffffff' },
  LAB: { name: 'Laboratorios Abiertos', color: '#f43f5e', textColor: '#ffffff' },
  EXTRA: { name: 'Actividades Extracurriculares', color: '#391e9b', textColor: '#ffffff' },
  MODULO: { name: 'Módulo de Especialidad', color: '#ea580c', textColor: '#ffffff' }
};

export const COMPETENCIAS = {
  INICIAL: { name: 'Competencias perfil inicial', color: '#facc15' },
  INTERMEDIO: { name: 'Competencias perfil intermedio', color: '#3b82f6' },
  EGRESO: { name: 'Competencias perfil egreso', color: '#22c55e' },
  LAB: { name: 'Laboratorios abiertos', color: '#ec4899' }
};

export const CORE_SUBJECTS = [
  // SEMESTRE I
  {
    clave: 'I5288',
    nombre: 'FUNDAMENTOS DE PROGRAMACIÓN',
    horas: 80,
    creditos: 8,
    semestre: 1,
    area: 'SI',
    competencia: 'INICIAL',
    sequenceCode: 'CG.SI.73',
    prereqSeq: 'SNB',
    postreqSeq: '142/295'
  },
  {
    clave: 'I5247',
    nombre: 'LÓGICA MATEMÁTICA',
    horas: 80,
    creditos: 8,
    semestre: 1,
    area: 'IA',
    competencia: 'INICIAL',
    sequenceCode: 'CG.B.67-A',
    prereqSeq: 'SNB',
    postreqSeq: '67-B'
  },
  {
    clave: 'IG738',
    nombre: 'PRECÁLCULO',
    horas: 80,
    creditos: 8,
    semestre: 1,
    area: 'IA',
    competencia: 'INICIAL',
    sequenceCode: 'CG.B.66-A',
    prereqSeq: 'SNB',
    postreqSeq: '66-B'
  },
  {
    clave: 'IL340',
    nombre: 'FUNDAMENTOS DE FÍSICA',
    horas: 80,
    creditos: 8,
    semestre: 1,
    area: 'EA',
    competencia: 'INICIAL',
    sequenceCode: 'CB.FIS.288',
    prereqSeq: 'SNB',
    postreqSeq: '215'
  },
  {
    clave: 'V0709',
    nombre: 'INDUCCIÓN A LA INGENIERÍA',
    horas: 40,
    creditos: 5,
    semestre: 1,
    area: 'GS',
    competencia: 'INICIAL',
    sequenceCode: 'VS.314/G.308',
    prereqSeq: 'SNB',
    postreqSeq: '274'
  },
  {
    clave: 'V0714',
    nombre: 'HISTORIA DE LA TECNOLOGÍA, EL ARTE Y LA SOCIEDAD',
    horas: 40,
    creditos: 5,
    semestre: 1,
    area: 'GS',
    competencia: 'INICIAL',
    sequenceCode: 'H.GS.273',
    prereqSeq: 'SNB',
    postreqSeq: '274'
  },

  // SEMESTRE II
  {
    clave: 'V0716',
    nombre: 'PROGRAMACIÓN ESTRUCTURADA',
    horas: 80,
    creditos: 8,
    semestre: 2,
    area: 'SI',
    competencia: 'INICIAL',
    sequenceCode: 'CG.SI.142',
    prereqSeq: '73', // dependiente de CG.SI.73
    postreqSeq: '95'
  },
  {
    clave: 'V0711',
    nombre: 'MATEMÁTICAS DISCRETAS',
    horas: 80,
    creditos: 8,
    semestre: 2,
    area: 'IA',
    competencia: 'INICIAL',
    sequenceCode: 'CG.B.67-B',
    prereqSeq: '67-A', // dependiente de CG.B.67-A
    postreqSeq: '96'
  },
  {
    clave: 'V0710',
    nombre: 'CÁLCULO DIFERENCIAL E INTEGRAL',
    horas: 80,
    creditos: 8,
    semestre: 2,
    area: 'IA',
    competencia: 'INICIAL',
    sequenceCode: 'CG.B.66-B',
    prereqSeq: '66-A',
    postreqSeq: '66-C'
  },
  {
    clave: 'IL343',
    nombre: 'MECÁNICA',
    horas: 80,
    creditos: 8,
    semestre: 2,
    area: 'EA',
    competencia: 'INICIAL',
    sequenceCode: 'CB.FIS.215',
    prereqSeq: '288',
    postreqSeq: '290'
  },
  {
    clave: 'V0715',
    nombre: 'TECNOLOGÍA Y RETOS DE LA SOCIEDAD',
    horas: 80,
    creditos: 8,
    semestre: 2,
    area: 'GS',
    competencia: 'INICIAL',
    sequenceCode: 'H.GS.274',
    prereqSeq: '273',
    postreqSeq: '275'
  },

  // SEMESTRE III
  {
    clave: 'I5289',
    nombre: 'PROGRAMACIÓN ORIENTADA A OBJETOS',
    horas: 80,
    creditos: 8,
    semestre: 3,
    area: 'SI',
    competencia: 'INICIAL',
    sequenceCode: 'CG.SI.142/CG.SI.295',
    prereqSeq: '73',
    postreqSeq: '95'
  },
  {
    clave: 'IB056',
    nombre: 'ÁLGEBRA LINEAL',
    horas: 80,
    creditos: 8,
    semestre: 3,
    area: 'IA',
    competencia: 'INICIAL',
    sequenceCode: 'C.GB.66-E',
    prereqSeq: '66-A',
    postreqSeq: '66-F'
  },
  {
    clave: 'V0712',
    nombre: 'ECUACIONES DIFERENCIALES',
    horas: 80,
    creditos: 8,
    semestre: 3,
    area: 'IA',
    competencia: 'INICIAL',
    sequenceCode: 'CG.B.66-C',
    prereqSeq: '66-B',
    postreqSeq: '66-D'
  },
  {
    clave: 'IC591',
    nombre: 'ELECTROMAGNETISMO',
    horas: 80,
    creditos: 8,
    semestre: 3,
    area: 'EA',
    competencia: 'INICIAL',
    sequenceCode: 'CB.FIS.290',
    prereqSeq: '215',
    postreqSeq: '299'
  },
  {
    clave: 'V0717',
    nombre: 'INGENIERÍA Y SUSTENTABILIDAD',
    horas: 80,
    creditos: 8,
    semestre: 3,
    area: 'GS',
    competencia: 'INTERMEDIO',
    sequenceCode: 'H.GS.275',
    prereqSeq: '274',
    postreqSeq: '301'
  },

  // SEMESTRE IV
  {
    clave: 'V0731',
    nombre: 'ESTRUCTURA DE DATOS',
    horas: 120,
    creditos: 10,
    semestre: 4,
    area: 'SI',
    competencia: 'INTERMEDIO',
    sequenceCode: 'SI.S.95',
    prereqSeq: '142/295',
    postreqSeq: '128'
  },
  {
    clave: 'IB067',
    nombre: 'PROBABILIDAD Y ESTADÍSTICA',
    horas: 80,
    creditos: 8,
    semestre: 4,
    area: 'IA',
    competencia: 'INICIAL',
    sequenceCode: 'C.GB.66-F',
    prereqSeq: '66-E',
    postreqSeq: '292'
  },
  {
    clave: 'V0713',
    nombre: 'MÉTODOS NUMÉRICOS',
    horas: 80,
    creditos: 8,
    semestre: 4,
    area: 'IA',
    competencia: 'INICIAL',
    sequenceCode: 'C.GB.66-D',
    prereqSeq: '66-C',
    postreqSeq: '96'
  },
  {
    clave: 'V0730',
    nombre: 'INFORMÁTICA ADMINISTRATIVA',
    horas: 80,
    creditos: 8,
    semestre: 4,
    area: 'GS',
    competencia: 'INTERMEDIO',
    sequenceCode: 'CE.IE.301/CE.MA.57',
    prereqSeq: '275',
    postreqSeq: '211'
  },
  {
    clave: 'I5629',
    nombre: 'ARQUITECTURA DE COMPUTADORAS',
    horas: 80,
    creditos: 8,
    semestre: 4,
    area: 'EA',
    competencia: 'INTERMEDIO',
    sequenceCode: 'EA.R.299',
    prereqSeq: '290',
    postreqSeq: '92/244'
  },

  // SEMESTRE V
  {
    clave: 'CB224',
    nombre: 'INGENIERÍA DE SOFTWARE',
    horas: 80,
    creditos: 8,
    semestre: 5,
    area: 'SI',
    competencia: 'INTERMEDIO',
    sequenceCode: 'SI.S.128',
    prereqSeq: '95',
    postreqSeq: '136'
  },
  {
    clave: 'CU206',
    nombre: 'MINERÍA DE DATOS',
    horas: 80,
    creditos: 8,
    semestre: 5,
    area: 'CD',
    competencia: 'INTERMEDIO',
    sequenceCode: 'SI.D.292',
    prereqSeq: '66-F',
    postreqSeq: '78'
  },
  {
    clave: 'IL361',
    nombre: 'FUNDAMENTOS DE INTELIGENCIA ARTIFICIAL',
    horas: 80,
    creditos: 8,
    semestre: 5,
    area: 'IA',
    competencia: 'INTERMEDIO',
    sequenceCode: 'CE.TINF.96',
    prereqSeq: '&&-E', // Matemáticas Discretas (67-B) y Métodos Numéricos (66-D)
    postreqSeq: '253'
  },
  {
    clave: 'V0719',
    nombre: 'INNOVACIÓN TECNOLÓGICA Y EMPRENDIMIENTO',
    horas: 80,
    creditos: 8,
    semestre: 5,
    area: 'GS',
    competencia: 'EGRESO',
    sequenceCode: 'CE.SI.211',
    prereqSeq: '301/57',
    postreqSeq: ''
  },
  {
    clave: 'IL364',
    nombre: 'REDES DE COMPUTADORAS',
    horas: 80,
    creditos: 8,
    semestre: 5,
    area: 'EA',
    competencia: 'INTERMEDIO',
    sequenceCode: 'EA.R.92',
    prereqSeq: '299',
    postreqSeq: '59/289'
  },
  {
    clave: 'V0733',
    nombre: 'SEMINARIO DE INTEGRACIÓN PROTOCOLO',
    horas: 40,
    creditos: 4,
    semestre: 5,
    area: 'EXTRA', // En la malla oficial está como seminarios transversales
    competencia: 'INICIAL',
    sequenceCode: 'G.306/G.311',
    prereqSeq: '',
    postreqSeq: '309/321'
  },

  // SEMESTRE VI
  {
    clave: 'V0732',
    nombre: 'CALIDAD DE SOFTWARE',
    horas: 80,
    creditos: 8,
    semestre: 6,
    area: 'SI',
    competencia: 'INTERMEDIO',
    sequenceCode: 'SI.S.136',
    prereqSeq: '128',
    postreqSeq: '58'
  },
  {
    clave: 'V0718',
    nombre: 'BASE DE DATOS',
    horas: 80,
    creditos: 8,
    semestre: 6,
    area: 'CD',
    competencia: 'INTERMEDIO',
    sequenceCode: 'SI.D.78',
    prereqSeq: '292',
    postreqSeq: '124'
  },
  {
    clave: 'V0723',
    nombre: 'ALGORITMOS METAHEURÍSTICOS',
    horas: 80,
    creditos: 8,
    semestre: 6,
    area: 'IA',
    competencia: 'INTERMEDIO',
    sequenceCode: 'SI.IA.253',
    prereqSeq: '96',
    postreqSeq: '256'
  },

  // SEMESTRE VII
  {
    clave: 'V0724',
    nombre: 'ADMINISTRACIÓN DE BASE DE DATOS',
    horas: 80,
    creditos: 8,
    semestre: 7,
    area: 'CD',
    competencia: 'INTERMEDIO',
    sequenceCode: 'SI.D.124',
    prereqSeq: '78',
    postreqSeq: '250'
  },
  {
    clave: 'V0734',
    nombre: 'SEMINARIO DE INTEGRACIÓN DESARROLLO',
    horas: 60,
    creditos: 6,
    semestre: 7,
    area: 'IA', // En la malla oficial está con fondo azul IA, pero actúa de seminario
    competencia: 'INTERMEDIO',
    sequenceCode: 'G.309/G.321',
    prereqSeq: '306/311',
    postreqSeq: '312/328'
  },
  {
    clave: 'V0720',
    nombre: 'LABORATORIO ABIERTO: DISEÑO',
    horas: 80,
    creditos: 7,
    semestre: 7,
    area: 'LAB',
    competencia: 'LAB',
    sequenceCode: 'G.313/GL.332/GL.333',
    prereqSeq: '306/311',
    postreqSeq: ''
  },

  // SEMESTRE VIII
  {
    clave: 'V0725',
    nombre: 'ANÁLISIS Y VISUALIZACIÓN DE LA INFORMACIÓN',
    horas: 80,
    creditos: 8,
    semestre: 8,
    area: 'CD',
    competencia: 'EGRESO',
    sequenceCode: 'SI.D.250',
    prereqSeq: '124',
    postreqSeq: ''
  },
  {
    clave: 'V0726',
    nombre: 'SISTEMAS INTELIGENTES',
    horas: 80,
    creditos: 8,
    semestre: 8,
    area: 'IA',
    competencia: 'INTERMEDIO',
    sequenceCode: 'SI.IA.257',
    prereqSeq: '253',
    postreqSeq: '256'
  },
  {
    clave: 'V0721',
    nombre: 'LABORATORIO ABIERTO: CONSTRUCCIÓN',
    horas: 80,
    creditos: 7,
    semestre: 8,
    area: 'LAB',
    competencia: 'LAB',
    sequenceCode: 'G.313/GL.332/GL.333',
    prereqSeq: '309/321',
    postreqSeq: ''
  },

  // SEMESTRE IX
  {
    clave: 'V0727',
    nombre: 'CONTROL DE PROYECTOS',
    horas: 80,
    creditos: 8,
    semestre: 9,
    area: 'SI',
    competencia: 'EGRESO',
    sequenceCode: 'C.SI.58',
    prereqSeq: '136',
    postreqSeq: ''
  },
  {
    clave: 'V0735',
    nombre: 'SEMINARIO DE INTEGRACIÓN COMUNICACIÓN',
    horas: 40,
    creditos: 4,
    semestre: 9,
    area: 'EXTRA', // Verde claro en la original
    competencia: 'EGRESO',
    sequenceCode: 'G.312/EJ.328',
    prereqSeq: '309/321',
    postreqSeq: ''
  },
  {
    clave: 'V0722',
    nombre: 'LABORATORIO ABIERTO: PRUEBAS',
    horas: 80,
    creditos: 7,
    semestre: 9,
    area: 'LAB',
    competencia: 'LAB',
    sequenceCode: 'G.313/GL.332/GL.333',
    prereqSeq: '312/328',
    postreqSeq: ''
  },
  {
    clave: 'V0728',
    nombre: 'TECNOLOGÍAS DE INTELIGENCIA ARTIFICIAL',
    horas: 80,
    creditos: 8,
    semestre: 9,
    area: 'IA',
    competencia: 'EGRESO',
    sequenceCode: 'SI.IA.256',
    prereqSeq: '257',
    postreqSeq: ''
  }
];

export const SPECIALTY_MODULES = [
  {
    id: 'MODULO_I',
    name: 'Bio-Informática',
    subjects: [
      {
        clave: 'BIO287', // Asignado clave representativa si no venia en HTML
        nombre: 'ANÁLISIS GENÓMICO Y PROTÓMICO',
        horas: 80,
        creditos: 8,
        semestre: 6, // Rellena UA 1
        area: 'MODULO',
        competencia: 'INTERMEDIO',
        sequenceCode: 'BIO.287',
        prereqSeq: '57',
        postreqSeq: '221/220'
      },
      {
        clave: 'BIO221',
        nombre: 'PROGRAMACIÓN BIOINFORMÁTICA',
        horas: 80,
        creditos: 8,
        semestre: 7, // Rellena UA 2
        area: 'MODULO',
        competencia: 'INTERMEDIO',
        sequenceCode: 'BIO.221/BIO.220',
        prereqSeq: '287',
        postreqSeq: '232'
      },
      {
        clave: 'BIO232',
        nombre: 'BIOINFORMÁTICA Y BIOLOGÍA COMPUTACIONAL AVANZADOS',
        horas: 80,
        creditos: 8,
        semestre: 8, // Rellena UA 3
        area: 'MODULO',
        competencia: 'EGRESO',
        sequenceCode: 'BIO.232',
        prereqSeq: '221/220',
        postreqSeq: ''
      }
    ]
  },
  {
    id: 'MODULO_II',
    name: 'Cómputo Cuántico',
    subjects: [
      {
        clave: 'ECC291',
        nombre: 'FÍSICA CUÁNTICA',
        horas: 80,
        creditos: 8,
        semestre: 6,
        area: 'MODULO',
        competencia: 'INTERMEDIO',
        sequenceCode: 'E.CC.291',
        prereqSeq: '290',
        postreqSeq: '268'
      },
      {
        clave: 'ECC268',
        nombre: 'COMPUTACIÓN CUÁNTICA',
        horas: 80,
        creditos: 8,
        semestre: 7,
        area: 'MODULO',
        competencia: 'INTERMEDIO',
        sequenceCode: 'E.CC.268',
        prereqSeq: '291',
        postreqSeq: '265'
      },
      {
        clave: 'ECC265',
        nombre: 'MODELADO CUÁNTICO',
        horas: 80,
        creditos: 8,
        semestre: 8,
        area: 'MODULO',
        competencia: 'EGRESO',
        sequenceCode: 'E.CC.265',
        prereqSeq: '268',
        postreqSeq: ''
      }
    ]
  },
  {
    id: 'MODULO_III',
    name: 'Tecnología Financiera',
    subjects: [
      {
        clave: 'TF217',
        nombre: 'COMERCIO ELECTRÓNICO',
        horas: 80,
        creditos: 8,
        semestre: 6,
        area: 'MODULO',
        competencia: 'INTERMEDIO',
        sequenceCode: 'TF.217',
        prereqSeq: '57',
        postreqSeq: '262'
      },
      {
        clave: 'TF262',
        nombre: 'CADENA DE BLOQUES',
        horas: 80,
        creditos: 8,
        semestre: 7,
        area: 'MODULO',
        competencia: 'INTERMEDIO',
        sequenceCode: 'TF.262',
        prereqSeq: '217',
        postreqSeq: '305'
      },
      {
        clave: 'TF305',
        nombre: 'MODELO DE NEGOCIOS FINANCIEROS',
        horas: 80,
        creditos: 8,
        semestre: 8,
        area: 'MODULO',
        competencia: 'EGRESO',
        sequenceCode: 'TF.305',
        prereqSeq: '262',
        postreqSeq: ''
      }
    ]
  },
  {
    id: 'MODULO_IV',
    name: 'Ciber-Seguridad',
    subjects: [
      {
        clave: 'CIS59',
        nombre: 'SEGURIDAD EN REDES E INFRAESTRUCTURA TECNOLÓGICA',
        horas: 80,
        creditos: 8,
        semestre: 6,
        area: 'MODULO',
        competencia: 'INTERMEDIO',
        sequenceCode: 'CI.S.59/CI.S.289',
        prereqSeq: '92',
        postreqSeq: '61'
      },
      {
        clave: 'CIS61',
        nombre: 'SEGURIDAD DEFENSIVA Y GESTIÓN',
        horas: 80,
        creditos: 8,
        semestre: 7,
        area: 'MODULO',
        competencia: 'INTERMEDIO',
        sequenceCode: 'CI.S.61',
        prereqSeq: '59/289',
        postreqSeq: '266'
      },
      {
        clave: 'CIS266',
        nombre: 'ANÁLISIS FORENSE DIGITAL',
        horas: 80,
        creditos: 8,
        semestre: 8,
        area: 'MODULO',
        competencia: 'EGRESO',
        sequenceCode: 'CI.S.266',
        prereqSeq: '61',
        postreqSeq: ''
      }
    ]
  },
  {
    id: 'MODULO_V',
    name: 'Arquitecturas Múltiples',
    subjects: [
      {
        clave: 'EAR244',
        nombre: 'INTERNET DE LAS COSAS',
        horas: 80,
        creditos: 8,
        semestre: 6,
        area: 'MODULO',
        competencia: 'INTERMEDIO',
        sequenceCode: 'E.AR.244',
        prereqSeq: '299',
        postreqSeq: '164/165'
      },
      {
        clave: 'EAR164',
        nombre: 'DESARROLLO DE APLICACIONES WEB, EN LA NUBE Y MÓVILES',
        horas: 80,
        creditos: 8,
        semestre: 7,
        area: 'MODULO',
        competencia: 'INTERMEDIO',
        sequenceCode: 'E.AR.164/E.AR.165',
        prereqSeq: '244',
        postreqSeq: '239'
      },
      {
        clave: 'EAR239',
        nombre: 'COMPUTACIÓN EN FRONTERA',
        horas: 80,
        creditos: 8,
        semestre: 8,
        area: 'MODULO',
        competencia: 'EGRESO',
        sequenceCode: 'E.AR.239',
        prereqSeq: '164/165',
        postreqSeq: ''
      }
    ]
  },
  {
    id: 'MODULO_VI',
    name: 'Interacción Hombre-Máquina',
    subjects: [
      {
        clave: 'IHM65',
        nombre: 'MODELADO BASADO EN LA EXPERIENCIA DE USUARIO',
        horas: 80,
        creditos: 8,
        semestre: 6,
        area: 'MODULO',
        competencia: 'INTERMEDIO',
        sequenceCode: 'I.HM.65/I.HM.304',
        prereqSeq: '95',
        postreqSeq: '281'
      },
      {
        clave: 'IHM281',
        nombre: 'INTERACCIÓN ADAPTADA AL USUARIO',
        horas: 80,
        creditos: 8,
        semestre: 7,
        area: 'MODULO',
        competencia: 'INTERMEDIO',
        sequenceCode: 'I.HM.281',
        prereqSeq: '65/304',
        postreqSeq: '284'
      },
      {
        clave: 'IHM284',
        nombre: 'SISTEMAS INFORMÁTICOS CENTRADOS EN EL SER HUMANO',
        horas: 80,
        creditos: 8,
        semestre: 8,
        area: 'MODULO',
        competencia: 'EGRESO',
        sequenceCode: 'I.HM.284',
        prereqSeq: '281',
        postreqSeq: ''
      }
    ]
  },
  {
    id: 'MODULO_VII',
    name: 'Tecnologías Emergentes',
    subjects: [
      {
        clave: 'TE1',
        nombre: 'UA I TECNOLOGIAS EMERGENTES',
        horas: 80,
        creditos: 8,
        semestre: 6,
        area: 'MODULO',
        competencia: 'INTERMEDIO',
        sequenceCode: 'COMPETENCIA TE1',
        prereqSeq: '',
        postreqSeq: 'TE2'
      },
      {
        clave: 'TE2',
        nombre: 'UA2 TECNOLOGÍAS EMERGENTES',
        horas: 80,
        creditos: 8,
        semestre: 7,
        area: 'MODULO',
        competencia: 'INTERMEDIO',
        sequenceCode: 'COMPETENCIA TE2',
        prereqSeq: 'TE1',
        postreqSeq: 'TE3'
      },
      {
        clave: 'TE3',
        nombre: 'UA3 TECNOLOGÍAS EMERGENTES',
        horas: 80,
        creditos: 8,
        semestre: 8,
        area: 'MODULO',
        competencia: 'EGRESO',
        sequenceCode: 'COMPETENCIA TE3',
        prereqSeq: 'TE2',
        postreqSeq: ''
      }
    ]
  }
];

// Mapeos rápidos para flujo de prerrequisitos y postrequisitos
// Esta función traza recursivamente los prerrequisitos de una materia
export function getPrereqsRecursive(subjectClave, allSubjects) {
  const subject = allSubjects.find(s => s.clave === subjectClave);
  if (!subject) return [];

  let prereqClaves = [];

  // Mapeos específicos de prerrequisitos basados en sequence codes
  if (subject.clave === 'V0711') prereqClaves.push('I5247'); // Discretas -> Lógica
  if (subject.clave === 'V0710') prereqClaves.push('IG738'); // Cálculo D -> Precálculo
  if (subject.clave === 'IL343') prereqClaves.push('IL340'); // Mecánica -> Física
  if (subject.clave === 'V0715') prereqClaves.push('V0714', 'V0709'); // Retos -> Historia, Inducción
  if (subject.clave === 'V0716') prereqClaves.push('I5288'); // Estructurada -> Fund Programación

  if (subject.clave === 'I5289') prereqClaves.push('I5288'); // POO -> Fund Programación
  if (subject.clave === 'IB056') prereqClaves.push('IG738'); // Álgebra -> Precálculo
  if (subject.clave === 'V0712') prereqClaves.push('V0710'); // Ecuaciones -> Cálculo D
  if (subject.clave === 'IC591') prereqClaves.push('IL343'); // Electromagn -> Mecánica
  if (subject.clave === 'V0717') prereqClaves.push('V0715'); // Sustentabilidad -> Retos

  if (subject.clave === 'V0731') prereqClaves.push('V0716', 'I5289'); // Estructura Datos -> Estructurada, POO
  if (subject.clave === 'IB067') prereqClaves.push('IB056'); // Probabilidad -> Álgebra
  if (subject.clave === 'V0713') prereqClaves.push('V0712'); // Numéricos -> Ecuaciones
  if (subject.clave === 'V0730') prereqClaves.push('V0717'); // Info Adm -> Sustentabilidad
  if (subject.clave === 'I5629') prereqClaves.push('IC591'); // Arqui -> Electromagn

  if (subject.clave === 'CB224') prereqClaves.push('V0731'); // Sw -> Estructura Datos
  if (subject.clave === 'CU206') prereqClaves.push('IB067'); // Minería -> Probabilidad
  if (subject.clave === 'IL361') prereqClaves.push('V0711', 'V0713'); // IA -> Discretas, Numéricos
  if (subject.clave === 'V0719') prereqClaves.push('V0730'); // Innovación -> Info Adm
  if (subject.clave === 'IL364') prereqClaves.push('I5629'); // Redes -> Arqui
  if (subject.clave === 'V0733') { } // Protocolo

  if (subject.clave === 'V0732') prereqClaves.push('CB224'); // Calidad -> Sw
  if (subject.clave === 'V0718') prereqClaves.push('CU206'); // BD -> Minería
  if (subject.clave === 'V0723') prereqClaves.push('IL361'); // Metaheurísticos -> IA

  if (subject.clave === 'V0724') prereqClaves.push('V0718'); // Admin BD -> BD
  if (subject.clave === 'V0734') prereqClaves.push('V0733'); // Integración Des -> Protocolo
  if (subject.clave === 'V0720') prereqClaves.push('V0733'); // Lab Diseño -> Protocolo

  if (subject.clave === 'V0725') prereqClaves.push('V0724'); // Visualización -> Admin BD
  if (subject.clave === 'V0726') prereqClaves.push('V0723'); // Sist Inteligentes -> Metaheurísticos
  if (subject.clave === 'V0721') prereqClaves.push('V0734'); // Lab Const -> Integración Des

  if (subject.clave === 'V0727') prereqClaves.push('V0732'); // Control Proyectos -> Calidad
  if (subject.clave === 'V0735') prereqClaves.push('V0734'); // Integración Com -> Integración Des
  if (subject.clave === 'V0722') prereqClaves.push('V0735'); // Lab Pruebas -> Integración Com
  if (subject.clave === 'V0728') prereqClaves.push('V0726'); // Tec IA -> Sist Inteligentes

  // Prerrequisitos de Módulos
  if (subject.clave === 'BIO287') prereqClaves.push('I5288'); // Análisis genómico -> Prog (representativo: Fund)
  if (subject.clave === 'BIO221') prereqClaves.push('BIO287');
  if (subject.clave === 'BIO232') prereqClaves.push('BIO221');

  if (subject.clave === 'ECC291') prereqClaves.push('IC591'); // Física cuántica -> Electromagn
  if (subject.clave === 'ECC268') prereqClaves.push('ECC291');
  if (subject.clave === 'ECC265') prereqClaves.push('ECC268');

  if (subject.clave === 'TF217') prereqClaves.push('I5288'); // Comercio Elec -> Fund Prog
  if (subject.clave === 'TF262') prereqClaves.push('TF217');
  if (subject.clave === 'TF305') prereqClaves.push('TF262');

  if (subject.clave === 'CIS59') prereqClaves.push('IL364'); // Seg Redes -> Redes
  if (subject.clave === 'CIS61') prereqClaves.push('CIS59');
  if (subject.clave === 'CIS266') prereqClaves.push('CIS61');

  if (subject.clave === 'EAR244') prereqClaves.push('I5629'); // IoT -> Arqui
  if (subject.clave === 'EAR164') prereqClaves.push('EAR244');
  if (subject.clave === 'EAR239') prereqClaves.push('EAR164');

  if (subject.clave === 'IHM65') prereqClaves.push('V0731'); // UX -> Estructuras
  if (subject.clave === 'IHM281') prereqClaves.push('IHM65');
  if (subject.clave === 'IHM284') prereqClaves.push('IHM281');

  if (subject.clave === 'TE1') { }
  if (subject.clave === 'TE2') prereqClaves.push('TE1');
  if (subject.clave === 'TE3') prereqClaves.push('TE2');

  // Agregar recursión
  let recursivePrereqs = [...prereqClaves];
  prereqClaves.forEach(pClave => {
    recursivePrereqs = [...recursivePrereqs, ...getPrereqsRecursive(pClave, allSubjects)];
  });

  return Array.from(new Set(recursivePrereqs));
}

// Esta función obtiene todos los postrequisitos de manera recursiva
export function getPostreqsRecursive(subjectClave, allSubjects) {
  let postreqs = [];

  allSubjects.forEach(s => {
    // Si esta materia tiene a subjectClave en sus prerrequisitos directos
    const directPrereqs = getPrereqsDirect(s.clave);
    if (directPrereqs.includes(subjectClave)) {
      postreqs.push(s.clave);
      postreqs = [...postreqs, ...getPostreqsRecursive(s.clave, allSubjects)];
    }
  });

  return Array.from(new Set(postreqs));
}

// Obtener prerrequisitos directos (no recursivos) para visualización inmediata
export function getPrereqsDirect(subjectClave) {
  switch (subjectClave) {
    case 'V0711': return ['I5247'];
    case 'V0710': return ['IG738'];
    case 'IL343': return ['IL340'];
    case 'V0715': return ['V0714', 'V0709'];
    case 'V0716': return ['I5288'];

    case 'I5289': return ['I5288'];
    case 'IB056': return ['IG738'];
    case 'V0712': return ['V0710'];
    case 'IC591': return ['IL343'];
    case 'V0717': return ['V0715'];

    case 'V0731': return ['V0716', 'I5289'];
    case 'IB067': return ['IB056'];
    case 'V0713': return ['V0712'];
    case 'V0730': return ['V0717'];
    case 'I5629': return ['IC591'];

    case 'CB224': return ['V0731'];
    case 'CU206': return ['IB067'];
    case 'IL361': return ['V0711', 'V0713'];
    case 'V0719': return ['V0730'];
    case 'IL364': return ['I5629'];

    case 'V0732': return ['CB224'];
    case 'V0718': return ['CU206'];
    case 'V0723': return ['IL361'];

    case 'V0724': return ['V0718'];
    case 'V0734': return ['V0733'];
    case 'V0720': return ['V0733'];

    case 'V0725': return ['V0724'];
    case 'V0726': return ['V0723'];
    case 'V0721': return ['V0734'];

    case 'V0727': return ['V0732'];
    case 'V0735': return ['V0734'];
    case 'V0722': return ['V0735'];
    case 'V0728': return ['V0726'];

    // Módulos
    case 'BIO287': return ['I5288'];
    case 'BIO221': return ['BIO287'];
    case 'BIO232': return ['BIO221'];

    case 'ECC291': return ['IC591'];
    case 'ECC268': return ['ECC291'];
    case 'ECC265': return ['ECC268'];

    case 'TF217': return ['I5288'];
    case 'TF262': return ['TF217'];
    case 'TF305': return ['TF262'];

    case 'CIS59': return ['IL364'];
    case 'CIS61': return ['CIS59'];
    case 'CIS266': return ['CIS61'];

    case 'EAR244': return ['I5629'];
    case 'EAR164': return ['EAR244'];
    case 'EAR239': return ['EAR164'];

    case 'IHM65': return ['V0731'];
    case 'IHM281': return ['IHM65'];
    case 'IHM284': return ['IHM281'];

    case 'TE2': return ['TE1'];
    case 'TE3': return ['TE2'];

    default: return [];
  }
}