import { Route, Routes, BrowserRouter } from 'react-router-dom';
import AuthPage from './components/Auth/AuthPage.tsx';
import TaskPage from './components/TaskPage/TaskPage.tsx';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/tasks" element={<TaskPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
