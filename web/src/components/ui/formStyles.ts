const BASE =
  "block w-full rounded-md border bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2";
const OK = "border-slate-300 focus:border-amber-500 focus:ring-amber-500/30";
const ERR = "border-red-400 focus:border-red-500 focus:ring-red-500/30";

/** Shared class string for text inputs and selects, with an error variant. */
export function inputClass(hasError: boolean): string {
  return `${BASE} ${hasError ? ERR : OK}`;
}
