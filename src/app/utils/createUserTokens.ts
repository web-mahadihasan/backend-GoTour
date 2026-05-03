import type { JwtPayload } from "jsonwebtoken";
import { generateToken } from "./jwt";
import config from "@/app/config/environment";

const createUserTokens = (payload: JwtPayload) => {
    const accessToken = generateToken(payload, config.JWT_ACCESS_SECRET, config.JWT_ACCESS_EXPIRES)
    const refreshToken = generateToken(payload, config.JWT_REFRESH_SECRET, config.JWT_REFRESH_EXPIRES)
    return {accessToken, refreshToken}
}

export default createUserTokens