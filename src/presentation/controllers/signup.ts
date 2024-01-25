import { badRequest, serverError } from '../helpers/http-helper'
import { type EmailValidator, type Controller, type HttpRequest, type HttpResponse } from '../protocols'
import { InvalidParamError, MissingParamError } from '../erros'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const isValid = this.emailValidator.isValid(httpRequest.body.email)

      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      return badRequest(new MissingParamError(''))
    } catch (error) {
      return serverError()
    }
  }
}
