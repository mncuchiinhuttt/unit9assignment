<script lang="ts">
  import { cn } from "$lib/utils";
  import { tableCell } from "./index";

  let className: string | undefined = undefined;
  export { className as class };
</script>

<td class={cn(tableCell(), className)} {...$$restProps}>
  <slot />
</td> 