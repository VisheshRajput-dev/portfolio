import React, { useState } from 'react';
import { updateSubmissionStatus } from '../../firebase/database';

const ContactManager = ({ submissions, onUpdate }) => {
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateSubmissionStatus(id, newStatus);
      onUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    if (statusFilter === 'all') return true;
    return submission.status === statusFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'contacted': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'completed': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'archived': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Contact Submissions</h2>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.map((submission, index) => (
          <div
            key={submission.id}
            className="bg-gray-800 border border-gray-700 rounded-lg p-6"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <h3 className="text-lg font-bold text-white">{submission.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(submission.status)}`}>
                    {submission.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-300 text-sm">Email</p>
                    <p className="text-white">{submission.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Phone</p>
                    <p className="text-white">{submission.phone || 'Not provided'}</p>
                  </div>
                </div>

                {submission.message && (
                  <div className="mb-4">
                    <p className="text-gray-300 text-sm">Message</p>
                    <p className="text-white bg-white/5 p-3 rounded-lg mt-1">{submission.message}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <p className="text-gray-400 text-sm">
                    Submitted: {formatDate(submission.timestamp)}
                  </p>
                  
                  <div className="flex gap-2">
                    <select
                      value={submission.status}
                      onChange={(e) => handleStatusChange(submission.id, e.target.value)}
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="completed">Completed</option>
                      <option value="archived">Archived</option>
                    </select>
                    
                    <button
                      onClick={() => setSelectedSubmission(submission)}
                      className="bg-blue-500/20 border border-blue-500/30 text-blue-300 px-3 py-1 rounded-lg hover:bg-blue-500/30 transition-all duration-300 text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSubmissions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No submissions found</p>
        </div>
      )}

      {/* Submission Details Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Submission Details</h3>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-300 text-sm">Name</p>
                  <p className="text-white font-medium">{selectedSubmission.name}</p>
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Email</p>
                  <p className="text-white font-medium">{selectedSubmission.email}</p>
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Phone</p>
                  <p className="text-white font-medium">{selectedSubmission.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm border ${getStatusColor(selectedSubmission.status)}`}>
                    {selectedSubmission.status}
                  </span>
                </div>
              </div>

              {selectedSubmission.message && (
                <div>
                  <p className="text-gray-300 text-sm mb-2">Message</p>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-white">{selectedSubmission.message}</p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-gray-300 text-sm">Submitted</p>
                <p className="text-white">{formatDate(selectedSubmission.timestamp)}</p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="flex-1 bg-gray-500/20 border border-gray-500/30 text-gray-300 py-3 rounded-lg hover:bg-gray-500/30 transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactManager;
