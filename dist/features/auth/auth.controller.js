"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApplicationError_1 = __importDefault(require("../../common/error-handler/ApplicationError"));
const model_service_1 = __importDefault(require("../../provider/model.service"));
const bcrypt = __importStar(require("bcryptjs"));
const config_1 = __importDefault(require("../../config"));
const constant_1 = __importDefault(require("../../constant"));
const NotAuthorizeError_1 = __importDefault(require("../../common/error-handler/NotAuthorizeError"));
const generate_token_1 = __importDefault(require("../../lib/generate-token"));
const BadRequestError_1 = __importDefault(require("../../common/error-handler/BadRequestError"));
const uuid_1 = require("uuid");
const userServices = new model_service_1.default("users");
const Messages = constant_1.default.messages;
class AuthController {
    async createUser(req, res, next) {
        try {
            const { username, email, password } = req.body;
            const isUser = await userServices.findOne({ email });
            if (isUser.length) {
                return next(new BadRequestError_1.default(Messages.userExist));
            }
            const salt = await bcrypt.genSalt(config_1.default.saltFactor);
            const hashedPassword = await bcrypt.hash(password, salt);
            const id = (0, uuid_1.v4)();
            await userServices.create({
                id,
                name: username,
                email,
                password: hashedPassword
            });
            const [user] = await userServices.findOne({ id });
            res.status(201).json({
                message: Messages.userAddedSuccess,
                data: {
                    id: user.id,
                    email: user.email
                },
                status: true
            });
        }
        catch (error) {
            return next(new ApplicationError_1.default(error.message));
        }
    }
    async handleLogin(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return next(new BadRequestError_1.default("Invalid Login Credentials"));
            }
            const [user] = await userServices.findOne({ email });
            if (!user) {
                res.set("WWW-Authenticate", "Basic realm=Access to login token, charset=UTF-8");
                return next(new NotAuthorizeError_1.default("Invalid Login Credentials"));
            }
            const isCorrectPassword = await bcrypt.compare(password, user.password);
            if (!isCorrectPassword) {
                res.set("WWW-Authenticate", "Basic realm=Access to login token, charset=UTF-8");
                return next(new NotAuthorizeError_1.default("Invalid Login Credentials"));
            }
            const { id, name } = user;
            const tokenData = {
                id,
                email,
                username: name
            };
            const token = (0, generate_token_1.default)(tokenData);
            const userDetails = {
                id: user.id,
                username: name,
                email,
            };
            res.status(200).json({
                message: "Login successfully",
                data: {
                    token,
                    user: userDetails
                },
                status: true
            });
        }
        catch (error) {
            return next(new ApplicationError_1.default(error));
        }
    }
    async handleLogout(req, res, next) {
        try {
            res.locals.payload = null;
            res.locals.token = null;
            res.status(200).json({
                statusCode: 200,
                success: true,
                message: "User logout completed"
            });
        }
        catch (error) {
            return next(new ApplicationError_1.default(error));
        }
    }
}
exports.default = new AuthController();
