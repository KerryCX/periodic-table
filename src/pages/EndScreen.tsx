import "../styles/EndScreen.css";

interface Props {
  score: number;
  total: number;
  onPlayAgain: () => void;
  onBack: () => void;
}

const EndScreen = ({ score, total, onPlayAgain, onBack }: Props) => {
  const getMessage = (score: number, total: number): string => {
    const percentage = score / total;
    if (percentage >= 0.75) return "Great work!";
    if (percentage >= 0.4) return "Good effort!";
    return "Keep practising!";
  };

  return (
    <div className='screen'>
      <div className='card'>
        <h1 className='heading'>Periodic Table</h1>
        <p className='text-trophy'>🏆</p>
        <p className='text-score'>
          You scored {score} out of {total}
        </p>
        <p className='text-encouragement'>{getMessage(score, total)}</p>
        <hr className='divider' />
        <div className='button-group'>
          <button className='btn-primary' onClick={onPlayAgain}>
            Play Again
          </button>
          <button className='btn-secondary' onClick={onBack}>
            Switch Mode
          </button>
        </div>
      </div>
    </div>
  );
};

export default EndScreen;
