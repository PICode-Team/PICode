import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../constants/token'
import { TAuthToken } from '../types/token.types'

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET) as TAuthToken
    } catch {
        // Authorization failed
        return undefined
    }
}

export function signToken(token: TAuthToken) {
    return jwt.sign(token, JWT_SECRET)
}