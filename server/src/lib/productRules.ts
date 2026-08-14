// Mirrors src/lib/productRules.ts on the frontend. Every product carries
// both a per-unit and a case price, so Individual vs Business mode is valid
// for every category — the server trusts the client's chosen mode.
export function resolveMode(_category: string, requestedMode: "individual" | "business"): "individual" | "business" {
  return requestedMode;
}
