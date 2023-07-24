import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from '../../pages/Home';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

function WrappedApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export { App, WrappedApp };
