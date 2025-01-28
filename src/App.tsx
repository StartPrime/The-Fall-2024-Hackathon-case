import { Route, Routes, BrowserRouter } from 'react-router-dom';
import AuthPage from './components/Auth/AuthPage.tsx';
import TaskPage from './components/TaskPage/TaskPage.tsx';
import ErrorPage from './components/404/404Page.tsx';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/tasks" element={<TaskPage />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/404" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
