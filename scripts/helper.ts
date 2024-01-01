/**
 *
 * @param cssClass
 */
export const getHtmlElementByClassName = (
  cssClass: string | { [p: number]: string }
): HTMLElement => {
  return document.querySelector(`.${cssClass}`) as HTMLElement;
};

/**
 *
 * @param stringWithTag
 */
export const removeHtmlTagFromString = (stringWithTag: string): string => {
  return stringWithTag.replace(/<.*>/g, "");
};

/**
 *
 * @param tagName
 * @param root
 */
export const getHtmlElementByTagName = (
  tagName: string | { [p: number]: string },
  root?: Element
): HTMLElement => {
  if (root) {
    return root.querySelector(`${tagName}`) as HTMLElement;
  }
  return document.querySelector(`${tagName}`) as HTMLElement;
};

/**
 *
 * @param tagName
 * @param root
 */
export const getHtmlElementsByTagName = (
  tagName: string | { [p: number]: string },
  root?: Element
): NodeListOf<HTMLElement> => {
  if (root) {
    return root.querySelectorAll(`${tagName}`);
  }
  return document.querySelectorAll(`${tagName}`);
};

/**
 *
 * @param htmlString
 */
export const getElementFromHTML = (htmlString: string): HTMLDivElement => {
  const div: HTMLDivElement = document.createElement("div");
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes.
  return div.firstChild as HTMLDivElement;
};

/**
 *
 * @param node
 * @param children
 * @param level
 */
export const traverseList = (
  node: HTMLElement,
  children: Element[],
  level: number = 1
): void => {
  node.classList.add(`list-level-${level.toString()}`);

  for (const child of children) {
    const hasGrandChild =
      [...child.children].filter((el) => el.tagName.toLowerCase() === "ul")
        .length !== 0;

    if (hasGrandChild) {
      const newChild = [...child.children].find(
        (el) => el.tagName.toLowerCase() === "ul"
      ) as HTMLUListElement;
      const grandChildren = findListChildren(<HTMLUListElement>newChild);

      traverseList(newChild, grandChildren, level + 1);
    }
  }
};

/**
 *
 * @param child
 */
export const findListChildren = (child: HTMLElement) =>
  [...child.children].filter((el) => el.tagName.toLowerCase() === "li");
