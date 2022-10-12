"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("./auth.controller"));
const validate_signup_1 = __importDefault(require("../../middleware/validate-signup"));
const validate_token_1 = __importDefault(require("../../middleware/validate-token"));
const { createUser, handleLogin, handleLogout } = auth_controller_1.default;
const authRouter = (0, express_1.Router)();
authRouter.post("/sign-up", validate_signup_1.default, createUser);
authRouter.post("/login", handleLogin);
authRouter.get("/logout", validate_token_1.default, handleLogout);
exports.default = authRouter;
