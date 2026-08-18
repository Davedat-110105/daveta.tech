import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { DeployRail } from "@/components/DeployRail";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Record } from "@/components/Record";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Work } from "@/components/Work";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-bg text-fg">
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <Work />
        <DeployRail />
        <Record />
        <About />
        <Contact />
      </main>
    </div>
  );
}
