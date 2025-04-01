<script lang="ts">
  import { cn } from "$lib/utils";
  import { select } from "./index";

  let className: string | undefined = undefined;
  export { className as class };
</script>

<div class={cn(select(), className)} {...$$restProps}>
  <slot />
</div> 