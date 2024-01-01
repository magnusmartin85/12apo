/**
 * Off-Canvas Menu v2.0.0
 * by Magnus Martin
 *
 * Author:
 * https://mgnmrt.com
 *
 * Demo:
 * http://off-canvas-menu.mgnmrt.com
 *
 */

import {CSS_CLASSES, STRINGS} from "./constants";
import {menuHeader} from "./templates/menuHeader";
import {VisibleListItemData} from "./types";
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
    iconOpen: HTMLElement = getHtmlElementByClassName(CSS_CLASSES.ICON_OPEN);
    sidebar: HTMLElement = getHtmlElementByClassName(CSS_CLASSES.SIDEBAR);

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

        backdrop.className = <string>CSS_CLASSES.BACKDROP;
        document.body.appendChild(backdrop);
    }

    /**
     *
     * @private
     */
    private addClickListenerToBackArrow(): void {
        const iconBack = getHtmlElementByClassName(CSS_CLASSES.ICON_BACK);

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
            CSS_CLASSES.MENU_HEADER
        );

        const menuContainer: HTMLElement = getHtmlElementByClassName(
            CSS_CLASSES.MENU_CONTAINER
        );

        const header: HTMLElement = getElementFromHTML(menuHeader);

        existingHeader && existingHeader.remove();
        header.children[1].innerHTML = this.menuTitle;
        menuContainer.prepend(header || "");
    }

    /**
     * Add close events to provided closeItems e.g. backdrop and close icon.
     * @param {object} sidebar - HTML Element containing the menu.
     * @param {object} body - HTML Element which containing the body.
     */
    private addClickListenerToCloseItems(
        sidebar: HTMLElement,
        body: HTMLElement
    ): void {
        const iconClose: HTMLElement = getHtmlElementByClassName(
            CSS_CLASSES.ICON_CLOSE
        );

        const closeItem: HTMLElement[] = [];
        iconClose && closeItem.push(iconClose);

        if (this.closeMenuOnBackdropClick) {
            const backdrop: HTMLElement = getHtmlElementByClassName(
                CSS_CLASSES.BACKDROP
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
            list.classList.contains("show")
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
     * @param {object} sidebar - DOM Element which contains the menu.
     */
    private hideSidebar(sidebar: HTMLElement): void {
        sidebar.className = <string>CSS_CLASSES.SIDEBAR;
    }

    /**
     *
     * @private
     */
    private handleBackIconVisibility(): void {
        const parentList: HTMLElement = this.getParentListElement();
        const iconBack: HTMLElement = getHtmlElementByClassName(
            CSS_CLASSES.ICON_BACK
        );

        if (!parentList) {
            iconBack.style.visibility = "hidden";
        } else {
            iconBack.style.visibility = "visible";
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
        listElement?.classList.add("show");
    }

    /**
     * Move list element off the canvas.
     * @param listElement
     * @private
     */
    private moveOffCanvas(listElement: HTMLElement): void {
        listElement?.classList.remove("show");
    }

    /**
     * Allow body to scroll vertically.
     * @param {object} body - DOM Element which contains the body.
     */
    private makeBodyScrollable(body: HTMLElement): void {
        body.style.overflow = "";
    }

    /**
     * Open the menu.
     * @param {object} sidebar - DOM Element which contains the menu.
     * @param {object} body - DOM Element which contains the body.
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
     * @param {object} body - DOM Element which contains the body.
     */
    private preventBodyFromScrolling(body: HTMLElement): void {
        body.style.overflow = "hidden";
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
        const menuRoot = getHtmlElementByClassName(CSS_CLASSES.MENU_NAV);
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
     * Needed to apply icon indicator.
     */
    addChildrenItemCounter(): void {
        const menuRoot = getHtmlElementByClassName(CSS_CLASSES.MENU_NAV);
        const listItems = getHtmlElementsByTagName("li", menuRoot);

        for (let i = 0; i < listItems.length; i++) {
            const currentListItem = listItems[i];

            if (getHtmlElementByTagName("ul", currentListItem)) {
                const link = getHtmlElementByTagName("a", currentListItem);
                const childrenItemCounter = document.createElement("span");

                childrenItemCounter.classList.add("children-item-counter");
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
            CSS_CLASSES.BACKDROP
        );
        backdrop?.remove();
    }

    /**
     *
     * @param {object} sidebar - DOM Element which contains the menu.
     */
    private showSidebar(sidebar: HTMLElement): void {
        sidebar.classList.add("show");
        sidebar.style.visibility = "visible";
    }

    /**
     *
     * @private
     */
    private updateMenuTitle(): void {
        const title: HTMLElement = getHtmlElementByClassName(
            CSS_CLASSES.MENU_TITLE
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
            CSS_CLASSES.MENU_HEADER
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
        const offCanvasNav = getHtmlElementByClassName(CSS_CLASSES.MENU_NAV);
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

    addEventListenersForKeyboard(): void {
        document.addEventListener("keydown", this.addKeyboardListeners);
    }

    removeEventListenersForKeyboard(): void {
        document.removeEventListener("keydown", this.addKeyboardListeners);
    }

    addKeyboardListeners(event: KeyboardEvent): void {
        const iconClose: HTMLElement = getHtmlElementByClassName(
            CSS_CLASSES.ICON_CLOSE
        );

        if (event.key === "Escape") {
            return iconClose.click();
        }
    }
}

export default OffCanvasMenu;
