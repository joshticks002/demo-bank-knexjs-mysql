"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transactions_controller_1 = __importDefault(require("./transactions.controller"));
const { fundAccount, withdrawFunds, transferFunds } = transactions_controller_1.default;
const transRouter = (0, express_1.Router)();
transRouter.post("/fund", fundAccount);
transRouter.post("/withdraw", withdrawFunds);
transRouter.post("/transfer", transferFunds);
exports.default = transRouter;
