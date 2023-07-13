import { ContainerClient, type BlobHTTPHeaders } from "@azure/storage-blob";
import { errors as errorsUtils, file as fileUtils } from "@strapi/utils";
import { ReadStream } from "node:fs";

interface UploadFile {
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: Record<string, unknown>;
  hash: string;
  ext?: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  path?: string;
  provider?: string;
  provider_metadata?: Record<string, unknown>;
  stream?: ReadStream;
  buffer?: Buffer;
}

interface InitOptions {
  containerUrl: string;
  blobPrefix?: string;
}

export default class UploadBlobProvider {
  constructor(
    private readonly containerClient: ContainerClient,
    private readonly blobPrefix: string
  ) {}

  public readonly upload = async (file: UploadFile) => {
    const blobClient = this.containerClient.getBlockBlobClient(
      this.getBlobName(file)
    );
    const blobHTTPHeaders: BlobHTTPHeaders = {
      blobContentType: file.mime,
    };
    if (file.stream) {
      await blobClient.uploadStream(file.stream, undefined, undefined, {
        blobHTTPHeaders,
      });
      file.url = blobClient.url;
    } else if (file.buffer) {
      await blobClient.uploadData(file.buffer, {
        blobHTTPHeaders,
      });
      file.url = blobClient.url;
    }
  };

  private getBlobName(file: UploadFile) {
    const path = file.path ? `${file.path}/` : "";
    return `${this.blobPrefix}${path}${file.hash}${file.ext}`;
  }

  public readonly uploadStream = this.upload;

  public readonly delete = async (file: UploadFile) => {
    const blobClient = this.containerClient.getBlobClient(
      this.getBlobName(file)
    );
    await blobClient.delete();
  };

  public readonly isPrivate = () => false;

  public readonly checkFileSize = (file, { sizeLimit }) => {
    if (sizeLimit && fileUtils.kbytesToBytes(file.size) > sizeLimit) {
      throw new errorsUtils.PayloadTooLargeError(
        `${file.name} exceeds size limit of ${fileUtils.bytesToHumanReadable(
          sizeLimit
        )}.`
      );
    }
  };

  public readonly getSignedUrl = (file) => file;
}
