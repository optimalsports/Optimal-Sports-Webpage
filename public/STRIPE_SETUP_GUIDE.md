# Stripe Payment Integration Setup Guide

## 🎯 Overview
Your Optimal Sports website now has complete Stripe payment integration. This guide will help you set up Stripe to accept payments from customers.

## 📋 What's Already Done
✅ Stripe payment components installed  
✅ Payment processing API endpoints created  
✅ Checkout flow integrated with Printful  
✅ Error handling for missing configuration  
✅ Environment variable templates ready  

## 🔑 Required Environment Variables

Add these to your Vercel dashboard under **Settings → Environment Variables**:

### Stripe Keys
```
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

### Printful Key (Already Added)
```
PRINTFUL_API_KEY=2W2rPSAbOrHtHrYtm8cBK5atgsM9vhPkIpCbWPV7
```

## 🚀 Setup Steps

### 1. Create Stripe Account
1. Go to [stripe.com](https://stripe.com)
2. Click "Start now" or "Sign up"
3. Choose "Business" account type
4. Fill out your business information
5. Verify your email and phone number

### 2. Get Your API Keys
1. In Stripe Dashboard, go to **Developers → API keys**
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)
4. **Keep these keys secure!**

### 3. Add Keys to Vercel
1. Go to [vercel.com](https://vercel.com) → Your project
2. Click **Settings → Environment Variables**
3. Add each key:
   - **Name:** `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Value:** `pk_test_your_key_here`
   - **Environment:** Production, Preview, Development
4. Repeat for `STRIPE_SECRET_KEY`

### 4. Redeploy
1. Go to **Deployments** tab in Vercel
2. Click **Redeploy** on latest deployment
3. Wait for deployment to complete

## 💰 Payment Flow

### How It Works:
1. **Customer fills out order form** → Clicks "Continue to Payment"
2. **Stripe payment form appears** → Customer enters card details
3. **Payment processes** → Customer pays you via Stripe
4. **Order sent to Printful** → You pay Printful wholesale cost
5. **You keep the profit** → Difference between retail and wholesale

### Example:
- **Customer pays:** $79 (retail price)
- **Printful costs:** ~$30 (wholesale)
- **Your profit:** ~$49 per order

## 🧪 Testing

### Test Mode (Recommended First)
- Stripe test keys start with `pk_test_` and `sk_test_`
- Use test card numbers:
  - **Success:** `4242 4242 4242 4242`
  - **Decline:** `4000 0000 0000 0002`
  - **Any future date and CVC**

### Live Mode (When Ready)
- Switch to live keys (start with `pk_live_` and `sk_live_`)
- Real payments will be processed
- Funds deposited to your bank account

## 🔧 Troubleshooting

### "Stripe Not Configured" Error
- Check environment variables are added to Vercel
- Verify keys are correct format
- Redeploy after adding keys

### Payment Fails
- Check Stripe Dashboard for error details
- Verify card details are correct
- Check API key permissions

### Printful Orders Not Created
- Verify `PRINTFUL_API_KEY` is correct
- Check Printful dashboard for order status
- Review server logs for API errors

## 📞 Support

### Stripe Support
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)

### Printful Support
- [Printful API Docs](https://developers.printful.com)
- Your API key: `2W2rPSAbOrHtHrYtm8cBK5atgsM9vhPkIpCbWPV7`

## ✅ Final Checklist

Before going live:
- [ ] Stripe account created and verified
- [ ] API keys added to Vercel environment variables
- [ ] Test payments working
- [ ] Printful integration tested
- [ ] Switch to live Stripe keys when ready
- [ ] Set up bank account for payouts

## 🎉 You're Ready!

Once Stripe is configured, your checkout will:
- ✅ Accept customer payments securely
- ✅ Create orders in Printful automatically
- ✅ Handle the entire fulfillment process
- ✅ Generate profit for your business

**The integration is complete - just add your Stripe keys and you're live!**
