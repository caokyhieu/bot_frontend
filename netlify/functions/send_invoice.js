const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  try {
    // Parse the incoming request body
    const { chat_id, total_amount } = JSON.parse(event.body);

    if (!chat_id || !total_amount) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing chat_id or total_amount' }),
      };
    }

    // Define the Telegram API endpoint for sending an invoice
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN; // Store your bot token in Netlify environment variables
    const TELEGRAM_PROVIDER_TOKEN = process.env.TELEGRAM_PROVIDER_TOKEN; // Store the provider token
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendInvoice`;

    // Construct the payload
    const payload = {
      chat_id: chat_id,
      title: "Food Order",
      description: "Payment for your food order",
      payload: `order_${chat_id}`, // Unique identifier for the payment
      provider_token: TELEGRAM_PROVIDER_TOKEN,
      currency: 'USD',
      prices: [
        { label: 'Total', amount: total_amount * 100 }, // Convert to cents
      ],
    };

    // Send the invoice request to the Telegram API
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ message: result.description }),
      };
    }

    // Return the success response
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };

  } catch (error) {
    // Handle any errors that occur
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error', error: error.message }),
    };
  }
};
