# 🚀 Quick Setup Guide - Get Started in 15 Minutes

## ✅ What You Need from Your Stripe Account

### 1. **Three Essential Keys:**

| Key | Where to Find | Starts With | Purpose |
|-----|---------------|-------------|---------|
| **Secret Key** | Dashboard → Developers → API keys | `sk_test_` or `sk_live_` | Server-side payments |
| **Publishable Key** | Dashboard → Developers → API keys | `pk_test_` or `pk_live_` | Client-side Stripe.js |
| **Webhook Secret** | Dashboard → Developers → Webhooks | `whsec_` | Verify webhook events |

---

## 📝 Step-by-Step Setup

### Step 1: Get Stripe API Keys (2 minutes)
1. Go to https://dashboard.stripe.com/apikeys
2. Copy **Publishable key** (pk_test_...)
3. Click **Reveal test key** → Copy **Secret key** (sk_test_...)

### Step 2: Create Stripe Webhook (5 minutes)
1. Go to https://dashboard.stripe.com/webhooks
2. Click **Add endpoint**
3. Enter webhook URL: `https://yourdomain.vercel.app/api/webhooks/stripe`
4. Select events:
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (whsec_...)

### Step 3: Add to Vercel (3 minutes)
1. Go to https://vercel.com → Your project
2. Click **Settings → Environment Variables**
3. Add these three:

```
STRIPE_SECRET_KEY = sk_test_your_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_your_key_here
STRIPE_WEBHOOK_SECRET = whsec_your_secret_here
```

4. Make sure to check ✅ **Production**, **Preview**, and **Development**

### Step 4: Add Printful Key (2 minutes)
1. Go to https://www.printful.com/dashboard/store
2. Click **Settings → API**
3. Copy your API key
4. Add to Vercel:
```
PRINTFUL_API_KEY = your_printful_api_key_here
```

### Step 5: Setup Product Mapping (3 minutes)
1. Visit: `https://yourdomain.vercel.app/api/printful/sync-products`
2. This shows all your Printful products and variant IDs
3. Update `lib/printful-mapping.ts` with your product IDs
4. Match your website products to Printful variants

### Step 6: Redeploy (1 minute)
1. Go to **Vercel → Deployments**
2. Click **Redeploy** on latest deployment
3. ✅ Done!

---

## 🧪 Test Your Setup

### Test Payment (Use Test Mode First!)
1. Visit your checkout page
2. Use test card: `4242 4242 4242 4242`
3. Any future date, any CVC
4. Complete payment

### Verify It Works:
- ✅ Payment succeeds in Stripe Dashboard
- ✅ Webhook event received (check Stripe → Webhooks)
- ✅ Order created in Printful Dashboard
- ✅ Order stored in your database

---

## 🎯 What Happens When a Customer Orders

```mermaid
1. Customer fills out form + enters card
   ↓
2. Stripe creates PaymentIntent
   ↓
3. Customer confirms payment
   ↓
4. Stripe sends webhook to your site
   ↓
5. Webhook creates Printful order
   ↓
6. Order saved to database
   ↓
7. Customer gets confirmation
   ↓
8. Printful fulfills order
```

---

## 💰 Payment Flow & Money

### Customer Pays You:
- Customer pays **$79** → Stripe takes **~$2.50 fee** → You receive **$76.50**

### You Pay Printful:
- Printful charges **~$25-30** → You profit **$46-51** per order

### Automatic Process:
1. ✅ Customer payment → **Your Stripe account**
2. ✅ Order creation → **Printful automatically charges you**
3. ✅ Shipping → **Printful ships to customer**
4. ✅ Profit → **You keep the difference**

---

## 🔍 Helpful API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `/api/printful/sync-products` | List all your Printful products |
| `/api/orders` | View all orders (admin) |
| `/api/webhooks/stripe` | Stripe webhook handler |
| `/api/checkout` | Process checkout & create order |

---

## ⚠️ Important Notes

### **Use Test Mode First!**
- Test keys start with `sk_test_` and `pk_test_`
- Use test cards: `4242 4242 4242 4242`
- Orders in Printful will be in draft/test mode
- No real money is charged

### **When Going Live:**
1. Get live keys from Stripe (start with `sk_live_` and `pk_live_`)
2. Create new webhook for live mode
3. Update all environment variables in Vercel
4. Test with small real payment first
5. Monitor Stripe Dashboard closely

### **Security Checklist:**
- ✅ Never commit API keys to GitHub
- ✅ Use environment variables only
- ✅ Verify webhook signatures (already implemented)
- ✅ Enable Stripe Radar for fraud protection
- ✅ Set up bank account for payouts

---

## 🐛 Troubleshooting

### "Stripe Not Configured" Error
**Fix:** Add STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to Vercel, then redeploy

### Webhook Not Receiving Events
**Fix:** 
1. Check webhook URL is correct in Stripe
2. Verify endpoint is publicly accessible
3. Check webhook secret is correct
4. View logs in Stripe Dashboard → Webhooks

### Orders Not Creating in Printful
**Fix:**
1. Check PRINTFUL_API_KEY is correct
2. Verify product mapping in `lib/printful-mapping.ts`
3. Check Printful Dashboard for draft orders
4. Review webhook logs for errors

### "Missing Variant ID" Error
**Fix:**
1. Visit `/api/printful/sync-products`
2. Find your product's variant IDs
3. Update `lib/printful-mapping.ts`
4. Redeploy

---

## 📞 Need Help?

### Check These First:
1. Stripe Dashboard → Logs
2. Vercel Dashboard → Logs  
3. Printful Dashboard → Orders
4. Your webhook events in Stripe

### Documentation:
- **Stripe:** https://stripe.com/docs
- **Printful:** https://developers.printful.com
- **Stripe Webhooks:** https://stripe.com/docs/webhooks

---

## ✨ You're All Set!

Once you complete these steps:
- ✅ Accept payments securely through Stripe
- ✅ Orders automatically sent to Printful
- ✅ Products shipped to customers
- ✅ You earn profit on every order

**Start with test mode, verify everything works, then switch to live mode!**

