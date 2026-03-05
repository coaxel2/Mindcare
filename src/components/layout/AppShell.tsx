import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Header from './Header';
import DemoBanner from '../ui/DemoBanner';
import { AnimatePresence, motion } from 'framer-motion';

export default function AppShell() {
  const location = useLocation();
  const isChatPage = location.pathname.includes('/chat');

  return (
    <div className="flex flex-col h-dvh bg-bg">
      <DemoBanner />
      {!isChatPage && <Header />}
      <main className={`flex-1 overflow-y-auto overscroll-contain ${isChatPage ? '' : 'px-4 pb-2'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
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
