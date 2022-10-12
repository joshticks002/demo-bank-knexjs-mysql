"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const constant_1 = __importDefault(require("./constant"));
app_1.default.listen(config_1.default.serverPort, () => console.log(constant_1.default.messages.serverUp));
