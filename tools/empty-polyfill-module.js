// Empty stand-in for next/dist/build/polyfills/polyfill-module.
// Our browserslist targets Chrome 92+/Firefox 90+/Safari 15.4+/Edge 92+, which all
// have native Array.prototype.at / flat / flatMap, Object.fromEntries, and
// Promise.prototype.finally. Shipping Next's polyfills to these browsers is dead weight.
export {};
