import { DefaultAzureCredential } from "@azure/identity";
import { ContainerClient } from "@azure/storage-blob";
import type { Strapi } from "@strapi/strapi";
import UploadBlobProvider from "./providers/upload-blob";
import { EmailClient } from "@azure/communication-email";
import AzureCommunicationEmailProvider from "./providers/communication-email";

export default async ({ strapi }: { strapi: Strapi }) => {
  // bootstrap phase
  await (strapi as any).admin.services.permission.actionProvider.register({
    section: "plugins",
    displayName: "Read azure integration configuration",
    uid: "read",
    pluginName: "azure-integrations",
  });

  const blobContainerUrl = strapi.config.get(
    "plugin.azure-integrations.blobUploadContainerUrl"
  );
  if (blobContainerUrl) {
    strapi.log.info(`Set upload to Azure Blob Container: ${blobContainerUrl}`);
    strapi.plugin("upload").provider = new UploadBlobProvider(
      new ContainerClient(blobContainerUrl, new DefaultAzureCredential()),
      strapi.config.get("plugin.azure-integrations.blobUploadPrefix")
    );
  }

  const emailServiceConnectionString = strapi.config.get(
    "plugin.azure-integrations.emailServiceConnectionString"
  );
  if (blobContainerUrl) {
    strapi.log.info(`Set up Azure Communication service email`);
    strapi.plugin("email").provider = new AzureCommunicationEmailProvider(
      new EmailClient(emailServiceConnectionString),
      strapi.config.get("plugin.email.settings")
    );
  }
};
