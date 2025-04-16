<script lang='ts'>
  import { updateUserSettings } from '$lib/apis/users'
  import { config, mobile, models, settings, showSettings, user } from '$lib/stores'
  import { toast } from 'svelte-sonner'
  import Tooltip from '../common/Tooltip.svelte'
  import Selector from './ModelSelector/Selector.svelte'

  export let selectedModels = ['']
  export let disabled = false

  export let showSetDefault = true

  const saveDefaultModel = async () => {
    const hasEmptyModel = selectedModels.filter(it => it === '')
    if (hasEmptyModel.length) {
      toast.error('保存前选择一个模型...')
      return
    }
    settings.set({ ...$settings, models: selectedModels })
    await updateUserSettings(localStorage.token, { ui: $settings })

    toast.success('默认模型已更新')
  }

  $: if (selectedModels.length > 0 && $models.length > 0) {
    selectedModels = selectedModels.map(model =>
      $models.map(m => m.id).includes(model) ? model : '',
    )
  }
</script>

<div class='flex flex-col w-full items-start'>
  {#each selectedModels as selectedModel, selectedModelIdx}
    <div class='flex w-full max-w-fit'>
      <div class='overflow-hidden w-full flex items-center'>
        <div class='text-gray-500 text-sm'>模型选择：</div>
        <div class='mr-1 max-w-full'>
          <Selector
            id={`${selectedModelIdx}`}
            placeholder='请选择'
            items={$models.map(model => ({
              value: model.id,
              label: model.name,
              model,
            }))}
            showTemporaryChatControl={$user?.role === 'user'
              ? ($user?.permissions?.chat?.temporary ?? true)
              && !($user?.permissions?.chat?.temporary_enforced ?? false)
              : true}
            bind:value={selectedModel}
          />
        </div>
      </div>

      {#if $user?.role === 'admin' || ($user?.permissions?.chat?.multiple_models ?? true)}
        {#if selectedModelIdx === 0}
          <div class='self-center mx-1 disabled:text-gray-600 disabled:hover:text-gray-600'>
            <Tooltip content='添加模型'>
              <button
                class='p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800'
                {disabled}
                on:click={() => {
                  selectedModels = [...selectedModels, '']
                }}
                aria-label='添加模型'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke-width='2'
                  stroke='currentColor'
                  class='size-4'
                >
                  <path stroke-linecap='round' stroke-linejoin='round' d='M12 6v12m6-6H6' />
                </svg>
              </button>
            </Tooltip>
          </div>
        {:else}
          <div class='self-center mx-1 disabled:text-gray-600 disabled:hover:text-gray-600'>
            <Tooltip content='移除模型'>
              <button
                class='p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800'
                {disabled}
                on:click={() => {
                  selectedModels.splice(selectedModelIdx, 1)
                  selectedModels = selectedModels
                }}
                aria-label='移除模型'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke-width='2'
                  stroke='currentColor'
                  class='size-3'
                >
                  <path stroke-linecap='round' stroke-linejoin='round' d='M19.5 12h-15' />
                </svg>
              </button>
            </Tooltip>
          </div>
        {/if}
      {/if}
    </div>
  {/each}
</div>

{#if showSetDefault && selectedModels.length === 1}
  <div class='absolute mt-[1px] text-[0.7rem] text-gray-500 font-primary hover:text-gray-700 dark:hover:text-gray-300'>
    <button on:click={saveDefaultModel}>设为默认</button>
  </div>
{/if}
