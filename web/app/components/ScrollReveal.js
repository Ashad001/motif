"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ScrollReveal;
const react_1 = require("react");
function ScrollReveal() {
    (0, react_1.useEffect)(() => {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting)
                    e.target.classList.add("in");
            });
        }, { threshold: 0.08 });
        document.querySelectorAll(".fade-up").forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);
    return null;
}
//# sourceMappingURL=ScrollReveal.js.map