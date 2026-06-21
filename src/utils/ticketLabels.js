export const CATEGORY_LABELS = {
  ACADEMIC: 'Académica',
  INSTITUTIONAL: 'Institucional',
  TECHNICAL: 'Técnica',
  GENERAL: 'General',
};

export const SUBCATEGORY_LABELS = {
  GRADE_ISSUE: 'Problema con calificación',
  EXAM_ISSUE: 'Problema con examen',
  CORRELATIVITY_ISSUE: 'Problema de correlatividad',
  SUBJECT_CONTENT_ISSUE: 'Problema de contenido de materia',
  SUBJECT_EQUIVALENCY_REQUEST: 'Solicitud de equivalencia de materia',
  GRADE_RECORD_CORRECTION_REQUEST: 'Solicitud de corrección de nota',
  EXAM_CERTIFICATE_REQUEST: 'Solicitud de certificado de examen',
  DEGREE_PROCESS_REQUEST: 'Solicitud de trámite de título',
  CLASS_SECTION_CHANGE_REQUEST: 'Solicitud de cambio de comisión',
  MOODLE_PROBLEM: 'Problema con Moodle',
  SIU_PROBLEM: 'Problema con SIU',
  WEBSITE_ERROR: 'Error en sitio web',
  GENERAL_INQUIRY: 'Consulta general',
};

export const SUBCATEGORIES_BY_CATEGORY = {
  ACADEMIC: ['GRADE_ISSUE', 'EXAM_ISSUE', 'CORRELATIVITY_ISSUE', 'SUBJECT_CONTENT_ISSUE'],
  INSTITUTIONAL: ['SUBJECT_EQUIVALENCY_REQUEST', 'GRADE_RECORD_CORRECTION_REQUEST', 'EXAM_CERTIFICATE_REQUEST', 'DEGREE_PROCESS_REQUEST', 'CLASS_SECTION_CHANGE_REQUEST'],
  TECHNICAL: ['MOODLE_PROBLEM', 'SIU_PROBLEM', 'WEBSITE_ERROR'],
  GENERAL: ['GENERAL_INQUIRY'],
};

export const formatCategory = (category) => CATEGORY_LABELS[category] || category;
export const formatSubcategory = (subcategory) => SUBCATEGORY_LABELS[subcategory] || subcategory;
