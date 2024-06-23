import express from 'express'
import cors from 'cors'
import { sendMail } from './Controllers/SendMail.js';

const PORT = 8000


const app = express()

app.use(cors());

app.get('/', (req,res) => {
    res.send("Helllo world")
})

app.get('/sendemail/:userId', sendMail)

app.listen(PORT, () =>{
    console.log(`Server is running at ${PORT}`)
})



