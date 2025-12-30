import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export interface CreateCheckoutSessionParams {
  items: {
    bookId: string;
    title: string;
    format: string;
    price: number;
    quantity: number;
    imageUrl?: string;
  }[];
  customerId?: string;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export interface CreateConnectAccountParams {
  email: string;
  country: string;
  businessType: 'individual' | 'company';
}

/**
 * Create a Stripe checkout session
 */
export async function createCheckoutSession(params: CreateCheckoutSessionParams) {
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = params.items.map(
    (item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title,
          description: `${item.format} format`,
          ...(item.imageUrl && { images: [item.imageUrl] }),
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    })
  );

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    customer_email: params.customerEmail,
    metadata: {
      ...params.metadata,
      items: JSON.stringify(params.items.map((i) => ({ bookId: i.bookId, format: i.format }))),
    },
    shipping_address_collection: {
      allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IN'],
    },
  });

  return session;
}

/**
 * Retrieve a checkout session
 */
export async function getCheckoutSession(sessionId: string) {
  return stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'customer'],
  });
}

/**
 * Create a Stripe Connect account for authors (payouts)
 */
export async function createConnectAccount(params: CreateConnectAccountParams) {
  const account = await stripe.accounts.create({
    type: 'express',
    country: params.country,
    email: params.email,
    business_type: params.businessType,
    capabilities: {
      transfers: { requested: true },
    },
  });

  return account;
}

/**
 * Create an account link for onboarding
 */
export async function createAccountLink(accountId: string, refreshUrl: string, returnUrl: string) {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: 'account_onboarding',
  });

  return accountLink;
}

/**
 * Create a payout to an author's connected account
 */
export async function createPayout(
  connectedAccountId: string,
  amount: number,
  currency: string = 'usd'
) {
  const transfer = await stripe.transfers.create({
    amount: Math.round(amount * 100),
    currency,
    destination: connectedAccountId,
  });

  return transfer;
}

/**
 * Verify webhook signature
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  endpointSecret: string
) {
  return stripe.webhooks.constructEvent(payload, signature, endpointSecret);
}

/**
 * Get Stripe publishable key (client-safe)
 */
export function getPublishableKey() {
  return process.env.STRIPE_PUBLISHABLE_KEY;
}

export { stripe };
