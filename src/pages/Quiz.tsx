import { useEffect, useState } from "react";
import { getData, getRandomElements, getOtherElementOptions } from "../utils";
import type { Element } from "../types";
import "../styles/Quiz.css";
import EndScreen from "./EndScreen";

interface Props {
  onBack: () => void;
}

function Quiz({ onBack }: Props) {
  const [elements, setElements] = useState<Element[]>([]);
  const [questions, setQuestions] = useState<Element[]>([]);
  const [current, setCurrent] = useState<number>(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [finished, setFinished] = useState<boolean>(false);
  const [options, setOptions] = useState<Element[]>([]);

  useEffect(() => {
    getData().then((data) => {
      setElements(data);
      setQuestions(getRandomElements(data, 20));
    });
  }, []);

  useEffect(() => {
    if (questions.length === 0) return;
    setOptions(getOtherElementOptions(questions[current], elements));
  }, [current, questions]);

  if (!questions[current] && !finished) return <div>Loading...</div>;

  const handleSelect = (symbol: string) => {
    if (selected) return;
    const correct = questions[current].symbol === symbol;
    if (correct) setScore((prev) => prev + 1);
    setSelected(symbol);
  };

  const handleNext = () => {
    if (current + 1 === questions.length) {
      setFinished(true);
    } else {
      setCurrent((prev) => prev + 1);
      setSelected(null);
    }
  };

  const handlePlayAgain = () => {
    setQuestions(getRandomElements(elements, 20));
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  const getOptionClass = (symbol: string): string => {
    if (!selected) return "";
    if (symbol === questions[current].symbol) return "btn-option--correct";
    if (symbol === selected) return "btn-option--incorrect";
    return "";
  };

  if (finished) {
    return (
      <EndScreen
        score={score}
        total={questions.length}
        onPlayAgain={handlePlayAgain}
        onBack={onBack}
      />
    );
  }

  return (
    <div className='screen'>
      <div className='card'>
        <div className='card-header'>
          <button className='back-nav' onClick={onBack}>
            ← Periodic Table
          </button>
          <span className='text-score'>Score: {score}</span>
        </div>
        <h2 className='heading'>Quiz</h2>
        <div key={current} className='card-content'>
          <p className='text-progress'>
            {current + 1} of {questions.length}
          </p>
          <p className='text-symbol'>{questions[current].symbol}</p>
          <div className='options-group'>
            {options.map((option) => (
              <button
                key={option.symbol}
                className={`btn-option ${getOptionClass(option.symbol)}`}
                onClick={() => handleSelect(option.symbol)}
              >
                {option.name}
              </button>
            ))}
          </div>
          {selected && (
            <button className='btn-primary' onClick={handleNext}>
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Quiz;
