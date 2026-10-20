import React, { useState } from "react";
import {
  Mail,
  Shield,
  Award,
  Users,
  GraduationCap,
  Copy,
  Check
} from "lucide-react";

/**
 * UserAccountInfo
 * Reusable component to display the currently authenticated user
 * in the sidebar (Email address, Role badge, Name, and Avatar).
 */
export const UserAccountInfo = ({
  user,
  userProfile,
  isDarkMode = false,
  onProfileClick,
  isCollapsed = false,
  className = ""
}) => {
  const [copied, setCopied] = useState(false);

  // 1. Resolve authentic user email
  const email =
    user?.email ||
    userProfile?.email ||
    (typeof user === "string" && user.includes("@") ? user : null) ||
    "user@paterostechnologicalcollege.edu.ph";

  // 2. Resolve authentic user role
  const rawRole = (
    user?.role ||
    userProfile?.role ||
    "student"
  ).toLowerCase();

  // 3. Resolve display name
  const name =
    user?.name ||
    userProfile?.name ||
    (email ? email.split("@")[0].replace(/\./g, " ") : "PTC Account");

  // 4. Role-based badge config (Design system matching)
  const getRoleConfig = (roleStr) => {
    switch (roleStr) {
      case "admin":
      case "administrator":
        return {
          label: "Admin",
          fullName: "System Administrator",
          icon: Shield,
          badgeBg: isDarkMode ? "bg-violet-500/15 text-violet-300 border-violet-500/30" : "bg-violet-100 text-violet-700 border-violet-200",
          avatarGradient: "from-violet-600 to-indigo-600",
          ringColor: "ring-violet-500/40"
        };
      case "dean":
        return {
          label: "Dean",
          fullName: "College Dean",
          icon: Award,
          badgeBg: isDarkMode ? "bg-amber-500/15 text-amber-300 border-amber-500/30" : "bg-amber-100 text-amber-800 border-amber-200",
          avatarGradient: "from-amber-500 to-orange-600",
          ringColor: "ring-amber-500/40"
        };
      case "professor":
      case "teacher":
      case "faculty":
        return {
          label: "Faculty",
          fullName: "Faculty / Instructor",
          icon: Users,
          badgeBg: isDarkMode ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" : "bg-emerald-100 text-emerald-800 border-emerald-200",
          avatarGradient: "from-emerald-600 to-teal-700",
          ringColor: "ring-emerald-500/40"
        };
      case "student":
      default:
        return {
          label: "Student",
          fullName: "Enrolled Student",
          icon: GraduationCap,
          badgeBg: isDarkMode ? "bg-blue-500/15 text-blue-300 border-blue-500/30" : "bg-blue-100 text-blue-700 border-blue-200",
          avatarGradient: "from-blue-600 to-indigo-600",
          ringColor: "ring-blue-500/40"
        };
    }
  };

  const roleConfig = getRoleConfig(rawRole);
  const RoleIcon = roleConfig.icon;

  // Initials for avatar fallback
  const getInitials = (str) => {
    if (!str) return "U";
    const parts = str.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  const initials = userProfile?.avatarInitial || getInitials(name);
  const avatarUrl = userProfile?.customAvatarUrl;

  const handleCopyEmail = (e) => {
    e.stopPropagation();
    if (!email) return;
    navigator.clipboard?.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Collapsed Sidebar rendering
  if (isCollapsed) {
    return (
      <div
        className={`relative flex items-center justify-center p-2 rounded-2xl transition-all cursor-pointer ${
          isDarkMode ? "hover:bg-slate-800/60" : "hover:bg-slate-100"
        } ${className}`}
        title={`${name} (${roleConfig.fullName})\n${email}`}
        onClick={onProfileClick}
      >
        <div className={`w-10 h-10 rounded-xl relative flex items-center justify-center text-white font-bold text-xs shadow-md bg-gradient-to-tr ${roleConfig.avatarGradient}`}>
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover rounded-xl" />
          ) : (
            <span>{initials}</span>
          )}
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0f172a]" />
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onProfileClick}
      role={onProfileClick ? "button" : undefined}
      tabIndex={onProfileClick ? 0 : undefined}
      className={`group relative p-3 rounded-2xl border transition-all duration-200 mb-4 select-none ${
        isDarkMode
          ? "bg-slate-900/80 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 shadow-lg shadow-black/20"
          : "bg-slate-50 border-slate-200/90 hover:border-slate-300 hover:bg-white shadow-sm"
      } ${onProfileClick ? "cursor-pointer" : ""} ${className}`}
    >
      <div className="flex items-center gap-3">
        {/* Avatar with Status Indicator */}
        <div className="relative shrink-0">
          <div
            className={`w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center font-bold text-xs text-white shadow-md bg-gradient-to-tr ${roleConfig.avatarGradient} ring-2 ${roleConfig.ringColor} transition-transform group-hover:scale-105`}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          {/* Active indicator dot */}
          <span
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-sm"
            title="Active Account Session"
          />
        </div>

        {/* User Details */}
        <div className="min-w-0 flex-1 overflow-hidden">
          {/* Top row: Name and Role Badge */}
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <span
              className={`text-xs font-bold truncate leading-tight transition-colors ${
                isDarkMode ? "text-white group-hover:text-blue-300" : "text-slate-900 group-hover:text-blue-600"
              }`}
              title={name}
            >
              {name}
            </span>

            {/* Role Badge */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0 ${roleConfig.badgeBg}`}
              title={`Role: ${roleConfig.fullName}`}
            >
              <RoleIcon className="w-2.5 h-2.5" />
              <span>{roleConfig.label}</span>
            </span>
          </div>

          {/* Bottom row: Email Address with hover copy */}
          <div className="flex items-center justify-between gap-1 text-[11px]">
            <div
              className={`flex items-center gap-1 truncate font-mono ${
                isDarkMode ? "text-slate-400" : "text-slate-600"
              }`}
              title={email}
            >
              <Mail className="w-3 h-3 shrink-0 opacity-70" />
              <span className="truncate">{email}</span>
            </div>

            <button
              type="button"
              onClick={handleCopyEmail}
              title={copied ? "Email copied!" : "Copy email address"}
              className={`p-1 rounded-md transition-colors opacity-0 group-hover:opacity-100 shrink-0 ${
                isDarkMode
                  ? "hover:bg-slate-800 text-slate-400 hover:text-white"
                  : "hover:bg-slate-200 text-slate-500 hover:text-slate-800"
              }`}
            >
              {copied ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccountInfo;
