import { useState, useId } from 'react';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';

const FormField = ({
  label,
  name,
  type = 'text',
  value = '',
  onChange,
  onBlur,
  placeholder = '',
  required = false,
  disabled = false,
  error = '',
  success = '',
  hint = '',
  options = [],
  rows = 3,
  min,
  max,
  step,
  accept,
  multiple = false,
  className = '',
  labelClassName = '',
  inputClassName = '',
  errorClassName = '',
  successClassName = '',
  hintClassName = '',
  validation = null,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);
  const [localError, setLocalError] = useState('');
  const fieldId = useId();

  // Validación en tiempo real
  const validateField = (fieldValue) => {
    if (!validation) return '';

    for (const rule of validation) {
      const result = rule.validator(fieldValue);
      if (!result) {
        return rule.message;
      }
    }
    return '';
  };

  // Manejar cambio de valor
  const handleChange = (event) => {
    const newValue = event.target.value;
    
    if (onChange) {
      onChange(event);
    }

    // Validar si el campo ha sido tocado
    if (touched && validation) {
      const validationError = validateField(newValue);
      setLocalError(validationError);
    }
  };

  // Manejar blur
  const handleBlur = (event) => {
    setTouched(true);
    
    if (validation) {
      const validationError = validateField(event.target.value);
      setLocalError(validationError);
    }

    if (onBlur) {
      onBlur(event);
    }
  };

  // Determinar el error a mostrar
  const displayError = error || localError;
  const hasError = Boolean(displayError);
  const hasSuccess = Boolean(success && !hasError);

  // Clases base para el input
  const baseInputClasses = `
    w-full px-3 py-2 border rounded-lg transition-colors
    focus:ring-2 focus:ring-primary-500 focus:border-transparent
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${hasError ? 'border-red-500 focus:ring-red-500' : ''}
    ${hasSuccess ? 'border-green-500 focus:ring-green-500' : ''}
    ${!hasError && !hasSuccess ? 'border-gray-300' : ''}
    ${inputClassName}
  `;

  // Renderizar el campo según el tipo
  const renderField = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={fieldId}
            name={name}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            rows={rows}
            className={baseInputClasses}
            {...props}
          />
        );

      case 'select':
        return (
          <select
            id={fieldId}
            name={name}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            required={required}
            disabled={disabled}
            className={baseInputClasses}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'password':
        return (
          <div className="relative">
            <input
              id={fieldId}
              name={name}
              type={showPassword ? 'text' : 'password'}
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={placeholder}
              required={required}
              disabled={disabled}
              className={`${baseInputClasses} pr-10`}
              {...props}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        );

      case 'file':
        return (
          <input
            id={fieldId}
            name={name}
            type="file"
            onChange={handleChange}
            onBlur={handleBlur}
            required={required}
            disabled={disabled}
            accept={accept}
            multiple={multiple}
            className={`
              w-full px-3 py-2 border border-gray-300 rounded-lg
              file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
              file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700
              hover:file:bg-primary-100 transition-colors
              ${inputClassName}
            `}
            {...props}
          />
        );

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              id={fieldId}
              name={name}
              type="checkbox"
              checked={value}
              onChange={handleChange}
              onBlur={handleBlur}
              required={required}
              disabled={disabled}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              {...props}
            />
            <label htmlFor={fieldId} className="ml-2 text-sm text-gray-700">
              {label}
            </label>
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {options.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  id={`${fieldId}-${option.value}`}
                  name={name}
                  type="radio"
                  value={option.value}
                  checked={value === option.value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required={required}
                  disabled={disabled}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  {...props}
                />
                <label htmlFor={`${fieldId}-${option.value}`} className="ml-2 text-sm text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <input
            id={fieldId}
            name={name}
            type={type}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            className={baseInputClasses}
            {...props}
          />
        );
    }
  };

  // No mostrar label para checkbox ya que se maneja internamente
  if (type === 'checkbox') {
    return (
      <div className={`space-y-1 ${className}`}>
        {renderField()}
        {displayError && (
          <div className={`flex items-center gap-1 text-sm text-red-600 ${errorClassName}`}>
            <AlertCircle className="w-4 h-4" />
            <span>{displayError}</span>
          </div>
        )}
        {hasSuccess && (
          <div className={`flex items-center gap-1 text-sm text-green-600 ${successClassName}`}>
            <Check className="w-4 h-4" />
            <span>{success}</span>
          </div>
        )}
        {hint && !displayError && !hasSuccess && (
          <p className={`text-sm text-gray-500 ${hintClassName}`}>
            {hint}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label 
          htmlFor={fieldId} 
          className={`block text-sm font-medium text-gray-700 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {renderField()}
      
      {displayError && (
        <div className={`flex items-center gap-1 text-sm text-red-600 ${errorClassName}`}>
          <AlertCircle className="w-4 h-4" />
          <span>{displayError}</span>
        </div>
      )}
      
      {hasSuccess && (
        <div className={`flex items-center gap-1 text-sm text-green-600 ${successClassName}`}>
          <Check className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}
      
      {hint && !displayError && !hasSuccess && (
        <p className={`text-sm text-gray-500 ${hintClassName}`}>
          {hint}
        </p>
      )}
    </div>
  );
};

// Validadores comunes
export const validators = {
  required: (message = 'Este campo es requerido') => ({
    validator: (value) => Boolean(value && value.toString().trim()),
    message
  }),

  email: (message = 'Ingresa un email válido') => ({
    validator: (value) => {
      if (!value) return true; // Solo validar si hay valor
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    message
  }),

  minLength: (min, message) => ({
    validator: (value) => {
      if (!value) return true;
      return value.toString().length >= min;
    },
    message: message || `Debe tener al menos ${min} caracteres`
  }),

  maxLength: (max, message) => ({
    validator: (value) => {
      if (!value) return true;
      return value.toString().length <= max;
    },
    message: message || `No debe exceder ${max} caracteres`
  }),

  pattern: (regex, message = 'Formato inválido') => ({
    validator: (value) => {
      if (!value) return true;
      return regex.test(value);
    },
    message
  }),

  numeric: (message = 'Solo se permiten números') => ({
    validator: (value) => {
      if (!value) return true;
      return !isNaN(value) && !isNaN(parseFloat(value));
    },
    message
  }),

  min: (min, message) => ({
    validator: (value) => {
      if (!value) return true;
      return parseFloat(value) >= min;
    },
    message: message || `El valor mínimo es ${min}`
  }),

  max: (max, message) => ({
    validator: (value) => {
      if (!value) return true;
      return parseFloat(value) <= max;
    },
    message: message || `El valor máximo es ${max}`
  }),

  custom: (validatorFn, message) => ({
    validator: validatorFn,
    message
  })
};

export default FormField;