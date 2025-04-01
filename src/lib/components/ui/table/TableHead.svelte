<script lang="ts">
  import { cn } from "$lib/utils";
  import { tableHead } from "./index";

  let className: string | undefined = undefined;
  export { className as class };
</script>

<th class={cn(tableHead(), className)} {...$$restProps}>
  <slot />
</th> 