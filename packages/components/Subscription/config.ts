export const pricings = [
  {
    name: "Freemium",
    features: [
      "Unlimited links",
      "10+ themes",
      "Simple Analytics",
      "Collect 10 testimonials per month",
      "Showcase 5 testimonials",
      "100 form submissions per month",
    ],
    config: {
      testimonialCollection: 10,
      testimonialShowcase: 5,
      formSubmissions: 100,
      apiRequests: false,
      newsletter: false,
    },
  },
  {
    name: "Premium",
    features: [
      "Unlimited links",
      "Unlock all themes",
      "Advanced analytics",
      "Collect 50 testimonials per month",
      "Showcase 30 testimonials",
      "400 form submissions per month",
      "Developer API (200 requests per day)",
      "Newsletter (Coming soon!)",
    ],
    config: {
      testimonialCollection: 50,
      testimonialShowcase: 30,
      formSubmissions: 400,
      apiRequests: 200,
      newsletter: true,
    },
  },
];
