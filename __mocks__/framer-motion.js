const React = require("react");
const actual = jest.requireActual("framer-motion");

module.exports = {
    ...actual,
    motion: {
        div: ({ children, ...props }) => React.createElement("div", props, children),
        h1: ({ children, ...props }) => React.createElement("h1", props, children),
        h2: ({ children, ...props }) => React.createElement("h2", props, children),
        h3: ({ children, ...props }) => React.createElement("h3", props, children),
        p: ({ children, ...props }) => React.createElement("p", props, children),
        span: ({ children, ...props }) => React.createElement("span", props, children),
        section: ({ children, ...props }) => React.createElement("section", props, children),
        a: ({ children, ...props }) => React.createElement("a", props, children),
        img: ({ children, ...props }) => React.createElement("img", props),
        button: ({ children, ...props }) => React.createElement("button", props, children),
        form: ({ children, ...props }) => React.createElement("form", props, children),
        input: ({ children, ...props }) => React.createElement("input", props),
        ul: ({ children, ...props }) => React.createElement("ul", props, children),
        li: ({ children, ...props }) => React.createElement("li", props, children),
    },
    useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
    useTransform: () => 0,
    useMotionValue: () => ({ set: jest.fn(), get: () => 0 }),
    useSpring: () => ({ get: () => 0 }),
    useAnimation: () => ({ start: jest.fn(), set: jest.fn() }),
    AnimatePresence: ({ children }) => React.createElement(React.Fragment, null, children),
};
