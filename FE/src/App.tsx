import { useSelector } from 'react-redux';
import { RootState } from './app/store';
import { Route, Routes } from 'react-router-dom';
import routes from './routes/RouterConfig';
import ScrollToTop from './common/ScollToTop';

function App() {
  const isRehydrated = useSelector(
    (state: RootState) => state._persist?.rehydrated,
  );

  if (!isRehydrated) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <img
          src="/assets/img/logo-white.png"
          alt="Loading..."
          className="animate-pulse w-20 h-20"
        />
      </div>
    );
  }

  return (
    <>
      <div className="Loader" />
      <ScrollToTop />
      <Routes>
        {routes.map(({ path, element, layout: Layout }) => (
          <Route
            key={path}
            path={path}
            element={Layout ? <Layout>{element}</Layout> : element}
          />
        ))}
      </Routes>
    </>
  );
}

export default App;
