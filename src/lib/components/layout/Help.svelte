<script lang='ts'>
  import ShortcutsModal from '../chat/ShortcutsModal.svelte'
  import Tooltip from '../common/Tooltip.svelte'
  import HelpMenu from './Help/HelpMenu.svelte'

  let showShortcuts = false
</script>

<div class='hidden lg:flex fixed bottom-2 right-2 px-1 py-1 z-20'>
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
        class='text-gray-600 dark:text-gray-300 bg-gray-300/40 dark:bg-gray-300/20 size-8 flex items-center justify-center text-[1rem] rounded-full'
      >
        ?
      </button>
    </Tooltip>
  </HelpMenu>
</div>

<ShortcutsModal bind:show={showShortcuts} />
