import { Request, Response, NextFunction } from "express";
import ModelService from "../provider/model.service";
import Constant from "../constant";
import Joi from "joi";
import BadRequestError from "../common/error-handler/BadRequestError";

const accountServices = new ModelService("accounts")
const Messages = Constant.messages

const validateAmount = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = res.locals.payload
        
        const Schema = Joi.object({
            amount: Joi.number().min(100).required()
        });

        await Schema.validateAsync(req.body);

        const [ userAccount ] = await accountServices.findOne({ user_id: id })

        if (!userAccount) {
            return next(new BadRequestError(Messages.noAccount))
        }

        next();
    } catch (error: any) {
        return next(new BadRequestError(error.message));
    }
};

export default validateAmount;