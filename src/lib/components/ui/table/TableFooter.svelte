<script lang="ts">
  import { cn } from "$lib/utils";
  import { tableFooter } from "./index";

  let className: string | undefined = undefined;
  export { className as class };
</script>

<tfoot class={cn(tableFooter(), className)} {...$$restProps}>
  <slot />
</tfoot> 