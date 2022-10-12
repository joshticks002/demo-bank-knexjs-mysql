"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../loaders/db"));
const model_service_1 = __importDefault(require("../provider/model.service"));
const test_data_1 = require("./test-data");
const uuid_1 = require("uuid");
const userServices = new model_service_1.default("users");
const accountServices = new model_service_1.default("accounts");
beforeAll(async () => {
    try {
        await db_1.default.migrate.latest({ directory: "migrations" });
        console.log("Migration complete");
    }
    catch (e) {
        console.log("Migration Failed");
    }
});
afterAll(async () => {
    try {
        await db_1.default.migrate.rollback({ directory: "migrations" });
        db_1.default.destroy();
    }
    catch (e) {
        console.log(e);
    }
});
describe("Authentication", () => {
    it("should sign up a user successfully", async () => {
        const id = (0, uuid_1.v4)();
        const userData = test_data_1.users[0];
        userData.id = id;
        await userServices.create(userData);
        const [user] = await userServices.findOne({ email: userData.email });
        expect(user.id).toBe(id);
        expect(user.email).toBe(userData.email);
    });
    it("should only sign up unique email address", async () => {
        const id = (0, uuid_1.v4)();
        const userData = test_data_1.users[2];
        userData.id = id;
        const [user] = await userServices.findOne({ email: userData.email });
        expect(user.id).not.toBe(id);
        expect(user.email).toBe(userData.email);
    });
});
describe("Accounts", () => {
    let userID;
    const funds = 3000;
    it("should create an account successfully", async () => {
        const randomAccountNo = test_data_1.accounts[0];
        const userData = test_data_1.users[1];
        userData.id = (0, uuid_1.v4)();
        userID = userData.id;
        await userServices.create(userData);
        await accountServices.create({
            user_id: userData.id,
            account_number: randomAccountNo,
            balance: 0
        });
        const [user] = await accountServices.findOne({ user_id: userID });
        expect(user.id).toBe(1);
        expect(user.user_id).toBe(userID);
        expect(user.balance).toBe(0);
    });
    it("should return all registered account", async () => {
        const accnts = await accountServices.find();
        expect(accnts).toBeTruthy();
        expect(accnts.length).toBeGreaterThanOrEqual(1);
    });
    it("should update user account balance", async () => {
        await accountServices.update({ user_id: userID }, { balance: funds });
        const [account] = await accountServices.findOne({ user_id: userID });
        expect(account).toBeTruthy();
        expect(account.balance).toEqual(funds);
        expect(account.user_id).toBe(userID);
    });
});
