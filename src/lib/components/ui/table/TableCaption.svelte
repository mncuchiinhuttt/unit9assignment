<script lang="ts">
  import { cn } from "$lib/utils";
  import { tableCaption } from "./index";

  let className: string | undefined = undefined;
  export { className as class };
</script>

<caption class={cn(tableCaption(), className)} {...$$restProps}>
  <slot />
</caption> 