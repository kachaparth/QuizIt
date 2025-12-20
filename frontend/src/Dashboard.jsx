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
        console.log("Fetched quizzes:", data);
        setQuizzes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch quizzes", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Loading quizzes...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Quiz Dashboard</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => alert("Navigate to Create Quiz page")}
        >
          ➕ Create Quiz
        </button>
      </div>

      {/* Quiz List */}
      {quizzes.length === 0 ? (
        <p className="text-gray-500">No quizzes created yet.</p>
      ) : (
        <div className="grid gap-4">
          {quizzes.map((quiz) => (
            <div
              key={quiz.quizId}
              className="border rounded-lg p-5 flex justify-between items-center shadow-sm"
            >
              <div>
                <h2 className="text-xl font-semibold">{quiz.quizName}</h2>
                <p className="text-gray-600">
                  Mode: <span className="font-medium">{quiz.mode}</span>
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  className="px-3 py-1 border rounded hover:bg-gray-100"
                  onClick={() => alert(`Edit quiz ${quiz.quizId}`)}
                >
                  ✏️ Edit
                </button>

                <button
                  className="px-3 py-1 border rounded hover:bg-gray-100"
                  onClick={() => alert(`View analytics for ${quiz.quizId}`)}
                >
                  📊 Analytics
                </button>
                <Link to={`/runQuiz/${quiz.quizId}`}>
                  <button className="px-3 py-1 border rounded hover:bg-gray-100">
                    ▶️ RunQuiz
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
