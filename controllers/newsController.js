import vine from "@vinejs/vine"
import { newsSchema } from "../validations/newsValidation.js"
import { errors } from '@vinejs/vine';
import FileHelper from "../helper/profileFileHelper.js";
import prisma from "../db/db.config.js";
import { imageUploder } from "../helper/imageUploader.js";
import { imageRemover } from "../helper/imageRemover.js";


class NewsController{
    static async index(req, res){
        try {
            const page = Number(req.query.page) || 1
            const limit = Number(req.query.limit) || 2

            if(page <= 0){
                page = 1
            }
            if(limit >= 15){
                limit = 5
            }
            const skip = (page - 1) * limit

            const news = await prisma.news.findMany({
                take: limit,
                skip: skip,
                include:{
                user:{
                    select:{
                        id:true,
                        name:true,
                        profile:true
                    }
                }
               } 
            }) 
            const totalNews = await prisma.news.count()
            const totalPage = Math.ceil(totalNews/limit)
            

            return res.status(200).json({news, metadata:{
                totalPage,
                totalNews,
                currentPage: page,
                currentLimit : limit
            }})
            
            
        


        } catch (error) {
            console.log("the error is" ,error)
            if (error instanceof errors.E_VALIDATION_ERROR) {
              return res.status(400).json({errors : error.messages})
            }else{
              return res.status(500).json({
                success: false,
                message: 'something went wrong'
              })
            }
            
        }

    }

    static async store(req, res){
        try {
            const user = req.user
            const data = req.body
            const validator = vine.compile(newsSchema)
            const payload = await validator.validate(data)
            console.log(data)
            console.log(req.user)

            if (req.files === null || Object.keys(req.files).length === 0){
                return res.status(400).json({
                    success:false,
                    message: ' image is required'
                })
            }
            const image = req.files.image
            const imagevalidation = FileHelper.imageValidator(image.size, image.mimetype)

            if(imagevalidation.status!==200){
                return res.status(400).json({
                    success:false,
                    message:' something went wrong'
                })
            }
            const imageExt = image.name.split('.')
            const imageName = imageExt[0]+FileHelper.randomNum()+'.'+imageExt[imageExt.length - 1]

            const uploadPath = process.cwd()+'/public/image'+ imageName

            image.mv(uploadPath,(error)=>{
                if(error) throw error
    
            })

            const newsdata = await prisma.news.create({
                data :{title:req.body.title,
                content:req.body.content,
                image:imageName,
                user_id:user.id
            },
                include:{
                    user:{
                        select:{
                            id:true,
                            name:true,
                            profile:true
                        }
                    }
                }
        })
            return res.status(200).json({success:true, user, newsdata})

        } catch (error) {
            console.log("the error is" ,error)
            if (error instanceof errors.E_VALIDATION_ERROR) {
              return res.status(400).json({errors : error.messages})
            }else{
              return res.status(500).json({
                success: false,
                message: 'something went wrong'
              })
            }
            
        }

    }

    static async show(req, res){
        const { id } = req.params
        try {
            const news = await prisma.news.findUnique({
                where:{
                    id: Number(id)
                },
                include:{
                    user:{
                        select:{
                            id:true,
                            name:true,
                            profile:true
                        }

                    }
                }
            })

            return res.status(200).json({
                success:true,
                news: news
            })
            
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'An error occurred while deleting the news',})
            
        }
        

    }
    static async update(req, res){
        const { id } = req.params
        const user =  req.user
        const newData = req.body

        try {
            
        const news = await prisma.news.findUnique({
            where:{
                id: Number( id )
            }
        })

        // Check if the news article exists
        if (!news) {
            return res.status(404).json({
                success: false,
                message: 'News article not found',
            });
        }

        // Check if the user is authorized to update the news article
        if(user.id !== news.user_id){
            return res.status(400).json({
                success:false,
                message: 'unauthorised'
            })
        }

        // Handle image upload if present
        const image = req?.files?.image

        if(image){
            const imagevalidation = FileHelper.imageValidator(image.size, image.mimetype)

                if(imagevalidation.status!==200){
                    return res.status(400).json({
                    success:false,
                    message:' something went wrong'
            })
        }
        // remove the ole image
        imageRemover(news.image)

        // upload the new image
        const imageName = imageUploder(image)
        newData.image = imageName

        }

        const updateNews = await prisma.news.update({
            data: newData,
            where:{
                id: Number( id )
            }
        })

        return res.status(200).json({
            success:true,
            message:" updated successfully",
            updateNews
        })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
            
        }

    }
    static async destroy(req, res){
        const { id } = req.params
        const user = req.user

        try {
            // Find the news article to check if it exists
            const news =  await prisma.news.findUnique({
                where:{
                    id: Number( id )
                }
            })

            if (!news) {
                return res.status(404).json({
                    success: false,
                    message: 'News article not found',
                });
            }

            // Check if the user is authorized to delete the news article
            if (user.id !== news.user_id) {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            // If an image is associated, remove it
            if (news.image) {
                imageRemover(news.image);
            }


            // Delete the news article
            await prisma.news.delete({
                where: {
                    id: Number(id),
                },
            });
    
            return res.status(200).json({
                success:true,
                message:'deleted successfully'
            }) 
            
        } catch (error) {
            console.error('Error deleting news:', error);
            return res.status(500).json({
                success: false,
                message: 'An error occurred while deleting the news',})
            }


    }

}

export default NewsController