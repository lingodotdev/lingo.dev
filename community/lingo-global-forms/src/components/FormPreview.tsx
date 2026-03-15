import React, { useState } from 'react';
import type { FormContent, SupportedLocale } from '../types/form';
import { LanguageSelect } from './LanguageSelect';

interface FormPreviewProps {
  formContent: FormContent;
  translatedContent: FormContent | null;
  currentLocale: SupportedLocale;
  onLocaleChange: (locale: SupportedLocale) => void;
  isTranslating: boolean;
  translationProgress: number;
  translationError: string | null;
}

export const FormPreview: React.FC<FormPreviewProps> = ({
  formContent,
  translatedContent,
  currentLocale,
  onLocaleChange,
  isTranslating,
  translationProgress,
  translationError,
}) => {
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const displayContent = translatedContent || formContent;

  const handleInputChange = (fieldId: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [fieldId]: value }));
    if (fieldErrors[fieldId]) {
      setFieldErrors((prev) => ({ ...prev, [fieldId]: false }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const errors: Record<string, boolean> = {};
    displayContent.fields.forEach((field) => {
      if (field.required && !fieldValues[field.id]?.trim()) {
        errors[field.id] = true;
      }
    });

    setFieldErrors(errors);

    if (Object.keys(errors).length === 0) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFieldValues({});
      }, 3000);
    }
  };

  const resetForm = () => {
    setFieldValues({});
    setFieldErrors({});
    setSubmitted(false);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden relative z-10">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200/50 bg-white/50 backdrop-blur-sm">
        <h2 className="text-lg font-semibold text-slate-800">Live Preview</h2>
        <LanguageSelect
          value={currentLocale}
          onChange={(locale) => {
            onLocaleChange(locale);
            resetForm();
          }}
          disabled={isTranslating}
        />
      </div>
      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center custom-scrollbar">
        
        {isTranslating && (
          <div className="w-full max-w-xl mb-6 bg-indigo-50 border border-indigo-100 rounded-lg p-3 flex items-center gap-3 animate-pulse">
            <div className="flex-1 h-1.5 bg-indigo-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 rounded-full transition-all duration-300 ease-out" 
                style={{ width: `${translationProgress}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-indigo-700 whitespace-nowrap">
              Translating... {translationProgress}%
            </span>
          </div>
        )}

        {translationError && (
          <div className="w-full max-w-xl mb-6 bg-red-50 border border-red-100 rounded-lg p-3 text-sm text-red-600 flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {translationError}
          </div>
        )}

        {/* Form Card */}
        <div className="w-full max-w-xl bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-200/80 p-8 transition-all duration-500">
          {submitted ? (
            <div className="text-center py-12 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Form Submitted!</h3>
              <p className="text-slate-500">Thank you for your submission.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">{displayContent.title}</h3>
                <p className="text-slate-500 leading-relaxed">{displayContent.description}</p>
              </div>

              <div className="space-y-5">
                {displayContent.fields.map((field, index) => {
                  const originalField = formContent.fields[index];
                  const hasError = fieldErrors[originalField?.id || field.id];
                  const fieldId = originalField?.id || field.id;

                  return (
                    <div key={fieldId} className="group">
                      <label htmlFor={`preview-${fieldId}`} className={`block text-sm font-medium mb-1.5 transition-colors ${hasError ? 'text-red-600' : 'text-slate-700'}`}>
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>

                      {(() => {
                        switch (field.type) {
                          case 'textarea':
                            return (
                              <textarea
                                id={`preview-${fieldId}`}
                                placeholder={field.placeholder}
                                value={fieldValues[fieldId] || ''}
                                onChange={(e) => handleInputChange(fieldId, e.target.value)}
                                rows={4}
                                className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all focus:ring-4 focus:ring-opacity-20 ${
                                  hasError 
                                    ? 'bg-red-50 border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' 
                                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500 hover:border-slate-300'
                                }`}
                              />
                            );
                          case 'select':
                            return (
                              <select
                                id={`preview-${fieldId}`}
                                value={fieldValues[fieldId] || ''}
                                onChange={(e) => handleInputChange(fieldId, e.target.value)}
                                className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all focus:ring-4 focus:ring-opacity-20 ${
                                  hasError 
                                    ? 'bg-red-50 border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' 
                                    : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 hover:border-slate-300'
                                }`}
                              >
                                <option value="" disabled>{field.placeholder || 'Select an option'}</option>
                                {field.options?.map((option, i) => (
                                  <option key={i} value={option}>{option}</option>
                                ))}
                              </select>
                            );
                          case 'radio':
                            return (
                              <div className="space-y-2">
                                {field.options?.map((option, i) => (
                                  <label key={i} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                      type="radio"
                                      name={`preview-${fieldId}`}
                                      value={option}
                                      checked={fieldValues[fieldId] === option}
                                      onChange={(e) => handleInputChange(fieldId, e.target.value)}
                                      className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-slate-700">{option}</span>
                                  </label>
                                ))}
                                {(!field.options || field.options.length === 0) && (
                                  <span className="text-sm text-slate-400 italic">No options defined</span>
                                )}
                              </div>
                            );
                          case 'checkbox':
                            return (
                              <div className="space-y-2">
                                {field.options && field.options.length > 0 ? (
                                  field.options.map((option, i) => {
                                    const currentValues = (fieldValues[fieldId] || '').split(',').filter(Boolean);
                                    const isChecked = currentValues.includes(option);
                                    return (
                                      <label key={i} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          value={option}
                                          checked={isChecked}
                                          onChange={(e) => {
                                            let newValues;
                                            if (e.target.checked) {
                                              newValues = [...currentValues, option];
                                            } else {
                                              newValues = currentValues.filter(v => v !== option);
                                            }
                                            handleInputChange(fieldId, newValues.join(','));
                                          }}
                                          className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                        />
                                        <span className="text-sm text-slate-700">{option}</span>
                                      </label>
                                    );
                                  })
                                ) : (
                              
                                   <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={fieldValues[fieldId] === 'true'}
                                        onChange={(e) => handleInputChange(fieldId, e.target.checked ? 'true' : 'false')}
                                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                      />
                                      <span className="text-sm text-slate-700">{field.placeholder || field.label}</span>
                                    </label>
                                )}
                              </div>
                            );
                          default:
                            return (
                              <input
                                id={`preview-${fieldId}`}
                                type={field.type}
                                placeholder={field.placeholder}
                                value={fieldValues[fieldId] || ''}
                                onChange={(e) => handleInputChange(fieldId, e.target.value)}
                                className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all focus:ring-4 focus:ring-opacity-20 ${
                                  hasError 
                                    ? 'bg-red-50 border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' 
                                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500 hover:border-slate-300'
                                }`}
                              />
                            );
                        }
                      })()}

                      {hasError ? (
                        <div className="flex items-center mt-1.5 text-xs text-red-600 font-medium animate-in slide-in-from-top-1">
                          <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {field.errorMessage}
                        </div>
                      ) : (
                        <p className="mt-1.5 text-xs text-slate-500">{field.helperText}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isTranslating}
                >
                  {displayContent.submitButtonText}
                </button>
              </div>
            </form>
          )}
        </div>
        
        {/* Footer Note */}
        <div className="mt-8 text-center">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
               Current locale: <code className="ml-1.5 font-mono text-indigo-600 font-bold">{currentLocale}</code>
            </span>
        </div>
      </div>
    </div>
  );
};
