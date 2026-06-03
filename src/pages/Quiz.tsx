import { useEffect, useState } from "react";
import { getData, getRandomElements, getOtherElementOptions } from "../utils";
import type { Element } from "../types";

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
      <div className='screen'>
        <div className='card'>
          <h1 className='heading'>Periodic Table</h1>
          <p className='text-trophy'>🏆</p>
          <p className='text-score'>
            You scored {score} out of {questions.length}
          </p>
          <p className='text-encouragement'>Great work!</p>
          <hr className='divider' />
          <div className='button-group'>
            <button className='btn-primary' onClick={handlePlayAgain}>
              Play Again
            </button>
            <button className='btn-secondary' onClick={onBack}>
              Switch Mode
            </button>
          </div>
          <a
            className='text-product-link'
            href='https://your-etsy-link.com'
            target='_blank'
            rel='noreferrer'
          >
            Love chemistry? Check out our periodic table posters →
          </a>
        </div>
      </div>
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
