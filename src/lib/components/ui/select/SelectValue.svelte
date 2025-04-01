<script lang="ts">
  import { cn } from "$lib/utils";
  import { selectValue } from "./index";

  let className: string | undefined = undefined;
  export { className as class };
</script>

<span class={cn(selectValue(), className)} {...$$restProps}>
  <slot />
</span> 