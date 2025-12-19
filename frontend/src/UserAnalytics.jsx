const dummyAnalytics = {
    participantName: "Parth",
    questions: [
        {
            questionId: "q1",
            questionText: "What is the time complexity of Binary Search?",
            options: {
                A: "O(n)",
                B: "O(log n)",
                C: "O(n log n)",
                D: "O(1)",
            },
            selectedAnswer: "B",
            correctAnswer: "B",
            isCorrect: true,
            timeSpent: 25,
            tabSwitchCount: 1,
        },
        {
            questionId: "q2",
            questionText: "Which data structure uses FIFO?",
            options: {
                A: "Stack",
                B: "Tree",
                C: "Queue",
                D: "Graph",
            },
            selectedAnswer: "C",
            correctAnswer: "C",
            isCorrect: true,
            timeSpent: 18,
            tabSwitchCount: 0,
        },
        {
            questionId: "q3",
            questionText: "Which sorting algorithm is stable?",
            options: {
                A: "Quick Sort",
                B: "Heap Sort",
                C: "Merge Sort",
                D: "Selection Sort",
            },
            selectedAnswer: "A",
            correctAnswer: "C",
            isCorrect: false,
            timeSpent: 40,
            tabSwitchCount: 3,
        },
    ],
};

import { useEffect, useState } from "react";

export default function UserAnalytics() {
    const [data, setData] = useState(null);

    useEffect(() => {
        // simulate backend response
        setData(dummyAnalytics);
    }, []);

    if (!data) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">
                User Analytics – {data.participantName}
            </h1>

            {data.questions.map((q, index) => (
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
