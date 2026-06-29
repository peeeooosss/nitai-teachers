import type { DataModel } from "./dataModel.js";
import {
  action as convexAction,
  mutation as convexMutation,
  query as convexQuery,
} from "convex/server";

export const query = convexQuery;
export const mutation = convexMutation;
export const action = convexAction;

export type QueryCtx = {
  auth: import("convex/server").Auth;
  db: import("convex/server").DatabaseReader<DataModel>;
};

export type MutationCtx = {
  auth: import("convex/server").Auth;
  db: import("convex/server").DatabaseWriter<DataModel>;
};

export type ActionCtx = {
  auth: import("convex/server").Auth;
  runQuery: (query: any, args?: any) => Promise<any>;
  runMutation: (mutation: any, args?: any) => Promise<any>;
  runAction: (action: any, args?: any) => Promise<any>;
};
