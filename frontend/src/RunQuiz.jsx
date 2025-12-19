import { useState, useEffect } from "react";


export default function RunQuiz() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentQuestion = questions[currentIndex];

  const sendQuestionAnalytics = () => {
    if (!currentQuestion) return; 

    const selected = answers[currentQuestion.questionId] ?? null;

    const payload = {
      quizId: currentQuestion.quizId,
      questionId: currentQuestion.questionId,
      selectedOption: selected,
      correctOption: currentQuestion.correctAnswer.key,
      isCorrect: selected === currentQuestion.correctAnswer.key,
      timeSpent: currentQuestion.duration - timeLeft,
    };

    console.log("Sending analytics:", payload);
  };

  const handleNext = () => {
    sendQuestionAnalytics();

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setFinished(true);
    }
  };

  useEffect(() => {
    if (currentQuestion) {
      setTimeLeft(currentQuestion.duration);
    }
  }, [currentIndex, currentQuestion]);

  useEffect(() => {
    if (loading || finished || !currentQuestion) return;
    if (timeLeft === 0) {
      handleNext();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, finished]);

  useEffect(() => {
    fetch(
      "http://localhost:3000/quizit/questions/41d1237d-8a7f-4472-a14c-dffc7f48ef84"
    )
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch quizzes", err);
        setLoading(false);
      });
  }, []);

  const handleSelect = (optionKey) => {
    setAnswers({
      ...answers,
      [currentQuestion.questionId]: optionKey,
    });
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q) => {
      if (answers[q.questionId] === q.correctAnswer.key) {
        score++;
      }
    });
    return score;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Loading quizzes...
      </div>
    );
  }

  if (finished) {
    const score = calculateScore();

    return (
      <div className="p-8 max-w-3xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Quiz Completed 🎉</h1>
        <p className="text-lg mb-2">{questions.quizId}</p>
        <p className="text-xl font-semibold mb-6">
          Score: {score} / {questions.length}
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
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{questions.quizId}</h1>
          <p className="text-sm text-gray-500">
            Mode: {questions.mode} | Question {currentIndex + 1} of{" "}
            {questions.length}
          </p>
        </div>
        <div className="text-red-600 font-semibold">⏱️ {timeLeft}s</div>
      </div>
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">
          {currentQuestion.content}
        </h2>

        <div className="space-y-3">
          {Object.entries(currentQuestion.options).map(([key, value]) => {
            const selected = answers[currentQuestion.questionId] === key;

            return (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                className={`w-full text-left px-4 py-2 border rounded
                    ${
                      selected
                        ? "bg-blue-100 border-blue-500"
                        : "hover:bg-gray-50"
                    }`}
              >
                <strong>{key}.</strong> {value}
              </button>
            );
          })}
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={handleNext}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            {currentIndex === questions.length - 1
              ? "Finish Quiz"
              : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
