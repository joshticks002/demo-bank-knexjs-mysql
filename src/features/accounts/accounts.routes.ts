import { Router } from "express" 
import authController from "./accounts.controller"

const {
    createAccount,
    generateAccount,
    getAccount
} = authController

const accountRouter = Router() 

accountRouter.post("/create-account", createAccount) 
accountRouter.get("/generate-account", generateAccount)
accountRouter.get("/account", getAccount)


export default accountRouter