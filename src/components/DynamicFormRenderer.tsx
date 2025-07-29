import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { LoadingSpinner } from './ui/loading-spinner';
import { Toast } from './ui/toast';
import { useUIStore } from '../stores/uiStore';
import type { FormField, FormData } from '../types';

interface DynamicFormRendererProps {
  fields: FormField[];
  onSubmit: (data: FormData) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
}

export const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({
  fields,
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel'
}) => {
  const { t } = useTranslation();
  const { theme } = useUIStore();
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  const validateField = (field: FormField, value: any): string => {
    if (field.required && (!value || value.toString().trim() === '')) {
      return `${field.label} is required`;
    }
    
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }
    
    return '';
  };

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setToastMessage('Please fix the errors in the form');
      setToastType('error');
      setShowToast(true);
      return;
    }
    
    try {
      await onSubmit(formData);
    } catch (error) {
      setToastMessage('An error occurred while submitting the form');
      setToastType('error');
      setShowToast(true);
    }
  };

  const renderField = (field: FormField) => {
    const fieldError = errors[field.name];
    const fieldValue = formData[field.name] || '';

    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <div key={field.name} className="space-y-2">
            <label className={`block text-sm font-medium transition-colors duration-300 ${
              theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
            }`}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Input
              type={field.type}
              value={fieldValue}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className={`transition-all duration-200 ${
                fieldError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
            />
            {field.helpText && (
              <p className={`text-sm transition-colors duration-300 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {field.helpText}
              </p>
            )}
            {fieldError && (
              <div className={`text-sm transition-colors duration-300 ${
                theme === 'dark' ? 'text-red-400' : 'text-red-600'
              }`}>
                {fieldError}
              </div>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.name} className="space-y-2">
            <label className={`block text-sm font-medium transition-colors duration-300 ${
              theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
            }`}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Textarea
              value={fieldValue}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              className={`transition-all duration-200 ${
                fieldError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
            />
            {field.helpText && (
              <p className={`text-sm transition-colors duration-300 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {field.helpText}
              </p>
            )}
            {fieldError && (
              <div className={`text-sm transition-colors duration-300 ${
                theme === 'dark' ? 'text-red-400' : 'text-red-600'
              }`}>
                {fieldError}
              </div>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className="space-y-2">
            <label className={`block text-sm font-medium transition-colors duration-300 ${
              theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
            }`}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              value={fieldValue}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={`w-full px-3 py-2 border rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark'
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-slate-300 text-slate-900'
              } ${
                fieldError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
            >
              <option value="">{t('form.selectOption')}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {field.helpText && (
              <p className={`text-sm transition-colors duration-300 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {field.helpText}
              </p>
            )}
            {fieldError && (
              <div className={`text-sm transition-colors duration-300 ${
                theme === 'dark' ? 'text-red-400' : 'text-red-600'
              }`}>
                {fieldError}
              </div>
            )}
          </div>
        );

      case 'date':
        return (
          <div key={field.name} className="space-y-2">
            <label className={`block text-sm font-medium transition-colors duration-300 ${
              theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
            }`}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Input
              type="date"
              value={fieldValue}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={`transition-all duration-200 ${
                fieldError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
            />
            {field.helpText && (
              <p className={`text-sm transition-colors duration-300 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {field.helpText}
              </p>
            )}
            {fieldError && (
              <div className={`text-sm transition-colors duration-300 ${
                theme === 'dark' ? 'text-red-400' : 'text-red-600'
              }`}>
                {fieldError}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Card className={`w-full max-w-4xl mx-auto transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-slate-200'
      }`}>
        <CardHeader>
          <CardTitle className={`text-2xl font-bold transition-colors duration-300 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            {t('form.requestForm')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {fields.map(renderField)}
            
            <div className={`flex justify-end space-x-4 pt-6 border-t transition-colors duration-300 ${
              theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
            }`}>
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={loading}
                  className={`${
                    theme === 'dark' 
                      ? 'border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white' 
                      : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {cancelLabel}
                </Button>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="min-w-[120px]"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  submitLabel
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {showToast && (
        <Toast
          type={toastType}
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}; 