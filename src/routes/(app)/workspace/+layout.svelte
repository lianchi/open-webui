<script lang='ts'>
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import MenuLines from '$lib/components/icons/MenuLines.svelte'
  import {
    functions,
    knowledge,
    mobile,
    models,
    prompts,
    showSidebar,
    tools,
    user,
    WEBUI_NAME,
  } from '$lib/stores'

  import { getContext, onMount } from 'svelte'

  const i18n = getContext('i18n')

  let loaded = false

  onMount(async () => {
    if ($user?.role !== 'admin') {
      if ($page.url.pathname.includes('/models') && !$user?.permissions?.workspace?.models) {
        goto('/')
      }
      else if (
        $page.url.pathname.includes('/knowledge')
        && !$user?.permissions?.workspace?.knowledge
      ) {
        goto('/')
      }
      else if (
        $page.url.pathname.includes('/prompts')
        && !$user?.permissions?.workspace?.prompts
      ) {
        goto('/')
      }
      else if ($page.url.pathname.includes('/tools') && !$user?.permissions?.workspace?.tools) {
        goto('/')
      }
    }

    loaded = true
  })
</script>

<svelte:head>
  <title>
    {$i18n.t('Workspace')} | {$WEBUI_NAME}
  </title>
</svelte:head>

{#if loaded}
  <div
    class=" relative flex flex-col w-full h-screen max-h-[100dvh] transition-width duration-200 ease-in-out {$showSidebar
      ? 'md:max-w-[calc(100%-260px)]'
      : ''} max-w-full"
  >
    <nav class='px-2.5 pt-1 backdrop-blur-xl drag-region'>
      <div class='flex items-center gap-1'>
        <div class="{$showSidebar ? 'md:hidden' : ''} self-center flex flex-none items-center">
          <button
            id='sidebar-toggle-button'
            class='cursor-pointer p-1.5 flex rounded-xl hover:bg-gray-100 dark:hover:bg-gray-850 transition'
            on:click={() => {
              showSidebar.set(!$showSidebar)
            }}
            aria-label='Toggle Sidebar'
          >
            <div class=' m-auto self-center'>
              <MenuLines />
            </div>
          </button>
        </div>

        <div class="">
          <div
            class='flex gap-1 scrollbar-none overflow-x-auto w-fit text-center text-1rem font-medium rounded-full bg-transparent py-1 touch-auto pointer-events-auto'
          >
            {#if $user?.role === 'admin' || $user?.permissions?.workspace?.models}
              <a
                class="min-w-fit rounded-full p-1.5 {$page.url.pathname.includes(
                  '/workspace/models',
                )
                  ? ''
                  : 'text-gray-300 dark:text-gray-600 hover:text-gray-700 dark:hover:text-white'} transition"
                href='/workspace/models'>
                模型
              </a>
            {/if}

            {#if $user?.role === 'admin' || $user?.permissions?.workspace?.knowledge}
              <a
                class="min-w-fit rounded-full p-1.5 {$page.url.pathname.includes(
                  '/workspace/knowledge',
                )
                  ? ''
                  : 'text-gray-300 dark:text-gray-600 hover:text-gray-700 dark:hover:text-white'} transition"
                href='/workspace/knowledge'
              >
                知识库
              </a>
            {/if}

            {#if $user?.role === 'admin' || $user?.permissions?.workspace?.prompts}
              <a
                class="min-w-fit rounded-full p-1.5 {$page.url.pathname.includes(
                  '/workspace/prompts',
                )
                  ? ''
                  : 'text-gray-300 dark:text-gray-600 hover:text-gray-700 dark:hover:text-white'} transition"
                href='/workspace/prompts'>
                提示词
              </a>
            {/if}

            {#if $user?.role === 'admin' || $user?.permissions?.workspace?.tools}
              <a
                class="min-w-fit rounded-full p-1.5 {$page.url.pathname.includes('/workspace/tools')
                  ? ''
                  : 'text-gray-300 dark:text-gray-600 hover:text-gray-700 dark:hover:text-white'} transition"
                href='/workspace/tools'
              >
                工具
              </a>
            {/if}
          </div>
        </div>

        <!-- <div class="flex items-center text-xl font-semibold">{$i18n.t('Workspace')}</div> -->
      </div>
    </nav>

    <hr class='border-gray-100 dark:border-gray-850 my-1'>

    <div class='pb-1 px-[16px] flex-1 max-h-full overflow-y-auto' id='workspace-container'>
      <slot />
    </div>
  </div>
{/if}
