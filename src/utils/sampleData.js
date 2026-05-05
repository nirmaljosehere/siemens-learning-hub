export const SAMPLE_COURSES = [
  {
    _path: '/content/dam/siemens-learning/courses/intro-to-tia-portal',
    slug: 'intro-to-tia-portal',
    title: 'Introduction to TIA Portal',
    duration: '2–5 hours',
    difficultyLevel: 'Beginner',
    tags: ['automation', 'tia-portal', 'plc'],
    shortDescription:
      'Get hands-on with Siemens TIA Portal — the unified engineering framework for SIMATIC controllers, HMIs and drives.',
  },
  {
    _path: '/content/dam/siemens-learning/courses/simatic-s7-1500-fundamentals',
    slug: 'simatic-s7-1500-fundamentals',
    title: 'SIMATIC S7-1500 Fundamentals',
    duration: '5–8 hours',
    difficultyLevel: 'Intermediate',
    tags: ['simatic', 's7-1500', 'plc'],
    shortDescription:
      'Architecture, addressing, and programming patterns for the S7-1500 family in production environments.',
  },
  {
    _path: '/content/dam/siemens-learning/courses/sinamics-drives-startup',
    slug: 'sinamics-drives-startup',
    title: 'SINAMICS Drives — Commissioning',
    duration: '8–12 hours',
    difficultyLevel: 'Intermediate',
    tags: ['sinamics', 'drives', 'commissioning'],
    shortDescription:
      'Step-by-step commissioning of SINAMICS G120 and S210 drives using Startdrive.',
  },
  {
    _path: '/content/dam/siemens-learning/courses/mindsphere-iot-essentials',
    slug: 'mindsphere-iot-essentials',
    title: 'MindSphere IoT Essentials',
    duration: '2–5 hours',
    difficultyLevel: 'Beginner',
    tags: ['mindsphere', 'iot', 'cloud'],
    shortDescription:
      'Connect a SIMATIC asset to MindSphere, model your data, and build a first dashboard.',
  },
  {
    _path: '/content/dam/siemens-learning/courses/safety-integrated-advanced',
    slug: 'safety-integrated-advanced',
    title: 'Safety Integrated — Advanced',
    duration: '12–15+ hours',
    difficultyLevel: 'Advanced',
    tags: ['safety', 'functional-safety', 'iso-13849'],
    shortDescription:
      'Designing fail-safe applications with Safety Integrated, including risk assessment and validation.',
  },
  {
    _path: '/content/dam/siemens-learning/courses/wincc-unified-hmi',
    slug: 'wincc-unified-hmi',
    title: 'WinCC Unified HMI Design',
    duration: '5–8 hours',
    difficultyLevel: 'Intermediate',
    tags: ['wincc', 'hmi', 'visualization'],
    shortDescription:
      'Build modern, web-native HMIs with WinCC Unified — layouts, dynamics, and scripting.',
  },
  {
    _path: '/content/dam/siemens-learning/courses/profinet-networking',
    slug: 'profinet-networking',
    title: 'PROFINET Networking',
    duration: '5–8 hours',
    difficultyLevel: 'Intermediate',
    tags: ['profinet', 'networking', 'industrial-ethernet'],
    shortDescription:
      'Topology, diagnostics and real-time communication on industrial PROFINET networks.',
  },
  {
    _path: '/content/dam/siemens-learning/courses/digital-twin-with-nx',
    slug: 'digital-twin-with-nx',
    title: 'Digital Twin with NX & Teamcenter',
    duration: '8–12 hours',
    difficultyLevel: 'Advanced',
    tags: ['digital-twin', 'nx', 'teamcenter', 'plm'],
    shortDescription:
      'Connect mechanical, electrical and automation models into a single executable digital twin.',
  },
];

const DETAIL_EXTRAS = {
  '/content/dam/siemens-learning/courses/intro-to-tia-portal': {
    learningObjectives: [
      'Navigate the TIA Portal workspace and project tree',
      'Configure a SIMATIC S7-1200 station from scratch',
      'Write and download a first ladder-logic program',
      'Use online diagnostics to validate a running program',
    ],
    prerequisites: [
      'Basic understanding of industrial automation',
      'Familiarity with electrical schematics',
    ],
    courseMaterial: [{ _path: '/content/dam/siemens-learning/materials/tia-portal-intro.pdf', _publishUrl: '#sample-material' }],
  },
  '/content/dam/siemens-learning/courses/simatic-s7-1500-fundamentals': {
    learningObjectives: [
      'Explain the S7-1500 hardware architecture',
      'Use symbolic addressing and structured data types',
      'Implement program blocks (OB, FB, FC, DB) effectively',
      'Apply best-practice naming and code organization',
    ],
    prerequisites: [
      'Completion of "Introduction to TIA Portal" or equivalent',
      'Working knowledge of structured text or ladder logic',
    ],
    courseMaterial: null,
  },
};

export function getSampleCourseDetail(pathOrSlug) {
  const base = SAMPLE_COURSES.find(
    (c) => c._path === pathOrSlug || c.slug === pathOrSlug
  );
  if (!base) return null;
  const extras = DETAIL_EXTRAS[base._path] || {
    learningObjectives: ['Outcome A', 'Outcome B', 'Outcome C'],
    prerequisites: ['General Siemens automation literacy'],
    courseMaterial: null,
  };
  return { ...base, ...extras };
}

export function getSampleCourseBySlug(slug) {
  return getSampleCourseDetail(slug);
}
