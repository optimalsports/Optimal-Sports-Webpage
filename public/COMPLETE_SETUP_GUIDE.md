# Complete Stripe + Printful Integration Guide

## 🎯 What You Need from Your Stripe Account

### 1. **API Keys** (Required)
Get these from Stripe Dashboard → Developers → API keys:
- **Publishable Key** (starts with `pk_test_` or `pk_live_`)
- **Secret Key** (starts with `sk_test_` or `sk_live_`)

### 2. **Webhook Secret** (Highly Recommended)
Get this from Stripe Dashboard → Developers → Webhooks:
- **Webhook Signing Secret** (starts with `whsec_`)
- This ensures orders are created only after confirmed payment

---

## 🔧 Environment Variables Needed

Add these to your `.env.local` (development) and Vercel (production):

```bash
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Printful Key
PRINTFUL_API_KEY=your_printful_api_key_here

# Vercel KV (for order tracking)
KV_REST_API_URL=your_kv_url
KV_REST_API_TOKEN=your_kv_token
KV_REST_API_READ_ONLY_TOKEN=your_kv_read_only_token
```

---

## 🚀 Complete Setup Steps

### Step 1: Get Stripe API Keys
1. Log into [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to **Developers → API keys**
3. Copy both keys (use TEST mode first)
4. Add to Vercel environment variables

### Step 2: Set Up Stripe Webhook
**Why?** Webhooks ensure orders are created ONLY after payment succeeds, even if the user closes their browser.

1. Go to **Developers → Webhooks** in Stripe
2. Click **Add endpoint**
3. Enter your webhook URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select these events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add to Vercel as `STRIPE_WEBHOOK_SECRET`

### Step 3: Configure Printful
1. Log into [Printful Dashboard](https://www.printful.com)
2. Go to **Settings → Stores → API**
3. Copy your API key
4. Add to Vercel as `PRINTFUL_API_KEY`

### Step 4: Map Products to Printful Variants
**Important:** Each product on your site needs a Printful variant ID.

In Printful:
1. Create your products and designs
2. Note the **variant IDs** for each size/color
3. Store these in your product database

---

## 📊 Current Payment Flow

### What Happens Now:
```
1. Customer adds item to cart
2. Customer enters shipping info
3. Stripe creates payment intent
4. Customer enters card details
5. Payment processes
6. ✅ If successful → Create Printful order
7. Return confirmation
```

### ⚠️ Current Issues:
- If user closes browser after payment, order might not be created
- No webhook handling for async payment confirmation
- No order tracking/storage

---

## ✅ Recommended Improvements

### 1. Add Webhook Handler
**Purpose:** Create Printful orders reliably after payment confirmation

### 2. Add Order Database
**Purpose:** Track orders, statuses, and customer info

### 3. Product-to-Variant Mapping
**Purpose:** Automatically match your products to Printful variants

### 4. Email Notifications
**Purpose:** Send order confirmations to customers

### 5. Admin Dashboard
**Purpose:** View and manage orders

---

## 💰 How Money Flows

### Payment Process:
```
Customer pays $79 → Stripe (your account) → You receive $77 (after fees)
```

### Fulfillment Cost:
```
You pay Printful ~$25-30 → Printful ships to customer
```

### Your Profit:
```
$77 (received) - $30 (Printful cost) = $47 profit
```

---

## 🧪 Testing Checklist

### Test Mode (Do This First):
- [ ] Add test Stripe keys to Vercel
- [ ] Test payment with card `4242 4242 4242 4242`
- [ ] Verify order appears in Printful (draft mode)
- [ ] Check webhook events in Stripe Dashboard
- [ ] Test failed payment with `4000 0000 0000 0002`

### Live Mode (When Ready):
- [ ] Switch to live Stripe keys
- [ ] Update webhook endpoint to live mode
- [ ] Test with real card (small amount)
- [ ] Verify real order in Printful
- [ ] Check money arrives in Stripe balance

---

## 🔐 Security Best Practices

1. **Never commit API keys** to GitHub
2. **Use environment variables** for all secrets
3. **Verify webhook signatures** to prevent fraud
4. **Use Stripe test mode** until ready for production
5. **Enable Stripe Radar** for fraud protection

---

## 📱 Next Steps to Complete Integration

1. **Add webhook handler** (I can create this for you)
2. **Set up order database** using Vercel KV
3. **Map products to Printful variants**
4. **Add order confirmation emails**
5. **Create admin dashboard** for order management

---

## 🚨 Common Issues & Solutions

### "Stripe Not Configured"
**Fix:** Add `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to Vercel, then redeploy

### "Printful API Error"
**Fix:** Verify your `PRINTFUL_API_KEY` is correct and has proper permissions

### Orders Not Creating
**Fix:** Check Stripe webhook is configured and receiving events

### Wrong Product Variant
**Fix:** Update product database with correct Printful variant IDs

---

## 📞 Support Resources

- **Stripe Docs:** https://stripe.com/docs
- **Printful API:** https://developers.printful.com
- **Stripe Test Cards:** https://stripe.com/docs/testing

---

## ✨ What I Can Build for You Next

1. **Webhook Handler** - Reliable order creation
2. **Order Database** - Track all orders
3. **Product Mapping** - Link products to Printful
4. **Email System** - Customer notifications
5. **Admin Panel** - Manage orders

Let me know what you want to implement first!

