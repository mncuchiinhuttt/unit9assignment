<script lang="ts">
  import { cn } from "$lib/utils";
  import { selectContent } from "./index";

  let className: string | undefined = undefined;
  export { className as class };
</script>

<div class={cn(selectContent(), className)} {...$$restProps}>
  <slot />
</div> 