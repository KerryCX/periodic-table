import { useState } from "react";
import ModeSelect from "./pages/ModeSelect";

type Mode = "select" | "flashcard" | "quiz";

function App() {
  const [mode, setMode] = useState<Mode>("select");

  return (
    <div>
      {mode === "select" && <ModeSelect onSelectMode={(m) => setMode(m)} />}
      {mode === "flashcard" && <div>Flashcard mode coming soon</div>}
      {mode === "quiz" && <div>Quiz mode coming soon</div>}
    </div>
  );
}

export default App;
