import { useState } from "react";

export default function CreateQuiz() {
  const [quiz, setQuiz] = useState({
    quizName: "",
    quizType: "",
    mode: "SERVER",
    startTime: "",
    endTime: "",
  });

  const handleChange = (e) => {
    setQuiz({
      ...quiz,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Dummy payload (similar to QuizDto)
    const payload = {
      quizId: crypto.randomUUID(),
      quizName: quiz.quizName,
      quizType: quiz.quizType || null,
      mode: quiz.mode,
      startTime: quiz.startTime || null,
      endTime: quiz.endTime || null,
      host: "a94d6b81-bfff-4742-8dbe-92d684a93000", // dummy host
      createdAt: new Date().toISOString(),
    };

    console.log("Quiz Created (Dummy):", payload);
    alert("Quiz created successfully (dummy)");
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create Quiz</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-lg p-6 space-y-5 shadow-sm"
      >
        {/* Quiz Name */}
        <div>
          <label className="block font-medium mb-1">Quiz Name</label>
          <input
            type="text"
            name="quizName"
            value={quiz.quizName}
            onChange={handleChange}
            required
            placeholder="Enter quiz name"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Quiz Type */}
        <div>
          <label className="block font-medium mb-1">Quiz Type</label>
          <input
            type="text"
            name="quizType"
            value={quiz.quizType}
            onChange={handleChange}
            placeholder="MCQ / TECHNICAL / PRACTICE"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Quiz Mode */}
        <div>
          <label className="block font-medium mb-1">Quiz Mode</label>
          <select
            name="mode"
            value={quiz.mode}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="SERVER">SERVER</option>
            <option value="RANDOMIZED">RANDOMIZED</option>
            <option value="LAN">LAN</option>
          </select>
        </div>

        {/* Start Time */}
        <div>
          <label className="block font-medium mb-1">Start Time</label>
          <input
            type="datetime-local"
            name="startTime"
            value={quiz.startTime}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* End Time */}
        <div>
          <label className="block font-medium mb-1">End Time</label>
          <input
            type="datetime-local"
            name="endTime"
            value={quiz.endTime}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            className="px-4 py-2 border rounded"
            onClick={() => alert("Cancelled")}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            Create Quiz
          </button>
        </div>
      </form>
    </div>
  );
}
