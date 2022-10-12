"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./features/auth/auth.routes"));
const accounts_routes_1 = __importDefault(require("./features/accounts/accounts.routes"));
const transactions_routes_1 = __importDefault(require("./features/transactions/transactions.routes"));
const validate_token_1 = __importDefault(require("./middleware/validate-token"));
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    res.status(200).json({
        message: "Service Running Fine",
        status: true,
        statusCode: 200,
        data: []
    });
});
router.use(auth_routes_1.default);
router.use(validate_token_1.default);
router.use(accounts_routes_1.default);
router.use(transactions_routes_1.default);
exports.default = router;
