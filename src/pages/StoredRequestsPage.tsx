import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { requestStorage, type StoredRequest } from '../services/requestStorage';

export const StoredRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<StoredRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    setLoading(true);
    const storedRequests = requestStorage.getAllRequests();
    setRequests(storedRequests);
    setLoading(false);
  };

  const clearAllRequests = () => {
    if (window.confirm('Are you sure you want to clear all stored requests?')) {
      requestStorage.clearAllRequests();
      loadRequests();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_manual_processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading stored requests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Stored Requests</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            View all requests that have been submitted through the portal
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-slate-600">
            Total Requests: {requests.length}
          </div>
          <div className="space-x-2">
            <Button onClick={loadRequests} variant="outline" size="sm">
              Refresh
            </Button>
            <Button onClick={clearAllRequests} variant="outline" size="sm" className="text-red-600 hover:text-red-700">
              Clear All
            </Button>
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-2">No stored requests</h3>
            <p className="text-slate-600">Submit a catalog request to see it here</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {requests.map((request) => (
              <Card key={request.sys_id} className="hover-lift">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{request.catalog_item.name}</CardTitle>
                      <p className="text-slate-600 mt-1">Request Number: {request.number}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                        {request.status.replace('_', ' ')}
                      </span>
                      <span className="text-sm text-slate-500">
                        {new Date(request.submitted_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Request Details</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Category:</span> {request.catalog_item.category}</p>
                        <p><span className="font-medium">Submitted By:</span> {request.submitted_by}</p>
                        <p><span className="font-medium">Priority:</span> {request.priority}</p>
                        <p><span className="font-medium">Impact:</span> {request.impact}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Form Data</h4>
                      <div className="space-y-1 text-sm">
                        {Object.entries(request.form_data).map(([key, value]) => (
                          <p key={key}>
                            <span className="font-medium">{key}:</span> {String(value)}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 