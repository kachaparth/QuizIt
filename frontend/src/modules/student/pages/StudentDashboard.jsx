import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router"; // Note: typically 'react-router-dom' in v6
import useAuth from "../../../stores/store";
import useHistoryStore from "../../../stores/historyStore";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { getAllowedUserQuizzes } from "../../../services/authService"; // Adjust path as needed
import {
  Layout,
  Search,
  Trophy,
  Clock,
  BarChart3,
  BookOpen,
  Calendar,
  Zap,
  RefreshCw,
  Mail,
  PlayCircle,
} from "lucide-react";

export default function StudentDashboard() {
  // --- Store Hooks & State ---
  const checkLogin = useAuth((s) => s.checkLogin);
  const user = useAuth((s) => s.user);

  const attendedQuizzes = useHistoryStore((s) => s.history);
  const loadingHistory = useHistoryStore((s) => s.loading);
  const fetchHistory = useHistoryStore((s) => s.fetchHistory);

  const navigate = useNavigate();

  // Local state for tabs and invited quizzes
  const [activeTab, setActiveTab] = useState("invited"); // 'invited' | 'participated'
  const [invitedQuizzes, setInvitedQuizzes] = useState([]);
  const [loadingInvited, setLoadingInvited] = useState(false);

  // --- Auth & Initial Fetch ---
  useEffect(() => {
    if (!checkLogin()) {
      navigate("/auth", { replace: true });
      return;
    }

    if (user?.id) {
      fetchHistory(user.id);
      fetchInvitedQuizzes();
    }
  }, [user?.id, checkLogin, fetchHistory, navigate]);

  // --- Helpers ---
  const fetchInvitedQuizzes = async () => {
    setLoadingInvited(true);
    try {
      const data = await getAllowedUserQuizzes();
      console.log(data);
      setInvitedQuizzes(data);
    } catch (error) {
      toast.error("Failed to load invited quizzes.");
      console.error(error);
    } finally {
      setLoadingInvited(false);
    }
  };

  const handleRefresh = async () => {
    if (!user?.id) return;
    try {
      if (activeTab === "participated") {
        await fetchHistory(user.id, { force: true });
      } else {
        await fetchInvitedQuizzes();
      }
      toast.success("Updated successfully!");
    } catch (err) {
      toast.error("Failed to refresh");
    }
  };

  const calculatePercentage = (score, total) => {
    if (!total || total === 0) return 0;
    return Math.round((score / total) * 100);
  };

  const getScoreColorClass = (percentage) => {
    if (percentage >= 80) return "bg-emerald-500";
    if (percentage >= 50) return "bg-orange-400";
    return "bg-red-500";
  };

  // --- Animation Variants ---
  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVars = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
  };

  const isLoading =
    activeTab === "participated" ? loadingHistory : loadingInvited;

  if (
    loadingHistory &&
    attendedQuizzes.length === 0 &&
    loadingInvited &&
    invitedQuizzes.length === 0
  ) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cyan-700 text-white font-sans">
        <RefreshCw className="animate-spin mb-4" size={32} />
        <p className="text-lg font-medium">Fetching your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-600 to-cyan-700 px-6 py-10 font-sans selection:bg-orange-200">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                <Layout className="text-white" size={24} />
              </div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight">
                Quiz<span className="text-orange-300">It</span> Student
              </h1>
            </div>
            <p className="text-cyan-100 flex items-center gap-2 text-sm md:text-base">
              Welcome back,{" "}
              <span className="font-bold text-white uppercase tracking-wider text-xs bg-white/10 px-2 py-0.5 rounded-md">
                {user?.username}
              </span>
            </p>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-wrap items-center gap-3"
          >
            <div className="relative group">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-100 group-focus-within:text-white transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Enter Quiz Code..."
                className="pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-cyan-200 focus:outline-none focus:bg-white/20 transition-all w-48 md:w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-orange-400 text-white rounded-xl font-bold shadow-lg shadow-black/10 hover:bg-orange-500 hover:-translate-y-0.5 transition-all active:scale-95">
              <Zap size={18} fill="currentColor" />
              Join Quiz
            </button>
          </motion.div>
        </header>

        {/* Custom Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center bg-white/10 p-1 rounded-2xl backdrop-blur-md border border-white/20">
            {["invited", "participated"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-8 py-3 text-sm font-bold uppercase tracking-wider rounded-xl transition-colors z-10 ${
                  activeTab === tab
                    ? "text-cyan-800"
                    : "text-white hover:text-cyan-100"
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 bg-white rounded-xl shadow-md"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    style={{ zIndex: -1 }}
                  />
                )}
                {tab === "invited"
                  ? "Invited Quizzes"
                  : "Participation History"}
              </button>
            ))}
          </div>
        </div>

        {/* Section Heading & Refresh */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {activeTab === "invited"
              ? "Pending Invitations"
              : "Completed Quizzes"}
            <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
              {activeTab === "invited"
                ? invitedQuizzes.length
                : attendedQuizzes.length}
            </span>
          </h2>
          <button
            onClick={handleRefresh}
            className="text-cyan-100 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* --- TAB CONTENT: INVITED QUIZZES --- */}
        {activeTab === "invited" &&
          (invitedQuizzes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-lg border-2 border-dashed border-white/20 rounded-3xl p-16 text-center"
            >
              <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="text-white/50" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                No pending invitations
              </h3>
              <p className="text-cyan-100 mb-8 max-w-sm mx-auto">
                You have no upcoming quizzes scheduled. Check back later!
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVars}
              initial="hidden"
              animate="show"
              className="grid md:grid-cols-2 lg:grid-cols-2 gap-8"
            >
              {invitedQuizzes.map((quiz) => (
                <motion.div
                  key={quiz.quizId}
                  variants={cardVars}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="group relative bg-white rounded-2xl p-6 shadow-2xl shadow-black/10 overflow-hidden border border-white/20 flex flex-col"
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-cyan-400" />

                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.1em] px-2 py-1 rounded-md bg-orange-50 text-orange-600 border border-orange-100">
                          {quiz.invitationStatus || "INVITED"}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 group-hover:text-cyan-600 transition-colors">
                        {quiz.quizTitle}
                      </h3>
                    </div>
                  </div>

                  {/* Timing Stats */}
                  <div className="flex flex-col gap-3 mb-8 text-sm text-gray-500 flex-grow">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span>
                        Starts:{" "}
                        {quiz.startTime
                          ? new Date(quiz.startTime).toLocaleString()
                          : "TBA"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      <span>
                        Ends:{" "}
                        {quiz.endTime
                          ? new Date(quiz.endTime).toLocaleString()
                          : "TBA"}
                      </span>
                    </div>
                  </div>

                  {/* Footer Action Bar */}
                  <div className="flex items-center justify-end gap-3 pt-5 border-t border-gray-100 mt-auto">
                    {/* Register Button - Only shows if registerURL is not null */}
                    {quiz.registerURL && (
                      <Link
                        to={quiz.registerURL}
                        className="flex items-center gap-2 px-6 py-2.5 font-bold rounded-xl transition-all bg-white border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-50 active:scale-95"
                      >
                        Register
                      </Link>
                    )}

                    {/* Join Button - Only shows if joinURL is not null */}
                    {quiz.joinURL &&
                      (quiz.canJoin ? (
                        <Link
                          to={quiz.joinURL}
                          className="flex items-center gap-2 px-6 py-2.5 font-bold rounded-xl transition-all bg-cyan-600 text-white shadow-lg hover:bg-cyan-500 active:scale-95"
                        >
                          <PlayCircle size={18} />
                          Enter Quiz
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="flex items-center gap-2 px-6 py-2.5 font-bold rounded-xl transition-all bg-gray-100 text-gray-400 cursor-not-allowed"
                        >
                          <PlayCircle size={18} />
                          Not Open Yet
                        </button>
                      ))}

                    {/* Fallback if both URLs are null */}
                    {!quiz.registerURL && !quiz.joinURL && (
                      <span className="text-sm font-medium text-gray-400 italic px-2">
                        No actions available
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ))}

        {/* --- TAB CONTENT: PARTICIPATED QUIZZES (History) --- */}
        {activeTab === "participated" &&
          (attendedQuizzes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-lg border-2 border-dashed border-white/20 rounded-3xl p-16 text-center"
            >
              <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="text-white/50" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                No history found
              </h3>
              <p className="text-cyan-100 mb-8 max-w-sm mx-auto">
                You haven't joined any quizzes yet. Enter a code to start your
                first assessment!
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVars}
              initial="hidden"
              animate="show"
              className="grid md:grid-cols-2 lg:grid-cols-2 gap-8"
            >
              {attendedQuizzes.map((item) => {
                const percentage = calculatePercentage(
                  item.score,
                  item.totalQuestions,
                );
                const accentColor = getScoreColorClass(percentage);

                return (
                  <motion.div
                    key={item.id}
                    variants={cardVars}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    className="group relative bg-white rounded-2xl p-6 shadow-2xl shadow-black/10 overflow-hidden border border-white/20"
                  >
                    <div
                      className={`absolute top-0 left-0 w-2 h-full ${accentColor}`}
                    />
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-[0.1em] px-2 py-1 rounded-md bg-cyan-50 text-cyan-600 border border-cyan-100">
                            {item.mode || "COMPLETED"}
                          </span>
                          {percentage >= 90 && (
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md uppercase border border-orange-100">
                              <Trophy size={10} fill="currentColor" /> Top Tier
                            </span>
                          )}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 group-hover:text-cyan-600 transition-colors">
                          {item.quizName}
                        </h3>
                      </div>
                      {item.score !== undefined && (
                        <div className="text-right">
                          <div className="text-3xl font-black text-cyan-600 leading-none">
                            {percentage}%
                          </div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase mt-1">
                            Final Score
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Performance Stats */}
                    <div className="flex gap-6 mb-8 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span>
                          {item.date
                            ? new Date(item.date).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                      {item.score !== undefined && (
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-gray-400" />
                          <span>
                            {item.score}/{item.totalQuestions} Correct
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Footer Action Bar */}
                    <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                      <div className="flex items-center gap-4"></div>
                      <Link
                        to={`/quizAnalytics/${item.quizId}/participant/${item.id}`}
                        className="flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-cyan-600 text-cyan-600 text-sm font-bold rounded-xl hover:bg-cyan-50 transition-all active:scale-95"
                      >
                        <BarChart3 size={18} /> View Analytics
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ))}
      </div>
    </div>
  );
}
