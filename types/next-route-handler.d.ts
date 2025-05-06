// Crea un archivo en: types/next-route-handler.d.ts

import { NextRequest } from 'next/server';

declare module 'next/server' {
  export interface RouteHandlerContext {
    params: Record<string, string>;
  }

  export type RouteHandler = (
    req: NextRequest,
    context: { params: Record<string, string> }
  ) => Response | Promise<Response>;
}