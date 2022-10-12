import { NextFunction, Request , Response } from "express";
import ApplicationError from "../../common/error-handler/ApplicationError";
import ModelService from "../../provider/model.service";
import Constant from "../../constant";
import BadRequestError from "../../common/error-handler/BadRequestError";
import Chance from "chance"

const userServices = new ModelService("users")
const accountServices = new ModelService("accounts")
const Messages = Constant.messages

class AccountController {

    async createAccount(
        req: Request, 
        res : Response,
        next: NextFunction
    ) {
        try {
            const { account_nr } = req.body
            const { id } = res.locals.payload

            if (!account_nr) {
                return next(new BadRequestError("Provide Account Number"));
            }

            const [ userHasAccount ] = await accountServices.findOne({ user_id: id })

            if (userHasAccount) {
                return next(new BadRequestError(`User has a registered account: ${userHasAccount.account_number}`))
            }

            const data = {
                user_id: id,
                account_number: account_nr,
                balance: 0
            }

            await accountServices.create(data)
            const [ userAccountDetails ] = await accountServices.findOne({user_id: id})
            
            res.status(200).json({
                message: Messages.accountAdded, 
                data: {
                    "Account details": userAccountDetails
                }, 
                status : true
            })
        } catch (error: any) {
            return next(new ApplicationError(error.message))
        }
    }

    async generateAccount(
        req: Request, 
        res : Response,
        next: NextFunction
    ) {
        try {
            const chance = new Chance()
            const randomAccountNo = chance.natural({ min: 3000000000, max: 3099999999 })
            const [ isExisting ] = await accountServices.findOne({ account_number: randomAccountNo })

            if (isExisting) {
                return next(new BadRequestError(Messages.generateAccountError))
            }

            const userID = res.locals.payload.id
            const [ userHasAccount ] = await accountServices.findOne({ user_id: userID })

            if (userHasAccount) {
                return next(new BadRequestError(`User has a registered account: ${userHasAccount.account_number}`))
            }
            
            res.status(200).json({
                message: Messages.useRandomAccount, 
                data: {
                    "Account number": randomAccountNo
                }, 
                status : true
            })
        } catch (error: any) {
            return next(new ApplicationError(error.message))
        }
    }

    async getAccount(
        req: Request, 
        res : Response,
        next: NextFunction
    ) {
        try {
            const userID = res.locals.payload.id
            const [ userHasAccount ] = await accountServices.findOne({ user_id: userID })

            if (!userHasAccount) {
                return next(new BadRequestError(`User has no registered account`))
            }
            
            res.status(200).json({
                message: "Fetched successfully", 
                data: {
                    "Account details": userHasAccount
                }, 
                status : true
            })
        } catch (error: any) {
            return next(new ApplicationError(error.message))
        }
    }

}

export default new AccountController()