import mongoose from "mongoose";
export const ConnectToDB = async (uri) => {

    try{
        await mongoose.connect(uri)
        console.log("Database Connected Successfully.")
    }
    catch(error){
        console.log("Database connection error:",error);
    }
}
