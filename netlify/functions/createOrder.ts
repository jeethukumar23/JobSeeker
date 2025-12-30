import Razorpay from "razorpay"

export const handler = async (event:any) => {
  try {
    const { amount } = JSON.parse(event.body)

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "job_post_order"
    })

    return {
      statusCode: 200,
      body: JSON.stringify(order)
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Payment failed" })
    }
  }
}
