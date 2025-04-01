<script lang="ts">
  import { cn } from "$lib/utils";
  import { selectTrigger } from "./index";

  let className: string | undefined = undefined;
  export { className as class };
</script>

<button class={cn(selectTrigger(), className)} {...$$restProps}>
  <slot />
</button> 