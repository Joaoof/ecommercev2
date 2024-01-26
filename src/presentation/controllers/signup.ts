import { badRequest, serverError } from '../helpers/http-helper'
import { type EmailValidator, type Controller, type HttpRequest, type HttpResponse } from '../protocols'
import { InvalidParamError, MissingParamError } from '../erros'
import { type AddAccount } from '../../domain/usecases/add-account'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body

      const isValid = this.emailValidator.isValid(email)

      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      } // validação se o email for inválido

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      } // validação caso a senhas sejam diferentes

      this.addAccount.add({
        name,
        email,
        password
      })

      return badRequest(new MissingParamError(''))
    } catch (error) {
      return serverError()
    }
  }
}
