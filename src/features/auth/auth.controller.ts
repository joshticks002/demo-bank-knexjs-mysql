import { NextFunction, Request , Response } from "express";
import ApplicationError from "../../common/error-handler/ApplicationError";
import ModelService from "../../provider/model.service";
import * as bcrypt from "bcryptjs"
import Config from "../../config"
import Constant from "../../constant";
import NotAuthorizeError from "../../common/error-handler/NotAuthorizeError";
import generateToken from "../../lib/generate-token";
import BadRequestError from "../../common/error-handler/BadRequestError";
import { v4 } from "uuid";

const userServices = new ModelService("users") 
const Messages = Constant.messages

class AuthController {

    async createUser(
        req: Request, 
        res : Response,
        next: NextFunction
    ) {
        try {
            const { username, email, password } = req.body 
            
            const isUser = await userServices.findOne({ email })
            
            if (isUser.length) {
                return next(new BadRequestError(Messages.userExist))
            }
            
            const salt = await bcrypt.genSalt(Config.saltFactor);
            const hashedPassword = await bcrypt.hash(password, salt);
            const id = v4()
           
            await userServices.create({
                id,
                name: username,
                email,
                password: hashedPassword
            })

            const [user] = await userServices.findOne({id})

            res.status(201).json({
                message: Messages.userAddedSuccess, 
                data: {
                    id: user.id,
                    email: user.email
                }, 
                status : true
            })
        } catch (error: any) {
            return next(new ApplicationError(error.message))
        }
    }

    async handleLogin(
        req: Request, 
        res: Response,
        next: NextFunction
    ) {
        try {
            const { email, password } = req.body

            if (!email || !password) {
                return next(new BadRequestError("Invalid Login Credentials"))
            }
            
            const [ user ] = await userServices.findOne({ email })

            if (!user) {
                res.set("WWW-Authenticate", "Basic realm=Access to login token, charset=UTF-8")
                return next( new NotAuthorizeError("Invalid Login Credentials"))
            }
            
            const isCorrectPassword = await bcrypt.compare(password, user.password);
            
            if (!isCorrectPassword) {
                res.set("WWW-Authenticate", "Basic realm=Access to login token, charset=UTF-8")
                return next( new NotAuthorizeError("Invalid Login Credentials"))
            }
            const { id, name } = user
            
            const tokenData: Record<string,any> = {
                id,
                email,
                username: name
            }
            const token = generateToken(tokenData) as string
            
            const userDetails: Record<string,any> = {
                id: user.id,
                username: name,
                email, 
            }
            
            res.status(200).json({
                message: "Login successfully", 
                data: {
                    token, 
                    user : userDetails
                }, 
                status : true
            })
        } catch (error: any) {
            return next(new ApplicationError(error))
        }
    }

    async handleLogout(
        req: Request, 
        res: Response,
        next: NextFunction
    ) {
        try {
            res.locals.payload = null
            res.locals.token = null
            
            res.status(200).json({
                statusCode: 200,
                success: true, 
                message: "User logout completed"
            }) 
        } catch (error: any) {
            return next(new ApplicationError(error))
        }
    }
}

export default new AuthController()