let navigateFn;

export const setNavigate = (navigate) => {
  navigateFn = navigate;
};

export const navigateTo = (path, options) => {
  if (navigateFn) {
    navigateFn(path, options);
  } else {
    console.error("Navigate function is not set.");
  }
};