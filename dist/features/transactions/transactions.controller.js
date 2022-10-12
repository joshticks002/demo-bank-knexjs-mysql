"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApplicationError_1 = __importDefault(require("../../common/error-handler/ApplicationError"));
const model_service_1 = __importDefault(require("../../provider/model.service"));
const constant_1 = __importDefault(require("../../constant"));
const BadRequestError_1 = __importDefault(require("../../common/error-handler/BadRequestError"));
const accountServices = new model_service_1.default("accounts");
const Messages = constant_1.default.messages;
class TransactionController {
    async fundAccount(req, res, next) {
        try {
            const { amount } = req.body;
            const { id } = res.locals.payload;
            const [userAccount] = await accountServices.findOne({ user_id: id });
            await accountServices.update({ user_id: id }, { balance: userAccount.balance + amount });
            const [userAccountDetails] = await accountServices.findOne({ user_id: id });
            res.status(201).json({
                message: "Funds deposited successfully",
                data: {
                    "Account details": userAccountDetails
                },
                status: true
            });
        }
        catch (error) {
            return next(new ApplicationError_1.default(error.message));
        }
    }
    async withdrawFunds(req, res, next) {
        try {
            const { amount } = req.body;
            const { id } = res.locals.payload;
            const [userAccount] = await accountServices.findOne({ user_id: id });
            if (userAccount.balance < amount) {
                return next(new BadRequestError_1.default("Insufficient funds"));
            }
            await accountServices.update({ user_id: id }, { balance: userAccount.balance - amount });
            const [userAccountDetails] = await accountServices.findOne({ user_id: id });
            res.status(201).json({
                message: "Withdrawal successfully",
                data: {
                    "Account details": userAccountDetails
                },
                status: true
            });
        }
        catch (error) {
            return next(new ApplicationError_1.default(error.message));
        }
    }
    async transferFunds(req, res, next) {
        try {
            const { amount, receiver_account } = req.body;
            const { id } = res.locals.payload;
            if (!amount || amount < 0 || !receiver_account) {
                return next(new BadRequestError_1.default("Invalid credentials"));
            }
            const [[userAccount], [receiverAccount]] = await Promise.all([
                accountServices.findOne({ user_id: id }),
                accountServices.findOne({ account_number: receiver_account })
            ]);
            if (!userAccount) {
                return next(new BadRequestError_1.default(Messages.noAccount));
            }
            if (!receiverAccount) {
                return next(new BadRequestError_1.default('Account not found'));
            }
            if (userAccount.balance < amount) {
                return next(new BadRequestError_1.default("Insufficient funds"));
            }
            await accountServices.update({ user_id: id }, { balance: userAccount.balance - amount });
            await accountServices.update({ account_number: receiver_account }, { balance: receiverAccount.balance + amount });
            const [userAccountDetails] = await accountServices.findOne({ user_id: id });
            res.status(201).json({
                message: "Funds transferred successfully",
                data: {
                    "Account details": userAccountDetails
                },
                status: true
            });
        }
        catch (error) {
            return next(new ApplicationError_1.default(error.message));
        }
    }
}
exports.default = new TransactionController();
