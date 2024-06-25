import express from 'express'
import cors from 'cors'
import { sendMail } from './Controllers/SendMail.js';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import crypto from 'crypto';

const PORT = process.env.PORT || 8000


const app = express()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));


dotenv.config()

app.get('/', (req,res) => {
    res.send("Hello world")
})


  app.post("/order", async (req, res) => {

    
try {
        const razorpay = new Razorpay({
            key_id:"rzp_live_fHsSBLQQOxeKlA",
            key_secret:"jbycwjZLOrVfRDs77i2kHM6x",
        });
    
        const options = req.body;
    
        const order = await razorpay.orders.create(options);
    
        if(!order){
            return res.status(500).send("Error");
        }
    
        res.json(order);
} catch (error) {
    res.status(500).send("error")
    console.log("Error", error)
}
  })


  app.post("/order/validate", async(req, res) =>{
       
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature} = req.body

    const sha = crypto.createHmac("sha256","jbycwjZLOrVfRDs77i2kHM6x");
    // order_id + "|" + razorpay_payment_id
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);

    const digest = sha.digest("hex");
    if(digest !== razorpay_signature)
        {
            res.status(400).json({msg:"Transaction is not legit!"});
        }

        res.status(200).json({
            msg:"success",
            orderId:razorpay_order_id,
            paymentId:razorpay_payment_id
        })
  })

app.get('/sendemail/:userId', sendMail)

app.listen(PORT, () =>{
    console.log(`Server is running at ${PORT}`)
})



