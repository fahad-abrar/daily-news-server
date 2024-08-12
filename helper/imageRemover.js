import fs from 'fs'

export const imageRemover = (imageName) =>{
    const path = process.cwd()+'/public/image'+imageName
    
    if(fs.existsSync(path)){
        fs.unlinkSync(path)
    }
}