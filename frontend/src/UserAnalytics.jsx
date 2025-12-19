import { useEffect, useState } from "react";

export default function UserAnalytics() {
    const participantId = "bbe91674-2977-4bc2-81b9-72089e3b8752";

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadAnalytics() {
            try {
                // 1️⃣ Fetch analytics for participant
                const analyticsRes = await fetch(
                    `http://localhost:3000/quizit/question-analytics-user/participant/${participantId}`
                );
                const analyticsList = await analyticsRes.json();

                // 2️⃣ Fetch question details for each analytics entry
                const mergedData = await Promise.all(
                    analyticsList.map(async (qa) => {
                        const qRes = await fetch(
                            `http://localhost:3000/quizit/question/${qa.questionId}`
                        );
                        const question = await qRes.json();

                        return {
                            questionId: qa.questionId,
                            questionText: question.content,
                            options: question.options,
                            correctAnswer: question.correctAnswer?.answer,
                            selectedAnswer:
                                qa.selectedAnswer?.answer || qa.selectedAnswer?.key,
                            isCorrect: qa.isCorrect,
                            timeSpent: qa.timeSpent,
                            tabSwitchCount: qa.tabSwitchCount,
                        };
                    })
                );

                setQuestions(mergedData);
                setLoading(false);
            } catch (err) {
                console.error("Failed to load user analytics", err);
                setLoading(false);
            }
        }

        loadAnalytics();
    }, []);

    if (loading) return <div className="p-6">Loading user analytics...</div>;

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">
                User Analytics – Participant
            </h1>

            {questions.map((q, index) => (
                <div
                    key={q.questionId}
                    className="border rounded-lg p-4 mb-6"
                >
                    <h2 className="font-semibold mb-3">
                        Q{index + 1}. {q.questionText}
                    </h2>

                    {/* Options */}
                    <div className="space-y-2">
                        {Object.entries(q.options).map(([key, value]) => {
                            const isSelected = q.selectedAnswer === key;
                            const isCorrect = q.correctAnswer === key;

                            return (
                                <div
                                    key={key}
                                    className={`p-2 border rounded
                    ${isSelected ? "border-blue-500 bg-blue-50" : ""}
                    ${isCorrect ? "border-green-500 bg-green-50" : ""}
                  `}
                                >
                                    <strong>{key}.</strong> {value}
                                    {isSelected && " (Selected)"}
                                    {isCorrect && " ✅"}
                                </div>
                            );
                        })}
                    </div>

                    {/* Meta info */}
                    <div className="mt-3 text-sm text-gray-700">
                        <p>⏱ Time Spent: {q.timeSpent} sec</p>
                        <p>🧠 Correct: {q.isCorrect ? "Yes" : "No"}</p>
                        <p>🚨 Tab Switch Count: {q.tabSwitchCount}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
