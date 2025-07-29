import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DynamicFormRenderer } from '../components/DynamicFormRenderer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { Toast } from '../components/ui/toast';
import { apiService } from '../services/apiService';
import { useUIStore } from '../stores/uiStore';
import type { FormField, FormData } from '../types';

export const RequestSubmissionPage: React.FC = () => {
  const { t } = useTranslation();
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const [fields, setFields] = useState<FormField[]>([]);
  const [catalogItem, setCatalogItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');
  const { theme } = useUIStore();

  useEffect(() => {
    if (itemId) {
      loadFormMetadata(itemId);
    }
  }, [itemId]);

  const loadFormMetadata = async (catalogItemId: string) => {
    setLoading(true);
    setError(null);

    try {
      const [formResponse, catalogResponse] = await Promise.all([
        apiService.getCatalogItemForm(catalogItemId),
        apiService.getCatalogItemDetails(catalogItemId)
      ]);

      if (formResponse.success && formResponse.data) {
        setFields(formResponse.data.fields);
      } else {
        setError(formResponse.message || 'Failed to load form metadata');
      }

      if (catalogResponse.success && catalogResponse.data) {
        setCatalogItem(catalogResponse.data);
      }
    } catch (err) {
      setError('An error occurred while loading the form');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    if (!itemId) {
      setToastMessage('Invalid catalog item ID');
      setToastType('error');
      setShowToast(true);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await apiService.submitCatalogRequest(itemId, formData);

      if (response.success && response.data) {
        const requestNumber = response.data.number || 'N/A';
        const requestType = response.data.record_type || 'request';
        
        // Create a more informative success message
        let successMessage = `Request submitted successfully!`;
        
        if (response.data.table === 'sc_request' && response.data.req_item) {
          successMessage = `✅ Request created successfully!
          
📋 Request Number: ${response.data.number}
📋 Request Item: ${response.data.req_item.number}
📋 Status: Submitted

Your request has been created in ServiceNow and is being processed.`;
        } else if (response.data.table === 'sc_req_item') {
          successMessage = `✅ Request Item created successfully!
          
📋 Request Item Number: ${response.data.number}
📋 Status: Submitted

Your request item has been created in ServiceNow.`;
        } else {
          successMessage = `✅ ${requestType.charAt(0).toUpperCase() + requestType.slice(1)} created successfully!
          
📋 Number: ${requestNumber}
📋 Status: Submitted

Your ${requestType} has been created in ServiceNow.`;
        }
        
        setToastMessage(successMessage);
        setToastType('success');
        setShowToast(true);
        
        // Navigate to catalog page after showing success message
        setTimeout(() => {
          navigate('/catalog');
        }, 4000); // 4 seconds to allow user to read the message
      } else {
        setToastMessage(response.message || 'Failed to submit request');
        setToastType('error');
        setShowToast(true);
      }
    } catch (err) {
      setToastMessage('An error occurred while submitting the request');
      setToastType('error');
      setShowToast(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/catalog');
  };

  if (loading) {
    return (
      <div className={`min-h-screen transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
          : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <LoadingSpinner size="lg" text={t('form.loadingForm')} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
          : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className={`w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4`}>
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>{t('common.error')}</h2>
            <p className={`text-lg mb-6 transition-colors duration-300 ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}>{error}</p>
            <Button onClick={() => window.location.reload()}>
              {t('catalog.tryAgain')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link to="/" className={`hover:underline transition-colors duration-300 ${
                theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}>
                {t('navigation.home')}
              </Link>
            </li>
            <li className={`transition-colors duration-300 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-400'
            }`}>/</li>
            <li>
              <Link to="/catalog" className={`hover:underline transition-colors duration-300 ${
                theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}>
                {t('navigation.serviceCatalog')}
              </Link>
            </li>
            <li className={`transition-colors duration-300 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-400'
            }`}>/</li>
            <li className={`transition-colors duration-300 ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-900'
            }`}>
              {catalogItem?.name || t('form.requestForm')}
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold mb-4 transition-colors duration-300 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            {catalogItem?.name || t('form.requestForm')}
          </h1>
          <p className={`text-xl transition-colors duration-300 ${
            theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
          }`}>
            {catalogItem?.short_description || catalogItem?.description || t('form.requestForm')}
          </p>
        </div>

        {/* Form */}
        <DynamicFormRenderer
          fields={fields}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={submitting}
          submitLabel={t('form.submitRequest')}
          cancelLabel={t('common.cancel')}
        />
      </div>

      {/* Toast Notification */}
      {showToast && (
        <Toast
          type={toastType}
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}; 