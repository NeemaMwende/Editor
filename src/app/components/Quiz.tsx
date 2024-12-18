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
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleRetake = () => {
    setScore(0);
    setCurrentIndex(0);
    setIsSubmitted(false);
    setUserAnswer([]);
    setIsCorrect(null);
  };

 const handleSubmit = () => {
    if (score === questions.length) {
      alert(`Congrats! You scored ${score}/${questions.length}`);
    } else if (score >= 4) {
      alert(`Congrats! You passed with a score of ${score}/${questions.length}`);
    } else if (score === 3) {
      alert(`Good work! You scored ${score}/${questions.length}`);
    } else {
      alert(`Oops, try again! You scored ${score}/${questions.length}`);
    }
    setIsSubmitted(true);
  };


  if (questions.length === 0) return <p>Loading...</p>;

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) {
    return <p>Question not found</p>;
  }

  return (
<div className="max-w-3xl mx-auto mt-10 p-6 border-2 border-green-500 rounded-md">
      {isSubmitted ? (
        <div className="mt-4 p-4 border bg-gray-100 text-center">
          {score === questions.length ? (
            <p>Congrats! You scored {score}/{questions.length}</p>
          ) : score >= 4 ? (
            <p>Congrats! You passed with a score of {score}/{questions.length}</p>
          ) : score === 3 ? (
            <p>Good work! You scored {score}/{questions.length}</p>
          ) : (
            <p>Oops, try again! You scored {score}/{questions.length}</p>
          )}
          {score < 3 && (
            <button
              onClick={handleRetake}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Retake Test
            </button>
          )}
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-green-600 mb-4">
            Question {currentIndex + 1}/{questions.length}
          </h1>

          <div dangerouslySetInnerHTML={{ __html:  currentQuestion?.content || '' }} />

          <div className="mt-4">
            {currentQuestion.data.type === "checkbox" ? (
              <div>
                {currentQuestion.data.options?.map((option, idx) => (
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
                {currentQuestion.data.options?.map((option, idx) => (
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

          <div className="flex justify-between mt-6">
            <button
              onClick={checkAnswer}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Check Answer
            </button>

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
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-6">
            <div
              className="bg-green-500 h-2.5 rounded-full"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Quiz;
