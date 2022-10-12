import knexConnection from "../loaders/db";
import ModelService from "../provider/model.service"
import { users, accounts } from './test-data' 
import { v4 } from "uuid";

const userServices = new ModelService("users")
const accountServices = new ModelService("accounts")

beforeAll(async () => {
  try {
    await knexConnection.migrate.latest({ directory: "migrations" });
    console.log("Migration complete");
  } catch (e) {
    console.log("Migration Failed");
  }
});

afterAll(async () => {
  try {
    await knexConnection.migrate.rollback({ directory: "migrations" });
    knexConnection.destroy();
  } catch (e) {
    console.log(e);
  }
});


describe("Authentication", () => {
  it("should sign up a user successfully", async () => {
    const id = v4();
    const userData: UserType = users[0]
    userData.id = id;
    await userServices.create(userData)
    const [ user ] = await userServices.findOne({ email: userData.email })

    expect(user.id).toBe(id);
    expect(user.email).toBe(userData.email)
  });

  it("should only sign up unique email address", async () => {
    const id = v4();
    const userData: UserType = users[2]
    userData.id = id;
    const [ user ] = await userServices.findOne({ email: userData.email })
    
    expect(user.id).not.toBe(id);
    expect(user.email).toBe(userData.email)
  });
});

describe("Accounts", () => {
    let userID: string;
    const funds = 3000

    it("should create an account successfully", async () => {
        const randomAccountNo = accounts[0]
        const userData: UserType = users[1]
        userData.id = v4();
        userID = userData.id
        await userServices.create(userData)
        await accountServices.create({
            user_id: userData.id,
            account_number: randomAccountNo,
            balance: 0
        })
        const [user] = await accountServices.findOne({user_id: userID})
    
        expect(user.id).toBe(1);
        expect(user.user_id).toBe(userID)
        expect(user.balance).toBe(0)
    });

    it("should return all registered account", async () => {
        const accnts = await accountServices.find()
    
        expect(accnts).toBeTruthy()
        expect(accnts.length).toBeGreaterThanOrEqual(1)
    });

    it("should update user account balance", async () => {
        await accountServices.update({ user_id: userID }, { balance: funds })
        const [account] = await accountServices.findOne({ user_id: userID })
    
        expect(account).toBeTruthy()
        expect(account.balance).toEqual(funds)
        expect(account.user_id).toBe(userID)
    });
});