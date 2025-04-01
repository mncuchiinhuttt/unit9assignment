import { tv } from "tailwind-variants";

export const table = tv({
  base: "w-full caption-bottom text-sm",
  variants: {
    variant: {
      default: "border-collapse",
      borderless: "border-none",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const tableHeader = tv({
  base: "[&_tr]:border-b",
});

export const tableBody = tv({
  base: "[&_tr:last-child]:border-0",
});

export const tableFooter = tv({
  base: "bg-primary font-medium text-primary-foreground [&>tr]:last:border-b-0",
});

export const tableRow = tv({
  base: "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
});

export const tableHead = tv({
  base: "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
});

export const tableCell = tv({
  base: "p-4 align-middle [&:has([role=checkbox])]:pr-0",
});

export const tableCaption = tv({
  base: "mt-4 text-sm text-muted-foreground",
});

export { default as Table } from "./Table.svelte";
export { default as TableHeader } from "./TableHeader.svelte";
export { default as TableBody } from "./TableBody.svelte";
export { default as TableFooter } from "./TableFooter.svelte";
export { default as TableRow } from "./TableRow.svelte";
export { default as TableHead } from "./TableHead.svelte";
export { default as TableCell } from "./TableCell.svelte";
export { default as TableCaption } from "./TableCaption.svelte"; 