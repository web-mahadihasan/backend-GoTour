import type { Response } from "express";

const setAuthCookie = async (res: Response, accessToken: string, refreshToken: string) => {
    
    if(accessToken) {
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            maxAge: 60 * 60 * 1000,
        })
    }

    if(refreshToken) {
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
    }
}
export default setAuthCookie;