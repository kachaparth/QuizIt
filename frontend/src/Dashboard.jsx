import { useState, useEffect } from "react";
import { Link } from "react-router";

export default function Dashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const hostId = "a94d6b81-bfff-4742-8dbe-92d684a93000";

  useEffect(() => {
    fetch(`http://localhost:3000/quizit/quiz/host/${hostId}`)
      .then((res) => res.json())
      .then((data) => {
        setQuizzes(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-cyan-700">
        Loading your quizzes...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Quiz Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Create, manage, and run your quizzes
            </p>
          </div>

          <div className="flex gap-3 mt-4 md:mt-0">
            <button
              className="px-5 py-2 rounded-lg bg-white border border-cyan-200
              text-cyan-700 hover:bg-cyan-50 transition"
            >
              Join Quiz
            </button>

            <button
              className="px-5 py-2 rounded-lg bg-orange-500 text-white
              hover:bg-orange-600 transition shadow"
            >
              Create Quiz
            </button>
          </div>
        </div>

        {/* Created Quizzes */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Your Quizzes
        </h2>

        {quizzes.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center shadow-sm">
            <p className="text-gray-500 mb-4">
              You haven’t created any quizzes yet
            </p>
            <button className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition">
              Create Your First Quiz
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {quizzes.map((quiz) => (
              <div
                key={quiz.quizId}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {quiz.quizName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Mode: <span className="font-medium">{quiz.mode}</span>
                    </p>
                  </div>

                  <span className="px-3 py-1 text-xs rounded-full bg-cyan-100 text-cyan-700">
                    Active
                  </span>
                </div>

                <div className="flex gap-3 flex-wrap">
                  <button className="dashboard-btn">
                    Edit
                  </button>

                  <button className="dashboard-btn">
                    Analytics
                  </button>

                  <Link to={`/runQuiz/${quiz.quizId}`}>
                    <button className="dashboard-btn-primary">
                      Run Quiz
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
