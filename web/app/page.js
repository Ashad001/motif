"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;
const Announce_1 = __importDefault(require("./components/Announce"));
const Nav_1 = __importDefault(require("./components/Nav"));
const Hero_1 = __importDefault(require("./components/Hero"));
const HowItWorks_1 = __importDefault(require("./components/HowItWorks"));
const Callout_1 = __importDefault(require("./components/Callout"));
const TerminalOutput_1 = __importDefault(require("./components/TerminalOutput"));
const Install_1 = __importDefault(require("./components/Install"));
const Footer_1 = __importDefault(require("./components/Footer"));
const ScrollReveal_1 = __importDefault(require("./components/ScrollReveal"));
function Home() {
    return (<>
      <ScrollReveal_1.default />
      <Announce_1.default />
      <Nav_1.default />
      <main>
        <Hero_1.default />
        <HowItWorks_1.default />
        <Callout_1.default />
        <TerminalOutput_1.default />
        <Install_1.default />
      </main>
      <Footer_1.default />
    </>);
}
//# sourceMappingURL=page.js.map