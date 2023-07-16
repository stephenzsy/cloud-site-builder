import { EmailClient, EmailMessage } from "@azure/communication-email";
import { DefaultAzureCredential } from "@azure/identity";

interface Settings {
  defaultFrom: string;
  defaultReplyTo: string;
}

interface SendOptions {
  from?: string;
  to: string;
  cc: string;
  bcc: string;
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
  [key: string]: unknown;
}

interface ProviderOptions {
  connectionString: string;
}

export default class AzureCommunicationEmailProvider {
  constructor(
    private readonly emailClient: EmailClient,
    private readonly settings: Settings
  ) {}

  public readonly send = async (opts: SendOptions) => {
    const {
      from: senderAddress = this.settings.defaultFrom,
      subject,
      html,
      text: plainText,
      to,
      cc,
      bcc,
      replyTo = this.settings.defaultReplyTo,
    } = opts;
    const msg: EmailMessage = {
      senderAddress,
      content: {
        subject,
        html,
        plainText,
      },
      recipients: {
        to: to ? [{ address: to }] : undefined,
        cc: cc ? [{ address: cc }] : undefined,
        bcc: bcc ? [{ address: bcc }] : undefined,
      },
      replyTo: replyTo ? [{ address: replyTo }] : undefined,
    };
    await this.emailClient.beginSend(msg);
  };
}
