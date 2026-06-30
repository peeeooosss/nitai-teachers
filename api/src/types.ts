export type Bindings = {
  Variables: {
    tokenIdentifier: string;
  };
};

export function getTokenIdentifier(c: any): string {
  return c.var.tokenIdentifier as string;
}
