import { Router } from "express" 
import transController from "./transactions.controller"
import validateAmount from "../../middleware/validate-amount"

const {
    fundAccount,
    withdrawFunds,
    transferFunds
} = transController

const transRouter = Router() 

transRouter.post("/fund", validateAmount, fundAccount)
transRouter.post("/withdraw", validateAmount, withdrawFunds)
transRouter.post("/transfer", transferFunds) 

export default transRouter