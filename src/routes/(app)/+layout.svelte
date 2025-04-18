<script lang='ts'>
  import fileSaver from 'file-saver'
  import { deleteDB, openDB } from 'idb'
  import { getContext, onMount, tick } from 'svelte'
  import { toast } from 'svelte-sonner'

  const { saveAs } = fileSaver
  import { goto } from '$app/navigation'

  import { page } from '$app/stores'
  import { getModels, getToolServersData } from '$lib/apis'
  import { getAllTags } from '$lib/apis/chats'

  import { getBanners } from '$lib/apis/configs'
  import { getFunctions } from '$lib/apis/functions'
  import { getKnowledgeBases } from '$lib/apis/knowledge'
  import { getPrompts } from '$lib/apis/prompts'
  import { getTools } from '$lib/apis/tools'
  import { getUserSettings } from '$lib/apis/users'
  import ChangelogModal from '$lib/components/ChangelogModal.svelte'
  import SettingsModal from '$lib/components/chat/SettingsModal.svelte'

  import Spinner from '$lib/components/common/Spinner.svelte'
  import AccountPending from '$lib/components/layout/Overlay/AccountPending.svelte'

  import Sidebar from '$lib/components/layout/Sidebar.svelte'

  import UpdateInfoToast from '$lib/components/layout/UpdateInfoToast.svelte'
  import { WEBUI_VERSION } from '$lib/constants'
  import {
    banners,
    config,
    functions,
    knowledge,
    models,
    prompts,
    settings,
    showChangelog,
    showSettings,
    tags,
    temporaryChatEnabled,
    tools,
    toolServers,
    user,
  } from '$lib/stores'
  import { compareVersion } from '$lib/utils'
  import mermaid from 'mermaid'
  import { get } from 'svelte/store'
  import { fade } from 'svelte/transition'

  const i18n = getContext('i18n')

  let loaded = false
  let DB: any = null
  let localDBChats: any[] = []

  let version: any = null

  onMount(async () => {
    if ($user === undefined || $user === null) {
      await goto('/auth')
    }
    else if (['user', 'admin'].includes($user?.role)) {
      try {
        // Check if IndexedDB exists
        DB = await openDB('Chats', 1)

        if (DB) {
          const chats = await DB.getAllFromIndex('chats', 'timestamp')
          localDBChats = chats.map((item: any, idx: number) => chats[chats.length - 1 - idx])

          if (localDBChats.length === 0) {
            await deleteDB('Chats')
          }
        }

        console.log(DB)
      }
      catch (error) {
      // IndexedDB Not Found
      }

      const userSettings = await getUserSettings(localStorage.token).catch((error) => {
        console.error(error)
        return null
      })

      if (userSettings) {
        settings.set(userSettings.ui)
      }
      else {
        let localStorageSettings = {} as Parameters<(typeof settings)['set']>[0]

        try {
          localStorageSettings = JSON.parse(localStorage.getItem('settings') ?? '{}')
        }
        catch (e: unknown) {
          console.error('Failed to parse settings from localStorage', e)
        }

        settings.set(localStorageSettings)
      }

      models.set(
        await getModels(
          localStorage.token,
          $config?.features?.enable_direct_connections && ($settings?.directConnections ?? null),
        ),
      )

      banners.set(await getBanners(localStorage.token))
      tools.set(await getTools(localStorage.token))
      toolServers.set(await getToolServersData($i18n, $settings?.toolServers ?? []))

      document.addEventListener('keydown', async (event) => {
        const isCtrlPressed = event.ctrlKey || event.metaKey // metaKey is for Cmd key on Mac
        // Check if the Shift key is pressed
        const isShiftPressed = event.shiftKey

        // Check if Ctrl + Shift + O is pressed
        if (isCtrlPressed && isShiftPressed && event.key.toLowerCase() === 'o') {
          event.preventDefault()
          console.log('newChat')
          document.getElementById('sidebar-new-chat-button')?.click()
        }

        // Check if Shift + Esc is pressed
        if (isShiftPressed && event.key === 'Escape') {
          event.preventDefault()
          console.log('focusInput')
          document.getElementById('chat-input')?.focus()
        }

        // Check if Ctrl + Shift + ; is pressed
        if (isCtrlPressed && isShiftPressed && event.key === ';') {
          event.preventDefault()
          console.log('copyLastCodeBlock')
          const button = [...document.getElementsByClassName('copy-code-button')]?.at(-1)
          button?.click()
        }

        // Check if Ctrl + Shift + C is pressed
        if (isCtrlPressed && isShiftPressed && event.key.toLowerCase() === 'c') {
          event.preventDefault()
          console.log('copyLastResponse')
          const button = [...document.getElementsByClassName('copy-response-button')]?.at(-1)
          console.log(button)
          button?.click()
        }

        // Check if Ctrl + Shift + S is pressed
        if (isCtrlPressed && isShiftPressed && event.key.toLowerCase() === 's') {
          event.preventDefault()
          console.log('toggleSidebar')
          document.getElementById('sidebar-toggle-button')?.click()
        }

        // Check if Ctrl + Shift + Backspace is pressed
        if (
          isCtrlPressed
          && isShiftPressed
          && (event.key === 'Backspace' || event.key === 'Delete')
        ) {
          event.preventDefault()
          console.log('deleteChat')
          document.getElementById('delete-chat-button')?.click()
        }

        // Check if Ctrl + . is pressed
        if (isCtrlPressed && event.key === '.') {
          event.preventDefault()
          console.log('openSettings')
          showSettings.set(!$showSettings)
        }

        // Check if Ctrl + / is pressed
        if (isCtrlPressed && event.key === '/') {
          event.preventDefault()
          console.log('showShortcuts')
          document.getElementById('show-shortcuts-button')?.click()
        }

        // Check if Ctrl + Shift + ' is pressed
        if (
          isCtrlPressed
          && isShiftPressed
          && (event.key.toLowerCase() === `'` || event.key.toLowerCase() === `"`)
        ) {
          event.preventDefault()
          console.log('temporaryChat')
          temporaryChatEnabled.set(!$temporaryChatEnabled)
          await goto('/')
          const newChatButton = document.getElementById('new-chat-button')
          setTimeout(() => {
            newChatButton?.click()
          }, 0)
        }
      })

      if ($user?.role === 'admin' && ($settings?.showChangelog ?? true)) {
        showChangelog.set($settings?.version !== $config.version)
      }

      if ($user?.permissions?.chat?.temporary ?? true) {
        if ($page.url.searchParams.get('temporary-chat') === 'true') {
          temporaryChatEnabled.set(true)
        }

        if ($user?.permissions?.chat?.temporary_enforced) {
          temporaryChatEnabled.set(true)
        }
      }

      await tick()
    }

    loaded = true
  })
</script>

<SettingsModal bind:show={$showSettings} />
<ChangelogModal bind:show={$showChangelog} />

{#if version && compareVersion(version.latest, version.current) && ($settings?.showUpdateToast ?? true)}
  <div class=' absolute bottom-8 right-8 z-50' in:fade={{ duration: 100 }}>
    <UpdateInfoToast
      {version}
      on:close={() => {
        localStorage.setItem('dismissedUpdateToast', Date.now().toString())
        version = null
      }}
    />
  </div>
{/if}

<div class='app relative'>
  <div class='text-gray-700 dark:text-gray-100 dark:bg-gray-900 h-screen max-h-[100dvh] overflow-auto flex flex-row justify-end'>
    {#if !['user', 'admin'].includes($user?.role)}
      <AccountPending />
    {:else if localDBChats.length > 0}
      <div class='fixed w-full h-full flex z-50'>
        <div class='absolute w-full h-full backdrop-blur-md bg-white/20 dark:bg-gray-900/50 flex justify-center'>
          <div class='m-auto pb-44 flex flex-col justify-center'>
            <div class='max-w-md'>
              <div class='text-center dark:text-white text-2xl font-medium z-50'>
                请注意
              </div>

              <div class=' mt-4 text-center text-sm dark:text-gray-200 w-full'>
                我们不再支持将聊天记录直接保存到浏览器的存储空间。请点击下面的按钮下载并删除您的聊天记录。别担心，您可以轻松地将聊天记录重新导入到后台。
              </div>

              <div class='mt-6 mx-auto relative group w-fit'>
                <button
                  class='relative z-20 flex px-5 py-2 rounded-full bg-white border border-gray-100 dark:border-none hover:bg-gray-100 transition font-medium text-sm'
                  on:click={async () => {
                    let blob = new Blob([JSON.stringify(localDBChats)], {
                      type: 'application/json',
                    })
                    saveAs(blob, `chat-export-${Date.now()}.json`)
                    const tx = DB.transaction('chats', 'readwrite')
                    await Promise.all([tx.store.clear(), tx.done])
                    await deleteDB('Chats')
                    localDBChats = []
                  }}
                >
                  下载并删除
                </button>

                <button
                  class='text-xs text-center w-full mt-2 text-gray-400 underline'
                  on:click={async () => {
                    localDBChats = []
                  }}
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/if}

    <Sidebar />
    {#if loaded}
      <slot />
    {:else}
      <div class='w-full flex-1 h-full flex items-center justify-center'>
        <Spinner />
      </div>
    {/if}
  </div>
</div>

<style>
	.loading {
		display: inline-block;
		clip-path: inset(0 1ch 0 0);
		animation: l 1s steps(3) infinite;
		letter-spacing: -0.5px;
	}

	@keyframes l {
		to {
			clip-path: inset(0 -1ch 0 0);
		}
	}

	pre[class*='language-'] {
		position: relative;
		overflow: auto;

		/* make space  */
		margin: 5px 0;
		padding: 1.75rem 0 1.75rem 1rem;
		border-radius: 10px;
	}

	pre[class*='language-'] button {
		position: absolute;
		top: 5px;
		right: 5px;

		font-size: 0.9rem;
		padding: 0.15rem;
		background-color: #828282;

		border: ridge 1px #7b7b7c;
		border-radius: 5px;
		text-shadow: #c4c4c4 0 0 2px;
	}

	pre[class*='language-'] button:hover {
		cursor: pointer;
		background-color: #bcbabb;
	}
</style>
