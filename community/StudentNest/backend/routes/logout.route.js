import express from 'express'

const router = express.Router()

router.post('/logout', (req, res)=>{

    res.clearCookie('token')
    res.status(200).json({message: 'Logout Success'})

})


export default router