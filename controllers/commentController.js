import prisma from "../db/db.config.js";
import FileHelper from "../helper/profileFileHelper.js";
import { imageUploder } from "../helper/imageUploader.js";
import { imageRemover } from "../helper/imageRemover.js";

class CommentController {
    static async getcomment(req, res){
        try {
            const comment = await prisma.comment.findMany({
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            profile: true
                        }
                    },
                    news: {
                        select: {
                            id: true,
                            title: true
                        }
                    }
                }
    
            })
            return res.status(200).json({
                success: true,
                message:"comments retrieved successfully ",
                comment
            })
            
        } catch (error) {
            console.error('Error creating comment:', error.message); // Log the exact error
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message // Include error message in the response for debugging
            });
            
        }
    }

    static async createComment(req, res) {
        try {
            const { id } = req.params;
            const user = req.user;
            const body = req.body;

            // check comment is given or not
            if(!body.comment){
                return res.status(400).json({
                    success:false,
                    message:'comment is required'
                })
            }

            // Check if the news exists
            const news = await prisma.news.findUnique({
                where: {
                    id: Number(id)
                }
            });

            if (!news) {
                return res.status(404).json({
                    success: false,
                    message: 'News not found'
                });
            }

            console.log('News User ID:', news.user_id);
            console.log('Logged in User ID:', user.id);

            // Check if the user is authorized to comment
            if (user.id !== news.user_id) {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized to comment'
                });
            }

            // Handle image upload if present
            let imageName = null;
            const image = req?.files?.image;

            if (image) {
                const imageValidation = FileHelper.imageValidator(image.size, image.mimetype);

                if (imageValidation.status !== 200) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid image format or size'
                    });
                }

                imageName = imageUploder(image);
                console.log('Uploaded Image Name:', imageName);

                if (imageName) {
                    body.image = imageName;
                }
            }

            // Prepare the payload for creating the comment
            const payload = {
                comment: body.comment,
                user_id: user.id, 
                news_id: news.id,
                image: body.image 
            };

            // Create the comment in the database
            const data = await prisma.comment.create({
                data: payload,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            profile: true
                        }
                    },
                    news: {
                        select: {
                            id: true,
                            title: true
                        }
                    }
                }
            });

            return res.status(201).json({
                success: true,
                message: 'Comment created successfully',
                data
            });

        } catch (error) {
            console.error('Error creating comment:', error.message); // Log the exact error
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message // Include error message in the response for debugging
            });
        }
    }

    static async updateComment(req, res) {
        const { id } = req.params
        const user =  req.user
        const newData = req.body

        try {
            
        const comment = await prisma.comment.findUnique({
            where:{
                id: Number( id )
            }
        })
        console.log(comment)

        // Check if the comment exists
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'comment not found',
            });
        }

        // Check if the user is authorized to update the comment
        if(user.id !== comment.user_id){
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
        if(comment.image){
            imageRemover(comment.image) 
        }

        // upload the new image
        const imageName = imageUploder(image)
        newData.image = imageName

        }

        const newComment = await prisma.comment.update({
            data: newData,
            where:{
                id: Number( id )
            }
        })

        return res.status(200).json({
            success:true,
            message:" updated successfully",
            newComment
        })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
           
        }
   
    }

    static async deleteComment(req, res) {
        const { id } = req.params
        const user = req.user

        try {
            // Find the comment to check if it exists
            const comment =  await prisma.comment.findUnique({
                where:{
                    id: Number( id )
                }
            })

            if (!comment) {
                return res.status(404).json({
                    success: false,
                    message: 'comment not found',
                });
            }

            // Check if the user is authorized to delete the news article
            if (user.id !== comment.user_id) {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized',
                });
            }

            // If an image is associated, remove it
            if (comment.image) {
                imageRemover(comment.image);
            }


            // Delete the news article
            await prisma.comment.delete({
                where: {
                    id: Number(id),
                },
            });
    
            return res.status(200).json({
                success:true,
                message:'deleted successfully',
                comment
            }) 
            
        } catch (error) {
            console.error('Error deleting news:', error);
            return res.status(500).json({
                success: false,
                message: 'An error occurred while deleting the comment',})
            }

    }
    
}


export default CommentController