import express from 'express'


import AuthController from '../controllers/authController.js'
import ProfileController from '../controllers/profileController.js'
import authMiddleware from '../middleware/authentication.js'
import NewsController from '../controllers/newsController.js'
import CommentController from '../controllers/commentController.js'


const router = express.Router()

// auth router
router.post('/auth/register', AuthController.register)
router.post('/auth/login', AuthController.login)
router.post('/auth/logout',authMiddleware, AuthController.logout)

// profile router
router.get('/auth/profile', authMiddleware,  ProfileController.index)
router.put('/auth/profile/:id', authMiddleware,  ProfileController.update)

// reset password
router.post('/auth/resetPassword', authMiddleware,  AuthController.forgotPassword)
router.post('/auth/resetPassword/:id/:token', authMiddleware,  AuthController.resetPassword)




// news router
router.get('/news', NewsController.index)
router.get('/news/:id', NewsController.show)
router.post('/news',authMiddleware, NewsController.store)
router.put('/news/:id', authMiddleware,  NewsController.update)
router.delete('/news/:id', authMiddleware,  NewsController.destroy)

// comment router
router.get('/comment', CommentController.getcomment)
router.post('/comment/:id',authMiddleware, CommentController.createComment)
router.put('/comment/:id', authMiddleware,  CommentController.updateComment)
router.delete('/comment/:id', authMiddleware,  CommentController.deleteComment)


export default router 