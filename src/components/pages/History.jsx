import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import StatusPill from "@/components/molecules/StatusPill";
import SearchBar from "@/components/molecules/SearchBar";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Recipients from "@/components/pages/Recipients";
import Settings from "@/components/pages/Settings";
import { sendSessionService } from "@/services/api/sendSessionService";
import { recipientService } from "@/services/api/recipientService";

const History = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    loadSessions();
  }, []);

const loadSessions = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await sendSessionService.getAll();
      // Sort by most recent first
      setSessions(data.sort((a, b) => new Date(b.started_at) - new Date(a.started_at)));
    } catch (err) {
      console.error('Failed to load sessions:', err);
      setError('Failed to load send history');
    } finally {
      setLoading(false);
    }
  };

const filteredSessions = sessions.filter(session => {
    const matchesSearch = session?.message_id?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'sending': return 'info';
      case 'paused': return 'warning';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getSpeedLabel = (speed) => {
    switch (speed) {
      case 'low': return 'Low (3s)';
      case 'medium': return 'Medium (10s)';
      case 'high': return 'High (15s)';
      default: return speed;
    }
  };

const getBanProtectionLabel = (protection) => {
    switch (protection) {
      case 'none': return 'None';
      case 'random': return 'Random String';
      case 'timestamp': return 'Date & Time';
      default: return protection;
    }
  };

  const calculateDuration = (startedAt, completedAt) => {
    if (!startedAt || !completedAt) return 'N/A';
    
    const start = new Date(startedAt);
    const end = new Date(completedAt);
    const durationMs = end - start;
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    
    return `${minutes}m ${seconds}s`;
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadSessions} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Send History</h1>
          <p className="text-gray-600 mt-1">Track and monitor your bulk messaging campaigns</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button variant="secondary" icon="RefreshCw" onClick={loadSessions}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-whatsapp-100 to-whatsapp-200 rounded-lg flex items-center justify-center mr-4">
              <ApperIcon name="Send" className="w-6 h-6 text-whatsapp-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{sessions.length}</div>
              <div className="text-sm text-gray-500">Total Sessions</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center mr-4">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {sessions.filter(s => s.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-4">
              <ApperIcon name="Clock" className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {sessions.filter(s => s.status === 'sending' || s.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-500">In Progress</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mr-4">
              <ApperIcon name="Users" className="w-6 h-6 text-gray-600" />
            </div>
            <div>
<div className="text-2xl font-bold text-gray-900">
                {sessions.reduce((total, session) => total + (session.recipient_ids?.length || 0), 0)}
              </div>
              <div className="text-sm text-gray-500">Total Messages</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by message ID..."
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-whatsapp-500 focus:border-whatsapp-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="sending">Sending</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
          </select>
        </div>
      </div>

      {/* Sessions List */}
      <div className="card">
        {filteredSessions.length === 0 ? (
          <Empty 
            title="No send sessions found"
            description="Try adjusting your search or filter criteria, or send your first message."
            icon="Send"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Session</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Recipients</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Progress</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Status</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Settings</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Duration</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Started</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map((session, index) => (
                  <motion.tr
                    key={session.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
<td className="py-4 px-6">
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{session.message_id}</div>
                        <div className="text-xs text-gray-500">ID: {session.Id}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{session.recipient_ids?.length || 0}</div>
                        <div className="text-xs text-gray-500">recipients</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-whatsapp-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${session.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{session.progress}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <StatusPill status={session.status} />
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <Badge variant="default" size="sm">
                          {getSpeedLabel(session.speed)}
                        </Badge>
                        <div className="text-xs text-gray-500">
                          {getBanProtectionLabel(session.banProtection)}
                        </div>
                      </div>
                    </td>
<td className="py-4 px-6">
                      <span className="text-sm text-gray-900">
                        {calculateDuration(session.started_at, session.completed_at)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
<div>
                        <div className="text-sm text-gray-900">
                          {format(new Date(session.started_at), 'MMM d, yyyy')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(session.started_at), 'h:mm a')}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedSession(session)}
                        icon="Eye"
                      >
                        View
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Session Details Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Session Details</h3>
                <button
                  onClick={() => setSelectedSession(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
<div>
                  <label className="text-sm font-medium text-gray-500">Message ID</label>
                  <div className="text-lg text-gray-900">{selectedSession.message_id}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    <StatusPill status={selectedSession.status} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Recipients</label>
                  <div className="text-lg text-gray-900">{selectedSession.recipient_ids?.length || 0}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Progress</label>
                  <div className="text-lg text-gray-900">{selectedSession.progress}%</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Send Speed</label>
                  <div className="text-lg text-gray-900">{getSpeedLabel(selectedSession.speed)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Ban Protection</label>
                  <div className="text-lg text-gray-900">{getBanProtectionLabel(selectedSession.banProtection)}</div>
                </div>
<div>
                  <label className="text-sm font-medium text-gray-500">Started</label>
                  <div className="text-lg text-gray-900">
                    {format(new Date(selectedSession.started_at), 'MMM d, yyyy h:mm a')}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Duration</label>
                  <div className="text-lg text-gray-900">
                    {calculateDuration(selectedSession.started_at, selectedSession.completed_at)}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default History;