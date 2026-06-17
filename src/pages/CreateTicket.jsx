import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const CreateTicket = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [subject, setSubject] = useState('');
  const [commission, setCommission] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const [equivalencyInstitution, setEquivalencyInstitution] = useState('');
  const [equivalencySubject, setEquivalencySubject] = useState('');
  const [equivalencyGrade, setEquivalencyGrade] = useState('');

  const [gradeCorrectionGrade, setGradeCorrectionGrade] = useState('');
  const [gradeCorrectionExamDate, setGradeCorrectionExamDate] = useState('');

  const [examDate, setExamDate] = useState('');

  const [degreeGender, setDegreeGender] = useState('');
  const [degreeBirthDate, setDegreeBirthDate] = useState('');
  const [degreeBirthCountry, setDegreeBirthCountry] = useState('');
  const [degreeBirthLocation, setDegreeBirthLocation] = useState('');
  const [degreeCycle, setDegreeCycle] = useState('');

  const [destinationCommission, setDestinationCommission] = useState('');

  const handleCancel = () => {
    navigate('/reclamos');
  };

  const validateForm = () => {
    const errors = [];

    if (!category) errors.push('Debes seleccionar una categoría');
    if (!subcategory) errors.push('Debes seleccionar una subcategoría');
    if (!title.trim()) errors.push('El título es obligatorio');

    if (subcategory === 'EXAM_CERTIFICATE_REQUEST' && !examDate) {
      errors.push('La fecha de examen es obligatoria');
    }
    if (subcategory === 'SUBJECT_EQUIVALENCY_REQUEST') {
      if (!equivalencyInstitution.trim()) errors.push('La institución de origen es obligatoria');
      if (!equivalencySubject.trim()) errors.push('La materia aprobada es obligatoria');
      if (!equivalencyGrade) errors.push('La nota final es obligatoria');
    }
    if (subcategory === 'GRADE_RECORD_CORRECTION_REQUEST') {
      if (!gradeCorrectionGrade) errors.push('La nota es obligatoria');
      if (!gradeCorrectionExamDate) errors.push('La fecha de examen es obligatoria');
    }
    if (subcategory === 'DEGREE_PROCESS_REQUEST') {
      if (!degreeGender) errors.push('El género es obligatorio');
      if (!degreeBirthDate) errors.push('La fecha de nacimiento es obligatoria');
      if (!degreeBirthCountry.trim()) errors.push('El país de nacimiento es obligatorio');
      if (!degreeBirthLocation.trim()) errors.push('La localidad y provincia son obligatorias');
      if (!degreeCycle.trim()) errors.push('El ciclo lectivo es obligatorio');
    }
    if (subcategory === 'CLASS_SECTION_CHANGE_REQUEST' && !destinationCommission) {
      errors.push('La comisión de destino es obligatoria');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const buildMetadata = () => {
    if (subcategory === 'SUBJECT_EQUIVALENCY_REQUEST') {
      return {
        institution: equivalencyInstitution.trim(),
        approvedSubject: equivalencySubject.trim(),
        grade: equivalencyGrade,
      };
    }
    if (subcategory === 'GRADE_RECORD_CORRECTION_REQUEST') {
      return { grade: gradeCorrectionGrade, examDate: gradeCorrectionExamDate };
    }
    if (subcategory === 'EXAM_CERTIFICATE_REQUEST') {
      return { examDate };
    }
    if (subcategory === 'DEGREE_PROCESS_REQUEST') {
      return {
        gender: degreeGender,
        birthDate: degreeBirthDate,
        birthCountry: degreeBirthCountry.trim(),
        birthLocation: degreeBirthLocation.trim(),
        lastYearCycle: degreeCycle.trim(),
      };
    }
    if (subcategory === 'CLASS_SECTION_CHANGE_REQUEST') {
      return { destinationCommission };
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      setLoading(true);
      setApiError('');

      const hideSubject = category === 'TECHNICAL';
      const hideCommission = category === 'TECHNICAL';

      const ticketData = {
        title: title.trim(),
        description: description.trim(),
        category,
        subcategory,
        subject: hideSubject ? null : subject.trim() || null,
        commission: hideCommission ? null : commission.trim() || null,
        metadata: buildMetadata(),
      };

      const response = await apiFetch('/tickets', {
        method: 'POST',
        body: JSON.stringify(ticketData),
      });

      const createdTicketId = response.data?.id || response.id;
      navigate(`/reclamos/${createdTicketId}`);
    } catch (error) {
      const errorMessage = (() => {
        if (error.response?.data?.error) {
          return error.response.data.error;
        }
        if (error.message && error.message.includes('Failed to fetch')) {
          return 'No se puede conectar al servidor. Por favor intenta más tarde.';
        }
        return error.message || 'Error al crear el reclamo. Intenta nuevamente.';
      })();
      setApiError(errorMessage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = category && subcategory && title.trim() && description.trim();

  const categoryOptions = [
    { value: 'ACADEMIC', label: 'Académica' },
    { value: 'INSTITUTIONAL', label: 'Institucional' },
    { value: 'TECHNICAL', label: 'Técnica' },
    { value: 'GENERAL', label: 'General' },
  ];

  const subcategoryOptions = {
    ACADEMIC: [
      { value: 'GRADE_ISSUE', label: 'Problema con calificación' },
      { value: 'EXAM_ISSUE', label: 'Problema con examen' },
      { value: 'CORRELATIVITY_ISSUE', label: 'Problema de correlatividad' },
      { value: 'SUBJECT_CONTENT_ISSUE', label: 'Problema de contenido de materia' },
    ],
    INSTITUTIONAL: [
      { value: 'SUBJECT_EQUIVALENCY_REQUEST', label: 'Solicitud de equivalencia de materia' },
      { value: 'GRADE_RECORD_CORRECTION_REQUEST', label: 'Solicitud de corrección de nota' },
      { value: 'EXAM_CERTIFICATE_REQUEST', label: 'Solicitud de certificado de examen' },
      { value: 'DEGREE_PROCESS_REQUEST', label: 'Solicitud de trámite de título' },
      { value: 'CLASS_SECTION_CHANGE_REQUEST', label: 'Solicitud de cambio de comisión' },
    ],
    TECHNICAL: [
      { value: 'MOODLE_PROBLEM', label: 'Problema con Moodle' },
      { value: 'SIU_PROBLEM', label: 'Problema con SIU' },
      { value: 'WEBSITE_ERROR', label: 'Error en sitio web' },
    ],
    GENERAL: [{ value: 'GENERAL_INQUIRY', label: 'Consulta general' }],
  };

  const subjectOptions = [
    { value: '', label: 'Seleccionar materia' },
    { value: 'PROGRAMACION_I', label: 'Programación I' },
    { value: 'PROGRAMACION_II', label: 'Programación II' },
    { value: 'MATEMATICA_I', label: 'Matemática I' },
    { value: 'MATEMATICA_II', label: 'Matemática II' },
    { value: 'INGENIERIA_SOFTWARE', label: 'Ingeniería de Software' },
    { value: 'BASE_DATOS', label: 'Base de Datos' },
    { value: 'REDES', label: 'Redes' },
  ];

  const commissionOptions = [
    { value: '', label: 'Seleccionar comisión' },
    { value: '1K', label: '1K' },
    { value: '1A', label: '1A' },
    { value: '2K', label: '2K' },
    { value: '2A', label: '2A' },
    { value: '3K', label: '3K' },
    { value: '3A', label: '3A' },
  ];

  const inputClass = 'w-full px-3 py-2 border border-border rounded-lg text-sm bg-surface text-text-main focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent disabled:opacity-50';
  const selectClass = `${inputClass} appearance-none bg-no-repeat bg-right pr-8`;
  const labelClass = 'block text-sm font-medium text-text-main mb-1';
  const sectionCardClass = 'bg-surface rounded-xl border border-border p-5 space-y-4';
  const sectionTitleClass = 'text-sm font-semibold text-text-main';

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text-main text-center">Generar un reclamo</h2>
      </div>

      {/* Student Profile Header */}
      <div className="bg-surface rounded-xl border border-border p-5 mb-6">
        <h3 className={sectionTitleClass}>Datos del Alumno</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
          <div className="bg-background rounded-lg px-4 py-3">
            <p className="text-xs text-text-secondary font-medium mb-1">Nombre y Apellido</p>
            <p className="text-sm text-text-main font-semibold">{currentUser?.firstName} {currentUser?.lastName}</p>
          </div>
          <div className="bg-background rounded-lg px-4 py-3">
            <p className="text-xs text-text-secondary font-medium mb-1">DNI</p>
            <p className="text-sm text-text-main font-semibold">{currentUser?.dni || 'N/A'}</p>
          </div>
          <div className="bg-background rounded-lg px-4 py-3">
            <p className="text-xs text-text-secondary font-medium mb-1">Email</p>
            <p className="text-sm text-text-main font-semibold">{currentUser?.email}</p>
          </div>
        </div>
      </div>

      {/* Validation Errors Alert */}
      {validationErrors.length > 0 && (
        <div className="mb-4 p-3 bg-state-rejected/10 border border-state-rejected/30 rounded-lg">
          <ul className="list-disc list-inside space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index} className="text-state-rejected text-sm">{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* API Error Alert */}
      {apiError && (
        <div className="mb-4 p-3 bg-state-rejected/10 border border-state-rejected/30 rounded-lg">
          <p className="text-state-rejected text-sm">{apiError}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="flex-1 overflow-auto pr-4 pb-4 space-y-4">
          {/* Category Selector */}
          <div>
            <label htmlFor="category" className={labelClass}>Categoría</label>
            <select
              id="category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSubcategory('');
                if (e.target.value === 'TECHNICAL') {
                  setSubject('');
                  setCommission('');
                }
              }}
              disabled={loading}
              className={selectClass}
            >
              <option value="">Seleccionar categoría</option>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Subcategory Selector */}
          <div>
            <label htmlFor="subcategory" className={labelClass}>Subcategoría</label>
            <select
              id="subcategory"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              disabled={!category || loading}
              className={selectClass}
            >
              <option value="">
                {category ? 'Seleccionar subcategoría' : 'Primero selecciona una categoría'}
              </option>
              {category && subcategoryOptions[category]?.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Subject & Commission Row - Hidden for TECHNICAL */}
          {category !== 'TECHNICAL' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="subject" className={labelClass}>Materia</label>
                <select
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={loading}
                  className={selectClass}
                >
                  {subjectOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="commission" className={labelClass}>Comisión</label>
                <select
                  id="commission"
                  value={commission}
                  onChange={(e) => setCommission(e.target.value)}
                  disabled={loading}
                  className={selectClass}
                >
                  {commissionOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Conditional Fields: SUBJECT_EQUIVALENCY_REQUEST */}
          {category === 'INSTITUTIONAL' && subcategory === 'SUBJECT_EQUIVALENCY_REQUEST' && (
            <div className={sectionCardClass}>
              <h3 className={sectionTitleClass}>Datos de Equivalencia</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Institución de origen *</label>
                  <input
                    type="text"
                    value={equivalencyInstitution}
                    onChange={(e) => setEquivalencyInstitution(e.target.value)}
                    placeholder="Nombre de la institución"
                    disabled={loading}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Materia aprobada *</label>
                  <input
                    type="text"
                    value={equivalencySubject}
                    onChange={(e) => setEquivalencySubject(e.target.value)}
                    placeholder="Nombre de la materia"
                    disabled={loading}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Nota final *</label>
                <input
                  type="number"
                  value={equivalencyGrade}
                  onChange={(e) => setEquivalencyGrade(e.target.value)}
                  placeholder="Nota obtenida"
                  disabled={loading}
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {/* Conditional Fields: GRADE_RECORD_CORRECTION_REQUEST */}
          {category === 'INSTITUTIONAL' && subcategory === 'GRADE_RECORD_CORRECTION_REQUEST' && (
            <div className={sectionCardClass}>
              <h3 className={sectionTitleClass}>Datos de Corrección de Acta</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Nota *</label>
                  <input
                    type="number"
                    value={gradeCorrectionGrade}
                    onChange={(e) => setGradeCorrectionGrade(e.target.value)}
                    placeholder="Nota a corregir"
                    disabled={loading}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Fecha de examen *</label>
                  <input
                    type="date"
                    value={gradeCorrectionExamDate}
                    onChange={(e) => setGradeCorrectionExamDate(e.target.value)}
                    disabled={loading}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Conditional Fields: EXAM_CERTIFICATE_REQUEST */}
          {category === 'INSTITUTIONAL' && subcategory === 'EXAM_CERTIFICATE_REQUEST' && (
            <div className={sectionCardClass}>
              <h3 className={sectionTitleClass}>Certificado de Asistencia a Examen</h3>
              <div>
                <label className={labelClass}>Fecha de examen *</label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  disabled={loading}
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {/* Conditional Fields: DEGREE_PROCESS_REQUEST */}
          {category === 'INSTITUTIONAL' && subcategory === 'DEGREE_PROCESS_REQUEST' && (
            <div className={sectionCardClass}>
              <h3 className={sectionTitleClass}>Datos Personales</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Género *</label>
                  <select
                    value={degreeGender}
                    onChange={(e) => setDegreeGender(e.target.value)}
                    disabled={loading}
                    className={selectClass}
                  >
                    <option value="">Seleccionar</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                    <option value="NB">No binario</option>
                    <option value="OTHER">Otro</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Fecha de nacimiento *</label>
                  <input
                    type="date"
                    value={degreeBirthDate}
                    onChange={(e) => setDegreeBirthDate(e.target.value)}
                    disabled={loading}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>País de nacimiento *</label>
                  <input
                    type="text"
                    value={degreeBirthCountry}
                    onChange={(e) => setDegreeBirthCountry(e.target.value)}
                    placeholder="País"
                    disabled={loading}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Localidad y provincia *</label>
                  <input
                    type="text"
                    value={degreeBirthLocation}
                    onChange={(e) => setDegreeBirthLocation(e.target.value)}
                    placeholder="Ciudad, Provincia"
                    disabled={loading}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Ciclo lectivo del último año *</label>
                <input
                  type="text"
                  value={degreeCycle}
                  onChange={(e) => setDegreeCycle(e.target.value)}
                  placeholder="Ej: 2023"
                  disabled={loading}
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {/* Conditional Fields: CLASS_SECTION_CHANGE_REQUEST */}
          {category === 'INSTITUTIONAL' && subcategory === 'CLASS_SECTION_CHANGE_REQUEST' && (
            <div className={sectionCardClass}>
              <h3 className={sectionTitleClass}>Cambio de Comisión</h3>
              <div>
                <label className={labelClass}>Comisión de destino *</label>
                <select
                  value={destinationCommission}
                  onChange={(e) => setDestinationCommission(e.target.value)}
                  disabled={loading}
                  className={selectClass}
                >
                  <option value="">Seleccionar comisión</option>
                  {commissionOptions.filter((o) => o.value).map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Title Input */}
          <div>
            <label htmlFor="title" className={labelClass}>Título</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título del reclamo"
              disabled={loading}
              className={inputClass}
            />
          </div>

          {/* Description Textarea */}
          <div>
            <label htmlFor="description" className={labelClass}>Descripción</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción detallada del reclamo"
              rows={6}
              disabled={loading}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="px-5 py-2 bg-background border border-border text-text-main rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              isFormValid && !loading
                ? 'bg-brand-blue text-white hover:bg-brand-dark active:scale-95'
                : 'bg-gray-400 text-white cursor-not-allowed opacity-60'
            }`}
          >
            {loading ? 'Enviando...' : 'Enviar'}
            {!loading && <i className="fas fa-arrow-right text-xs"></i>}
          </button>
        </div>
      </form>
    </div>
  );
};
