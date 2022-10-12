import { Router } from "express" 
import transController from "./transactions.controller"

const {
    fundAccount,
    withdrawFunds,
    transferFunds
} = transController

const transRouter = Router() 

transRouter.post("/fund", fundAccount)
transRouter.post("/withdraw", withdrawFunds)
transRouter.post("/transfer", transferFunds) 

export default transRouter