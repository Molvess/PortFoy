import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/Home'));
const Admin = lazy(() => import('./pages/Admin'));

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-dark">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-purple to-neon-blue animate-pulse overflow-hidden">
          <img src="/MlogoSiyah.png" alt="Molvess" className="h-8 w-8 object-contain" />
        </div>
        <div className="h-1 w-32 overflow-hidden rounded-full bg-dark-card">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-neon-purple to-neon-blue" />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
