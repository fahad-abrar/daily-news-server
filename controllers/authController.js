import prisma from '../db/db.config.js'
import vine from '@vinejs/vine';
import { logInSchema, registerSchema } from '../validations/authValidation.js';
import { errors } from '@vinejs/vine';
import bcrypt from 'bcryptjs'
import { messages } from '@vinejs/vine/defaults';
import jwt from 'jsonwebtoken'

class AuthController {
  static async register(req, res){
        try {
            const body = req.body;
            const validator = vine.compile(registerSchema)
            const payload = await validator.validate(body)

            // check the user exist or not
            const findUser = await prisma.users.findUnique({
              where:{
                email: payload.email
              }
            })

            if(findUser){
              return res.status(400).json({
                success: false,
                error:{
                  email: 'eamil already used , please use aonther one'
                }
              })
            }


            // encript the password
            const salt = bcrypt.genSaltSync(10)
            payload.password = bcrypt.hashSync(payload.password, salt)


            const user = await prisma.users.create({
              data: payload
            })

            return res.status(200).json({
              success: true,
              message : 'user created  successfully',
              user
            })

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
  };


  static async login(req, res) {
      try {
          const body = req.body;
          const validator = vine.compile(logInSchema);
          const payload = await validator.validate(body);

          // check if the user exists
          const user = await prisma.users.findUnique({
              where: {
                  email: payload.email
              }
          });

          if (!user) {
              return res.status(400).json({
                  success: false,
                  message: 'invalid email or password'
              });
          }

          // check if the password is correct
          const isMatch = bcrypt.compareSync(payload.password, user.password);

          if (!isMatch) {
              return res.status(400).json({
                  success: false,
                  message: 'invalid email or password'
              });
          }

          // generating token
          const payloaddata = {
            id: user.id,
            name: user.name,
            email: user.email
          }

          const token = jwt.sign(payloaddata, process.env.JWT_SECRET,{
            expiresIn: '365d'
          })


          return res.status(200).json({
              success: true,
              message: 'logged in successfully',
              access_token: `Bearer ${token}`
          });
      } catch (error) {
          console.log("the error is", error);
          if (error instanceof errors.E_VALIDATION_ERROR) {
              return res.status(400).json({ errors: error.message });
          } else {
              return res.status(500).json({
                  success: false,
                  message: 'something went wrong'
              });
          }
      }
  }

  static async logout(req, res){
      const { id } = req.params

      // find user exist or not
      const findUser = await prisma.users.findUnique({
        where:{
          id : Number( id )
        }
      })

      // find user is authorized or not
      if(!findUser.id===req.user.id){
        return res.status(400).json({
          success: false,
          message: 'unauthorized'
        })
      }

      

  }

  static async forgotPassword(req, res){
    const { email }= req.body
    try {
      // find the user is exist or not
      const user = await prisma.users.findUnique({
        where:{
          email: email
        }
      })
      if(!user){
        return res.status(400).json({
          success:false,
          message:" user does not exist "
        })
      }

      const secret = process.env.JWT_SECRET + user.password
      const payload = {
          id: user.id,
          email: user.email
        }
      const token = jwt.sign(payload, secret, {
          expiresIn:'365d'
        })
      const link = `http://localhost:4000/api/auth/resetPassword/${user.id}/${token}`

      console.log(link)
      return res.status(200).json({
        success: true,
        message: 'link created successfully',
        link
      })

    } catch (error) {
      console.log(error)
      return res.status(400).json({
        success: false,
        message: 'something went wrong',
      })
      
    }

  }

  static async resetPassword(req, res){
    const {token, id} = req.params
    const {password, confirmPassword} = req.body
    try {
      // find the user is exist or not
      const user = await prisma.users.findUnique({
        where:{
          id: Number(id)
        }
      })
      if(!user){
        return res.status(400).json({
          success:false,
          message:" user does not exist "
        })
      }

      // verify the token
      const secret = process.env.JWT_SECRET + user.password
      const verifyUser = jwt.verify(token, secret)
      if(!verifyUser){
        return res.status(400).json({
          success:false,
          message:" token verification failed"
        })
      }

      // check if the password is match
      if(password !== confirmPassword){
        return res.status(400).json({
          success: false,
          message: 'password does not match'
        })
      }

      //hash the new password
      const salt = bcrypt.genSaltSync(10)
      const hashPass = bcrypt.hashSync(password, salt)

      // update the new password
      const updatePassword = await prisma.users.update({
        data:{
          password: hashPass

        },
        where:{
          id: Number(id)
        }

      })
      console.log(password)
      console.log(updatePassword)
      return res.status(200).json({
        success: true,
        message: 'password updated successfully'
      })

    } catch (error) {
      console.log(error)
      return res.status(400).json({
        success: false,
        message: 'something went wrong',
      })
      
    }

  }
  

}

export default AuthController