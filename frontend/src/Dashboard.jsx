import { useState, useEffect } from "react";

export default function Dashboard() {
    const [quizzes, setQuizzes] = useState([
        {
            quizId: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
            quizName: "DSA Basics",
            host: "a94d6b81-bfff-4742-8dbe-92d684a93000",
            quizType: "TECHNICAL",
            mode: "SERVER",
            startTime: "2025-01-10T10:00:00Z",
            endTime: "2025-01-10T11:00:00Z",
            createdAt: "2025-01-01T09:30:00Z",
        },
        {
            quizId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            quizName: "C Language MCQ",
            host: "c18c4fd8-4c67-44e5-8a6a-52b8fdfb3d12",
            quizType: "MCQ",
            mode: "RANDOMIZED",
            startTime: "2025-01-15T14:00:00Z",
            endTime: "2025-01-15T15:00:00Z",
            createdAt: "2025-01-05T08:45:00Z",
        },
        {
            quizId: "9b2e5f10-2a6f-4e41-a4aa-33c88a9bcd99",
            quizName: "LAN Quiz Trial",
            host: "f7a1a9f1-18dd-4f47-9c22-12c9f7d0a456",
            quizType: "PRACTICE",
            mode: "LAN",
            startTime: null,
            endTime: null,
            createdAt: "2025-01-07T12:00:00Z",
        },
    ]);

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
                                <button
                                    className="px-3 py-1 border rounded hover:bg-gray-100"
                                    onClick={() => alert(`Run quiz for ${quiz.quizId}`)}
                                >
                                    ▶️ RunQuiz
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
