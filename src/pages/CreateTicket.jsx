import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';

export const CreateTicket = () => {
  const navigate = useNavigate();

  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [subject, setSubject] = useState('');
  const [commission, setCommission] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleCancel = () => {
    navigate('/reclamos');
  };

  const validateForm = () => {
    const errors = [];

    if (!category) {
      errors.push('Debes seleccionar una categoría');
    }
    if (!subcategory) {
      errors.push('Debes seleccionar una subcategoría');
    }
    if (!title.trim()) {
      errors.push('El título es obligatorio');
    }
    if (!description.trim()) {
      errors.push('La descripción es obligatoria');
    }

    setValidationErrors(errors);
    return errors.length === 0;
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

      const ticketData = {
        title: title.trim(),
        description: description.trim(),
        category,
        subcategory,
        subject: subject.trim() || null,
        commission: commission.trim() || null,
      };

      await apiFetch('/tickets', {
        method: 'POST',
        body: JSON.stringify(ticketData),
      });

      navigate('/reclamos');
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
      { value: 'NEW_STUDENT_CERTIFICATE_REQUEST', label: 'Solicitud de certificado de alumno regular' },
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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text-main text-center">Generar un reclamo</h2>
      </div>

      {/* Validation Errors Alert */}
      {validationErrors.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg dark:bg-red-900 dark:border-red-700">
          <ul className="list-disc list-inside space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index} className="text-red-700 text-sm dark:text-red-200">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* API Error Alert */}
      {apiError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg dark:bg-red-900 dark:border-red-700">
          <p className="text-red-800 text-sm dark:text-red-100">{apiError}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="flex-1 overflow-auto pr-4 pb-4 space-y-4">
          {/* Category Selector */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-text-main mb-1">
              Categoría
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSubcategory('');
              }}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-600 disabled:opacity-50"
            >
              <option value="">Seleccionar categoría</option>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory Selector */}
          <div>
            <label htmlFor="subcategory" className="block text-sm font-medium text-text-main mb-1">
              Subcategoría
            </label>
            <select
              id="subcategory"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              disabled={!category || loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-600 disabled:opacity-50"
            >
              <option value="">
                {category ? 'Seleccionar subcategoría' : 'Primero selecciona una categoría'}
              </option>
              {category &&
                subcategoryOptions[category]?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </select>
          </div>

          {/* Subject & Commission Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-text-main mb-1">
                Materia
              </label>
              <select
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-600 disabled:opacity-50"
              >
                {subjectOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="commission" className="block text-sm font-medium text-text-main mb-1">
                Comisión
              </label>
              <select
                id="commission"
                value={commission}
                onChange={(e) => setCommission(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-600 disabled:opacity-50"
              >
                {commissionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-text-main mb-1">
              Título
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título del reclamo"
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 disabled:opacity-50"
            />
          </div>

          {/* Description Textarea */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-text-main mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción detallada del reclamo"
              rows={6}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none bg-white text-gray-900 placeholder-gray-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-300 dark:border-gray-700">
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="px-5 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 font-medium transition-colors disabled:opacity-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`px-5 py-2 rounded font-medium transition-all duration-200 flex items-center gap-2 ${
              isFormValid && !loading
                ? 'bg-primary-500 text-white hover:bg-primary-600 active:scale-95 dark:bg-primary-600 dark:hover:bg-primary-700'
                : 'bg-gray-400 text-white cursor-not-allowed opacity-60 dark:bg-gray-700'
            }`}
          >
            {loading ? 'Enviando...' : 'Enviar'}
            {!loading && <i className="fas fa-arrow-right"></i>}
          </button>
        </div>
      </form>
    </div>
  );
};
