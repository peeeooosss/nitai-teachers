import type { Auth, DatabaseReader, DatabaseWriter } from "convex/server";
import type { GenericId, TableNamesInDataModel } from "convex/server";
import type { DataModel } from "./dataModel.js";

export type QueryCtx = {
  auth: Auth;
  db: DatabaseReader<DataModel>;
};

export type MutationCtx = {
  auth: Auth;
  db: DatabaseWriter<DataModel>;
};

export type ActionCtx = {
  auth: Auth;
  runQuery: (query: any, args?: any) => Promise<any>;
  runMutation: (mutation: any, args?: any) => Promise<any>;
  runAction: (action: any, args?: any) => Promise<any>;
};

export declare const query: <Args extends Record<string, unknown>, Output>(
  definition: { args: Args; handler: (ctx: QueryCtx, args: Args) => Promise<Output> | Output },
) => any;

export declare const mutation: <Args extends Record<string, unknown>, Output>(
  definition: { args: Args; handler: (ctx: MutationCtx, args: Args) => Promise<Output> | Output },
) => any;

export declare const action: <Args extends Record<string, unknown>, Output>(
  definition: { args: Args; handler: (ctx: ActionCtx, args: Args) => Promise<Output> | Output },
) => any;
