import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import StatusPill from '@/components/molecules/StatusPill';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { recipientService } from '@/services/api/recipientService';
import { sendSessionService } from '@/services/api/sendSessionService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRecipients: 0,
    totalContacts: 0,
    totalGroups: 0,
    totalCommunities: 0
  });
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [recipients, sessions] = await Promise.all([
        recipientService.getAll(),
        sendSessionService.getAll()
      ]);

      // Calculate stats
      const newStats = {
        totalRecipients: recipients.length,
        totalContacts: recipients.filter(r => r.type === 'contact').length,
        totalGroups: recipients.filter(r => r.type === 'group').length,
        totalCommunities: recipients.filter(r => r.type === 'community').length
      };
      
      setStats(newStats);
      setRecentSessions(sessions.slice(0, 5));
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const statCards = [
    {
      title: 'Total Recipients',
      value: stats.totalRecipients,
      icon: 'Users',
      color: 'whatsapp',
      change: '+12%'
    },
    {
      title: 'Contacts',
      value: stats.totalContacts,
      icon: 'User',
      color: 'info',
      change: '+5%'
    },
    {
      title: 'Groups',
      value: stats.totalGroups,
      icon: 'Users',
      color: 'success',
      change: '+8%'
    },
    {
      title: 'Communities',
      value: stats.totalCommunities,
      icon: 'Building',
      color: 'warning',
      change: '+15%'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor your WhatsApp bulk messaging activity</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <StatusPill status="connected" />
          <Link to="/send">
            <Button icon="Send">
              Send Message
            </Button>
          </Link>
        </div>
      </div>

      {/* Connection Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 bg-gradient-to-r from-whatsapp-500 to-whatsapp-600 text-white"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <ApperIcon name="MessageSquare" className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">WhatsApp Web Connected</h3>
              <p className="text-whatsapp-100">Your account is ready for bulk messaging</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">100%</div>
            <div className="text-whatsapp-100 text-sm">Connection Health</div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br from-${stat.color === 'whatsapp' ? 'whatsapp' : stat.color}-100 to-${stat.color === 'whatsapp' ? 'whatsapp' : stat.color}-200 rounded-lg flex items-center justify-center`}>
                <ApperIcon 
                  name={stat.icon} 
                  className={`w-6 h-6 text-${stat.color === 'whatsapp' ? 'whatsapp' : stat.color}-600`} 
                />
              </div>
              <Badge variant="success" size="sm">
                {stat.change}
              </Badge>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">{stat.title}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Send Sessions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Send Sessions</h3>
            <Link to="/history">
              <Button variant="ghost" size="sm" icon="ArrowRight">
                View All
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {recentSessions.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Send" className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No send sessions yet</p>
                <Link to="/send" className="inline-block mt-2">
                  <Button size="sm">Send Your First Message</Button>
                </Link>
              </div>
            ) : (
              recentSessions.map((session) => (
                <div key={session.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-whatsapp-100 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Send" className="w-5 h-5 text-whatsapp-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {session.recipientIds.length} recipients
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(session.startedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <StatusPill status={session.status} />
                    <div className="text-sm text-gray-500 mt-1">
                      {session.progress}% complete
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
          
          <div className="space-y-4">
            <Link to="/send">
              <div className="flex items-center p-4 bg-gradient-to-r from-whatsapp-50 to-whatsapp-100 rounded-lg hover:from-whatsapp-100 hover:to-whatsapp-200 transition-all cursor-pointer">
                <div className="w-12 h-12 bg-whatsapp-500 rounded-lg flex items-center justify-center mr-4">
                  <ApperIcon name="Send" className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Send New Message</div>
                  <div className="text-sm text-gray-500">Compose and send bulk messages</div>
                </div>
                <ApperIcon name="ArrowRight" className="w-5 h-5 text-gray-400" />
              </div>
            </Link>

            <Link to="/recipients">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer">
                <div className="w-12 h-12 bg-gray-500 rounded-lg flex items-center justify-center mr-4">
                  <ApperIcon name="Users" className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Manage Recipients</div>
                  <div className="text-sm text-gray-500">View and organize your contacts</div>
                </div>
                <ApperIcon name="ArrowRight" className="w-5 h-5 text-gray-400" />
              </div>
            </Link>

            <Link to="/categories">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer">
                <div className="w-12 h-12 bg-gray-500 rounded-lg flex items-center justify-center mr-4">
                  <ApperIcon name="FolderOpen" className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Create Categories</div>
                  <div className="text-sm text-gray-500">Organize recipients into groups</div>
                </div>
                <ApperIcon name="ArrowRight" className="w-5 h-5 text-gray-400" />
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;