const stripe = require("../../config/stripe");
const Order = require("../../models/orderProductModel");

const endpointSecret =
  "whsec_90a7c4aca554426d4469ebb88d2019a755dd1277702e9baf5074fca3883a3a0b";

async function getLineItems(lineItems, session) {
  let ProductItems = [];

  if (lineItems?.data?.length) {
    for (const item of lineItems.data) {
      const product = await stripe.products.retrieve(item.price.product);
      const productId = product.metadata.productId;
      const productData = {
        productId: productId,
        name: product.name,
        price: item.price.unit_amount / 100,
        quantity: item.quantity,
        image: product.images ? product.images : null, // Ensure we get the first image if available
      };
      ProductItems.push(productData);
    }
    console.log("Product Items", ProductItems);
    const orderDetails = {
      productDetails: ProductItems,
      email: session.customer_details.email,
      userId: session.metadata.userId,
      paymentDetails: {
        paymentId: session.payment_intent,
        payment_method_type: session.payment_method_types,
        payment_status: session.payment_status,
      },
      shipping_options: session.shipping_options,
      totalAmount: session.amount_total / 100,
    };

    const order = new Order(orderDetails);
    await order.save(); // Let's take it man
  }
  return ProductItems;
}

const webhooks = async (request, response) => {
  const sig = request.headers["stripe-signature"];

  const payloadString = JSON.stringify(request.body);
  let event;

  try {
    event = stripe.webhooks.constructEvent(payloadString, sig, endpointSecret);
  } catch (err) {
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );
      await getLineItems(lineItems, session);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.status(200).send();
};

module.exports = webhooks;
