<script lang="ts">
  import { cn } from "$lib/utils";
  import { tableBody } from "./index";

  let className: string | undefined = undefined;
  export { className as class };
</script>

<tbody class={cn(tableBody(), className)} {...$$restProps}>
  <slot />
</tbody> 