import dotenv from 'dotenv'
dotenv.config()
import express from "express";
import cors from "cors";
import foodRouter from './routers/Food.router'
import userRouter from './routers/user.router'
import { dbConnect } from './configs/database.config';
dbConnect();
const app = express();
// since express does't support json we have to enable it
app.use(express.json())
app.use(cors({
    credentials: true,
    origin:["http://localhost:4200"]

}))


app.use('/api/foods', foodRouter )
app.use('/api/users', userRouter)

// the below line of code is telling express there is a request form 4200 to this server






const port = 5000;
app.listen(port, ()=>{
    console.log('wesite served on http:/localhost:' + port)
})

// if it were a js application we use node.js to run the server but our app is ts we need to install ts-node package