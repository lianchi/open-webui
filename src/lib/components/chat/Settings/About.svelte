<script lang='ts'>
  import { getOllamaVersion } from '$lib/apis/ollama'
  import Tooltip from '$lib/components/common/Tooltip.svelte'
  import { WEBUI_BUILD_HASH, WEBUI_VERSION } from '$lib/constants'
  import { showChangelog, WEBUI_NAME } from '$lib/stores'

  import { onMount } from 'svelte'

  let ollamaVersion = ''

  onMount(async () => {
    ollamaVersion = await getOllamaVersion(localStorage.token).catch((_e) => {
      return ''
    })
  })
</script>

<div class='flex flex-col h-full justify-between space-y-3 text-sm mb-6'>
  <div class='space-y-3 overflow-y-scroll max-h-[28rem] lg:max-h-full'>
    <div>
      <div class='mb-2.5 font-medium flex space-x-2 items-center'>
        {$WEBUI_NAME}
      </div>
      <div class='flex w-full justify-between items-center'>
        <div class='flex flex-col text-xs text-gray-700 dark:text-gray-200'>
          <div class='flex gap-1'>
            <Tooltip content={WEBUI_BUILD_HASH}>
              v{WEBUI_VERSION}
            </Tooltip>
          </div>

          <button
            class='underline flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-500'
            on:click={() => {
              showChangelog.set(true)
            }}
          >
            <div>查阅最新更新内容</div>
          </button>
        </div>
      </div>
    </div>

    {#if ollamaVersion}
      <hr class=' border-gray-100 dark:border-gray-850' />

      <div>
        <div class=' mb-2.5 text-sm font-medium'>Ollama 版本</div>
        <div class='flex w-full'>
          <div class='flex-1 text-xs text-gray-700 dark:text-gray-200'>
            {ollamaVersion ?? 'N/A'}
          </div>
        </div>
      </div>
    {/if}

    <hr class=' border-gray-100 dark:border-gray-850' />

    <div class='text-xs text-gray-400 dark:text-gray-500'>
      北京计算机技术及应用研究所 &copy; {new Date().getFullYear()}.
    </div>
  </div>
</div>
