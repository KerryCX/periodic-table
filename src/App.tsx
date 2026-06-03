import { useState } from "react";
import ModeSelect from "./pages/ModeSelect";
import Flashcard from "./pages/Flashcard";
import Quiz from "./pages/Quiz";

type Mode = "select" | "flashcard" | "quiz";

function App() {
  const [mode, setMode] = useState<Mode>("select");

  return (
    <div>
      {mode === "select" && <ModeSelect onSelectMode={(m) => setMode(m)} />}
      {mode === "flashcard" && <Flashcard onBack={() => setMode("select")} />}
      {mode === "quiz" && <Quiz onBack={() => setMode("select")} />}
    </div>
  );
}

export default App;
