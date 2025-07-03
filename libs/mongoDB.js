'use server';

import mongoose from "mongoose";

export async function connectToDB() {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log('connected to mongoDB');
    }
    catch(error){
        console.log('Erroe Connecting to MOngoDB : ', error.message);
    }
}