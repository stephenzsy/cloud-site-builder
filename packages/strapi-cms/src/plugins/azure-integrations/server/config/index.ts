export default {
  default: function ({ env }) {
    return {
      keyVaultUrl: env("AZURE_KEY_VAULT_URL", ""),
      keyVaultSecretPrefix: env("AZURE_KEY_VAULT_SECRET_PREFIX", "CSB-"),
    };
  },
  validator() {},
};
