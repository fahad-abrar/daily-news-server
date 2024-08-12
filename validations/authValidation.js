import vine from '@vinejs/vine'
import { CustomErrors } from './customValidationErrors.js'

vine.errorReporter = () => new CustomErrors()

export const registerSchema = vine.object({
    name: vine.string().minLength(2).maxLength(150),
    email: vine.string().email(),
    password: vine.string().minLength(4).maxLength(20)

})

export const logInSchema = vine.object({
    email: vine.string().email(),
    password: vine.string()

})