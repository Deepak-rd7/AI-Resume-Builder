import jwt from "jsonwebtoken";



async function protect(req,res,next) {
    const token=req.headers.authorization;


    if(!token){
        return res.status(400).json({
            message:'Unauthorized'
        })
    }

    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY)

        req.userId=decoded.userId;
        next();
    } catch (error) {
                return res.status(401).json({
            message:'Unauthorized'
        })
    }
    
}

export default protect;