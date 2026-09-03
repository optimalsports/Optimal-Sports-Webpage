# 🎯 What You Need from Stripe - Simple Answer

## Three Things from Your Stripe Account:

### 1. **Secret Key** 
- **Where:** https://dashboard.stripe.com/apikeys
- **Looks like:** `sk_test_51Abc...` or `sk_live_51Abc...`
- **Add to Vercel as:** `STRIPE_SECRET_KEY`

### 2. **Publishable Key**
- **Where:** https://dashboard.stripe.com/apikeys (same page)
- **Looks like:** `pk_test_51Abc...` or `pk_live_51Abc...`
- **Add to Vercel as:** `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### 3. **Webhook Secret**
- **Where:** https://dashboard.stripe.com/webhooks
- **First:** Create webhook pointing to: `https://yourdomain.vercel.app/api/webhooks/stripe`
- **Events to select:** 
  - ✅ `payment_intent.succeeded`
  - ✅ `payment_intent.payment_failed`
- **Then:** Copy the signing secret
- **Looks like:** `whsec_abc123...`
- **Add to Vercel as:** `STRIPE_WEBHOOK_SECRET`

---

## What Happens Now (Automatic Flow)

```
Customer pays → Stripe webhook → Your site creates Printful order → Done!
```

### Detailed Flow:
1. Customer enters card and pays
2. Stripe charges their card
3. Stripe immediately sends webhook to your site
4. Your site automatically creates order in Printful
5. Printful ships the product
6. You keep the profit!

### Why This Is Better:
- ✅ **Reliable:** Orders created even if customer closes browser
- ✅ **Automatic:** No manual order entry needed
- ✅ **Secure:** Webhook signature verification prevents fraud
- ✅ **Trackable:** All orders stored in database

---

## What's Been Built for You

### New Features:
1. **Webhook Handler** - Automatically creates Printful orders when payments succeed
2. **Order Database** - Stores all orders with customer info
3. **Product Mapping** - System to match your products to Printful variants
4. **Order API** - View and manage all orders
5. **Helper Tools** - API to list your Printful products

### Updated Features:
1. **Payment Processing** - Now stores order data for webhook
2. **Checkout Flow** - Simplified and webhook-ready
3. **Success Messages** - Better customer experience

---

## Quick Setup (15 Minutes)

### Step 1: Get Stripe Keys (5 min)
1. Go to https://dashboard.stripe.com/apikeys
2. Copy both keys (Secret and Publishable)

### Step 2: Create Webhook (5 min)
1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. URL: `https://yourdomain.vercel.app/api/webhooks/stripe`
4. Select events: `payment_intent.succeeded` and `payment_intent.payment_failed`
5. Copy the signing secret

### Step 3: Add to Vercel (3 min)
1. Go to Vercel → Settings → Environment Variables
2. Add all three keys (see above)
3. Check Production, Preview, Development

### Step 4: Map Products (2 min)
1. Visit: `/api/printful/sync-products` on your site
2. See your Printful products and variant IDs
3. Edit `lib/printful-mapping.ts` with your product IDs

### Step 5: Deploy & Test
1. Redeploy in Vercel
2. Test with card: `4242 4242 4242 4242`
3. Check Stripe & Printful dashboards

---

## Files Created for You

```
app/api/webhooks/stripe/route.ts          ← Handles Stripe webhooks
app/api/orders/route.ts                   ← Order management API
app/api/printful/sync-products/route.ts   ← List Printful products
lib/printful-mapping.ts                   ← Product variant mapping

Updated:
app/api/create-payment-intent/route.ts    ← Stores order data
components/StripePayment.tsx              ← Passes order data
components/CheckoutForm.tsx               ← Simplified flow
```

---

## Test Your Setup

### Use Test Mode First!
```
Card: 4242 4242 4242 4242
Date: Any future date
CVC: Any 3 digits
```

### What to Check:
1. ✅ Payment succeeds in Stripe Dashboard
2. ✅ Webhook event shows up in Stripe → Webhooks
3. ✅ Order appears in Printful Dashboard
4. ✅ No errors in Vercel logs

---

## Money Flow

**Customer Pays:** $79
**Stripe Fee:** -$2.30 (2.9% + $0.30)
**You Receive:** $76.70
**Printful Cost:** -$25-30
**Your Profit:** $46-51 per order

### Where Money Goes:
- Customer payment → Your Stripe account
- Stripe automatically pays you (minus fees)
- You pay Printful when they fulfill order
- Profit stays in your bank account

---

## Help & Documentation

### Quick References:
- **Full Guide:** See `COMPLETE_SETUP_GUIDE.md`
- **Quick Start:** See `QUICK_SETUP.md`
- **Technical Details:** See `INTEGRATION_SUMMARY.md`

### API Endpoints:
- `/api/webhooks/stripe` - Stripe webhook handler
- `/api/orders` - View all orders
- `/api/printful/sync-products` - List Printful products
- `/api/create-payment-intent` - Create payment

### Dashboards:
- **Stripe:** https://dashboard.stripe.com
- **Printful:** https://www.printful.com/dashboard
- **Vercel:** https://vercel.com

---

## Common Questions

**Q: Do I need a credit card to accept payments?**
A: No, customers pay you directly through Stripe. You need a bank account to receive payouts.

**Q: When do I get paid?**
A: Stripe holds funds for 2-7 days, then deposits to your bank account automatically.

**Q: When does Printful charge me?**
A: Printful charges you when they fulfill the order (usually 2-3 days after order is placed).

**Q: What if a customer requests a refund?**
A: Process refund in Stripe Dashboard. You'll need to manually cancel the Printful order if it hasn't shipped yet.

**Q: Can I use this in production right now?**
A: Yes! Once you add your Stripe keys and test everything, you're ready to go live.

**Q: What if something breaks?**
A: Check Vercel logs and Stripe webhook logs first. All errors are logged for debugging.

---

## You're All Set! 🎉

Once you add those three Stripe keys to Vercel, your site will:
- ✅ Accept payments securely
- ✅ Automatically create Printful orders
- ✅ Track all orders in database
- ✅ Handle everything automatically

**Start in test mode, verify it works, then switch to live mode and start making money!**

