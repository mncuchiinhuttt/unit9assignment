<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { TableProperties, Home } from "@lucide/svelte";

  const items = [
    {
      title: "Home",
      icon: Home,
      href: "/"
    },
    {
      title: "Database",
      icon: TableProperties,
      href: "/database"
    }
  ]
</script>
 
<Sidebar.Root>
  <Sidebar.Content>
    <Sidebar.Menu class="space-y-1 p-4">
      {#each items as item (item.title)}
        <Sidebar.MenuItem>
          <Sidebar.MenuButton>
            {#snippet child({ props })}
              <a href={item.href} {...props}>
                <item.icon />
                <span>{item.title}</span>
              </a>
            {/snippet}
          </Sidebar.MenuButton>
        </Sidebar.MenuItem>
      {/each}
    </Sidebar.Menu>
  </Sidebar.Content>
</Sidebar.Root>