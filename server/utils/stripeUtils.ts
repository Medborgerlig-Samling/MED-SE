import { useServerStripe } from '#stripe/server';

export async function fetchOrCreateCustomer(event, customer) {
  const stripe = await useServerStripe(event);

  const { firstName, lastName, email, country, municipality } = customer;

  const { data } = await stripe.customers.search({
    query: `email:'test@example.com'`,
  });
  // const { data } = await stripe.customers.search({
  //   query: `email:'${email}'`,
  // });

  if (data.length) return data[0].id;
  else {
    const newCustomer = await stripe.customers.create({
      email,
      currency: 'sek',
      name: `${firstName} ${lastName}`,
      address: {
        country,
        city: country === 'SE' ? municipality : undefined,
      },
    });

    return newCustomer.id;
  }
}
