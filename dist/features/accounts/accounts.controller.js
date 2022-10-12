"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApplicationError_1 = __importDefault(require("../../common/error-handler/ApplicationError"));
const model_service_1 = __importDefault(require("../../provider/model.service"));
const constant_1 = __importDefault(require("../../constant"));
const BadRequestError_1 = __importDefault(require("../../common/error-handler/BadRequestError"));
const chance_1 = __importDefault(require("chance"));
const accountServices = new model_service_1.default("accounts");
const Messages = constant_1.default.messages;
class AccountController {
    async createAccount(req, res, next) {
        try {
            const { account_nr } = req.body;
            const { id } = res.locals.payload;
            if (!account_nr) {
                return next(new BadRequestError_1.default("Provide Account Number"));
            }
            const [userHasAccount] = await accountServices.findOne({ user_id: id });
            if (userHasAccount) {
                return next(new BadRequestError_1.default(`User has a registered account: ${userHasAccount.account_number}`));
            }
            const data = {
                user_id: id,
                account_number: account_nr,
                balance: 0
            };
            await accountServices.create(data);
            const [userAccountDetails] = await accountServices.findOne({ user_id: id });
            res.status(201).json({
                message: Messages.accountAdded,
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
    async generateAccount(req, res, next) {
        try {
            const chance = new chance_1.default();
            const randomAccountNo = chance.natural({ min: 3000000000, max: 3099999999 });
            const [isExisting] = await accountServices.findOne({ account_number: randomAccountNo });
            if (isExisting) {
                return next(new BadRequestError_1.default(Messages.generateAccountError));
            }
            const userID = res.locals.payload.id;
            const [userHasAccount] = await accountServices.findOne({ user_id: userID });
            if (userHasAccount) {
                return next(new BadRequestError_1.default(`User has a registered account: ${userHasAccount.account_number}`));
            }
            res.status(200).json({
                message: Messages.useRandomAccount,
                data: {
                    "Account number": randomAccountNo
                },
                status: true
            });
        }
        catch (error) {
            return next(new ApplicationError_1.default(error.message));
        }
    }
    async getAccount(req, res, next) {
        try {
            const userID = res.locals.payload.id;
            const [userHasAccount] = await accountServices.findOne({ user_id: userID });
            if (!userHasAccount) {
                return next(new BadRequestError_1.default(Messages.noAccount));
            }
            res.status(200).json({
                message: "Fetched successfully",
                data: {
                    "Account details": userHasAccount
                },
                status: true
            });
        }
        catch (error) {
            return next(new ApplicationError_1.default(error.message));
        }
    }
}
exports.default = new AccountController();
