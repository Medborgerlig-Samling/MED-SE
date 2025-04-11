import { defineEventHandler } from 'h3';
import { useServerStripe } from '#stripe/server';

export default defineEventHandler(async (event) => {
  const stripe = await useServerStripe(event);
  const config = useRuntimeConfig();
  const { public: { membership } = {} } = config;

  const annualMembership = await stripe.products.retrieve(membership?.annual);
  const annualYouthMembership = await stripe.products.retrieve(membership?.youthAnnual);

  const oneYearMembership = await stripe.products.retrieve(membership?.oneYear);
  const oneYearYouthMembership = await stripe.products.retrieve(membership?.youthOneYear);

  // Retrieve prices for each product
  const annualYouthMembershipPrices = await stripe.prices.list({
    product: annualYouthMembership.id,
  });

  const annualMembershipPrices = await stripe.prices.list({
    product: annualMembership.id,
  });

  const oneYearMembershipPrices = await stripe.prices.list({
    product: oneYearMembership.id,
  });

  const oneYearYouthMembershipPrices = await stripe.prices.list({
    product: oneYearYouthMembership.id,
  });

  // Extract the price IDs (you can customize the logic to select the specific price based on currency or other parameters)
  const annualYouthMembershipPriceId = annualYouthMembershipPrices.data[0]?.id;
  const annualMembershipPriceId = annualMembershipPrices.data[0]?.id;
  const oneYearMembershipPriceId = oneYearMembershipPrices.data[0]?.id;
  const oneYearYouthMembershipPriceId = oneYearYouthMembershipPrices.data[0]?.id;

  return {
    annualYouthMembership,
    annualMembership,
    oneYearMembership,
    oneYearYouthMembership,
    annualYouthMembershipPriceId,
    annualMembershipPriceId,
    oneYearMembershipPriceId,
    oneYearYouthMembershipPriceId,
  };
});
