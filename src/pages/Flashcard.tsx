import { useEffect, useState } from "react";
import { getData } from "../utils";
import type { Element } from "../types";

interface Props {
  onBack: () => void;
}

function Flashcard({ onBack }: Props) {
  const [elements, setElements] = useState<Element[]>([]);
  const [current, setCurrent] = useState<number>(0);
  const [revealed, setRevealed] = useState<boolean>(false);
  const [showOrigin, setShowOrigin] = useState<boolean>(false);

  useEffect(() => {
    getData().then(setElements);
  }, []);

  const element = elements[current];

  if (!element) return <div>Loading...</div>;

  const handleNext = () => {
    setCurrent((prev) => prev + 1);
    setRevealed(false);
    setShowOrigin(false);
  };

  return (
    <div className='screen'>
      <div className='card'>
        <div className='card-header'>
          <button className='back-nav' onClick={onBack}>
            ← Periodic Table
          </button>
        </div>
        <h2 className='heading'>Flashcard</h2>
        <p className='text-progress'>
          {current + 1} of {elements.length}
        </p>
        <p className='text-symbol'>{element.symbol}</p>

        {revealed && <p className='text-element-name'>{element.name}</p>}

        {!revealed && (
          <button className='btn-primary' onClick={() => setRevealed(true)}>
            Reveal Name
          </button>
        )}

        {revealed && (
          <>
            {!showOrigin && (
              <button
                className='btn-secondary'
                onClick={() => setShowOrigin(true)}
              >
                Reveal Origin
              </button>
            )}
            {showOrigin && (
              <p className='text-origin'>{element.symbolOrigin}</p>
            )}
            <button className='btn-primary' onClick={handleNext}>
              Next →
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Flashcard;
