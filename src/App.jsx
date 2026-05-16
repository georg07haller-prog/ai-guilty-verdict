import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Landing from './pages/Landing';
import Quiz from './pages/Quiz';
import Results from './pages/Results';
import About from './pages/About';
import Contact from './pages/Contact';
import BottomTabBar from './components/layout/BottomTabBar';
import MobileHeader from './components/layout/MobileHeader';

// Tab routes that stay mounted (keep-alive) for instant switching + state preservation
const TAB_ROUTES = ['/Landing', '/Quiz', '/About'];

// Slide transition — only for non-tab (child) routes
const pageVariants = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '-30%', opacity: 0 },
};
const pageTransition = { type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 0.32 };

// Always-mounted tab screens — shown/hidden via display:none
function TabScreens({ activePath }) {
  return (
    <>
      <div style={{ display: activePath === '/Landing' ? 'block' : 'none' }}><Landing /></div>
      <div style={{ display: activePath === '/Quiz' ? 'block' : 'none' }}><Quiz /></div>
      <div style={{ display: activePath === '/About' ? 'block' : 'none' }}><About /></div>
    </>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  const isTabRoute = TAB_ROUTES.includes(location.pathname) || location.pathname === '/';
  const activePath = location.pathname === '/' ? '/Landing' : location.pathname;

  return (
    <>
      {/* Keep-alive tab screens — always in DOM, toggled via display */}
      <div style={{ display: isTabRoute ? 'block' : 'none' }}>
        <TabScreens activePath={activePath} />
      </div>

      {/* Child routes with slide transition */}
      {!isTabRoute && (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            style={{ willChange: 'transform, opacity' }}
          >
            <Routes location={location}>
              <Route path="/Results" element={<Results />} />
              <Route path="/Contact" element={<Contact />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
}

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <div
      className="relative overflow-x-hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <MobileHeader />
      <AnimatedRoutes />
      <BottomTabBar />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;