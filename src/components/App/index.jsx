import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from '../../pages/Home';
import NotFound from '../../pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
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
