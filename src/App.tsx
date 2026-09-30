import { useCallback, useState } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { MotionProvider } from "@/motion/MotionProvider";
import { useLenisScroll } from "@/motion/useLenisScroll";
import { BookingProvider } from "@/components/BookingProvider";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import Preloader from "@/components/Preloader";
import PageTransition from "@/components/PageTransition";
import MotionDebug from "@/components/MotionDebug";
import Seo from "@/components/Seo";
import Home from "@/pages/Home";
import Packages from "@/pages/Packages";
import Branches from "@/pages/Branches";
import Trainers from "@/pages/Trainers";
import Gallery from "@/pages/Gallery";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import { ScrollTrigger } from "@/motion/gsap";
import { mlog } from "@/config/motion";

function Shell() {
  const [loaded, setLoaded] = useState(false);
  useLenisScroll();

  const onPreloaderDone = useCallback(() => {
    setLoaded(true);
    ScrollTrigger.refresh();
    mlog("site revealed, ScrollTrigger refreshed");
  }, []);

  return (
    <>
      <Seo />
      <Preloader onDone={onPreloaderDone} />
      <Cursor />
      <MotionDebug />
      <div style={{ opacity: loaded ? 1 : 0, transition: "opacity .4s ease" }}>
        <Nav />
        <main>
          <PageTransition>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/branches" element={<Branches />} />
              <Route path="/trainers" element={<Trainers />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </PageTransition>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default function App() {
  return (
    <MotionProvider>
      <BookingProvider>
        <HashRouter>
          <Shell />
        </HashRouter>
      </BookingProvider>
    </MotionProvider>
  );
}
