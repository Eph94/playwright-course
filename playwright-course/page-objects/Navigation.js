import { isDesktopViewport } from "./../utils/isDesktopViewport"

export class Navigation {
    constructor(page){
        this.page = page

        this.basketCounter = page.locator('[data-qa="header-basket-count"]')
        this.checkoutLink = page.getByRole('link', {name: 'Checkout'})
        this.movileBurgerButton = page.locator('[data-qa="burger-button"]')
    }

    getBasketCount = async () => {
        await this.basketCounter.waitFor()
        //return a number
        const text = await this.basketCounter.innerText()
        // "0" => 0
        return parseInt(text, 10)
    }

    goToCheckout = async () => {
        //if mobile viewport, first open the burger menu
        if (!isDesktopViewport(this.page)) {
            await this.movileBurgerButton.waitFor()
            await this.movileBurgerButton.click()
        }
        
        await this.checkoutLink.waitFor()
        await this.checkoutLink.click()
        await this.page.waitForURL("/basket")
    }
}


    