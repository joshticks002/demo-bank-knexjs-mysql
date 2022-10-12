import { Router } from "express" 
import accountController from "./accounts.controller"

const {
    createAccount,
    generateAccount,
    getAccount
} = accountController

const accountRouter = Router() 

accountRouter.post("/create-account", createAccount) 
accountRouter.get("/generate-account", generateAccount)
accountRouter.get("/account", getAccount)


export default accountRouter