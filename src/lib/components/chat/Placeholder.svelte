<script lang='ts'>
  import { marked } from 'marked'
  import { createEventDispatcher, onMount, tick } from 'svelte'

  import { toast } from 'svelte-sonner'
  import { blur, fade } from 'svelte/transition'

  const dispatch = createEventDispatcher()

  import Tooltip from '$lib/components/common/Tooltip.svelte'
  import EyeSlash from '$lib/components/icons/EyeSlash.svelte'
  import { WEBUI_BASE_URL } from '$lib/constants'

  import { models as _models, config, temporaryChatEnabled, user } from '$lib/stores'
  import { extractCurlyBraceWords, sanitizeResponseContent } from '$lib/utils'
  import MessageInput from './MessageInput.svelte'
  import Suggestions from './Suggestions.svelte'

  export let transparentBackground = false

  export let createMessagePair: Function
  export let stopResponse: Function

  export let autoScroll = false

  export let atSelectedModel: Model | undefined
  export let selectedModels: ['']

  export let history

  export let prompt = ''
  export let files = []

  export let selectedToolIds = []
  export let imageGenerationEnabled = false
  export let codeInterpreterEnabled = false
  export let webSearchEnabled = false

  export let toolServers = []

  let models = []

  const selectSuggestionPrompt = async (p) => {
    let text = p

    if (p.includes('{{CLIPBOARD}}')) {
      const clipboardText = await navigator.clipboard.readText().catch((err) => {
        toast.error('读取剪贴板内容失败')
        return '{{CLIPBOARD}}'
      })

      text = p.replaceAll('{{CLIPBOARD}}', clipboardText)

      console.log('Clipboard text:', clipboardText, text)
    }

    prompt = text

    console.log(prompt)
    await tick()

    const chatInputContainerElement = document.getElementById('chat-input-container')
    const chatInputElement = document.getElementById('chat-input')

    if (chatInputContainerElement) {
      chatInputContainerElement.scrollTop = chatInputContainerElement.scrollHeight
    }

    await tick()
    if (chatInputElement) {
      chatInputElement.focus()
      chatInputElement.dispatchEvent(new Event('input'))
    }

    await tick()
  }

  let selectedModelIdx = 0

  $: if (selectedModels.length > 0) {
    selectedModelIdx = models.length - 1
  }

  $: models = selectedModels.map(id => $_models.find(m => m.id === id))

  onMount(() => {})
</script>

<div class='m-auto w-full max-w-6xl px-2 @2xl:px-20 translate-y-6 py-24 text-center'>
  {#if $temporaryChatEnabled}
    <Tooltip
      content='此聊天不会出现在历史记录中，且您的消息不会被保存。'
      className='w-full flex justify-center mb-0.5'
      placement='top'
    >
      <div class='flex items-center gap-2 text-gray-500 font-medium text-lg my-2 w-fit'>
        <EyeSlash strokeWidth='2.5' className='size-5' />临时对话
      </div>
    </Tooltip>
  {/if}

  <div
    class='w-full text-3xl text-gray-800 dark:text-gray-100 text-center flex items-center gap-4'
  >
    <div class='w-full flex flex-col justify-center items-center'>
      <div class='flex flex-col justify-center gap-2 w-fit px-5'>
        <div class='flex shrink-0 justify-center'>
          <div class='flex space-x-2 mb-0.5' in:fade={{ duration: 100 }}>
            {#each models as model, modelIdx}
              <Tooltip
                content={(models[modelIdx]?.info?.meta?.tags ?? [])
                  .map(tag => tag.name.toUpperCase())
                  .join(', ')}
                placement='top'
              >
                <button on:click={() => { selectedModelIdx = modelIdx }}>
                  <img
                    crossorigin='anonymous'
                    src={model?.info?.meta?.profile_image_url ?? `${WEBUI_BASE_URL}/static/favicon.svg`}
                    class='h-16'
                    alt='logo'
                    draggable='false'
                  />
                </button>
              </Tooltip>
            {/each}
          </div>
        </div>

        <div class='text-3xl line-clamp-1' in:fade={{ duration: 100 }}>
          {#if models[selectedModelIdx]?.name}
            {models[selectedModelIdx]?.name}
          {:else}
            {`欢迎使用天熠小舟，${$user?.name}`}
          {/if}
        </div>
      </div>

      <div class='flex mt-1 mb-2'>
        <div in:fade={{ duration: 100, delay: 50 }}>
          {#if models[selectedModelIdx]?.info?.meta?.description ?? null}
            <Tooltip
              className=' w-fit'
              content={marked.parse(
                sanitizeResponseContent(models[selectedModelIdx]?.info?.meta?.description ?? ''),
              )}
              placement='top'
            >
              <div
                class='mt-0.5 px-2 text-sm font-normal text-gray-500 dark:text-gray-400 line-clamp-2 max-w-xl markdown'
              >
                {@html marked.parse(
                  sanitizeResponseContent(models[selectedModelIdx]?.info?.meta?.description),
                )}
              </div>
            </Tooltip>

            {#if models[selectedModelIdx]?.info?.meta?.user}
              <div class='mt-0.5 text-sm font-normal text-gray-400 dark:text-gray-500'>
                By {models[selectedModelIdx]?.info?.meta?.user.name}
              </div>
            {/if}
          {/if}
        </div>
      </div>

      <div class="text-base font-normal @md:max-w-3xl w-full py-3 {atSelectedModel ? 'mt-2' : ''}">
        <MessageInput
          {history}
          {selectedModels}
          bind:files
          bind:prompt
          bind:autoScroll
          bind:selectedToolIds
          bind:imageGenerationEnabled
          bind:codeInterpreterEnabled
          bind:webSearchEnabled
          bind:atSelectedModel
          {toolServers}
          {transparentBackground}
          {stopResponse}
          {createMessagePair}
          placeholder='有什么我能帮您的吗？'
          on:upload={(e) => {
            dispatch('upload', e.detail)
          }}
          on:submit={(e) => {
            dispatch('submit', e.detail)
          }}
        />
      </div>
    </div>
  </div>
  <div class='mx-auto max-w-2xl font-primary' in:fade={{ duration: 200, delay: 200 }}>
    <div class='mx-5'>
      <Suggestions
        suggestionPrompts={atSelectedModel?.info?.meta?.suggestion_prompts
          ?? models[selectedModelIdx]?.info?.meta?.suggestion_prompts
          ?? $config?.default_prompt_suggestions
          ?? []}
        inputValue={prompt}
        on:select={(e) => {
          selectSuggestionPrompt(e.detail)
        }}
      />
    </div>
  </div>
</div>
