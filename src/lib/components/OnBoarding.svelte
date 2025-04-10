<script>
  import { WEBUI_NAME } from '$lib/stores'
  import { getContext } from 'svelte'

  const i18n = getContext('i18n')

  import { WEBUI_BASE_URL } from '$lib/constants'

  import ArrowRightCircle from './icons/ArrowRightCircle.svelte'

  export let show = true
  export let getStartedHandler = () => {}

  function setLogoImage() {
    const logo = document.getElementById('logo')

    if (logo) {
      const isDarkMode = document.documentElement.classList.contains('dark')

      if (isDarkMode) {
        const darkImage = new Image()
        darkImage.src = '/static/favicon-dark.png'

        darkImage.onload = () => {
          logo.src = '/static/favicon-dark.png'
          logo.style.filter = '' // Ensure no inversion is applied if splash-dark.png exists
        }

        darkImage.onerror = () => {
          logo.style.filter = 'invert(1)' // Invert image if splash-dark.png is missing
        }
      }
    }
  }

  $: if (show) {
    setLogoImage()
  }
</script>

{#if show}
  <div class='w-full h-screen max-h-[100dvh] text-white relative'>
    <div class='fixed m-10 z-50'>
      <div class='flex space-x-2'>
        <div class=' self-center'>
          <img
            id='logo'
            crossorigin='anonymous'
            src='{WEBUI_BASE_URL}/static/favicon.png'
            class='w-10'
            alt='logo'
          />
        </div>
      </div>
    </div>

    <div
      class='w-full h-full absolute top-0 left-0 bg-cover bg-center transition-opacity duration-1000'
      style="background-image: url('/assets/images/earth.jpg')"
    />

    <div class='w-full h-full absolute top-0 left-0 bg-linear-to-t from-20% from-black to-transparent' />

    <div class='w-full h-full absolute top-0 left-0 backdrop-blur-xs bg-black/50' />

    <div class='relative bg-transparent w-full min-h-screen flex z-10'>
      <div class='flex flex-col justify-center w-full items-center pb-10 text-center'>
        <div class='text-5xl lg:text-7xl'>
          {$WEBUI_NAME}
        </div>

        <div class='flex justify-center mt-8'>
          <div class='flex flex-col justify-center items-center'>
            <button
              class='relative z-20 flex items-center px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 transition font-medium text-sm'
              on:click={() => {
                getStartedHandler()
              }}
            >
              <ArrowRightCircle className='size-6' />
              <div class='ml-2 font-primary text-base font-medium'>{$i18n.t(`Get started`)}</div>
            </button>
          </div>
        </div>
      </div>

      <!-- <div class="absolute bottom-12 left-0 right-0 w-full"></div> -->
    </div>
  </div>
{/if}
