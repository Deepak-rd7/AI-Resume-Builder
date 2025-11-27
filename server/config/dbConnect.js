import mongoose from "mongoose";

async function dbConnect() {
    try {
        mongoose.connection.on("connected",()=>{
            console.log("DB Connected succesfully");
        })
        let mongodbURI=process.env.MONGODB_URI;

        const projectName='ai-resume-builder';

        if(!mongodbURI){
            throw new Error("MONGODB_URI environment variable not set")
        }
        if(mongodbURI.endsWith('/')){
            mongodbURI=mongodbURI.slice(0,-1);
        }

        await mongoose.connect(`${mongodbURI}/${projectName}`)
    } catch (error) {
        console.log(error);
    }
}

export default dbConnect;