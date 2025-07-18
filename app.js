import express from 'express';

const app=express();

app.get('/',(req,res)=>{
    res.send("Welcome to Subscription tracking Api")
})

app.listen(3000,()=>{
    console.log("Subscription tracking API is running on http://localhost:3000");
})

export default app;