import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FeedbackPage from "./pages/FeedbackPage"
import TTSPage from "./pages/TTSPage";
import STSPage from "./pages/STSPage";
import STTPage from "./pages/STTPage";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/feedback" element={<FeedbackPage/>}/>
        <Route path="/tts" element={<TTSPage />} />
        <Route path="/sts" element={<STSPage />} />
        <Route path="/stt" element={<STTPage />} />
      </Routes>
    </Router>
  );
}

export default App;
