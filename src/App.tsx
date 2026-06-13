import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<BlankPage />} />
      </Routes>
    </BrowserRouter>
  );
}

function BlankPage() {
  return <div className="min-h-screen bg-background" />;
}
