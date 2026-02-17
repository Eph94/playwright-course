import { expect } from "@playwright/test"

export class PaymentPage {
    constructor(page){
        this.page = page
        //Iframe usage case:
        this.discountCode = page.frameLocator('[data-qa="active-discount-container"]')
                                .locator('[data-qa="discount-code"]')
        //new element for the discount input
        this.discountInput = page.getByRole('textbox', { name: 'Discount code' })
        this.activateDiscountButton = page.locator('[data-qa="submit-discount-button"]')
        this.discountActivateMessage = page.getByText('Discount activated!')
        this.discountedValue = page.locator('[data-qa="total-with-discount-value"]')
        this.totalValue = page.locator('[data-qa="total-value"]')
        this.cardOwnerInput = page.locator('[data-qa="credit-card-owner"]')
        this.cardNumberInput = page.locator('[data-qa="credit-card-number"]')
        this.validUntilInput = page.locator('[data-qa="valid-until"]')
        this.cardCVCInput = page.locator('[data-qa="credit-card-cvc"]')
        this.payButton = page.locator('[data-qa="pay-button"]')
    }

    activateDiscount = async () => {
        await this.discountCode.waitFor() //Code
        const code = await this.discountCode.innerText()
        await this.discountInput.waitFor() //Input
        //Option 1 for laggy inputs: using .fill() with await expect()
        await this.discountInput.fill(code)
        await expect(this.discountInput).toHaveValue(code)
        
        //Option 2 for laggy inputs: slow typping
        //await this.discountInput.focus()
        //await this.page.keyboard.type(code, {delay: 1000})        
        //expect(await this.discountInput.inputValue()).toBe(code)

        //Check discount value to not being visible and discount message too
        expect(await this.discountedValue.isVisible()).toBe(false)
        expect(await this.discountActivateMessage.isVisible()).toBe(false)
        //Here we wait and activate the discount Button
        await this.activateDiscountButton.waitFor()
        await this.activateDiscountButton.click()
        //We wait Discount activated! and verify if is visible
        await this.discountActivateMessage.waitFor()
        expect( await this.discountActivateMessage.isVisible()).toBe(true)

        // check that there is now a discounted price total showing
        await this.discountedValue.waitFor()
        const discountValueText = await this.discountedValue.innerText() //"345"
        const discountValueOnlyStringNumber = discountValueText.replace("$", "")
        const discountValueNumber = parseInt(discountValueOnlyStringNumber, 10)
        
        await this.totalValue.waitFor()
        const totalValueText = await this.totalValue.innerText() //"345"
        const totalValueOnlyStringNumber = totalValueText.replace("$", "")
        const totalValueNumber = parseInt(totalValueOnlyStringNumber, 10)
        //Check if discountValue is less than totalvalue
        expect(discountValueNumber).toBeLessThan(totalValueNumber)
        
        //await this.page.pause()
    }

    fillPaymentDetails = async (userData) => {
        await this.cardOwnerInput.waitFor()
        await this.cardOwnerInput.fill(userData.Owner)
        await this.cardNumberInput.waitFor()
        await this.cardNumberInput.fill(userData.Number)
        await this.validUntilInput.waitFor()
        await this.validUntilInput.fill(userData.validUntil)
        await this.cardCVCInput.waitFor()
        await this.cardCVCInput.fill(userData.CVC)
    }

    completePayment = async () => {
        await this.payButton.waitFor()
        await this.payButton.click()
        await this.page.waitForURL(/\/thank-you/, { timeout: 3000 })
    }
}