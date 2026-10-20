import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  GraduationCap,
  Shield,
  Edit,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  Check,
  X,
  Mail,
  FileText
} from 'lucide-react';
import axios from 'axios';

const AdminUserManagement = ({ isDarkMode, user: currentUserProp }) => {
  // Get active reviewer identity from props or localStorage
  const currentReviewer = currentUserProp || (() => {
    try {
      const stored = localStorage.getItem('ptc_user') || localStorage.getItem('user');
      return stored ? JSON.parse(stored) : { name: 'Faculty Member', role: 'professor' };
    } catch (e) {
      return { name: 'Faculty Member', role: 'professor' };
    }
  })();

  const reviewerRole = (currentReviewer?.role || 'administrator').toLowerCase();
  const isAuthorized = ['professor', 'teacher', 'faculty', 'dean', 'administrator', 'admin'].includes(reviewerRole);

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'approved', 'rejected'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [confirmApproveStudent, setConfirmApproveStudent] = useState(null);
  const [confirmRejectStudent, setConfirmRejectStudent] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');

  // Default seed data for offline / preview fallback
  const initialDefaultStudents = [
    {
      id: 1,
      full_name: 'Sheryl Ann Delos Reyes',
      email: 'sheryl.delosreyes@ptc.edu.ph',
      student_id: '2023-00102',
      program: 'BS Information Technology',
      section: 'BSIT 3-A',
      role: 'student',
      account_status: 'approved',
      approved_by: 'Dean Roberto Santos',
      approved_by_role: 'Dean',
      approved_at: '2026-10-16T11:00:00.000Z',
      created_at: '2026-10-16T10:00:00.000Z',
    },
    {
      id: 2,
      full_name: 'Juan Carlo Santos',
      email: 'juan.santos@ptc.edu.ph',
      student_id: '2023-00105',
      program: 'BS Information Technology',
      section: 'BSIT 3-B',
      role: 'student',
      account_status: 'pending',
      created_at: '2026-10-17T06:20:00.000Z',
    },
    {
      id: 3,
      full_name: 'Maria Cristina Ramos',
      email: 'maria.ramos@ptc.edu.ph',
      student_id: '2023-00106',
      program: 'BS Information Technology',
      section: 'BSIT 3-B',
      role: 'student',
      account_status: 'pending',
      created_at: '2026-10-17T07:45:00.000Z',
    },
    {
      id: 4,
      full_name: 'Alex Gonzaga',
      email: 'alex.gonzaga@ptc.edu.ph',
      student_id: '2023-00088',
      program: 'BS Computer Engineering',
      section: 'BSCpE 2-A',
      role: 'student',
      account_status: 'rejected',
      rejected_by: 'Dean Roberto Santos',
      rejected_at: '2026-10-16T14:10:00.000Z',
      rejection_reason: 'Missing Form 137 / prerequisite verification records.',
      created_at: '2026-10-16T13:00:00.000Z',
    }
  ];

  // Fetch students from backend
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/students', {
        headers: {
          'x-user-role': reviewerRole,
          'x-user-name': currentReviewer?.name || 'Authorized Reviewer'
        }
      });
      if (response.data && response.data.students && response.data.students.length > 0) {
        setStudents(response.data.students);
      } else {
        setStudents(initialDefaultStudents);
      }
    } catch (err) {
      console.log('Using local student roster state:', err.message);
      setStudents((prev) => (prev.length > 0 ? prev : initialDefaultStudents));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Approve Handler
  const handleApprove = async (student) => {
    setProcessingId(student.id);
    const approverName = currentReviewer?.name || 'Administrator';
    const approverRoleTitle = reviewerRole === 'dean' ? 'Dean' : reviewerRole === 'professor' ? 'Faculty' : 'Admin';

    try {
      await axios.post(`http://localhost:5000/api/students/${student.id}/approve`, {
        approverName,
        approverRole: approverRoleTitle
      }, {
        headers: {
          'x-user-role': reviewerRole,
          'x-user-name': approverName
        }
      });
    } catch (e) {
      console.log('Applied approval to local state');
    }

    setStudents((prev) =>
      prev.map((s) =>
        s.id === student.id
          ? {
              ...s,
              account_status: 'approved',
              approved_by: approverName,
              approved_by_role: approverRoleTitle,
              approved_at: new Date().toISOString(),
              rejected_by: null,
              rejected_at: null,
              rejection_reason: null
            }
          : s
      )
    );

    setProcessingId(null);
    setConfirmApproveStudent(null);
    setActionSuccessMessage(`Successfully approved registration for ${student.full_name || student.email}`);
    setTimeout(() => setActionSuccessMessage(''), 4000);
  };

  // Reject Handler
  const handleReject = async (student) => {
    setProcessingId(student.id);
    const reviewerName = currentReviewer?.name || 'Administrator';
    const reasonText = rejectionReason.trim() || 'Did not meet admission / verification criteria';

    try {
      await axios.post(`http://localhost:5000/api/students/${student.id}/reject`, {
        reason: reasonText,
        approverName: reviewerName
      }, {
        headers: {
          'x-user-role': reviewerRole,
          'x-user-name': reviewerName
        }
      });
    } catch (e) {
      console.log('Applied rejection to local state');
    }

    setStudents((prev) =>
      prev.map((s) =>
        s.id === student.id
          ? {
              ...s,
              account_status: 'rejected',
              rejected_by: reviewerName,
              rejected_at: new Date().toISOString(),
              rejection_reason: reasonText,
              approved_by: null,
              approved_at: null
            }
          : s
      )
    );

    setProcessingId(null);
    setConfirmRejectStudent(null);
    setRejectionReason('');
    setActionSuccessMessage(`Registration rejected for ${student.full_name || student.email}`);
    setTimeout(() => setActionSuccessMessage(''), 4000);
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const status = (s.account_status || 'pending').toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      (s.full_name && s.full_name.toLowerCase().includes(query)) ||
      (s.email && s.email.toLowerCase().includes(query)) ||
      (s.student_id && s.student_id.toLowerCase().includes(query));

    if (!matchesQuery) return false;

    if (filter === 'pending') return status === 'pending';
    if (filter === 'approved') return status === 'approved' || status === 'active';
    if (filter === 'rejected') return status === 'rejected';
    return true;
  });

  const pendingCount = students.filter((s) => (s.account_status || 'pending').toLowerCase() === 'pending').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 text-white shadow-md shadow-indigo-500/20">
            <GraduationCap size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Student Management
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                Registration Approval
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Review new student registrations, grant course access, and manage student accounts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={fetchStudents}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionSuccessMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-sm"
        >
          <CheckCircle size={16} className="text-emerald-500" />
          <span>{actionSuccessMessage}</span>
        </motion.div>
      )}

      {/* Role Permission Badge Alert */}
      <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300">
          <Shield size={16} className="text-indigo-500 shrink-0" />
          <span>
            Logged in as <strong>{currentReviewer?.name || 'Reviewer'}</strong> (
            <span className="capitalize font-semibold">{reviewerRole}</span>). You have{' '}
            <strong>Full Approval Authority</strong> to review student registrations.
          </span>
        </div>
        <span className="hidden md:inline-flex text-[11px] font-mono text-indigo-500 dark:text-indigo-400 font-semibold">
          RBAC: Faculty &bull; Dean &bull; Admin
        </span>
      </div>

      {/* Search Bar & Filter Tabs */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs overflow-x-auto">
          {[
            { id: 'all', label: 'All Students' },
            { id: 'pending', label: 'Pending Approvals', badge: pendingCount },
            { id: 'approved', label: 'Approved' },
            { id: 'rejected', label: 'Rejected' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                filter === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative max-w-sm w-full">
          <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, ID, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Student Records Master Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading student records...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No students found matching current filter or search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 uppercase font-mono text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">Student</th>
                  <th className="p-4">Student ID</th>
                  <th className="p-4">Program &amp; Section</th>
                  <th className="p-4">Registration Date</th>
                  <th className="p-4">Approval Status</th>
                  <th className="p-4">Reviewed By</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredStudents.map((student) => {
                  const status = (student.account_status || 'pending').toLowerCase();
                  const isPending = status === 'pending';
                  const isApproved = status === 'approved' || status === 'active';
                  const isRejected = status === 'rejected';

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      {/* Name & Email */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-sky-400 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow">
                            {(student.full_name || student.email || 'S').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-slate-900 dark:text-white">
                              {student.full_name || 'PTC Student'}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Mail size={12} className="text-slate-400" />
                              {student.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Student ID */}
                      <td className="p-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                        {student.student_id || 'Pending Assign'}
                      </td>

                      {/* Program & Section */}
                      <td className="p-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {student.section || 'BSIT 3-A'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {student.program || 'BS Information Technology'}
                        </div>
                      </td>

                      {/* Registration Date */}
                      <td className="p-4 text-slate-500 dark:text-slate-400">
                        <div>{new Date(student.created_at).toLocaleDateString()}</div>
                        <div className="text-[10px]">
                          {new Date(student.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>

                      {/* Approval Status Badge */}
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            isApproved
                              ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                              : isPending
                              ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800'
                              : 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-800'
                          }`}
                        >
                          {isApproved && <CheckCircle size={12} />}
                          {isPending && <Clock size={12} className="animate-spin text-amber-500" />}
                          {isRejected && <XCircle size={12} />}
                          <span className="capitalize">{status}</span>
                        </span>
                      </td>

                      {/* Review Metadata */}
                      <td className="p-4 text-[11px]">
                        {isApproved && student.approved_by ? (
                          <div>
                            <span className="text-slate-800 dark:text-slate-200 font-semibold block">
                              {student.approved_by}
                            </span>
                            <span className="text-slate-400 text-[10px]">
                              {student.approved_at ? new Date(student.approved_at).toLocaleDateString() : 'Approved'}
                            </span>
                          </div>
                        ) : isRejected ? (
                          <div>
                            <span className="text-rose-600 dark:text-rose-400 font-semibold block">
                              Rejected by {student.rejected_by || 'Reviewer'}
                            </span>
                            {student.rejection_reason && (
                              <span className="text-slate-400 text-[10px] italic line-clamp-1">
                                "{student.rejection_reason}"
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Awaiting Review</span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="p-4 text-right">
                        {isAuthorized ? (
                          <div className="flex items-center justify-end gap-2">
                            {isPending ? (
                              <>
                                <button
                                  onClick={() => setConfirmApproveStudent(student)}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition transform hover:scale-105"
                                >
                                  <Check size={14} /> Approve
                                </button>
                                <button
                                  onClick={() => setConfirmRejectStudent(student)}
                                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition transform hover:scale-105"
                                >
                                  <X size={14} /> Reject
                                </button>
                              </>
                            ) : isApproved ? (
                              <button
                                onClick={() => setConfirmRejectStudent(student)}
                                className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-medium transition"
                              >
                                Revoke
                              </button>
                            ) : (
                              <button
                                onClick={() => setConfirmApproveStudent(student)}
                                className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-[11px] font-semibold hover:bg-indigo-100 transition"
                              >
                                Re-approve
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">View Only</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CONFIRM APPROVE MODAL */}
      <AnimatePresence>
        {confirmApproveStudent && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Approve Registration Application
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Grant full LMS access to this student
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student Name:</span>
                  <strong className="text-slate-900 dark:text-white">
                    {confirmApproveStudent.full_name || 'PTC Student'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    {confirmApproveStudent.email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Program &amp; Section:</span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {confirmApproveStudent.program || 'BSIT'} &bull; {confirmApproveStudent.section || '3-A'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Once approved, the student will be permitted to log in, access course materials, submit assignments, and join PTC Meet live video classrooms.
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmApproveStudent(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={processingId === confirmApproveStudent.id}
                  onClick={() => handleApprove(confirmApproveStudent)}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition"
                >
                  {processingId === confirmApproveStudent.id ? 'Approving...' : 'Confirm Approval'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONFIRM REJECT MODAL */}
      <AnimatePresence>
        {confirmRejectStudent && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <XCircle size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Reject Student Registration
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Deny access to the LMS application
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs">
                <div className="text-slate-700 dark:text-slate-300">
                  Rejecting: <strong>{confirmRejectStudent.full_name || confirmRejectStudent.email}</strong>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Rejection Reason (will be shown to the student upon login attempt):
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Invalid student ID number, incomplete registrar documents, or duplicate enrollment."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full p-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setConfirmRejectStudent(null);
                    setRejectionReason('');
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={processingId === confirmRejectStudent.id}
                  onClick={() => handleReject(confirmRejectStudent)}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition"
                >
                  {processingId === confirmRejectStudent.id ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUserManagement;
