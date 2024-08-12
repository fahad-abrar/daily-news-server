import vine from '@vinejs/vine'
import { CustomErrors } from './customValidationErrors.js'

vine.errorReporter = () => new CustomErrors()

export const commentSchema = vine.object({
    comment: vine.string()
})

