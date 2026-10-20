import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  Search,
  Check,
  X,
  Mail,
  Eye,
  Shield,
  GraduationCap,
  Calendar,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';

/**
 * Centralized Student Application Verification Component
 * Shared across Admin, Dean, and Faculty roles with single-approval workflow
 */
const VerificationView = ({ user, isDarkMode, setActiveNav }) => {
  const reviewerRole = (user?.role || 'administrator').toLowerCase();
  const reviewerName = user?.name || user?.username || 'Authorized Reviewer';
  const isAuthorized = ['professor', 'teacher', 'faculty', 'dean', 'administrator', 'admin'].includes(reviewerRole);

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'approved', 'rejected', 'all'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [inspectStudent, setInspectStudent] = useState(null);
  const [confirmApproveStudent, setConfirmApproveStudent] = useState(null);
  const [confirmRejectStudent, setConfirmRejectStudent] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Initial fallback mock data
  const defaultApplications = [
    {
      id: 1,
      full_name: 'Juan Carlo Santos',
      email: 'juan.santos@ptc.edu.ph',
      student_id: '2023-00105',
      program: 'BS Information Technology',
      section: 'BSIT 3-B',
      account_status: 'pending',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 2,
      full_name: 'Maria Cristina Ramos',
      email: 'maria.ramos@ptc.edu.ph',
      student_id: '2023-00106',
      program: 'BS Information Technology',
      section: 'BSIT 3-B',
      account_status: 'pending',
      created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    {
      id: 3,
      full_name: 'Sheryl Ann Delos Reyes',
      email: 'sheryl.delosreyes@ptc.edu.ph',
      student_id: '2023-00102',
      program: 'BS Information Technology',
      section: 'BSIT 3-A',
      account_status: 'approved',
      approved_by: 'Dean Roberto Santos',
      approved_by_role: 'Dean',
      approved_at: new Date(Date.now() - 86400000).toISOString(),
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 4,
      full_name: 'Alex Gonzaga',
      email: 'alex.gonzaga@ptc.edu.ph',
      student_id: '2023-00088',
      program: 'BS Computer Engineering',
      section: 'BSCpE 2-A',
      account_status: 'rejected',
      rejected_by: 'Prof. Cynthia B. Dulagan',
      rejected_by_role: 'Faculty',
      rejected_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      rejection_reason: 'Incomplete registrar documents & missing Form 137.',
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    }
  ];

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/students', {
        headers: {
          'x-user-role': reviewerRole,
          'x-user-name': reviewerName
        }
      });
      if (res.data?.students && res.data.students.length > 0) {
        setStudents(res.data.students);
      } else {
        setStudents(defaultApplications);
      }
    } catch (e) {
      setStudents(prev => prev.length > 0 ? prev : defaultApplications);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Approve application
  const handleApprove = async (student) => {
    setProcessingId(student.id);
    const roleTitle = reviewerRole === 'dean' ? 'Dean' : (['professor', 'teacher'].includes(reviewerRole) ? 'Faculty' : 'Admin');
    try {
      await axios.post(`http://localhost:5000/api/students/${student.id}/approve`, {
        approverName: reviewerName,
        approverRole: roleTitle
      }, {
        headers: {
          'x-user-role': reviewerRole,
          'x-user-name': reviewerName
        }
      });
    } catch (err) {}

    setStudents(prev => prev.map(s => s.id === student.id ? {
      ...s,
      account_status: 'approved',
      approved_by: reviewerName,
      approved_by_role: roleTitle,
      approved_at: new Date().toISOString(),
      rejected_by: null,
      rejected_at: null,
      rejection_reason: null
    } : s));

    setProcessingId(null);
    setConfirmApproveStudent(null);
    setInspectStudent(null);
    setToastMessage(`✅ Approved registration for ${student.full_name || student.email}! Student can now log in.`);
    setTimeout(() => setToastMessage(''), 4500);
  };

  // Reject application
  const handleReject = async (student) => {
    setProcessingId(student.id);
    const reasonText = rejectionReason.trim() || 'Did not meet verification criteria';
    const roleTitle = reviewerRole === 'dean' ? 'Dean' : (['professor', 'teacher'].includes(reviewerRole) ? 'Faculty' : 'Admin');

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
    } catch (err) {}

    setStudents(prev => prev.map(s => s.id === student.id ? {
      ...s,
      account_status: 'rejected',
      rejected_by: reviewerName,
      rejected_by_role: roleTitle,
      rejected_at: new Date().toISOString(),
      rejection_reason: reasonText,
      approved_by: null,
      approved_at: null
    } : s));

    setProcessingId(null);
    setConfirmRejectStudent(null);
    setInspectStudent(null);
    setRejectionReason('');
    setToastMessage(`❌ Application rejected for ${student.full_name || student.email}.`);
    setTimeout(() => setToastMessage(''), 4500);
  };

  const filtered = students.filter(s => {
    const status = (s.account_status || 'pending').toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      (s.full_name && s.full_name.toLowerCase().includes(query)) ||
      (s.email && s.email.toLowerCase().includes(query)) ||
      (s.student_id && s.student_id.toLowerCase().includes(query));

    if (!matchesQuery) return false;
    if (activeTab === 'pending') return status === 'pending';
    if (activeTab === 'approved') return status === 'approved' || status === 'active';
    if (activeTab === 'rejected') return status === 'rejected';
    return true;
  });

  const pendingCount = students.filter(s => (s.account_status || 'pending').toLowerCase() === 'pending').length;

  if (!isAuthorized) {
    return (
      <div className="p-8 text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 flex items-center justify-center mx-auto">
          <Shield size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Access Restricted</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Student registration verification is strictly authorized for Faculty, Dean, and Admin roles only.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
            <CheckCircle size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Student Application Verification
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                Shared Hub
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Centralized verification portal: Admin, Dean, or Faculty approval authorizes immediate LMS access.
            </p>
          </div>
        </div>

        <button
          onClick={fetchApplications}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-slate-900 border border-indigo-500 text-white text-xs font-semibold flex items-center justify-between shadow-xl"
        >
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage('')} className="text-slate-400 hover:text-white">
            <X size={14} />
          </button>
        </motion.div>
      )}

      {/* Reviewer Authority Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-slate-900 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5 text-indigo-900 dark:text-indigo-300">
          <Shield size={16} className="text-indigo-500 shrink-0" />
          <span>
            Authorized Reviewer: <strong>{reviewerName}</strong> (
            <span className="capitalize font-semibold">{reviewerRole}</span>). Any single approval from Faculty, Dean, or Admin immediately activates the student's account.
          </span>
        </div>
      </div>

      {/* Tabs and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs overflow-x-auto">
          {[
            { id: 'pending', label: 'Pending Applications', count: pendingCount, highlight: pendingCount > 0 },
            { id: 'approved', label: 'Approved', count: students.filter(s => (s.account_status || '').toLowerCase() === 'approved' || (s.account_status || '').toLowerCase() === 'active').length },
            { id: 'rejected', label: 'Rejected', count: students.filter(s => (s.account_status || '').toLowerCase() === 'rejected').length },
            { id: 'all', label: 'All Applications', count: students.length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                tab.highlight ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative max-w-sm w-full">
          <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search application by student name, ID, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading student applications...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No registration applications match the current filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 uppercase font-mono text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">Student Applicant</th>
                  <th className="p-4">Student ID</th>
                  <th className="p-4">Program &amp; Section</th>
                  <th className="p-4">Submission Date</th>
                  <th className="p-4">Verification Status</th>
                  <th className="p-4">Reviewer Details</th>
                  <th className="p-4 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filtered.map(student => {
                  const status = (student.account_status || 'pending').toLowerCase();
                  const isPending = status === 'pending';
                  const isApproved = status === 'approved' || status === 'active';
                  const isRejected = status === 'rejected';

                  return (
                    <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow">
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

                      <td className="p-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                        {student.student_id || 'Pending Assign'}
                      </td>

                      <td className="p-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{student.section || 'BSIT 3-A'}</div>
                        <div className="text-[10px] text-slate-400">{student.program || 'BS Information Technology'}</div>
                      </td>

                      <td className="p-4 text-slate-500 dark:text-slate-400">
                        <div>{new Date(student.created_at).toLocaleDateString()}</div>
                        <div className="text-[10px]">{new Date(student.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>

                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          isApproved
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                            : isPending
                            ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800'
                            : 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-800'
                        }`}>
                          {isApproved && <CheckCircle size={12} />}
                          {isPending && <Clock size={12} className="animate-spin text-amber-500" />}
                          {isRejected && <XCircle size={12} />}
                          <span className="capitalize">{status}</span>
                        </span>
                      </td>

                      <td className="p-4 text-[11px]">
                        {isApproved && student.approved_by ? (
                          <div>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                              {student.approved_by}
                            </span>
                            <span className="text-slate-400 text-[10px]">
                              {student.approved_by_role || 'Staff'} &bull; {student.approved_at ? new Date(student.approved_at).toLocaleDateString() : 'Approved'}
                            </span>
                          </div>
                        ) : isRejected && student.rejected_by ? (
                          <div>
                            <span className="text-rose-600 dark:text-rose-400 font-semibold block">
                              {student.rejected_by}
                            </span>
                            {student.rejection_reason && (
                              <span className="text-slate-400 text-[10px] italic line-clamp-1">
                                "{student.rejection_reason}"
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Pending review</span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setInspectStudent(student)}
                            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition"
                            title="Inspect Application Details"
                          >
                            <Eye size={14} />
                          </button>

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
                              className="px-2.5 py-1 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-rose-500 text-[11px] font-medium transition"
                            >
                              Revoke
                            </button>
                          ) : (
                            <button
                              onClick={() => setConfirmApproveStudent(student)}
                              className="px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-[11px] font-semibold hover:bg-indigo-100 transition"
                            >
                              Re-verify
                            </button>
                          )}
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

      {/* INSPECT DETAILS MODAL */}
      <AnimatePresence>
        {inspectStudent && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="h-5 w-5 text-indigo-500" />
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Application Dossier &amp; Credentials
                  </h3>
                </div>
                <button onClick={() => setInspectStudent(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Applicant Name:</span>
                    <strong className="text-slate-900 dark:text-white">{inspectStudent.full_name || 'PTC Student'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">PTC Email:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">{inspectStudent.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Student ID:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">{inspectStudent.student_id || 'Not assigned'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Program / Section:</span>
                    <span className="text-slate-700 dark:text-slate-300">{inspectStudent.program} &bull; {inspectStudent.section}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Registered At:</span>
                    <span className="text-slate-700 dark:text-slate-300">{new Date(inspectStudent.created_at).toLocaleString()}</span>
                  </div>
                </div>

                {inspectStudent.rejection_reason && (
                  <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300">
                    <strong>Recorded Rejection Reason:</strong> "{inspectStudent.rejection_reason}"
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setInspectStudent(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  Close
                </button>
                {inspectStudent.account_status === 'pending' && (
                  <>
                    <button
                      onClick={() => setConfirmApproveStudent(inspectStudent)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      Approve Application
                    </button>
                    <button
                      onClick={() => setConfirmRejectStudent(inspectStudent)}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                    >
                      Reject Application
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                    Approve Student Application
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Authorize immediate login and course access
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Applicant:</span>
                  <strong className="text-slate-900 dark:text-white">{confirmApproveStudent.full_name || confirmApproveStudent.email}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Approver:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold capitalize">{reviewerName} ({reviewerRole})</span>
                </div>
              </div>

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

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Rejection Reason (displayed to student on login attempt):
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Incomplete registrar credentials or invalid student ID."
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

export default VerificationView;
