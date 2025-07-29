import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { apiService } from '../services/api';
import type { ServiceNowRequest } from '../types';

export const RequestDetailsPage: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const [request, setRequest] = useState<ServiceNowRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (requestId) {
      loadRequest(requestId);
    }
  }, [requestId]);

  const loadRequest = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getRequest(id);
      if (response.success && response.data) {
        setRequest(response.data);
      } else {
        setError(response.error || 'Failed to load request');
      }
    } catch (err) {
      setError('An error occurred while loading the request');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (state: string) => {
    const statusConfig = {
      new: { color: 'bg-green-100 text-green-800', label: 'Open' },
      in_progress: { color: 'bg-yellow-100 text-yellow-800', label: 'In Progress' },
      resolved: { color: 'bg-blue-100 text-blue-800', label: 'Resolved' },
      closed: { color: 'bg-red-100 text-red-800', label: 'Closed' }
    };

    const config = statusConfig[state as keyof typeof statusConfig] || statusConfig.new;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6">
            <p className="text-red-600 mb-4">{error || 'Request not found'}</p>
            <Button onClick={() => window.history.back()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-6">
          <a href="/requests" className="hover:text-gray-700">My Requests</a>
          <span className="mx-2">/</span>
          <span>Request Details</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Header */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">
                      Request #{request.number}: {request.short_description}
                    </CardTitle>
                    <p className="text-gray-600 mt-2">
                      Submitted by {request.requested_by?.name || 'Unknown'} on {request.requested_date ? new Date(request.requested_date).toLocaleDateString() : 'Unknown date'}
                    </p>
                  </div>
                  {getStatusBadge((request.state || request.status) as string)}
                </div>
              </CardHeader>
            </Card>

            {/* Request Details */}
            <Card>
              <CardHeader>
                <CardTitle>Request Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Priority</label>
                    <p className="text-gray-900">{request.priority}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Category</label>
                    <p className="text-gray-900">{request.category}</p>
                  </div>
                  {request.assigned_to && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Assigned To</label>
                      <p className="text-gray-900">{request.assigned_to.name}</p>
                    </div>
                  )}
                  {request.due_date && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Due Date</label>
                      <p className="text-gray-900">{new Date(request.due_date).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{request.description}</p>
              </CardContent>
            </Card>

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle>Communication Log</CardTitle>
              </CardHeader>
              <CardContent>
                {request.comments && request.comments.length > 0 ? (
                  <div className="space-y-4">
                    {request.comments.map((comment) => (
                      <div key={comment.sys_id} className="border-l-4 border-blue-500 pl-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {comment.user.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{comment.user.name}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(comment.date).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700">{comment.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No comments yet.</p>
                )}
                
                {/* Add Comment */}
                <div className="mt-6 pt-6 border-t">
                  <textarea
                    placeholder="Add a comment..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                  <Button className="mt-2">Comment</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Request History */}
            <Card>
              <CardHeader>
                <CardTitle>Request History</CardTitle>
                <p className="text-sm text-gray-600">Previous requests from this user</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <div>
                      <p className="text-sm font-medium">Request #12340: Hardware Issue</p>
                      <p className="text-xs text-gray-500">July 10, 2024</p>
                    </div>
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <div>
                      <p className="text-sm font-medium">Request #12335: Network...</p>
                      <p className="text-xs text-gray-500">June 25, 2024</p>
                    </div>
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};