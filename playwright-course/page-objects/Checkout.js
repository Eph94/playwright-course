import { expect } from "@playwright/test"

export class Checkout {
    constructor(page){
        this.page = page
        this.basketCards = page.locator('[data-qa="basket-card"]')
        this.basketItemsPrice = page.locator('[data-qa="basket-item-price"]')
        this.basketItemRemoveButton = page.locator('[data-qa="basket-card-remove-item"]')
        this.continueToCheckoutButton = page.locator('[data-qa="continue-to-checkout"]')
    }

    removeCheapestProduct = async () => {
        await this.basketCards.first().waitFor()
        const itemsBeforeRemoval = await this.basketCards.count()
        await this.basketItemsPrice.first().waitFor()
        const allPriceTexts = await this.basketItemsPrice.allInnerTexts()
        
        const justNumbers = allPriceTexts.map((element) => {
            const withoutDollarSign = element.replace("$", "") // '499$' -> '499'
            return parseInt(withoutDollarSign, 10)
        })
        
        const smallestPrice = Math.min(...justNumbers)
        const smallestPriceIdx = justNumbers.indexOf(smallestPrice)
        const specficRemoveButton = this.basketItemRemoveButton.nth(smallestPriceIdx)
        await specficRemoveButton.waitFor()
        await specficRemoveButton.click()
        await expect(this.basketCards).toHaveCount(itemsBeforeRemoval - 1)
    }

    continueToCheckout = async ()=>{
        await this.continueToCheckoutButton.waitFor()
        await this.continueToCheckoutButton.click()
        await this.page.waitForURL(/\/login/, {timeout: 3000})
    }

}