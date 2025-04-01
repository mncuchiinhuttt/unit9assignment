import { tv } from "tailwind-variants";

export const select = tv({
	base: "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
});

export const selectTrigger = tv({
	base: "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
});

export const selectContent = tv({
	base: "relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
});

export const selectItem = tv({
	base: "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
});

export const selectItemText = tv({
	base: "flex-1",
});

export const selectItemIndicator = tv({
	base: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
});

export const selectSeparator = tv({
	base: "-mx-1 my-1 h-px bg-muted",
});

export const selectLabel = tv({
	base: "py-1.5 pl-8 pr-2 text-sm font-semibold",
});

export const selectGroup = tv({
	base: "px-1 py-1.5",
});

export const selectValue = tv({
	base: "flex-1",
});

export const selectScrollUpButton = tv({
	base: "flex cursor-default items-center justify-center py-1",
});

export const selectScrollDownButton = tv({
	base: "flex cursor-default items-center justify-center py-1",
});

export { default as Select } from "./Select.svelte";
export { default as SelectContent } from "./SelectContent.svelte";
export { default as SelectItem } from "./SelectItem.svelte";
export { default as SelectTrigger } from "./SelectTrigger.svelte";
export { default as SelectValue } from "./SelectValue.svelte";