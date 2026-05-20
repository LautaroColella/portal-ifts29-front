import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';

export const CreateTicket = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [subject, setSubject] = useState('');
  const [commission, setCommission] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleCancel = () => {
    navigate('/reclamos');
  };

  // Validate form fields
  const validateForm = () => {
    const errors = [];
    const newTitleError = '';
    const newDescriptionError = '';

    // Check required fields
    if (!title.trim()) {
      errors.push('El título es obligatorio');
    }
    if (!description.trim()) {
      errors.push('La descripción es obligatoria');
    }
    if (!category) {
      errors.push('Debes seleccionar una categoría');
    }
    if (!subcategory) {
      errors.push('Debes seleccionar una subcategoría');
    }

    setTitleError(newTitleError);
    setDescriptionError(newDescriptionError);
    setValidationErrors(errors);

    return errors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to top to show errors
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

      // Success: navigate to tickets list
      navigate('/reclamos');
    } catch (error) {
      // Extract error message from API response or use friendly message
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

      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  // Check if form is ready to submit
  const isFormValid = title.trim() && description.trim() && category && subcategory;

  // Subcategory options mapped by category
  const subcategoryOptions = {
    ACADEMIC: [
      { value: 'GRADE_ISSUE', label: 'Problema con calificación' },
      { value: 'EXAM_ISSUE', label: 'Problema con examen' },
      { value: 'CORRELATIVITY_ISSUE', label: 'Problema de correlatividad' },
      { value: 'SUBJECT_CONTENT_ISSUE', label: 'Problema de contenido de materia' },
    ],
    INSTITUTIONAL: [
      { value: 'SUBJECT_EQUIVALENCY_REQUEST', label: 'Solicitud de equivalencia de materia' },
      { value: 'GRADE_RECORD_CORRECTION_REQUEST', label: 'Solicitud de corrección de historial' },
      { value: 'NEW_STUDENT_CERTIFICATE_REQUEST', label: 'Solicitud de certificado de alumno' },
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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-text-main mb-2">Crear Nuevo Reclamo</h2>
        <p className="text-text-secondary">Completa el formulario para registrar un nuevo reclamo</p>
      </div>

      {/* Validation Errors Alert */}
      {validationErrors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-semibold mb-2">Por favor corrige los siguientes errores:</p>
          <ul className="list-disc list-inside space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index} className="text-red-600 text-sm">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* API Error Alert */}
      {apiError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{apiError}</p>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-700 text-sm">Enviando reclamo...</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        {/* Main Content */}
        <div className="flex-1 overflow-auto pr-4 pb-4">
          <div className="space-y-6">
            {/* Title Input */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-text-main mb-2">
                Título del Reclamo <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Problema con calificación de examen"
                disabled={loading}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  titleError
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-primary-500'
                }`}
              />
              {titleError && <p className="text-red-600 text-sm mt-1">{titleError}</p>}
            </div>

            {/* Description Textarea */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-text-main mb-2">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe en detalle el problema o solicitud"
                rows={5}
                disabled={loading}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed ${
                  descriptionError
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-primary-500'
                }`}
              />
              {descriptionError && <p className="text-red-600 text-sm mt-1">{descriptionError}</p>}
            </div>

            {/* Category Selector */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-text-main mb-2">
                Categoría <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSubcategory('');
                }}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Selecciona una categoría</option>
                <option value="ACADEMIC">Académica</option>
                <option value="INSTITUTIONAL">Institucional</option>
                <option value="TECHNICAL">Técnica</option>
                <option value="GENERAL">General</option>
              </select>
            </div>

            {/* Subcategory Selector */}
            <div>
              <label htmlFor="subcategory" className="block text-sm font-semibold text-text-main mb-2">
                Subcategoría <span className="text-red-500">*</span>
              </label>
              <select
                id="subcategory"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                disabled={!category || loading}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors bg-white ${
                  !category || loading
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                    : 'border-gray-300 focus:ring-primary-500'
                }`}
              >
                <option value="">
                  {category ? 'Selecciona una subcategoría' : 'Primero selecciona una categoría'}
                </option>
                {category &&
                  subcategoryOptions[category]?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </select>
            </div>

            {/* Subject Input (Optional) */}
            <div>
              <label htmlFor="subject" className="block text-sm font-semibold text-text-main mb-2">
                Materia <span className="text-gray-400">(Opcional)</span>
              </label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ej: Programación I"
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Commission Input (Optional) */}
            <div>
              <label htmlFor="commission" className="block text-sm font-semibold text-text-main mb-2">
                Comisión <span className="text-gray-400">(Opcional)</span>
              </label>
              <input
                id="commission"
                type="text"
                value={commission}
                onChange={(e) => setCommission(e.target.value)}
                placeholder="Ej: 1K"
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ml-auto ${
              isFormValid && !loading
                ? 'bg-primary-500 text-white hover:bg-primary-600 cursor-pointer'
                : 'bg-gray-300 text-white cursor-not-allowed opacity-50'
            }`}
          >
            {loading ? 'Enviando...' : 'Enviar Reclamo'}
          </button>
        </div>
      </form>
    </div>
  );
};
