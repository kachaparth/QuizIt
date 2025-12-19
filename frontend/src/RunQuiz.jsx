import { useState } from "react";

const quizData = {
  quizId: "c1b0c1f1-1111-4b2f-aaaa-999999999999",
  quizName: "Java Basics Quiz",
  mode: "SERVER",
  questions: [
    {
      questionId: "q1",
      questionText: "Which keyword is used to inherit a class in Java?",
      options: ["this", "super", "extends", "implements"],
      correctIndex: 2,
    },
    {
      questionId: "q2",
      questionText: "Which of these is NOT a primitive data type?",
      options: ["int", "float", "String", "boolean"],
      correctIndex: 2,
    },
    {
      questionId: "q3",
      questionText: "Which collection does not allow duplicate values?",
      options: ["List", "ArrayList", "Set", "Map"],
      correctIndex: 2,
    },
  ],
};

export default function RunQuiz() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);

  const currentQuestion = quizData.questions[currentIndex];

  const handleSelect = (optionIndex) => {
    setAnswers({
      ...answers,
      [currentQuestion.questionId]: optionIndex,
    });
  };

  const handleNext = () => {
    if (currentIndex < quizData.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setFinished(true);
    }
  };

  const calculateScore = () => {
    let score = 0;
    quizData.questions.forEach((q) => {
      if (answers[q.questionId] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  /* ================= RESULT SCREEN ================= */
  if (finished) {
    const score = calculateScore();

    return (
      <div className="p-8 max-w-3xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Quiz Completed 🎉</h1>
        <p className="text-lg mb-2">{quizData.quizName}</p>
        <p className="text-xl font-semibold mb-6">
          Score: {score} / {quizData.questions.length}
        </p>

        <button
          onClick={() => alert("Result stored (dummy)")}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          View Analytics
        </button>
      </div>
    );
  }

  /* ================= QUIZ SCREEN ================= */
  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{quizData.quizName}</h1>
        <p className="text-sm text-gray-500">
          Mode: {quizData.mode} | Question {currentIndex + 1} of{" "}
          {quizData.questions.length}
        </p>
      </div>

      {/* Question Card */}
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">
          {currentQuestion.questionText}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const selected =
              answers[currentQuestion.questionId] === index;

            return (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                className={`w-full text-left px-4 py-2 border rounded
                  ${
                    selected
                      ? "bg-blue-100 border-blue-500"
                      : "hover:bg-gray-50"
                  }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleNext}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            {currentIndex === quizData.questions.length - 1
              ? "Finish Quiz"
              : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
