import { Server } from '@tus/server';
import { FileStore } from '@tus/file-store';
import { type NextRequest } from 'next/server';

const server = new Server({
	path: '/api/upload',
	datastore: new FileStore({ directory: './local-uploads' }),
});

export const GET = async (req: NextRequest) => server.handleWeb(req);
export const PATCH = async (req: NextRequest) => server.handleWeb(req);
export const POST = async (req: NextRequest) => server.handleWeb(req);
export const DELETE = async (req: NextRequest) => server.handleWeb(req);
export const OPTIONS = async (req: NextRequest) => server.handleWeb(req);
export const HEAD = async (req: NextRequest) => server.handleWeb(req);