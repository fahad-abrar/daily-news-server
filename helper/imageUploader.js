import FileHelper from "./profileFileHelper.js"


export const imageUploder =(image)=>{
   

    const imageExt = image.name.split('.')
    const imageName = imageExt[0]+FileHelper.randomNum()+'.'+imageExt[imageExt.length - 1]

    const uploadPath = process.cwd()+'/public/image'+ imageName

    image.mv(uploadPath,(error)=>{
        if(error) throw error

    })

    return imageName

}