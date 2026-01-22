import jwt from 'jsonwebtoken'
import dotenvx from '@dotenvx/dotenvx'; // loads .env automatically

dotenvx.config({path:'../.env'})

export function TokenGeneration(id, email){
    const token = jwt.sign({id,email},process.env.JWT_SECRATE_KEY, {expiresIn: '1d'})
    return token
}

// console.log(token)