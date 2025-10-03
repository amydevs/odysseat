/**
 * @vitest-environment node
 */
import { testApiHandler } from 'next-test-api-route-handler';
import { describe, expect, it, vi } from 'vitest';
import * as appHandler from '~/app/api/upload/[[...slug]]/route';
import * as fs from "node:fs";
import * as url from "node:url";
import { Upload } from "tus-js-client";

vi.mock("server-only", () => ({}));

describe("upload api", () => {
    it('upload unauthorized', async () => {
        await testApiHandler({
            appHandler,
            async test({ fetch }) {
                const contents = await fs.promises.readFile(url.fileURLToPath(import.meta.url));
                let resProm: () => void;
                let rejProm: (reason: unknown) => void;
                const prom = new Promise<void>((res, rej) => {
                    resProm = res;
                    rejProm = rej;
                });
                const upload = new Upload(contents, {
                    endpoint: `/api/upload`,
                    httpStack: {
                        getName: () => "MockedStack",
                        createRequest: (method, url) => {
                            const ac = new AbortController();
                            const headers = new Map<string, string>();
                            headers.set("url", url);
                            let progressHandler: (bytesSent: number) => void = () => { };
                            return {
                                getURL: () => url,
                                send: async (body) => {
                                    progressHandler(0);
                                    const fetchOptions: RequestInit = {
                                        method,
                                        headers: Object.fromEntries(headers.entries()),
                                        body,
                                        signal: ac.signal,
                                    };
                                    const response = await fetch(fetchOptions);
                                    const status = response.status;
                                    const resBody = await response.text();
                                    progressHandler(Number.MAX_SAFE_INTEGER);
                                    return {
                                        getBody: () => resBody,
                                        getHeader: (h) => response.headers.get(h) ?? undefined,
                                        getStatus: () => status,
                                        getUnderlyingObject: () => { },
                                    };
                                },
                                getMethod: () => method,
                                setProgressHandler: (n) => progressHandler = n,
                                getHeader: (...args) => headers.get(...args),
                                setHeader: (...args) => headers.set(...args),
                                abort: async () => ac.abort(),
                                getUnderlyingObject: () => { },
                            };
                        }
                    },
                    onSuccess: () => {
                        resProm();
                    },
                    onError: (e) => {
                        rejProm(e);
                    }
                });
                upload.start();
                await expect(prom).rejects.toThrowError();
                await expect(prom.catch((e) => e.originalResponse.getStatus())).resolves.toBe(401);
            }
        });
    });
});

