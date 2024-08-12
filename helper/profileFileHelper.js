import {v4 as uuid} from 'uuid'

class FileHelper{
    static imageValidator(size, mime){

        const mimeType = ['image/png', 'image/jpg','image/jpeg','image/svg','image/gif','image/webp']

        const bitesToMb = size/(1024*1024)

        if(bitesToMb > 5){
            return resizeBy.status(400).json({message:'image size must be less than 5 MB'})
        }

        if(!mimeType.includes(mime)){
            return resizeBy.status(400).json({message:'image must be jpg, png, jpeg, svg, gif, webp '})

        }
        return { status:200 , message: 'image is valid' }
    }


    static randomNum(){
        return uuid()
    }

    static imageUrl(imageName){
        return `${process.env.APP_URL}/image/${imageName}`
    }


}
export default FileHelper