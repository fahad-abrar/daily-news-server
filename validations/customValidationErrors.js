import { errors } from '@vinejs/vine'
import { fieldContext } from '@vinejs/vine/factories'

export class CustomErrors {

  hasErrors = false
  errors = {}
  report(
    message,
    rule,
    field,
    meta,
  ) {
    this.hasErrors = true
    this.errors[field.wildCardPath] = message
  }
    createError() {
    return new errors.E_VALIDATION_ERROR(this.errors)
  }
}
