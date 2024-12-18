"use client";
import { useState, useEffect } from "react";
import matter from "gray-matter";

interface Question {
  content: string;
  data: {
    type: string;
    correctAnswer: string | string[];
    options?: string[];
  };
}

const quizFiles = [
  "/questions/question1.md",
  "/questions/question2.md",
  "/questions/question3.md",
  "/questions/question4.md",
  "/questions/question5.md",
];

const Quiz = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string | string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const loadQuestions = async () => {
      const loadedQuestions = await Promise.all(
        quizFiles.map(async (file) => {
          const res = await fetch(file);
          const text = await res.text();
          return matter(text);
        })
      );
      setQuestions(
        loadedQuestions.map(({ content, data }) => ({
          content,
          data: {
            type: data.type || "",
            correctAnswer: data.correctAnswer || "",
            options: data.options || [],
          },
        }))
      );
    };

    loadQuestions();
  }, []);

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (questions[currentIndex]?.data.type === "checkbox") {
      const value = e.target.value;
      setUserAnswer((prev) =>
        prev.includes(value)
          ? (prev as string[]).filter((item) => item !== value)
          : [...(prev as string[]), value]
      );
    } else {
      setUserAnswer(e.target.value);
    }
  };

  const checkAnswer = () => {
    const correct = questions[currentIndex]?.data.correctAnswer;
    if (Array.isArray(correct)) {
      setIsCorrect(
        Array.isArray(userAnswer) &&
          correct.sort().toString() === userAnswer.sort().toString()
      );
    } else {
      setIsCorrect(userAnswer === correct);
    }

    
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
    setUserAnswer([]);
    setIsCorrect(null);
  };

  const handleSubmit = () => {
    
    if (score === questions.length) {
      alert(`Congrats! You scored ${score}/${questions.length}`);
    } else {
      alert(`Oops, try again! You scored ${score}/${questions.length}`);
    }
  };

  if (questions.length === 0) return <p>Loading...</p>;

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 border-2 border-green-500 rounded-md">
      <h1 className="text-2xl font-bold text-green-600 mb-4">
        Question {currentIndex + 1}/{questions.length}
      </h1>

      
      <div dangerouslySetInnerHTML={{ __html: currentQuestion?.content || '' }} />

      <div className="mt-4">
        {currentQuestion?.data?.type === "checkbox" ? (
          <div>
            {(currentQuestion?.data?.options || []).map((option, idx) => (
              <div key={idx}>
                <label>
                  <input
                    type="checkbox"
                    value={option}
                    checked={(userAnswer as string[]).includes(option)}
                    onChange={handleAnswerChange}
                    className="mr-2"
                  />
                  {option}
                </label>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {(currentQuestion?.data?.options || []).map((option, idx) => (
              <div key={idx}>
                <label className="block">
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    checked={userAnswer === option}
                    onChange={handleAnswerChange}
                    className="mr-2"
                  />
                  {option}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {isCorrect === false && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 border border-red-400 rounded">
          Incorrect answer. Please try again.
        </div>
      )}

      {isCorrect === true && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 border border-green-400 rounded">
          Correct answer!
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button
          onClick={checkAnswer}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Check Answer
        </button>

        {currentIndex === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={isCorrect !== true}
            className={`px-4 py-2 rounded ${
              isCorrect === true
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            Next Question
          </button>
        )}
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-6">
        <div
          className="bg-green-500 h-2.5 rounded-full"
          style={{
            width: `${((currentIndex + 1) / questions.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};

export default Quiz;
