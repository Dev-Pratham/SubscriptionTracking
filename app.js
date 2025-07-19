import express from 'express';
import { PORT,NODE_ENV } from './config/env.js';

const app=express();

app.get('/',(req,res)=>{
    res.send("Welcome to Subscription tracking Api")
})

app.listen(PORT,()=>{
    console.log(`Subscription tracking API is running on http://localhost:${PORT} ${NODE_ENV}`);
})

export default app;