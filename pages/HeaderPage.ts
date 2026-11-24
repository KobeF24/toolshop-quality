import {Locator, Page} from "@playwright/test";

export class HeaderPage {
    readonly page: Page ;
    readonly cartQuantity: Locator;
    readonly miniCart: Locator;


    constructor(page: Page) {
        this.page = page;
        this.cartQuantity = page.locator('[data-test="cart-quantity"]');
        this.miniCart = page.locator('[data-test="nav-cart"]');
    }
    }




