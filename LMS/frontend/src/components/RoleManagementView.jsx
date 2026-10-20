import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Shield,
  Award,
  GraduationCap,
  Plus,
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  Edit,
  Trash2,
  RefreshCw,
  Mail,
  Lock,
  X,
  Check
} from 'lucide-react';
import axios from 'axios';

/**
 * Reusable Role-Based Management Component
 * Powers Admin Management, Dean Management, Faculty Management, and Student Management
 */
const RoleManagementView = ({
  moduleId,
  moduleTitle,
  targetRole, // 'administrator' | 'dean' | 'professor' | 'student'
  icon: IconComponent = Users,
  currentUser,
  isDarkMode
}) => {
  const currentRole = (currentUser?.role || 'administrator').toLowerCase();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    program: 'BS Information Technology',
    section: 'BSIT 3-A',
    status: 'active'
  });

  // Default seed accounts for offline fallback
  const getInitialUsers = () => {
    if (targetRole === 'administrator') {
      return [
        { id: 'adm-1', email: 'admin@paterostechnologicalcollege.edu.ph', full_name: 'System Admin', role: 'administrator', account_status: 'active', created_at: '2026-10-01T08:00:00Z' },
        { id: 'adm-2', email: 'support.admin@ptc.edu.ph', full_name: 'IT Support Admin', role: 'administrator', account_status: 'active', created_at: '2026-10-05T09:30:00Z' },
      ];
    }
    if (targetRole === 'dean') {
      return [
        { id: 'dn-1', email: 'dean@paterostechnologicalcollege.edu.ph', full_name: 'Dean Roberto Santos', role: 'dean', account_status: 'active', department: 'College of Computer Studies', created_at: '2026-10-02T10:00:00Z' },
      ];
    }
    if (targetRole === 'professor') {
      return [
        { id: 'fc-1', email: 'prof@paterostechnologicalcollege.edu.ph', full_name: 'Prof. Cynthia B. Dulagan', role: 'professor', account_status: 'active', department: 'IT Department', created_at: '2026-10-03T11:00:00Z' },
        { id: 'fc-2', email: 'edmar.devera@ptc.edu.ph', full_name: 'Prof. Edmar De Vera', role: 'professor', account_status: 'active', department: 'Computer Science', created_at: '2026-10-04T12:00:00Z' },
        { id: 'fc-3', email: 'sheryl.ricafort@ptc.edu.ph', full_name: 'Prof. Sheryl Ann Ricafort', role: 'professor', account_status: 'active', department: 'IT Department', created_at: '2026-10-04T14:30:00Z' },
      ];
    }
    return [
      { id: 'st-1', email: 'student@paterostechnologicalcollege.edu.ph', full_name: 'Test Account', student_id: '2023-00101', role: 'student', section: 'BSIT 3-A', account_status: 'active', created_at: '2026-10-05T08:00:00Z' },
      { id: 'st-2', email: 'sheryl.delosreyes@ptc.edu.ph', full_name: 'Sheryl Ann Delos Reyes', student_id: '2023-00102', role: 'student', section: 'BSIT 3-A', account_status: 'active', created_at: '2026-10-06T09:00:00Z' },
      { id: 'st-3', email: 'juan.santos@ptc.edu.ph', full_name: 'Juan Carlo Santos', student_id: '2023-00105', role: 'student', section: 'BSIT 3-B', account_status: 'pending', created_at: '2026-10-17T06:20:00Z' },
    ];
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/users/role/${targetRole}`, {
        headers: {
          'x-user-role': currentRole,
          'x-user-name': currentUser?.name || 'Authorized User'
        }
      });
      if (res.data?.users && res.data.users.length > 0) {
        setUsers(res.data.users);
      } else {
        setUsers(getInitialUsers());
      }
    } catch (e) {
      setUsers(prev => prev.length > 0 ? prev : getInitialUsers());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [targetRole]);

  // Handle Save (Create or Edit)
  const handleSave = (e) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? {
        ...u,
        full_name: formData.name,
        email: formData.email,
        account_status: formData.status,
        section: formData.section
      } : u));
      setToastMessage(`Updated ${formData.name || formData.email} successfully.`);
      setEditingUser(null);
    } else {
      const newUser = {
        id: 'usr-' + Date.now(),
        full_name: formData.name,
        email: formData.email,
        role: targetRole,
        account_status: formData.status,
        student_id: targetRole === 'student' ? (formData.student_id || '2023-' + Math.floor(10000 + Math.random() * 90000)) : undefined,
        section: formData.section,
        created_at: new Date().toISOString()
      };
      setUsers([newUser, ...users]);
      setToastMessage(`Created new ${targetRole} account: ${formData.name}`);
      setShowCreateModal(false);
    }
    setFormData({ name: '', email: '', password: '', program: 'BS Information Technology', section: 'BSIT 3-A', status: 'active' });
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Handle Delete
  const handleDelete = (userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    setDeleteConfirmUser(null);
    setToastMessage('Account removed successfully.');
    setTimeout(() => setToastMessage(''), 4000);
  };

  const filteredUsers = users.filter(u => {
    const status = (u.account_status || 'active').toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (u.full_name && u.full_name.toLowerCase().includes(query)) ||
      (u.email && u.email.toLowerCase().includes(query)) ||
      (u.student_id && u.student_id.toLowerCase().includes(query));

    if (!matchesSearch) return false;
    if (statusFilter === 'active') return status === 'active' || status === 'approved';
    if (statusFilter === 'pending') return status === 'pending';
    if (statusFilter === 'inactive') return status === 'rejected' || status === 'inactive';
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <IconComponent size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {moduleTitle}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                {targetRole}s
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Manage accounts, view credentials, and maintain authorized records.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setFormData({ name: '', email: '', password: '', program: 'BS Information Technology', section: 'BSIT 3-A', status: 'active' });
              setShowCreateModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition"
          >
            <Plus size={14} /> Add {targetRole.charAt(0).toUpperCase() + targetRole.slice(1)}
          </button>
          <button
            onClick={fetchUsers}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
            title="Refresh List"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-xl bg-slate-900 border border-indigo-500 text-white text-xs font-semibold flex items-center justify-between shadow-lg">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage('')} className="text-slate-400 hover:text-white"><X size={14} /></button>
        </div>
      )}

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
          {[
            { id: 'all', label: 'All' },
            { id: 'active', label: 'Active / Approved' },
            { id: 'pending', label: 'Pending' },
            { id: 'inactive', label: 'Inactive / Rejected' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                statusFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative max-w-sm w-full">
          <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search account name, email, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading {targetRole} accounts...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No {targetRole} accounts found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 uppercase font-mono text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">Account User</th>
                  {targetRole === 'student' && <th className="p-4">Student ID</th>}
                  {targetRole === 'student' && <th className="p-4">Section</th>}
                  {targetRole === 'professor' && <th className="p-4">Department</th>}
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Created Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredUsers.map(userItem => {
                  const status = (userItem.account_status || 'active').toLowerCase();
                  const isActive = status === 'active' || status === 'approved';
                  const isPending = status === 'pending';

                  return (
                    <tr key={userItem.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-sky-400 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow">
                            {(userItem.full_name || userItem.email || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-slate-900 dark:text-white">
                              {userItem.full_name || 'PTC Account'}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Mail size={12} className="text-slate-400" />
                              {userItem.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {targetRole === 'student' && (
                        <td className="p-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                          {userItem.student_id || '2023-00101'}
                        </td>
                      )}

                      {targetRole === 'student' && (
                        <td className="p-4 text-slate-800 dark:text-slate-200">
                          {userItem.section || 'BSIT 3-A'}
                        </td>
                      )}

                      {targetRole === 'professor' && (
                        <td className="p-4 text-slate-800 dark:text-slate-200">
                          {userItem.department || 'Information Technology'}
                        </td>
                      )}

                      <td className="p-4">
                        <span className="capitalize font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px]">
                          {userItem.role}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          isActive
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                            : isPending
                            ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800'
                            : 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-800'
                        }`}>
                          {isActive ? <CheckCircle size={10} /> : isPending ? <Clock size={10} /> : <XCircle size={10} />}
                          <span className="capitalize">{userItem.account_status || 'Active'}</span>
                        </span>
                      </td>

                      <td className="p-4 text-slate-500 dark:text-slate-400 text-xs">
                        {new Date(userItem.created_at).toLocaleDateString()}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingUser(userItem);
                              setFormData({
                                name: userItem.full_name || '',
                                email: userItem.email || '',
                                password: '',
                                program: userItem.program || 'BS Information Technology',
                                section: userItem.section || 'BSIT 3-A',
                                status: userItem.account_status || 'active'
                              });
                            }}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                            title="Edit Account"
                          >
                            <Edit size={13} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmUser(userItem)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-rose-50 hover:border-rose-300 text-slate-500 hover:text-rose-600"
                            title="Deactivate / Remove"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      <AnimatePresence>
        {(showCreateModal || editingUser) && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {editingUser ? `Edit ${targetRole} Account` : `Create New ${targetRole} Account`}
                </h3>
                <button
                  onClick={() => { setShowCreateModal(false); setEditingUser(null); }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white"
                  />
                </div>

                {!editingUser && (
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Temporary Password</label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Account Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => { setShowCreateModal(false); setEditingUser(null); }}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                  >
                    Save Account
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRM */}
      <AnimatePresence>
        {deleteConfirmUser && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4"
            >
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Confirm Removal</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to remove <strong>{deleteConfirmUser.full_name || deleteConfirmUser.email}</strong>?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setDeleteConfirmUser(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmUser.id)}
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                >
                  Remove Account
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoleManagementView;
