import React from 'react';
import type { FormContent, FormField } from '../types/form';

interface FormBuilderProps {
  formContent: FormContent;
  onFormChange: (content: FormContent) => void;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({
  formContent,
  onFormChange,
}) => {
  const updateField = (index: number, updates: Partial<FormField>) => {
    const newFields = [...formContent.fields];
    newFields[index] = { ...newFields[index], ...updates };
    onFormChange({ ...formContent, fields: newFields });
  };

  const addField = (type: FormField['type'] = 'text') => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      label: type === 'radio' ? 'Multiple Choice' : type === 'checkbox' ? 'Checkboxes' : type === 'select' ? 'Dropdown' : 'New Field',
      placeholder: 'Enter value...',
      helperText: 'Help text for this field',
      errorMessage: 'This field is required',
      required: false,
      type: type,
      options: (type === 'radio' || type === 'select' || type === 'checkbox') ? ['Option 1', 'Option 2'] : undefined
    };
    onFormChange({
      ...formContent,
      fields: [...formContent.fields, newField],
    });
  };

  const removeField = (index: number) => {
    if (formContent.fields.length <= 1) return;
    const newFields = formContent.fields.filter((_, i) => i !== index);
    onFormChange({ ...formContent, fields: newFields });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex-shrink-0">
        <h2 className="text-lg font-semibold text-slate-900">Form Builder</h2>
        <p className="text-sm text-slate-500 mt-1">Edit fields to preview translations</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
        {/* General Settings */}
        <section>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Form Settings</h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="form-title" className="block text-sm font-medium text-slate-700 mb-1.5">Form Title</label>
              <input
                id="form-title"
                type="text"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                value={formContent.title}
                onChange={(e) => onFormChange({ ...formContent, title: e.target.value })}
                placeholder="Enter form title"
              />
            </div>

            <div>
              <label htmlFor="form-description" className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
              <textarea
                id="form-description"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors min-h-[80px] resize-y"
                value={formContent.description}
                onChange={(e) => onFormChange({ ...formContent, description: e.target.value })}
                placeholder="Enter form description"
                rows={2}
              />
            </div>

            <div>
              <label htmlFor="submit-button-text" className="block text-sm font-medium text-slate-700 mb-1.5">Submit Button Text</label>
              <input
                id="submit-button-text"
                type="text"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                value={formContent.submitButtonText}
                onChange={(e) => onFormChange({ ...formContent, submitButtonText: e.target.value })}
                placeholder="Submit"
              />
            </div>
          </div>
        </section>

        {/* Form Fields */}
        <section>
          <div className="mb-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Add Fields</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => addField('text')}
                className="flex items-center justify-center px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
              >
                <span className="mr-2">📝</span> Text
              </button>
              <button
                type="button"
                onClick={() => addField('textarea')}
                className="flex items-center justify-center px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
              >
                <span className="mr-2">📃</span> TextArea
              </button>
              <button
                type="button"
                onClick={() => addField('radio')}
                className="flex items-center justify-center px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
              >
                <span className="mr-2">⭕</span> Radio
              </button>
              <button
                type="button"
                onClick={() => addField('checkbox')}
                className="flex items-center justify-center px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
              >
                <span className="mr-2">☑️</span> Checkbox
              </button>
              <button
                type="button"
                onClick={() => addField('select')}
                className="flex items-center justify-center px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
              >
                <span className="mr-2">▼</span> Select
              </button>
              <button
                type="button"
                onClick={() => addField('date')}
                className="flex items-center justify-center px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
              >
                <span className="mr-2">📅</span> Date
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {formContent.fields.map((field, index) => (
              <div key={field.id} className="group relative bg-slate-50 border border-slate-200 rounded-lg p-4 transition-all hover:border-slate-300">
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-200/60">
                  <span className="text-xs font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    Field {index + 1}
                  </span>
                  {formContent.fields.length > 1 && (
                    <button
                      type="button"
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      onClick={() => removeField(index)}
                      aria-label="Remove field"
                    >
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Label</label>
                    <input
                      type="text"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      value={field.label}
                      onChange={(e) => updateField(index, { label: e.target.value })}
                      placeholder="Label"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Placeholder</label>
                    <input
                      type="text"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      value={field.placeholder}
                      onChange={(e) => updateField(index, { placeholder: e.target.value })}
                      placeholder="Placeholder"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Helper Text</label>
                    <input
                      type="text"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      value={field.helperText}
                      onChange={(e) => updateField(index, { helperText: e.target.value })}
                      placeholder="e.g. Enter your email"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Error Message</label>
                    <input
                      type="text"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      value={field.errorMessage}
                      onChange={(e) => updateField(index, { errorMessage: e.target.value })}
                      placeholder="Validation error"
                    />
                  </div>

                  <div className="col-span-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Type</label>
                    <select
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      value={field.type}
                      onChange={(e) => updateField(index, { type: e.target.value as FormField['type'] })}
                    >
                      <option value="text">Text</option>
                      <option value="email">Email</option>
                      <option value="number">Number</option>
                      <option value="textarea">Textarea</option>
                      <option value="radio">Radio Group</option>
                      <option value="select">Dropdown</option>
                      <option value="checkbox">Checkbox Group</option>
                      <option value="date">Date</option>
                    </select>
                  </div>

                  <div className="col-span-1 flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer pb-2 select-none">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          className="peer h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20"
                          checked={field.required}
                          onChange={(e) => updateField(index, { required: e.target.checked })}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-600">Required</span>
                    </label>
                  </div>

                  {/* Options Editor for Choice Fields */}
                  {(field.type === 'radio' || field.type === 'select' || field.type === 'checkbox') && (
                    <div className="col-span-2 pt-2 border-t border-slate-200 mt-2">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-medium text-slate-600">Options</label>
                        <button
                          type="button"
                          onClick={() => {
                            const currentOptions = field.options || [];
                            updateField(index, { options: [...currentOptions, `Option ${currentOptions.length + 1}`] });
                          }}
                          className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                          + Add Option
                        </button>
                      </div>
                      <div className="space-y-2">
                        {(field.options || []).map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-2">
                            <input
                              type="text"
                              className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...(field.options || [])];
                                newOptions[optIndex] = e.target.value;
                                updateField(index, { options: newOptions });
                              }}
                              placeholder={`Option ${optIndex + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newOptions = (field.options || []).filter((_, i) => i !== optIndex);
                                updateField(index, { options: newOptions });
                              }}
                              className="text-slate-400 hover:text-red-500 p-1"
                            >
                              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                        {(!field.options || field.options.length === 0) && (
                          <p className="text-xs text-slate-400 italic">No options added yet.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
