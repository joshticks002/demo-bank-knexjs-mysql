import { NextFunction, Request , Response } from "express";
import ApplicationError from "../../common/error-handler/ApplicationError";
import ModelService from "../../provider/model.service";
import Constant from "../../constant";
import BadRequestError from "../../common/error-handler/BadRequestError";

const accountServices = new ModelService("accounts")
const Messages = Constant.messages

class TransactionController {

    async fundAccount(
        req: Request, 
        res : Response,
        next: NextFunction
    ) {
        try {
            const { amount } = req.body
            const { id } = res.locals.payload

            if (!amount || amount < 0) {
                return next(new BadRequestError("Invalid funds"));
            }

            const [ userAccount ] = await accountServices.findOne({ user_id: id })

            if (!userAccount) {
                return next(new BadRequestError(Messages.noAccount))
            }

            await accountServices.update({ user_id: id },{ balance: userAccount.balance + amount })

            const [ userAccountDetails ] = await accountServices.findOne({user_id: id})
            
            res.status(201).json({
                message: "Fund deposited successfully", 
                data: {
                    "Account details": userAccountDetails
                }, 
                status : true
            })
        } catch (error: any) {
            return next(new ApplicationError(error.message))
        }
    }

    async withdrawFunds(
        req: Request, 
        res : Response,
        next: NextFunction
    ) {
        try {
            const { amount } = req.body
            const { id } = res.locals.payload

            if (!amount || amount < 0) {
                return next(new BadRequestError("Invalid funds"));
            }

            const [ userAccount ] = await accountServices.findOne({ user_id: id })

            if (!userAccount) {
                return next(new BadRequestError(Messages.noAccount))
            }

            if (userAccount.balance < amount) {
                return next(new BadRequestError("Insufficient funds"))
            }

            await accountServices.update({ user_id: id },{ balance: userAccount.balance - amount })

            const [ userAccountDetails ] = await accountServices.findOne({user_id: id})
            
            res.status(201).json({
                message: "Withdrawal successfully", 
                data: {
                    "Account details": userAccountDetails
                }, 
                status : true
            })
        } catch (error: any) {
            return next(new ApplicationError(error.message))
        }
    }

    async transferFunds(
        req: Request, 
        res : Response,
        next: NextFunction
    ) {
        try {
            const { amount, receiver_account } = req.body
            const { id } = res.locals.payload

            if (!amount || amount < 0 || !receiver_account) {
                return next(new BadRequestError("Invalid credentials"));
            }

            const [ [userAccount], [receiverAccount] ] = await Promise.all([
                accountServices.findOne({ user_id: id }),
                accountServices.findOne({ account_number: receiver_account })
            ])

            if (!userAccount) {
                return next(new BadRequestError(Messages.noAccount))
            }

            if (!receiverAccount) {
                return next(new BadRequestError('Account not found'))
            }

            if (userAccount.balance < amount) {
                return next(new BadRequestError("Insufficient funds"))
            }

            await accountServices.update({ user_id: id }, { balance: userAccount.balance - amount })
            await accountServices.update({ account_number: receiver_account }, { balance: receiverAccount.balance + amount })

            const [ userAccountDetails ] = await accountServices.findOne({user_id: id})
            
            res.status(201).json({
                message: "Funds transferred successfully", 
                data: {
                    "Account details": userAccountDetails
                }, 
                status : true
            })
        } catch (error: any) {
            return next(new ApplicationError(error.message))
        }
    }
}

export default new TransactionController()