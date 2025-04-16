<script lang='ts'>
  import ShortcutsModal from '../chat/ShortcutsModal.svelte'
  import Tooltip from '../common/Tooltip.svelte'
  import HelpMenu from './Help/HelpMenu.svelte'

  let showShortcuts = false
  export let classNames = ''
</script>

<!-- <div class='hidden lg:flex fixed bottom-2 right-2 px-1 py-1 z-20'> -->
<div class={classNames}>
  <HelpMenu
    showDocsHandler={() => {
      showShortcuts = !showShortcuts
    }}
    showShortcutsHandler={() => {
      showShortcuts = !showShortcuts
    }}
  >
    <Tooltip content='帮助' placement='left'>
      <button
        class='text-gray-600 dark:text-gray-300 bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-300/20 dark:hover:bg-gray-300/40 size-6 flex items-center justify-center text-sm rounded-full'
      >
        ?
      </button>
    </Tooltip>
  </HelpMenu>
  <!-- </div> -->

  <ShortcutsModal bind:show={showShortcuts} />
</div>
