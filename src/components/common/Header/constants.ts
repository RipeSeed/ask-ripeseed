export const menuItems = [
  {
    title: "General",
    href: "/general",
    pathMatch: ["/general", "/general/*"],
  },
  {
    title: "Ask RipeSeed",
    href: "/ask-ripeseed",
    pathMatch: ["/ask-ripeseed", "/ask-ripeseed/*"],
  },
];
export const configPaths = ["/general", "/general/*"];


/**
 * Checks if the given pathname matches any of the paths in the provided array.
 * @param path - An array of paths to match against.
 * @param pathname - The pathname to check.
 * @returns A boolean indicating whether the pathname matches any of the paths.
 */
export const isPath = (path: string[], pathname: string) => {
  const regexPattern = [];

  for (const p of path) {
    regexPattern.push(
      new RegExp(
        "^" + p.replace(/:\w+/g, "\\w+").replace(/\/\*$/, "(/.*)?") + "$",
      ),
    );
  }
  for (const r of regexPattern) {
    if (r.test(pathname)) return true;
  }
  return false;
};