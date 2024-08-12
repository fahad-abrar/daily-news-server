import vine from '@vinejs/vine'
import { CustomErrors } from './customValidationErrors.js'

vine.errorReporter = () => new CustomErrors()

export const newsSchema = vine.object({
    title: vine.string().minLength(10).maxLength(100),
    content: vine.string().minLength(20).maxLength(200000)
})

export const storeSchema = vine.object({
    email: vine.string().email(),
    password: vine.string()

})