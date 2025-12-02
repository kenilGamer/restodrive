# Razorpay Payment Integration Setup

## Environment Variables

Add the following to your `.env.local` file:

```env
RAZORPAY_KEY_ID="rzp_test_RmnJwxoxuIXWS1"
RAZORPAY_KEY_SECRET="5h60MBhRfJoJoJGRT3jlO5V4"
RAZORPAY_WEBHOOK_SECRET="your-webhook-secret-here"
```

## Features Implemented

### 1. Payment API Routes

- **`/api/payments/create-order`** - Creates a Razorpay order
- **`/api/payments/verify`** - Verifies payment signature and records payment
- **`/api/payments/webhook`** - Handles Razorpay webhooks for payment events

### 2. Payment Methods Supported

- **Cash** - Direct cash payment (no gateway)
- **Card/UPI** - Razorpay checkout (supports cards, UPI, net banking, wallets)
- **Digital Wallet** - Razorpay checkout

### 3. Payment Flow

1. User selects payment method in POS
2. For digital payments:
   - Creates Razorpay order via API
   - Opens Razorpay checkout modal
   - User completes payment
   - Payment is verified and recorded in database
3. For cash payments:
   - Payment is marked as completed immediately

## Testing

### Test Cards (Razorpay Test Mode)

- **Success**: 4111 1111 1111 1111
- **Failure**: 4000 0000 0000 0002
- **CVV**: Any 3 digits
- **Expiry**: Any future date

### Test UPI IDs

- `success@razorpay`
- `failure@razorpay`

## Webhook Setup

1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/payments/webhook`
3. Select events:
   - `payment.captured`
   - `payment.failed`
   - `order.paid`
4. Copy the webhook secret to `RAZORPAY_WEBHOOK_SECRET`

## Production Checklist

- [ ] Switch to production Razorpay keys
- [ ] Update webhook URL to production domain
- [ ] Set up webhook secret
- [ ] Test all payment methods
- [ ] Set up payment failure handling
- [ ] Configure refund process
- [ ] Set up payment analytics

## Security Notes

- Never expose `RAZORPAY_KEY_SECRET` in client-side code
- Always verify payment signatures on the server
- Use HTTPS in production
- Validate all payment data before processing

