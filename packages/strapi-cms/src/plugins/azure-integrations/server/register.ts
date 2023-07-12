import { Strapi } from "@strapi/strapi";
import { SecretClient } from "@azure/keyvault-secrets";
import { isRestError } from "@azure/core-rest-pipeline";

import { DefaultAzureCredential } from "@azure/identity";

class KeyVaultSecretFetcher {
  private readonly secretClient: SecretClient;
  constructor(
    vaultUrl: string,
    private readonly prefix: string,
    private readonly strapi: Strapi
  ) {
    this.secretClient = new SecretClient(
      vaultUrl,
      new DefaultAzureCredential()
    );
  }

  public async fetchSecret(
    name: string,
    injectConfigKey?: string
  ): Promise<string | undefined> {
    const keyName = `${this.prefix}${name}`;
    try {
      const resp = await this.secretClient.getSecret(keyName);
      const { value } = resp;
      if (value && injectConfigKey) {
        this.strapi.config.set(injectConfigKey, value);
        strapi.log.info(
          `Set key ${injectConfigKey} with value from Azure KeyVault`
        );
      }
    } catch (e) {
      if (isRestError(e) && e.code === "SecretNotFound") {
        strapi.log.warn(
          `Secret name ${keyName} is not found in Azure KeyVault`
        );
        return undefined;
      }
      throw e;
    }
  }
}

export default async function configure({ strapi }: { strapi: Strapi }) {
  const vaultUrl: string = strapi.config.get(
    "plugin.azure-integrations.keyVaultUrl"
  );
  if (!vaultUrl) {
    // fetch from keyvault
    return;
  }
  const prefix: string = strapi.config.get(
    "plugin.azure-integrations.keyVaultSecretPrefix"
  );

  const fetcher = new KeyVaultSecretFetcher(vaultUrl, prefix, strapi);

  await fetcher.fetchSecret("admin-auth-secret", "admin.auth.secret");
  await fetcher.fetchSecret(
    "plugin-users-permissions-jwtSecret",
    "plugin.users-permissions.jwtSecret"
  );
}
