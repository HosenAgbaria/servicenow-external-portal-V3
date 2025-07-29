import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { apiService } from '../services/apiService';
import { useRequestsStore } from '../stores/requestsStore';

export const RequestsListPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const {
    requests,
    loading,
    error,
    pagination,
    setRequests,
    setLoading,
    setError,
    setPagination,
    searchRequests,
    filterByStatus,
    filterByCategory
  } = useRequestsStore();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getUserRequests({
        offset: (pagination.page - 1) * pagination.limit,
        limit: pagination.limit
      });

      if (response.success && response.data) {
        setRequests(response.data.data);
        setPagination({
          count: response.data.count
        } as any);
        // Handle hasMore separately since it's not part of PaginatedResponse
        const hasMore = response.data.count > (pagination.page * pagination.limit);
        setPagination({ hasMore } as any);
      } else {
        setError(response.error || 'Failed to load requests');
      }
    } catch (err) {
      setError('An error occurred while loading requests');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchRequests(searchQuery);
  };

  const getStatusBadge = (state: string) => {
    const statusConfig = {
      new: { color: 'bg-green-100 text-green-800', label: 'Open' },
      in_progress: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      resolved: { color: 'bg-blue-100 text-blue-800', label: 'In Progress' },
      closed: { color: 'bg-red-100 text-red-800', label: 'Closed' }
    };

    const config = statusConfig[state as keyof typeof statusConfig] || statusConfig.new;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Requests</h1>
          <p className="text-gray-600">Track and manage your service requests</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search requests..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </form>
            </div>
            
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">Status: All</option>
                <option value="new">Open</option>
                <option value="in_progress">Pending</option>
                <option value="resolved">In Progress</option>
                <option value="closed">Closed</option>
              </select>
              
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">Type: All</option>
                <option value="Software">Software</option>
                <option value="Hardware">Hardware</option>
                <option value="Network">Network</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading requests...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={loadRequests}>Try Again</Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Requested
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Activity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {requests.map((request: any) => (
                      <tr key={request.sys_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            to={`/requests/${request.sys_id}`}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            {request.short_description}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(request.state)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(request.requested_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(request.requested_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            to={`/requests/${request.sys_id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && requests.length > 0 && (
              <div className="flex justify-center mt-6">
                <nav className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    disabled={pagination.page === 1}
                    onClick={() => setPagination({ page: pagination.page - 1 } as any)}
                  >
                    Previous
                  </Button>
                  {[1, 2, 3].map((page) => (
                    <Button
                      key={page}
                      variant={pagination.page === page ? "default" : "outline"}
                      onClick={() => setPagination({ page } as any)}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    disabled={!pagination.hasMore}
                    onClick={() => setPagination({ page: pagination.page + 1 } as any)}
                  >
                    Next
                  </Button>
                </nav>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && requests.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No requests found.</p>
                <Link to="/catalog">
                  <Button>Browse Services</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};