interface Props {
  onSelectMode: (mode: "flashcard" | "quiz") => void;
}

const ModeSelect = ({ onSelectMode }: Props) => {
  return (
    <div className='screen'>
      <div className='card'>
        <h1 className='heading'>Periodic Table</h1>
        <p className='tagline'>Quiz or flashcards — you choose</p>
        <div className='button-group'>
          <button
            className='btn-primary'
            onClick={() => onSelectMode("flashcard")}
          >
            Flashcard
          </button>
          <button className='btn-primary' onClick={() => onSelectMode("quiz")}>
            Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModeSelect;
