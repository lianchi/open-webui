<script lang='ts'>
  import { getBackendConfig } from '$lib/apis'
  import { setDefaultPromptSuggestions } from '$lib/apis/configs'
  import { updateUserInfo } from '$lib/apis/users'
  import Tooltip from '$lib/components/common/Tooltip.svelte'
  import { config, models, settings, user } from '$lib/stores'
  import { getUserPosition } from '$lib/utils'
  import { createEventDispatcher, getContext, onMount } from 'svelte'
  import { toast } from 'svelte-sonner'

  const dispatch = createEventDispatcher()

  const i18n = getContext('i18n')

  export let saveSettings: Function

  let backgroundImageUrl = null
  let inputFiles = null
  let filesInputElement

  // Addons
  let titleAutoGenerate = true
  let autoTags = true

  let widescreenMode = false
  let splitLargeChunks = false
  let scrollOnBranchChange = true
  let userLocation = false

  // Interface
  let defaultModelId = ''
  let showUsername = false
  let notificationSound = true

  let richTextInput = true
  let promptAutocomplete = false

  let largeTextAsFile = false

  let landingPageMode = ''
  let chatBubble = true
  let chatDirection: 'LTR' | 'RTL' | 'auto' = 'auto'
  let ctrlEnterToSend = false

  let collapseCodeBlocks = false
  let expandDetails = false

  let imageCompression = false
  let imageCompressionSize = {
    width: '',
    height: '',
  }

  // Admin - Show Update Available Toast
  let showUpdateToast = true
  let showChangelog = true

  let showEmojiInCall = false
  let voiceInterruption = false
  let hapticFeedback = false

  let webSearch = null

  const toggleExpandDetails = () => {
    expandDetails = !expandDetails
    saveSettings({ expandDetails })
  }

  const toggleCollapseCodeBlocks = () => {
    collapseCodeBlocks = !collapseCodeBlocks
    saveSettings({ collapseCodeBlocks })
  }

  const toggleSplitLargeChunks = async () => {
    splitLargeChunks = !splitLargeChunks
    saveSettings({ splitLargeChunks })
  }

  const togglePromptAutocomplete = async () => {
    promptAutocomplete = !promptAutocomplete
    saveSettings({ promptAutocomplete })
  }

  const togglesScrollOnBranchChange = async () => {
    scrollOnBranchChange = !scrollOnBranchChange
    saveSettings({ scrollOnBranchChange })
  }

  const toggleWidescreenMode = async () => {
    widescreenMode = !widescreenMode
    saveSettings({ widescreenMode })
  }

  const toggleChatBubble = async () => {
    chatBubble = !chatBubble
    saveSettings({ chatBubble })
  }

  const toggleLandingPageMode = async () => {
    landingPageMode = landingPageMode === '' ? 'chat' : ''
    saveSettings({ landingPageMode })
  }

  const toggleShowUpdateToast = async () => {
    showUpdateToast = !showUpdateToast
    saveSettings({ showUpdateToast })
  }

  const toggleNotificationSound = async () => {
    notificationSound = !notificationSound
    saveSettings({ notificationSound })
  }

  const toggleShowChangelog = async () => {
    showChangelog = !showChangelog
    saveSettings({ showChangelog })
  }

  const toggleShowUsername = async () => {
    showUsername = !showUsername
    saveSettings({ showUsername })
  }

  const toggleEmojiInCall = async () => {
    showEmojiInCall = !showEmojiInCall
    saveSettings({ showEmojiInCall })
  }

  const toggleVoiceInterruption = async () => {
    voiceInterruption = !voiceInterruption
    saveSettings({ voiceInterruption })
  }

  const toggleImageCompression = async () => {
    imageCompression = !imageCompression
    saveSettings({ imageCompression })
  }

  const toggleHapticFeedback = async () => {
    hapticFeedback = !hapticFeedback
    saveSettings({ hapticFeedback })
  }

  const toggleUserLocation = async () => {
    userLocation = !userLocation

    if (userLocation) {
      const position = await getUserPosition().catch((error) => {
        toast.error(error.message)
        return null
      })

      if (position) {
        await updateUserInfo(localStorage.token, { location: position })
        toast.success('成功检索到用户位置。')
      }
      else {
        userLocation = false
      }
    }

    saveSettings({ userLocation })
  }

  const toggleTitleAutoGenerate = async () => {
    titleAutoGenerate = !titleAutoGenerate
    saveSettings({
      title: {
        ...$settings.title,
        auto: titleAutoGenerate,
      },
    })
  }

  const toggleAutoTags = async () => {
    autoTags = !autoTags
    saveSettings({ autoTags })
  }

  const toggleRichTextInput = async () => {
    richTextInput = !richTextInput
    saveSettings({ richTextInput })
  }

  const toggleLargeTextAsFile = async () => {
    largeTextAsFile = !largeTextAsFile
    saveSettings({ largeTextAsFile })
  }

  const toggleChangeChatDirection = async () => {
    if (chatDirection === 'auto') {
      chatDirection = 'LTR'
    }
    else if (chatDirection === 'LTR') {
      chatDirection = 'RTL'
    }
    else if (chatDirection === 'RTL') {
      chatDirection = 'auto'
    }
    saveSettings({ chatDirection })
  }

  const togglectrlEnterToSend = async () => {
    ctrlEnterToSend = !ctrlEnterToSend
    saveSettings({ ctrlEnterToSend })
  }

  const updateInterfaceHandler = async () => {
    saveSettings({
      models: [defaultModelId],
      imageCompressionSize,
    })
  }

  const toggleWebSearch = async () => {
    webSearch = webSearch === null ? 'always' : null
    saveSettings({ webSearch })
  }

  onMount(async () => {
    titleAutoGenerate = $settings?.title?.auto ?? true
    autoTags = $settings.autoTags ?? true

    showUsername = $settings.showUsername ?? false
    showUpdateToast = $settings.showUpdateToast ?? true
    showChangelog = $settings.showChangelog ?? true

    showEmojiInCall = $settings.showEmojiInCall ?? false
    voiceInterruption = $settings.voiceInterruption ?? false

    richTextInput = $settings.richTextInput ?? true
    promptAutocomplete = $settings.promptAutocomplete ?? false
    largeTextAsFile = $settings.largeTextAsFile ?? false

    collapseCodeBlocks = $settings.collapseCodeBlocks ?? false
    expandDetails = $settings.expandDetails ?? false

    landingPageMode = $settings.landingPageMode ?? ''
    chatBubble = $settings.chatBubble ?? true
    widescreenMode = $settings.widescreenMode ?? false
    splitLargeChunks = $settings.splitLargeChunks ?? false
    scrollOnBranchChange = $settings.scrollOnBranchChange ?? true
    chatDirection = $settings.chatDirection ?? 'auto'
    userLocation = $settings.userLocation ?? false

    notificationSound = $settings.notificationSound ?? true

    hapticFeedback = $settings.hapticFeedback ?? false
    ctrlEnterToSend = $settings.ctrlEnterToSend ?? false

    imageCompression = $settings.imageCompression ?? false
    imageCompressionSize = $settings.imageCompressionSize ?? { width: '', height: '' }

    defaultModelId = $settings?.models?.at(0) ?? ''
    if ($config?.default_models) {
      defaultModelId = $config.default_models.split(',')[0]
    }

    backgroundImageUrl = $settings.backgroundImageUrl ?? null
    webSearch = $settings.webSearch ?? null
  })
</script>

<form
  class='flex flex-col h-full justify-between space-y-3 text-sm'
  on:submit|preventDefault={() => {
    updateInterfaceHandler()
    dispatch('save')
  }}
>
  <input
    bind:this={filesInputElement}
    bind:files={inputFiles}
    type='file'
    hidden
    accept='image/*'
    on:change={() => {
      let reader = new FileReader()
      reader.onload = (event) => {
        let originalImageUrl = `${event.target.result}`

        backgroundImageUrl = originalImageUrl
        saveSettings({ backgroundImageUrl })
      }

      if (
        inputFiles
        && inputFiles.length > 0
        && ['image/gif', 'image/webp', 'image/jpeg', 'image/png'].includes(inputFiles[0].type)
      ) {
        reader.readAsDataURL(inputFiles[0])
      }
      else {
        console.log(`Unsupported File Type '${inputFiles[0].type}'.`)
        inputFiles = null
      }
    }}
  />

  <div class='overflow-y-scroll max-h-[28rem] lg:max-h-full'>
    <div class='mb-1.5 text-sm font-bold'>界面</div>

    <div class='space-y-0.5 text-xs pr-4'>
      <div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
        <div>默认主页样式</div>
        <button
          class='hover:text-black dark:hover:text-white'
          on:click={() => {
            toggleLandingPageMode()
          }}
          type='button'
        >
          {#if landingPageMode === ''}
            <span>默认</span>
          {:else}
            <span>对话</span>
          {/if}
        </button>
      </div>

      <div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
        <div>气泡样式对话</div>
        <button
          class='hover:text-black dark:hover:text-white'
          on:click={() => {
            toggleChatBubble()
          }}
          type='button'
        >
          {#if chatBubble === true}
            <span>开启</span>
          {:else}
            <span>关闭</span>
          {/if}
        </button>
      </div>

      {#if !$settings.chatBubble}
        <div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
          <div>在对话中显示用户名而不是“你”</div>
          <button
            class='hover:text-black dark:hover:text-white'
            on:click={() => {
              toggleShowUsername()
            }}
            type='button'
          >
            {#if showUsername === true}
              <span>开启</span>
            {:else}
              <span>关闭</span>
            {/if}
          </button>
        </div>
      {/if}

      <div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
        <div>宽屏模式</div>
        <button
          class='hover:text-black dark:hover:text-white'
          on:click={() => {
            toggleWidescreenMode()
          }}
          type='button'
        >
          {#if widescreenMode === true}
            <span>开启</span>
          {:else}
            <span>关闭</span>
          {/if}
        </button>
      </div>

      <div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
        <div>对话样式方向</div>

        <button
          class='hover:text-black dark:hover:text-white'
          on:click={toggleChangeChatDirection}
          type='button'
        >
          {#if chatDirection === 'LTR'}
            <span>LTR</span>
          {:else if chatDirection === 'RTL'}
            <span>RTL</span>
          {:else}
            <span>自动</span>
          {/if}
        </button>
      </div>

      <div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
        <div>通知提示音</div>

        <button
          class='hover:text-black dark:hover:text-white'
          on:click={() => {
            toggleNotificationSound()
          }}
          type='button'
        >
          {#if notificationSound === true}
            <span>开启</span>
          {:else}
            <span>关闭</span>
          {/if}
        </button>
      </div>

      {#if $user?.role === 'admin'}
        <div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
          <div>更新后弹窗提示更新内容</div>

          <button
            class='hover:text-black dark:hover:text-white'
            on:click={() => {
              toggleShowUpdateToast()
            }}
            type='button'
          >
            {#if showUpdateToast === true}
              <span>开启</span>
            {:else}
              <span>关闭</span>
            {/if}
          </button>
        </div>

        <div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
          <div>在登录时显示“更新内容”弹窗</div>

          <button
            class='hover:text-black dark:hover:text-white'
            on:click={() => {
              toggleShowChangelog()
            }}
            type='button'
          >
            {#if showChangelog === true}
              <span>开启</span>
            {:else}
              <span>关闭</span>
            {/if}
          </button>
        </div>
      {/if}
    </div>

    <div class='mt-3 mb-1.5 text-sm font-bold'>对话</div>

    <div class='space-y-0.5 text-xs pr-4'>
      <div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
        <div>自动生成标题</div>

        <button
          class='hover:text-black dark:hover:text-white'
          on:click={() => {
            toggleTitleAutoGenerate()
          }}
          type='button'
        >
          {#if titleAutoGenerate === true}
            <span>开启</span>
          {:else}
            <span>关闭</span>
          {/if}
        </button>
      </div>

      <div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
        <div>自动生成对话标签</div>

        <button
          class='hover:text-black dark:hover:text-white'
          on:click={() => {
            toggleAutoTags()
          }}
          type='button'
        >
          {#if autoTags === true}
            <span>开启</span>
          {:else}
            <span>关闭</span>
          {/if}
        </button>
      </div>

      <div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
        <div>对话富文本输入</div>

        <button
          class='hover:text-black dark:hover:text-white'
          on:click={() => {
            toggleRichTextInput()
          }}
          type='button'
        >
          {#if richTextInput === true}
            <span>开启</span>
          {:else}
            <span>关闭</span>
          {/if}
        </button>
      </div>

      {#if $config?.features?.enable_autocomplete_generation && richTextInput}
        <div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
          <div>提示词自动补全</div>

          <button
            class='hover:text-black dark:hover:text-white'
            on:click={() => {
              togglePromptAutocomplete()
            }}
            type='button'
          >
            {#if promptAutocomplete === true}
              <span>开启</span>
            {:else}
              <span>关闭</span>
            {/if}
          </button>
        </div>
      {/if}

      <div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
        <div>粘贴大文本作为文件</div>

        <button
          class='hover:text-black dark:hover:text-white'
          on:click={() => {
            toggleLargeTextAsFile()
          }}
          type='button'
        >
          {#if largeTextAsFile === true}
            <span>开启</span>
          {:else}
            <span>关闭</span>
          {/if}
        </button>
      </div>

      <div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
        <div>始终折叠代码块</div>

        <button
          class='hover:text-black dark:hover:text-white'
          on:click={() => {
            toggleCollapseCodeBlocks()
          }}
          type='button'
        >
          {#if collapseCodeBlocks === true}
            <span>开启</span>
          {:else}
            <span>关闭</span>
          {/if}
        </button>
      </div>

      <div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
        <div>始终展开详情信息</div>

        <button
          class='hover:text-black dark:hover:text-white'
          on:click={() => {
            toggleExpandDetails()
          }}
          type='button'
        >
          {#if expandDetails === true}
            <span>开启</span>
          {:else}
            <span>关闭</span>
          {/if}
        </button>
      </div>

      <div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
        <div>对话背景图片</div>

        <button
          class='hover:text-black dark:hover:text-white'
          on:click={() => {
            if (backgroundImageUrl !== null) {
              backgroundImageUrl = null
              saveSettings({ backgroundImageUrl })
            }
            else {
              filesInputElement.click()
            }
          }}
          type='button'
        >
          {#if backgroundImageUrl !== null}
            <span>重置</span>
          {:else}
            <span>上传</span>
          {/if}
        </button>
      </div>

      <div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
        <div>允许获取您的位置</div>

        <button
          class='hover:text-black dark:hover:text-white'
          on:click={() => {
            toggleUserLocation()
          }}
          type='button'
        >
          {#if userLocation === true}
            <span>开启</span>
          {:else}
            <span>关闭</span>
          {/if}
        </button>
      </div>

      <div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
        <div>震动反馈</div>

        <button
          class='hover:text-black dark:hover:text-white'
          on:click={() => {
            toggleHapticFeedback()
          }}
          type='button'
        >
          {#if hapticFeedback === true}
            <span>开启</span>
          {:else}
            <span>关闭</span>
          {/if}
        </button>
      </div>

      <!-- <div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
        <div>流畅地传输外部大型响应块数据</div>

        <button
          class='hover:text-black dark:hover:text-white'
          on:click={() => {
            toggleSplitLargeChunks()
          }}
          type='button'
        >
          {#if splitLargeChunks === true}
            <span>开启</span>
          {:else}
            <span>关闭</span>
          {/if}
        </button>
      </div> -->

      <div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
        <div>Enter 键行为</div>

        <button
          class='hover:text-black dark:hover:text-white'
          on:click={() => {
            togglectrlEnterToSend()
          }}
          type='button'
        >
          {#if ctrlEnterToSend === true}
            <span>Ctrl+Enter 发送</span>
          {:else}
            <span>Enter 发送</span>
          {/if}
        </button>
      </div>

      <div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
        <div>在分支间切换时滚动到底部</div>

        <button
          class='hover:text-black dark:hover:text-white'
          on:click={() => {
            togglesScrollOnBranchChange()
          }}
          type='button'
        >
          {#if scrollOnBranchChange === true}
            <span>开启</span>
          {:else}
            <span>关闭</span>
          {/if}
        </button>
      </div>

      <div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
        <div>聊天中启用网页搜索</div>

        <button
          class='hover:text-black dark:hover:text-white'
          on:click={() => {
            toggleWebSearch()
          }}
          type='button'
        >
          {#if webSearch === 'always'}
            <span>总是</span>
          {:else}
            <span>默认</span>
          {/if}
        </button>
      </div>
    </div>

    <div class='mt-3 my-1.5 text-sm font-bold'>语音</div>

    <div class='space-y-0.5 text-xs pr-4'>
      <div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
        <div>允许在通话中的打断语音</div>

        <button
          class='hover:text-black dark:hover:text-white'
          on:click={() => {
            toggleVoiceInterruption()
          }}
          type='button'
        >
          {#if voiceInterruption === true}
            <span>开启</span>
          {:else}
            <span>关闭</span>
          {/if}
        </button>
      </div>

      <div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
        <div>在通话中显示 Emoji 表情符号</div>

        <button
          class='hover:text-black dark:hover:text-white'
          on:click={() => {
            toggleEmojiInCall()
          }}
          type='button'
        >
          {#if showEmojiInCall === true}
            <span>开启</span>
          {:else}
            <span>关闭</span>
          {/if}
        </button>
      </div>
    </div>

    <div class='mt-3 my-1.5 text-sm font-bold'>文件</div>

    <div class='space-y-0.5 text-xs pr-4'>
      <div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
        <div>图片压缩</div>

        <button
          class='hover:text-black dark:hover:text-white'
          on:click={() => {
            toggleImageCompression()
          }}
          type='button'
        >
          {#if imageCompression === true}
            <span>开启</span>
          {:else}
            <span>关闭</span>
          {/if}
        </button>
      </div>

      {#if imageCompression}
        <div class='py-1 flex w-full items-center justify-between text-xs'>
          <div>图像压缩后最大分辨率</div>

          <div>
            <input
              bind:value={imageCompressionSize.width}
              type='number'
              class='py-0.5 w-16 border rounded-md border-gray-200 dark:border-gray-800 bg-transparent outline-hidden text-center'
              min='0'
              placeholder='宽'
            />
            ×
            <input
              bind:value={imageCompressionSize.height}
              type='number'
              class='py-0.5 w-16 border rounded-md border-gray-200 dark:border-gray-800 bg-transparent outline-hidden text-center'
              min='0'
              placeholder='高'
            />
          </div>
        </div>
      {/if}
    </div>
  </div>

  <div class='flex justify-end text-sm mt-4 font-medium'>
    <button
      class='px-3.5 py-1.5 text-sm font-medium bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 transition rounded-full'
      type='submit'
    >
      保存
    </button>
  </div>
</form>
