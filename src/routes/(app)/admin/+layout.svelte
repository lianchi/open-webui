<script lang='ts'>
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'

  import MenuLines from '$lib/components/icons/MenuLines.svelte'
  import { showSidebar, user, WEBUI_NAME } from '$lib/stores'
  import { getContext, onMount } from 'svelte'

  const i18n = getContext('i18n')

  let loaded = false

  onMount(async () => {
    if ($user?.role !== 'admin') {
      await goto('/')
    }
    loaded = true
  })
</script>

<svelte:head>
  <title>
    {$i18n.t('Admin Panel')} | {$WEBUI_NAME}
  </title>
</svelte:head>

{#if loaded}
  <div
    class=" flex flex-col w-full h-screen max-h-[100dvh] transition-width duration-200 ease-in-out {$showSidebar
      ? 'md:max-w-[calc(100%-260px)]'
      : ''} max-w-full"
  >
    <nav class='px-2.5 pt-1 backdrop-blur-xl drag-region'>
      <div class='flex items-center gap-1'>
        <div class="{$showSidebar ? 'md:hidden' : ''} flex flex-none items-center">
          <button
            id='sidebar-toggle-button'
            class='cursor-pointer p-1.5 flex rounded-xl hover:bg-gray-100 dark:hover:bg-gray-850 transition'
            on:click={() => {
              showSidebar.set(!$showSidebar)
            }}
            aria-label='Toggle Sidebar'
          >
            <div class='m-auto self-center'>
              <MenuLines />
            </div>
          </button>
        </div>

        <div class='flex w-full'>
          <div
            class='flex gap-1 scrollbar-none overflow-x-auto w-fit text-center text-1rem font-medium rounded-full bg-transparent pt-1'
          >
            <a
              class="min-w-fit rounded-full p-1.5 {['/admin/users'].includes($page.url.pathname)
                ? ''
                : 'text-gray-300 dark:text-gray-600 hover:text-gray-700 dark:hover:text-white'} transition"
              href='/admin'>
              用户
            </a>

            <a
              class="min-w-fit rounded-full p-1.5 {$page.url.pathname.includes('/admin/evaluations')
                ? ''
                : 'text-gray-300 dark:text-gray-600 hover:text-gray-700 dark:hover:text-white'} transition"
              href='/admin/evaluations'>
              评估
            </a>

            <a
              class="min-w-fit rounded-full p-1.5 {$page.url.pathname.includes('/admin/functions')
                ? ''
                : 'text-gray-300 dark:text-gray-600 hover:text-gray-700 dark:hover:text-white'} transition"
              href='/admin/functions'>
              函数
            </a>

            <a
              class="min-w-fit rounded-full p-1.5 {$page.url.pathname.includes('/admin/settings')
                ? ''
                : 'text-gray-300 dark:text-gray-600 hover:text-gray-700 dark:hover:text-white'} transition"
              href='/admin/settings'>
              设置
            </a>
          </div>
        </div>
      </div>
    </nav>

    <hr class='border-gray-100 dark:border-gray-850 my-1'>

    <div class=' pb-1 px-[16px] flex-1 max-h-full overflow-y-auto'>
      <slot />
    </div>
  </div>
{/if}
