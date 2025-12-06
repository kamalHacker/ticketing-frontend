let showFn = () => {};

export const toastStore = {
  register: (fn) => (showFn = fn),
  show: (msg, type) => showFn(msg, type),
};
