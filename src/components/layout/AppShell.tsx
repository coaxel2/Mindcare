import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Header from './Header';
import { AnimatePresence, motion } from 'framer-motion';

export default function AppShell() {
  const location = useLocation();
  const isChatPage = location.pathname.includes('/chat');

  return (
    <div className="flex flex-col h-dvh bg-bg">
      {!isChatPage && <Header />}
      <main className={`flex-1 overflow-y-auto ${isChatPage ? '' : 'px-4 pb-4'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Navbar />
    </div>
  );
}
