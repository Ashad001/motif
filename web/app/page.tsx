import Announce from "./components/Announce";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Callout from "./components/Callout";
import TerminalOutput from "./components/TerminalOutput";
import Install from "./components/Install";
import Footer from "./components/Footer";
import ScrollReveal from "./components/ScrollReveal";

export default function Home() {
  return (
    <>
      <ScrollReveal />
      <Announce />
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <Callout />
        <TerminalOutput />
        <Install />
      </main>
      <Footer />
    </>
  );
}
