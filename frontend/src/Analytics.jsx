import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Analytics() {
    const { quizId } = useParams();
    const [analytics, setAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 🔹 Dummy data (replace with backend API later)
        const dummyData = [
            {
                qauId: "1",
                participantName: "Parth",
                questionText: "What is Binary Search?",
                timeSpent: 30,
                selectedAnswer: { option: "A" },
                isCorrect: true,
                tabSwitchCount: 1,
            },
            {
                qauId: "2",
                participantName: "Krishna",
                questionText: "Time complexity of Merge Sort?",
                timeSpent: 45,
                selectedAnswer: { option: "C" },
                isCorrect: false,
                tabSwitchCount: 3,
            },
        ];

        setTimeout(() => {
            setAnalytics(dummyData);
            setLoading(false);
        }, 500);
    }, [quizId]);

    if (loading) {
        return <div className="p-8">Loading analytics...</div>;
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">
                Quiz Analytics
            </h1>

            <table className="w-full border-collapse border">
                <thead>
                <tr className="bg-gray-100">
                    <th className="border p-2">Participant</th>
                    <th className="border p-2">Question</th>
                    <th className="border p-2">Time Spent (s)</th>
                    <th className="border p-2">Selected</th>
                    <th className="border p-2">Correct</th>
                    <th className="border p-2">Tab Switch</th>
                </tr>
                </thead>

                <tbody>
                {analytics.map((row) => (
                    <tr key={row.qauId}>
                        <td className="border p-2">{row.participantName}</td>
                        <td className="border p-2">{row.questionText}</td>
                        <td className="border p-2">{row.timeSpent}</td>
                        <td className="border p-2">
                            {row.selectedAnswer?.option}
                        </td>
                        <td className="border p-2">
                            {row.isCorrect ? "✅" : "❌"}
                        </td>
                        <td className="border p-2">{row.tabSwitchCount}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
