<script lang='ts'>
  import { page } from '$app/stores'
  import Menu from '$lib/components/layout/Navbar/Menu.svelte'
  import UserMenu from '$lib/components/layout/Sidebar/UserMenu.svelte'

  import {
    chatId,
    mobile,
    settings,
    showArchivedChats,
    showControls,
    showSidebar,
    temporaryChatEnabled,
    user,
    WEBUI_NAME,
  } from '$lib/stores'

  import { toast } from 'svelte-sonner'
  import { slide } from 'svelte/transition'
  import ModelSelector from '../chat/ModelSelector.svelte'
  import ShareChatModal from '../chat/ShareChatModal.svelte'
  import Tooltip from '../common/Tooltip.svelte'
  import AdjustmentsHorizontal from '../icons/AdjustmentsHorizontal.svelte'
  import MenuLines from '../icons/MenuLines.svelte'

  import Plus from '../icons/Plus.svelte'

  export let initNewChat: Function
  export let title: string = $WEBUI_NAME
  export let shareEnabled: boolean = false

  export let chat
  export let selectedModels
  export let showModelSelector = true

  let showShareChatModal = false
  let showDownloadChatModal = false
</script>

<ShareChatModal bind:show={showShareChatModal} chatId={$chatId} />

<nav class='sticky top-0 z-30 w-full px-1.5 py-1.5 -mb-8 flex items-center drag-region'>
  <div
    class=' bg-linear-to-b via-50% from-white via-white to-transparent dark:from-gray-900 dark:via-gray-900 dark:to-transparent pointer-events-none absolute inset-0 -bottom-7 z-[-1]'
  ></div>

  <div class='flex max-w-full w-full mx-auto px-1 pt-0.5 bg-transparent'>
    <div class='flex items-center w-full max-w-full'>
      <div
        class="{$showSidebar ? 'md:hidden' : ''} mr-1 self-start flex flex-none items-center text-gray-600 dark:text-gray-400"
      >
        <button
          id='sidebar-toggle-button'
          class='cursor-pointer px-2 py-2 flex rounded-xl hover:bg-gray-50 dark:hover:bg-gray-850 transition'
          on:click={() => {
            showSidebar.set(!$showSidebar)
          }}
          aria-label='切换侧边栏'
        >
          <div class='m-auto self-center'>
            <MenuLines />
          </div>
        </button>
      </div>

      <div class="flex-1 overflow-hidden max-w-full py-0.5 {$showSidebar ? 'ml-1' : ''}">
        {#if showModelSelector}
          <ModelSelector bind:selectedModels showSetDefault={!shareEnabled} />
        {/if}
      </div>

      <div class='self-start flex flex-none items-center text-gray-600 dark:text-gray-400'>
        <!-- <div class="md:hidden flex self-center w-[1px] h-5 mx-2 bg-gray-300 dark:bg-stone-700" /> -->
        {#if shareEnabled && chat && (chat.id || $temporaryChatEnabled)}
          <Menu
            {chat}
            {shareEnabled}
            shareHandler={() => {
              showShareChatModal = !showShareChatModal
            }}
            downloadHandler={() => {
              showDownloadChatModal = !showDownloadChatModal
            }}
          >
            <button
              class='flex cursor-pointer px-2 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-850 transition'
              id='chat-context-menu-button'
            >
              <div class=' m-auto self-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke-width='1.5'
                  stroke='currentColor'
                  class='size-5'
                >
                  <path
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    d='M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z'
                  />
                </svg>
              </div>
            </button>
          </Menu>
        {/if}

        <Tooltip content='对话高级设置'>
          <button
            class='flex cursor-pointer px-2 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-850 transition'
            on:click={async () => {
              await showControls.set(!$showControls)
            }}
            aria-label='对话高级设置'
          >
            <div class='m-auto self-center'>
              <AdjustmentsHorizontal className=' size-5' strokeWidth='0.5' />
            </div>
          </button>
        </Tooltip>

        <Tooltip content='新对话'>
          <button
            id='new-chat-button'
            class="flex {$showSidebar
              ? 'md:hidden'
              : ''} cursor-pointer px-2 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-850 transition"
            on:click={() => {
              initNewChat()
            }}
            aria-label='新对话'
          >
            <div class='m-auto self-center'>
              <Plus className='size-5' strokeWidth='2' />
            </div>
          </button>
        </Tooltip>
      </div>
    </div>
  </div>
</nav>
