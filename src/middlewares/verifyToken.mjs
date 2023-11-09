import jwt from "jsonwebtoken";
import { ACCESS_TOKEN, OTP_TOKEN } from "../configs/secrets.mjs";

export function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401);

    const token = authHeader.split(" ")[1];
    jwt.verify(token, ACCESS_TOKEN, (err, decode) => {
        if (err) return res.status(403);
        req.user = decode.email;

        next();
    });
}

export function verifyOTPToken(req, res, next) {
    const { otp, email } = req.body;
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401);
    const token = authHeader.split(" ")[1];

    jwt.verify(token, OTP_TOKEN, (err, decode) => {
        if (err || decode.email != email || decode.otp != otp) {
            return res
                .status(403)
                .json({ msg: "Invalid OTP", error: { otp: "Invalid OTP" } });
        }
        next();
    });
}
