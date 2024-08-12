import FileHelper from "../helper/profileFileHelper.js"
import prisma from '../db/db.config.js'

class ProfileController{
    static async index(req, res){
        const user = req.user

        return res.status(200).json({
            success: true,
            message: 'user data is',
            user
        })
    }

    static async store(req, res){
        const user = req.user


        return res.status(200).json({
            success: true,
            message: '...'
        })
    }

    static async show(req, res){
        const user = req.user


        return res.status(200).json({
            success: true,
            message: '...'
        })
    }

    static async update(req, res){
        const { id }= req.params
        const user = req.user
        
        // Check if files are provided
        if(!req.files || Object.keys(req.files).length === 0){
            return res.status(400).json({success: false, message: 'image is required'})
        }

         // Validate the image
        const profile = req.files.profile
        const validation= FileHelper.imageValidator(profile.size, profile.mimetype)

        if(validation.status !== 200){
            return res.status(400).json({
                success:false,
                message: validation.message
            })
        }

        // if the image is valid
        const nameExt = profile.name.split('.')
        const imageName = nameExt[0]+ FileHelper.randomNum()+'.'+nameExt[nameExt.length - 1]
        const uploadPath = process.cwd()+'/public/image'+imageName

        profile.mv(uploadPath,(error)=>{
            if(error) throw error

        })


        await prisma.users.update({
            data:{
                profile: imageName
            },
            where:{
                id: Number( id )
            }
        })

        return res.status(200).json({
            message:'profile updated ',
            name: imageName,
            size: profile.size,
            mime: profile.mimetype

        })
    }

    static async delete(req, res){
        const user = req.user


        return res.status(200).json({
            success: true,
            message: '...'
        })
    }

}


export default ProfileController  