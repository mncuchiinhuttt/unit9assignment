<script lang="ts">
  import { cn } from "$lib/utils";
  import { selectItem } from "./index";

  let className: string | undefined = undefined;
  export { className as class };
</script>

<div class={cn(selectItem(), className)} {...$$restProps}>
  <slot />
</div> 