<script lang="ts">
  import { cn } from "$lib/utils";
  import { table } from "./index";

  let className: string | undefined = undefined;
  export { className as class };
  export let variant: "default" | "borderless" = "default";
</script>

<table class={cn(table({ variant }), className)} {...$$restProps}>
  <slot />
</table> 