beforeAll(() => {
  // https://github.com/nickcolley/jest-axe/issues/147#issuecomment-758804533
  // JSDom does not implement this and an error was being
  // thrown from jest-axe because of it.
  const {getComputedStyle} = window;
  window.getComputedStyle = (elt) => getComputedStyle(elt);
});

export {};
