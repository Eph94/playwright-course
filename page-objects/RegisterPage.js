export class RegisterPage{
    constructor(page){
        this.page = page
        this.emailInput = page.getByPlaceholder('E-Mail') //Funciona pero Playwright Recomienda GetByRole por que es mas robusta al cambio
        this.passwordInput = page.getByRole('textbox', { name: 'Password' }) //Recomendada por playwright
        this.registerButton = page.getByRole('button', { name: 'Register' }) //Recomendada por playwright
    }

    signUpAsNewUser = async (email, password) => {
        //type into email input
        await this.emailInput.waitFor()
        await this.emailInput.fill(email)
        //type into password input
        await this.passwordInput.waitFor()
        await this.passwordInput.fill(password)
        //click Register Button
        await this.registerButton.waitFor()
        await this.registerButton.click()
        //await this.page.pause()
    }
}