<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { createEventDispatcher, onMount, getContext } from 'svelte';
	import { getLanguages, changeLanguage } from '$lib/i18n';
	const dispatch = createEventDispatcher();

	import { models, settings, theme, user } from '$lib/stores';

	const i18n = getContext('i18n');

	import AdvancedParams from './Advanced/AdvancedParams.svelte';
	import Textarea from '$lib/components/common/Textarea.svelte';

	export let saveSettings: Function;
	export let getModels: Function;

	// General
	let themes = ['dark', 'light', 'rose-pine dark', 'rose-pine-dawn light', 'oled-dark'];
	let selectedTheme = 'system';

	let languages: Awaited<ReturnType<typeof getLanguages>> = [];
	let lang = $i18n.language;
	let notificationEnabled = false;
	let system = '';

	let showAdvanced = false;

	const toggleNotification = async () => {
		const permission = await Notification.requestPermission();

		if (permission === 'granted') {
			notificationEnabled = !notificationEnabled;
			saveSettings({ notificationEnabled: notificationEnabled });
		} else {
			toast.error(
				$i18n.t(
					'Response notifications cannot be activated as the website permissions have been denied. Please visit your browser settings to grant the necessary access.'
				)
			);
		}
	};

	// Advanced
	let requestFormat = null;
	let keepAlive: string | null = null;

	let params = {
		// Advanced
		stream_response: null,
		function_calling: null,
		seed: null,
		temperature: null,
		reasoning_effort: null,
		logit_bias: null,
		frequency_penalty: null,
		presence_penalty: null,
		repeat_penalty: null,
		repeat_last_n: null,
		mirostat: null,
		mirostat_eta: null,
		mirostat_tau: null,
		top_k: null,
		top_p: null,
		min_p: null,
		stop: null,
		tfs_z: null,
		num_ctx: null,
		num_batch: null,
		num_keep: null,
		max_tokens: null,
		num_gpu: null
	};

	const validateJSON = (json) => {
		try {
			const obj = JSON.parse(json);

			if (obj && typeof obj === 'object') {
				return true;
			}
		} catch (e) {}
		return false;
	};

	const toggleRequestFormat = async () => {
		if (requestFormat === null) {
			requestFormat = 'json';
		} else {
			requestFormat = null;
		}

		saveSettings({ requestFormat: requestFormat !== null ? requestFormat : undefined });
	};

	const saveHandler = async () => {
		if (requestFormat !== null && requestFormat !== 'json') {
			if (validateJSON(requestFormat) === false) {
				toast.error($i18n.t('Invalid JSON schema'));
				return;
			} else {
				requestFormat = JSON.parse(requestFormat);
			}
		}

		saveSettings({
			system: system !== '' ? system : undefined,
			params: {
				stream_response: params.stream_response !== null ? params.stream_response : undefined,
				function_calling: params.function_calling !== null ? params.function_calling : undefined,
				seed: (params.seed !== null ? params.seed : undefined) ?? undefined,
				stop: params.stop ? params.stop.split(',').filter((e) => e) : undefined,
				temperature: params.temperature !== null ? params.temperature : undefined,
				reasoning_effort: params.reasoning_effort !== null ? params.reasoning_effort : undefined,
				logit_bias: params.logit_bias !== null ? params.logit_bias : undefined,
				frequency_penalty: params.frequency_penalty !== null ? params.frequency_penalty : undefined,
				presence_penalty: params.frequency_penalty !== null ? params.frequency_penalty : undefined,
				repeat_penalty: params.frequency_penalty !== null ? params.frequency_penalty : undefined,
				repeat_last_n: params.repeat_last_n !== null ? params.repeat_last_n : undefined,
				mirostat: params.mirostat !== null ? params.mirostat : undefined,
				mirostat_eta: params.mirostat_eta !== null ? params.mirostat_eta : undefined,
				mirostat_tau: params.mirostat_tau !== null ? params.mirostat_tau : undefined,
				top_k: params.top_k !== null ? params.top_k : undefined,
				top_p: params.top_p !== null ? params.top_p : undefined,
				min_p: params.min_p !== null ? params.min_p : undefined,
				tfs_z: params.tfs_z !== null ? params.tfs_z : undefined,
				num_ctx: params.num_ctx !== null ? params.num_ctx : undefined,
				num_batch: params.num_batch !== null ? params.num_batch : undefined,
				num_keep: params.num_keep !== null ? params.num_keep : undefined,
				max_tokens: params.max_tokens !== null ? params.max_tokens : undefined,
				use_mmap: params.use_mmap !== null ? params.use_mmap : undefined,
				use_mlock: params.use_mlock !== null ? params.use_mlock : undefined,
				num_thread: params.num_thread !== null ? params.num_thread : undefined,
				num_gpu: params.num_gpu !== null ? params.num_gpu : undefined
			},
			keepAlive: keepAlive ? (isNaN(keepAlive) ? keepAlive : parseInt(keepAlive)) : undefined,
			requestFormat: requestFormat !== null ? requestFormat : undefined
		});
		dispatch('save');

		requestFormat =
			typeof requestFormat === 'object' ? JSON.stringify(requestFormat, null, 2) : requestFormat;
	};

	onMount(async () => {
		selectedTheme = localStorage.theme ?? 'system';

		languages = await getLanguages();

		notificationEnabled = $settings.notificationEnabled ?? false;
		system = $settings.system ?? '';

		requestFormat = $settings.requestFormat ?? null;
		if (requestFormat !== null && requestFormat !== 'json') {
			requestFormat =
				typeof requestFormat === 'object' ? JSON.stringify(requestFormat, null, 2) : requestFormat;
		}

		keepAlive = $settings.keepAlive ?? null;

		params = { ...params, ...$settings.params };
		params.stop = $settings?.params?.stop ? ($settings?.params?.stop ?? []).join(',') : null;
	});

	const applyTheme = (_theme: string) => {
		let themeToApply = _theme === 'oled-dark' ? 'dark' : _theme;

		if (_theme === 'system') {
			themeToApply = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		}

		if (themeToApply === 'dark' && !_theme.includes('oled')) {
			document.documentElement.style.setProperty('--color-gray-800', '#333');
			document.documentElement.style.setProperty('--color-gray-850', '#262626');
			document.documentElement.style.setProperty('--color-gray-900', '#171717');
			document.documentElement.style.setProperty('--color-gray-950', '#0d0d0d');
		}

		themes
			.filter((e) => e !== themeToApply)
			.forEach((e) => {
				e.split(' ').forEach((e) => {
					document.documentElement.classList.remove(e);
				});
			});

		themeToApply.split(' ').forEach((e) => {
			document.documentElement.classList.add(e);
		});

		const metaThemeColor = document.querySelector('meta[name="theme-color"]');
		if (metaThemeColor) {
			if (_theme.includes('system')) {
				const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
					? 'dark'
					: 'light';
				console.log('Setting system meta theme color: ' + systemTheme);
				metaThemeColor.setAttribute('content', systemTheme === 'light' ? '#ffffff' : '#171717');
			} else {
				console.log('Setting meta theme color: ' + _theme);
				metaThemeColor.setAttribute(
					'content',
					_theme === 'dark'
						? '#171717'
						: _theme === 'oled-dark'
							? '#000000'
							: '#ffffff'
				);
			}
		}

		if (typeof window !== 'undefined' && window.applyTheme) {
			window.applyTheme();
		}

		if (_theme.includes('oled')) {
			document.documentElement.style.setProperty('--color-gray-800', '#101010');
			document.documentElement.style.setProperty('--color-gray-850', '#050505');
			document.documentElement.style.setProperty('--color-gray-900', '#000000');
			document.documentElement.style.setProperty('--color-gray-950', '#000000');
			document.documentElement.classList.add('dark');
		}

		console.log(_theme);
	};

	const themeChangeHandler = (_theme: string) => {
		theme.set(_theme);
		localStorage.setItem('theme', _theme);
		applyTheme(_theme);
	};
</script>

<div class="flex flex-col h-full justify-between text-sm">
	<div class="  overflow-y-scroll max-h-[28rem] lg:max-h-full">
		<div class='space-y-0.5 text-xs pr-4'>
			<div class="mb-1.5 text-sm font-bold">通用设置</div>

			<div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
				<div class="self-center text-xs font-medium">界面主题</div>
				<div class="cursor-pointer flex items-center relative">
					<select
						class="dark:bg-gray-900 w-fit pr-8 rounded-sm px-2 text-xs bg-transparent outline-hidden"
						bind:value={selectedTheme}
						placeholder="选择主题"
						on:change={() => themeChangeHandler(selectedTheme)}
					>
						<option value="system">⚙️ 系统</option>
						<option value="dark">🌑 暗色</option>
						<option value="oled-dark">🌃 黑色</option>
						<option value="light">☀️ 浅色</option>
					</select>
				</div>
			</div>

			<div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
				<div class=" self-center text-xs font-medium">语言</div>
				<div class="flex items-center relative">
					<select
						class=" dark:bg-gray-900 w-fit pr-8 rounded-sm px-2 text-xs bg-transparent outline-hidden"
						bind:value={lang}
						placeholder="选择语言"
						on:change={(e) => {
							changeLanguage(lang);
						}}
					>
						{#each languages as language}
							<option value={language['code']}>{language['title']}</option>
						{/each}
					</select>
				</div>
			</div>

			<div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
					<div>桌面通知</div>

					<button
						class='hover:text-black dark:hover:text-white'
						on:click={() => {
							toggleNotification();
						}}
						type="button"
					>
						{#if notificationEnabled === true}
							<span>开启</span>
						{:else}
							<span>关闭</span>
						{/if}
					</button>
				</div>
		</div>

		{#if $user?.role === 'admin' || $user?.permissions.chat?.controls}
			<hr class="border-gray-100 dark:border-gray-850 my-3" />

			<div class="pr-4">
				<div class="my-1.5 text-sm font-bold">系统提示词</div>
				<Textarea
					bind:value={system}
					className="bg-transparent resize-none max-h-[10rem]"
					rows={2}
					placeholder="输入系统提示词"
				/>
			</div>

			<div class="mt-2 space-y-3">
				<div class="flex justify-between items-center text-sm pr-4">
					<div class="my-1.5 text-sm font-bold">高级参数</div>
					<button
						class="text-gray-500"
						type="button"
						on:click={() => {
							showAdvanced = !showAdvanced;
						}}>{showAdvanced ? '隐藏' : '显示'}</button
					>
				</div>

				{#if showAdvanced}
					<AdvancedParams admin={$user?.role === 'admin'} bind:params />

					<hr class="border-gray-100 dark:border-gray-850" />

					<div class='space-y-0.5 text-xs pr-4'>
						<div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
							<div>保持活动</div>

							<button
								class="hover:text-black dark:hover:text-white"
								type="button"
								on:click={() => {
									keepAlive = keepAlive === null ? '5m' : null;
								}}
							>
								{#if keepAlive === null}
									<span>默认</span>
								{:else}
									<span>自定义</span>
								{/if}
							</button>
						</div>

						{#if keepAlive !== null}
							<div class="mt-1 px-2">
								<input
									class="w-full px-2 py-1 rounded-md text-xs border border-gray-200 dark:border-gray-800 dark:text-gray-300 outline-hidden"
									type="text"
									placeholder="例如 '30s'，'10m'。有效的时间单位是秒：'s'，分：'m'，时：'h'。"
									bind:value={keepAlive}
								/>
							</div>
						{/if}

						<div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
							<div>请求模式</div>

							<button
								class="hover:text-black dark:hover:text-white"
								on:click={() => {
									toggleRequestFormat();
								}}
							>
								{#if requestFormat === null}
									<span>默认</span>
								{:else}
									<span>JSON</span>
								{/if}
							</button>
						</div>

						{#if requestFormat !== null}
							<div class="flex mt-1 px-2">
								<Textarea
									placeholder="例如 'json' 或一个 JSON schema"
									bind:value={requestFormat}
								/>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<div class="flex justify-end mt-4 text-sm font-medium">
		<button
			class="px-3.5 py-1.5 text-sm font-medium bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 transition rounded-full"
			on:click={() => {
				saveHandler();
			}}
		>
			保存
		</button>
	</div>
</div>
