export const cn = (...classes: (string | undefined | boolean)[]) =>
  classes.filter(Boolean).join(' ')