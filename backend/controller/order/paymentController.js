const stripe = require("../../config/stripe");
const userModel = require("../../models/userModel");

const paymentController = async (request, response) => {
  try {
    const { cartItems } = request.body;

    // Fetch the user from the database
    const user = await userModel.findOne({ _id: request.userId });
    if (!user) {
      return response
        .status(404)
        .json({ message: "User not found", error: true, success: false });
    }

    // Prepare the Stripe session parameters
    const params = {
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      shipping_options: [
        {
          shipping_rate: "shr_1PRosCItW4ANPBW3PMK7WWjh",
        },
      ],
      customer_email: user.email,
      metadata: {
        userId: request.userId,
      },
      line_items: cartItems.map((item) => {
        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: item.productId.productName,
              images:
                item.productId.productImage instanceof Array
                  ? item.productId.productImage
                  : [item.productId.productImage],
              metadata: {
                productId: item.productId._id,
              },
            },
            unit_amount: item.productId.sellingPrice * 100,
          },
          adjustable_quantity: {
            enabled: true,
            minimum: 1,
          },
          quantity: item.quantity,
        };
      }),
      success_url: `${"https://e-commerce-up-rithvikreddy.vercel.app"}/success`,
      cancel_url: `${"https://e-commerce-up-rithvikreddy.vercel.app"}/cancel`,
    };

    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create(params);

    // Respond with the session data
    response.status(303).json(session);
  } catch (error) {
    // Handle errors and respond with appropriate status and message
    response.status(500).json({
      message: error?.message || "An error occurred during payment processing",
      error: true,
      success: false,
    });
  }
};

module.exports = paymentController;
