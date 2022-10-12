"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const accounts_controller_1 = __importDefault(require("./accounts.controller"));
const { createAccount, generateAccount, getAccount } = accounts_controller_1.default;
const accountRouter = (0, express_1.Router)();
accountRouter.post("/create-account", createAccount);
accountRouter.get("/generate-account", generateAccount);
accountRouter.get("/account", getAccount);
exports.default = accountRouter;
