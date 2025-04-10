<script>
  import { goto } from '$app/navigation'
  import { config, WEBUI_NAME } from '$lib/stores'
  import { onMount } from 'svelte'

  let loaded = false

  onMount(async () => {
    if ($config) {
      await goto('/')
    }

    loaded = true
  })
</script>

{#if loaded}
  <div class='absolute w-full h-full flex z-50'>
    <div class='absolute rounded-xl w-full h-full backdrop-blur-sm flex justify-center'>
      <div class='m-auto pb-44 flex flex-col justify-center'>
        <div class='max-w-md'>
          <div class='text-center text-2xl font-medium z-50'>
            「{$WEBUI_NAME}」需要后端服务
          </div>

          <div class=' mt-6 mx-auto relative group w-fit'>
            <button
              class='relative z-20 flex px-5 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition font-medium text-sm'
              on:click={() => {
                location.href = '/'
              }}
            >
              刷新重试
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
