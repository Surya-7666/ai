import { Scalekit } from "@scalekit-sdk/node";

// Initialize the Scalekit client with your credentials
export const scalekit = new Scalekit(
  process.env.SCALEKIT_ENVIRONMENT_URL!,
  process.env.SCALEKIT_CLIENT_ID!,
  process.env.SCALEKIT_CLIENT_SECRET!,
);

// import { Scalekit } from "@scalekit-sdk/node"; // test

// const environmentUrl = "https://barigda5jx2f2.scalekit.dev";
// const clientId = "skc_134853420036129042";
// const clientSecret =
//   "test_8zCA0PhJ8x0PGlzFkLYYrJcTXJQYrOzmDO2LggTKLjlZ2cRBcOMaoxnfeKzcVP0L";

// export const scalekit = new Scalekit(environmentUrl, clientId, clientSecret);
