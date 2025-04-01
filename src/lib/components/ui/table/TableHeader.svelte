<script lang="ts">
  import { cn } from "$lib/utils";
  import { tableHeader } from "./index";

  let className: string | undefined = undefined;
  export { className as class };
</script>

<thead class={cn(tableHeader(), className)} {...$$restProps}>
  <slot />
</thead> 