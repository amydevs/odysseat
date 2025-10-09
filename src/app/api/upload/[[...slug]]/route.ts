import { Server } from "@tus/server";
import { FileStore } from "@tus/file-store";
import { S3Store } from "@tus/s3-store";
import { type NextRequest } from "next/server";
import { env } from "~/env";
import { auth } from "~/auth/server";

const server = new Server({
  path: "/api/upload",
  onUploadCreate: async (req, upload) => {
    const session = await auth.api.getSession({ headers: req.headers });
    if (session?.user == null) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw {
        status_code: 401,
        body: "Not authorized to make upload!",
      };
    }
    return upload;
  },
  respectForwardedHeaders: true,
  datastore:
    env.AWS_BUCKET != null
      ? new S3Store({
          partSize: 6 * 1024 * 1024,
          minPartSize: 6 * 1024 * 1024,
          s3ClientConfig: {
            bucket: env.AWS_BUCKET,
            region: env.AWS_REGION,
            endpoint: env.AWS_ENDPOINT_URL,
            credentials: {
              accessKeyId: env.AWS_ACCESS_KEY_ID!,
              secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
            },
            forcePathStyle: true,
          },
        })
      : new FileStore({ directory: "./local-uploads" }),
});

export const GET = async (req: NextRequest) => server.handleWeb(req);
export const PATCH = async (req: NextRequest) => server.handleWeb(req);
export const POST = async (req: NextRequest) => server.handleWeb(req);
export const DELETE = async (req: NextRequest) => server.handleWeb(req);
export const OPTIONS = async (req: NextRequest) => server.handleWeb(req);
export const HEAD = async (req: NextRequest) => server.handleWeb(req);
