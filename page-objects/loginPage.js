export class LoginPage{
    constructor(page){
        this.page = page
        this.loginToRegisterButton = page.locator('[data-qa="go-to-signup-button"]')
    }

    moveToSignup = async () => {
        await this.loginToRegisterButton.waitFor()
        await this.loginToRegisterButton.click()
        await this.page.waitForURL(/\/signup/, {timeout: 3000})
        //await this.page.pause()
    }
}