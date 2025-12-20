import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function UserAnalytics() {
  const [analytics, setAnalytics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { quizId } = useParams();

  useEffect(() => {
    Promise.all([
      fetch(
        "http://localhost:3000/quizit/question-analytics-user/participant/bbe91674-2977-4bc2-81b9-72089e3b8752"
      ).then((res) => res.json()),

      fetch(`http://localhost:3000/quizit/questions/${quizId}`).then((res) =>
        res.json()
      ),
    ])
      .then(([analyticsData, questionData]) => {
        setAnalytics(analyticsData);
        setQuestions(questionData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch analytics", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-6">Loading user analytics...</div>;

  const analyticsMap = analytics.reduce((acc, a) => {
    acc[a.questionId] = a;
    return acc;
  }, {});
  const totalCorrect = analytics.filter((a) => a.isCorrect).length;
  const totalQuestions = questions.length;
  const totalTimeSpent = analytics.reduce(
    (sum, a) => sum + (a.timeSpent || 0),
    0
  );

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Quiz Review</h1>

        <div className="mt-2 flex flex-wrap gap-4 text-gray-700">
          <p>
            🎯 Score:{" "}
            <span className="font-semibold text-green-600">
              {totalCorrect} / {totalQuestions}
            </span>
          </p>

          <p>
            ⏱ Total Time Spent:{" "}
            <span className="font-semibold">{formatTime(totalTimeSpent)}</span>
          </p>
        </div>
      </div>

      {questions.map((q, index) => {
        const qa = analyticsMap[q.questionId];
        const correctKey = q.correctAnswer?.key;

        return (
          <div
            key={q.questionId}
            className="border rounded-lg p-5 mb-6 bg-white shadow-sm"
          >
            {/* Question */}
            <h2 className="font-semibold mb-4">
              Q{index + 1}. {q.content}
            </h2>

            {/* Options */}
            <div className="space-y-2">
              {Object.entries(q.options).map(([key, value]) => {
                const isSelected = qa?.selectedAnswer?.key === key;
                const isCorrect = correctKey === key;

                return (
                  <div
                    key={key}
                    className={`p-2 border rounded flex justify-between items-center
                  ${isCorrect ? "border-green-500 bg-green-50" : ""}
                  ${isSelected && !isCorrect ? "border-red-500 bg-red-50" : ""}
                `}
                  >
                    <span>
                      <strong>{key}.</strong> {value}
                    </span>

                    <span className="text-sm">
                      {isCorrect && "✅ Correct"}
                      {isSelected && !isCorrect && "❌ Selected Answer"}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Analytics */}
            {qa && (
              <div className="mt-4 text-sm text-gray-700 grid grid-cols-2 gap-2">
                <p>Time Spent: {qa.timeSpent} sec</p>
                <p>
                  Result:{" "}
                  <span
                    className={`font-semibold ${
                      qa.isCorrect ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {qa.isCorrect ? "Correct" : "Wrong"}
                  </span>
                </p>
                <p>Tab Switch Count: {qa.tabSwitchCount}</p>
                <p>
                  Correct Answer:{" "}
                  <strong>
                    {correctKey}. {q.options?.[correctKey]}
                  </strong>
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
