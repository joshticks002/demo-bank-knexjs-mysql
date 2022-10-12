"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const model_service_1 = __importDefault(require("../provider/model.service"));
const constant_1 = __importDefault(require("../constant"));
const joi_1 = __importDefault(require("joi"));
const BadRequestError_1 = __importDefault(require("../common/error-handler/BadRequestError"));
const accountServices = new model_service_1.default("accounts");
const Messages = constant_1.default.messages;
const validateAmount = async (req, res, next) => {
    try {
        const { id } = res.locals.payload;
        const Schema = joi_1.default.object({
            amount: joi_1.default.number().min(100).required()
        });
        await Schema.validateAsync(req.body);
        const [userAccount] = await accountServices.findOne({ user_id: id });
        if (!userAccount) {
            return next(new BadRequestError_1.default(Messages.noAccount));
        }
        next();
    }
    catch (error) {
        return next(new BadRequestError_1.default(error.message));
    }
};
exports.default = validateAmount;
