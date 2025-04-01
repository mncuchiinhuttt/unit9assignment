<script lang="ts">
  import { cn } from "$lib/utils";
  import { tableRow } from "./index";

  let className: string | undefined = undefined;
  export { className as class };
</script>

<tr class={cn(tableRow(), className)} {...$$restProps}>
  <slot />
</tr> 