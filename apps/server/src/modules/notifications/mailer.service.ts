export const sendReceiptEmail = async (
  to: string,
  customerName: string,
  meterNumber: string,
  amount: number,
  units: number,
  token: string
) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Electricity Purchase Receipt</h2>
      <p>Dear ${customerName},</p>
      <p>Your electricity purchase was successful. Here are your details:</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Meter Number</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${meterNumber}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Amount Paid</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">NGN ${amount.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Units Credited</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${units.toFixed(2)} kWh</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Token</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd; font-size: 18px; font-weight: bold; color: #059669;">${token}</td>
        </tr>
      </table>
      <p>Thank you for using PHEDC Online Payment System.</p>
    </div>
  `;

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY || '',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: "PHEDC Payments",
          email: "no-reply@phedc.example"
        },
        to: [
          {
            email: to,
            name: customerName
          }
        ],
        subject: "Your Electricity Purchase Receipt",
        htmlContent: htmlContent
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Brevo API Error:', errorData);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to send email via Brevo:', error);
    return null;
  }
};
