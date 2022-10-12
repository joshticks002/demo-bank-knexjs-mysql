import { Router } from "express" 
import authController from "./auth.controller"
import validateSignupData from "../../middleware/validate-signup"
import validateToken from "../../middleware/validate-token"

const {
    createUser, 
    handleLogin,
    handleLogout
} = authController

const authRouter = Router() 


authRouter.post("/sign-up", validateSignupData, createUser) 
authRouter.post("/login", handleLogin) 
authRouter.get("/logout", validateToken, handleLogout)

export default authRouter

