"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const BadRequestError_1 = __importDefault(require("../common/error-handler/BadRequestError"));
const validateSignupData = async (req, res, next) => {
    try {
        const { password, confirmPassword } = req.body;
        const Schema = joi_1.default.object({
            email: joi_1.default.string().required(),
            username: joi_1.default.string().required(),
            password: joi_1.default.string().min(8).required(),
            confirmPassword: joi_1.default.string().min(8).required(),
        });
        await Schema.validateAsync(req.body);
        if (password !== confirmPassword) {
            return next(new BadRequestError_1.default("Passwords do not match"));
        }
        next();
    }
    catch (error) {
        return next(new BadRequestError_1.default(error.message));
    }
};
exports.default = validateSignupData;
