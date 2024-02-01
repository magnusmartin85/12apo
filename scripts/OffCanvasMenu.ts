/**
 * 12APO Off-Canvas Menu V1.0.0
 * by Magnus Martin
 *
 * Author:
 * https://mgnmrt.com
 *
 * Demo:
 * http://12apo.com
 *
 */
 
import { CSS_CLASSES, STRINGS } from "./constants";
import { menuHeader } from "./templates/menuHeader";
import { VisibleListItemData } from "./types";
import {
  findListChildren,
  getElementFromHTML,
  getHtmlElementByClassName,
  getHtmlElementByTagName,
  getHtmlElementsByTagName,
  removeHtmlTagFromString,
  traverseList
} from "./helper";

class OffCanvasMenu {
  private readonly closeMenuOnBackdropClick: boolean;
  private readonly menuTitle: string;

  constructor(closeMenuOnBackdropClick?: boolean) {
    /**
     * Close menu after click on backdrop (css class 'off-canvas-backdrop').
     * @type {boolean}
     */
    this.closeMenuOnBackdropClick = closeMenuOnBackdropClick || true;
    this.menuTitle = STRINGS.MENU_TITLE;
  }

  body: HTMLElement = getHtmlElementByTagName("body");
  iconOpen: HTMLElement = getHtmlElementByClassName(CSS_CLASSES.ICONS.OPEN);
  sidebar: HTMLElement = getHtmlElementByClassName(CSS_CLASSES.MENU.SIDEBAR);

  init(): void {
    const iconOpen: HTMLElement = this.iconOpen as HTMLElement;

    iconOpen.addEventListener("click", (): void =>
      this.openMenu(this.sidebar, this.body)
    );
    this.addNextLevelIcon();
    this.addCssClasses();
    this.addChildrenItemCounter();
  }

  /**
   *
   * @private
   */
  private addBackdrop(): void {
    const backdrop: HTMLElement = document.createElement("div");

    backdrop.className = <string>CSS_CLASSES.MENU.BACKDROP;
    document.body.appendChild(backdrop);
  }

  /**
   *
   * @private
   */
  private addClickListenerToBackArrow(): void {
    const iconBack = getHtmlElementByClassName(CSS_CLASSES.ICONS.BACK);

    iconBack.addEventListener("click", () => {
      this.handleBackIconEventListener();
    });
  }

  /**
   * Remove old menu header first.
   * @private
   */
  private addMenuHeader(): void {
    const existingHeader: HTMLElement = getHtmlElementByClassName(
      CSS_CLASSES.MENU.HEADER
    );

    const menuContainer: HTMLElement = getHtmlElementByClassName(
      CSS_CLASSES.MENU.CONTAINER
    );

    const header: HTMLElement = getElementFromHTML(menuHeader);

    existingHeader && existingHeader.remove();
    header.children[1].innerHTML = this.menuTitle;
    menuContainer.prepend(header || "");
  }

  /**
   * Add close events to provided closeItems e.g. backdrop and close icon.
   * @param sidebar
   * @param body
   */
  private addClickListenerToCloseItems(
    sidebar: HTMLElement,
    body: HTMLElement
  ): void {
    const iconClose: HTMLElement = getHtmlElementByClassName(
      CSS_CLASSES.ICONS.CLOSE
    );

    const closeItem: HTMLElement[] = [];
    iconClose && closeItem.push(iconClose);

    if (this.closeMenuOnBackdropClick) {
      const backdrop: HTMLElement = getHtmlElementByClassName(
        CSS_CLASSES.MENU.BACKDROP
      );
      closeItem.push(backdrop);
    }

    for (let i = 0; i < closeItem.length; i++) {
      const currentCloseItem: HTMLElement = closeItem[i] as HTMLElement;
      const lists = this.getLists();

      currentCloseItem.addEventListener("click", (): void => {
        const currentList = lists[0];
        this.hideSidebar(sidebar);
        this.removeBackdrop();
        this.makeBodyScrollable(body);
        this.removeClickListenersFromAllLists();
        this.removeEventListenersForKeyboard();
        this.showFirstList();
        this.moveOnCanvas(currentList);
      });
    }
  }

  /**
   *
   * @private
   */
  private addClickListenerToMenuItems(): void {
    const lists: HTMLElement[] = this.getLists();
    const visibleList: HTMLElement = this.getVisibleList(lists);

    if (visibleList) {
      for (let i = 0; i < visibleList.children.length; i++) {
        const currentListItem = visibleList.children[i];

        if (currentListItem.children.length) {
          const currentListItemLink =
            currentListItem.getElementsByTagName("a")[1];

          currentListItemLink?.addEventListener(
            "click",
            (event: MouseEvent): void => {
              this.handleClickOnListItemWithChildren(event);
            }
          );
        }
      }
    }
  }

  /**
   * Get data representation of list which is currently visible in off-canvas menu.
   * @private
   */
  private getVisibleListItemData(): VisibleListItemData {
    const lists: HTMLElement[] = this.getLists();
    const visibleList: HTMLElement = this.getVisibleList(lists);

    const visibleListItemData: VisibleListItemData = [];
    const visibleListItems: HTMLCollection = visibleList?.children;

    const parentListItem = visibleList?.parentElement as HTMLElement;
    const parentTitle =
      removeHtmlTagFromString(
        getHtmlElementByTagName("a", parentListItem).innerHTML
      ) || this.menuTitle;

    const hasParentListItem =
      visibleList?.parentNode?.nodeName.toLowerCase() === "li";

    if (visibleListItems?.length) {
      for (let i = 0; i < visibleListItems.length; i++) {
        const subMenuItems = getHtmlElementByTagName("ul", visibleListItems[i]);
        const subMenuItemCount: number = subMenuItems?.children.length || 0;
        const title = visibleListItems[i].children[0].innerHTML;
        const hasChildren = subMenuItemCount > 0;

        visibleListItemData.push({
          childrenCount: subMenuItemCount,
          hasChildren,
          hasParentList: hasParentListItem,
          parentTitle,
          title
        });
      }
    }

    return visibleListItemData;
  }

  /**
   *
   * @param lists
   * @private
   */
  private getVisibleList(lists: HTMLElement[]): HTMLElement {
    return lists.filter((list: HTMLElement): boolean =>
      list.classList.contains(CSS_CLASSES.VISIBILITY.SHOW)
    )[0];
  }

  /**
   *
   * @private
   */
  private getLists(): HTMLElement[] {
    return Array.from(getHtmlElementsByTagName("ul"));
  }

  /**
   * Check if current visible list has a parent list.
   * @private
   */
  private getParentListElement(): HTMLElement {
    const lists: HTMLElement[] = this.getLists();
    const currentList = this.getVisibleList(lists);

    const parentNode = currentList?.parentNode as HTMLElement;
    return parentNode?.closest("ul") as HTMLElement;
  }

  /**
   *
   * @param event
   * @private
   */
  private handleClickOnListItemWithChildren(event: Event): void {
    const clickedLinkElement: HTMLElement = event.target as HTMLElement;
    const listItemChildren: HTMLElement =
      clickedLinkElement.nextElementSibling as HTMLElement;
    const lists: HTMLElement[] = this.getLists();
    const currentList = this.getVisibleList(lists);

    listItemChildren && this.moveOnCanvas(listItemChildren);
    listItemChildren && this.moveOffCanvas(currentList);
    listItemChildren && this.updateMenuTitle();

    this.removeClickListenersFromAllLists();
    this.addClickListenerToMenuItems();
    this.handleBackIconVisibility();
    this.setListPosition();
  }

  /**
   *
   * @param sidebar
   * @private
   */
  private hideSidebar(sidebar: HTMLElement): void {
    sidebar.className = <string>CSS_CLASSES.MENU.SIDEBAR;
  }

  /**
   *
   * @private
   */
  private handleBackIconVisibility(): void {
    const parentList: HTMLElement = this.getParentListElement();
    const iconBack: HTMLElement = getHtmlElementByClassName(
      CSS_CLASSES.ICONS.BACK
    );

    if (!parentList) {
      iconBack.style.visibility = CSS_CLASSES.VISIBILITY.HIDDEN;
    } else {
      iconBack.style.visibility = CSS_CLASSES.VISIBILITY.VISIBLE;
    }
  }

  /**
   *
   * @private
   */
  private handleBackIconEventListener(): void {
    const parentList = this.getParentListElement();
    const lists: HTMLElement[] = this.getLists();
    const currentList = this.getVisibleList(lists);

    this.moveOffCanvas(currentList);
    this.moveOnCanvas(parentList);
    this.updateMenuTitle();
    this.handleBackIconVisibility();
    this.removeClickListenersFromAllLists();
    this.addClickListenerToMenuItems();
  }

  /**
   *
   * @param listElement
   * @private
   */
  private moveOnCanvas(listElement: HTMLElement): void {
    listElement?.classList.add(CSS_CLASSES.VISIBILITY.SHOW);
  }

  /**
   * Move list element off the canvas.
   * @param listElement
   * @private
   */
  private moveOffCanvas(listElement: HTMLElement): void {
    listElement?.classList.remove(CSS_CLASSES.VISIBILITY.SHOW);
  }

  /**
   * Allow body to scroll vertically.
   * @param body
   */
  private makeBodyScrollable(body: HTMLElement): void {
    body.style.overflow = "";
  }

  /**
   * Open the menu.
   * @param sidebar
   * @param body
   */
  private openMenu(sidebar: HTMLElement, body: HTMLElement): void {
    const lists: HTMLElement[] = this.getLists();
    const currentList = lists[0];

    this.preventBodyFromScrolling(body);
    this.showSidebar(sidebar);
    this.addMenuHeader();
    this.setListPosition();
    this.addBackdrop();
    this.showFirstList();
    this.moveOnCanvas(currentList);
    this.handleBackIconVisibility();
    this.addClickListenerToCloseItems(this.sidebar, this.body);
    this.addClickListenerToMenuItems();
    this.addClickListenerToBackArrow();
    this.addEventListenersForKeyboard();
  }

  /**
   *
   * @param body
   */
  private preventBodyFromScrolling(body: HTMLElement): void {
    body.style.overflow = CSS_CLASSES.VISIBILITY.HIDDEN;
  }

  /**
   * Add css classes to ul and li elements by traversing the DOM.
   */
  private addCssClasses(): void {
    const root = getHtmlElementByTagName("ul");
    const children = findListChildren(root);
    traverseList(root, children);
  }

  /**
   * Add css class to list item with children.
   * Needed to apply icon indicator.
   */
  addNextLevelIcon(): void {
    const menuRoot = getHtmlElementByClassName(CSS_CLASSES.MENU.NAV);
    const listItems = getHtmlElementsByTagName("li", menuRoot);

    for (let i = 0; i < listItems.length; i++) {
      const currentListItem = listItems[i];

      if (getHtmlElementByTagName("ul", currentListItem)) {
        const link = getHtmlElementByTagName("a", currentListItem);
        link.insertAdjacentHTML("afterend", "<a href='#'></a>");
      }
    }
  }

  /**
   * Add css class to list item with children.
   * Needed to apply item counter.
   */
  addChildrenItemCounter(): void {
    const menuRoot = getHtmlElementByClassName(CSS_CLASSES.MENU.NAV);
    const listItems = getHtmlElementsByTagName("li", menuRoot);

    for (let i = 0; i < listItems.length; i++) {
      const currentListItem = listItems[i];

      if (getHtmlElementByTagName("ul", currentListItem)) {
        const link = getHtmlElementByTagName("a", currentListItem);
        const childrenItemCounter = document.createElement("span");

        childrenItemCounter.classList.add(
          <string>CSS_CLASSES.CHILDREN_ITEM_COUNTER
        );
        childrenItemCounter.innerHTML = String(
          getHtmlElementByTagName("ul", currentListItem).children.length
        );
        link.appendChild(childrenItemCounter);
      }
    }
  }

  /**
   *
   * @private
   */
  private removeBackdrop(): void {
    const backdrop: HTMLElement = getHtmlElementByClassName(
      CSS_CLASSES.MENU.BACKDROP
    );
    backdrop?.remove();
  }

  /**
   *
   * @param sidebar
   * @private
   */
  private showSidebar(sidebar: HTMLElement): void {
    sidebar.classList.add(CSS_CLASSES.VISIBILITY.SHOW);
    sidebar.style.visibility = CSS_CLASSES.VISIBILITY.VISIBLE;
  }

  /**
   *
   * @private
   */
  private updateMenuTitle(): void {
    const title: HTMLElement = getHtmlElementByClassName(
      CSS_CLASSES.MENU.TITLE
    );
    const visibleListItemData: VisibleListItemData =
      this.getVisibleListItemData();

    if (visibleListItemData[0].hasParentList) {
      title.innerText = visibleListItemData[0]?.parentTitle;
    } else {
      title.innerText = STRINGS.MENU_TITLE;
    }
  }

  /**
   *
   * @private
   */
  private setListPosition(): void {
    const header = getHtmlElementByClassName(
      CSS_CLASSES.MENU.HEADER
    ) as HTMLElement;
    const headerHeight = header.getBoundingClientRect().height;
    const lists = getHtmlElementsByTagName("ul");

    for (let i = 0; i < lists.length; i++) {
      const currentList = lists[i] as HTMLElement;
      currentList.style.top = headerHeight + "px";
    }
  }

  /**
   *
   * @private
   */
  private removeClickListenersFromAllLists(): void {
    const offCanvasNav = getHtmlElementByClassName(CSS_CLASSES.MENU.NAV);
    offCanvasNav.replaceWith(offCanvasNav.cloneNode(true));
  }

  /**
   *
   * @private
   */
  private showFirstList(): void {
    const lists: HTMLElement[] = this.getLists();

    for (let i = 0; i < lists.length; i++) {
      this.moveOffCanvas(lists[i]);
    }

    this.moveOnCanvas(lists[0]);
  }

  /**
   *
   * @private
   */
  private addEventListenersForKeyboard(): void {
    document.addEventListener("keydown", this.addKeyboardListeners);
  }

  /**
   *
   * @private
   */
  private removeEventListenersForKeyboard(): void {
    document.removeEventListener("keydown", this.addKeyboardListeners);
  }

  /**
   *
   * @param event
   * @private
   */
  private addKeyboardListeners(event: KeyboardEvent): void {
    const iconClose: HTMLElement = getHtmlElementByClassName(
      CSS_CLASSES.ICONS.CLOSE
    );

    if (event.key === "Escape") {
      return iconClose.click();
    }
  }
}

export default OffCanvasMenu;
