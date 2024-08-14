const fs = require("fs");
const Infisical = require("@infisical/sdk").InfisicalClient;

const client = new Infisical({
  siteUrl: process.env.INFISICAL_URL,
  auth: {
    universalAuth: {
      clientId: process.env.INFISICAL_CLIENT_ID,
      clientSecret:
        process.env.INFISICAL_CLIENT_SECRET,
    },
  },
});

(async () => {
  const envExampleContent = fs.readFileSync(".env.example", "utf8");
  const lines = envExampleContent.split("\n");
  const filteredLines = lines.filter(
    (line) => line.trim() !== "" && !line.startsWith("#"),
  );
  const keysArray = filteredLines.map((line) => line.split("=")[0].trim());

  const enviroment = process.env.NODE_ENV ?? "dev"

  // Use a for...of loop to await each async operation
  for (const env of keysArray) {
    try {
      const val = await client.getSecret({
        environment: enviroment,
        projectId: process.env.INFISICAL_PROJECT_ID,
        path: "/",
        type: "shared",
        secretName: env,
      });

      // Append to the .env.dev file instead of overwriting it
      fs.appendFileSync(".env", `${env}=${val.secretValue}\n`);
    } catch (error) {
      console.error(`Failed to retrieve or write secret for ${env}:`, error);
    }
  }
})();
