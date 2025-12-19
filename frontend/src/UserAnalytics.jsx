import { useEffect, useState } from "react";

export default function UserAnalytics() {
  const [analytics, setAnalytics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(
        "http://localhost:3000/quizit/question-analytics-user/participant/bbe91674-2977-4bc2-81b9-72089e3b8752"
      ).then((res) => res.json()),

      fetch(
        "http://localhost:3000/quizit/questions/41d1237d-8a7f-4472-a14c-dffc7f48ef84"
      ).then((res) => res.json()),
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

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">User Analytics – Quiz Review</h1>

      {questions.map((q, index) => {
        const qa = analyticsMap[q.questionId];

        return (
          <div key={q.questionId} className="border rounded-lg p-4 mb-6">
            <h2 className="font-semibold mb-3">
              Q{index + 1}. {q.content}
            </h2>

            {/* Options */}
            <div className="space-y-2">
              {Object.entries(q.options).map(([key, value]) => {
                const isSelected = qa?.selectedAnswer?.key === key;

                return (
                  <div
                    key={key}
                    className={`p-2 border rounded
                      ${isSelected ? "border-blue-500 bg-blue-50" : ""}
                    `}
                  >
                    <strong>{key}.</strong> {value}
                    {isSelected && " (Selected)"}
                  </div>
                );
              })}
            </div>

            {/* Analytics info */}
            {qa && (
              <div className="mt-3 text-sm text-gray-700">
                <p>Time Spent: {qa.timeSpent} sec</p>
                <p>Correct: {qa.isCorrect ? "Yes" : "No"}</p>
                <p>Tab Switch Count: {qa.tabSwitchCount}</p>
                <p>
                  Correct Answer:{" "}
                  <strong>
                    {q.correctAnswer?.key}. {q.options?.[q.correctAnswer?.key]}
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
