<script lang="ts">
	import { toast } from 'svelte-sonner';
	import fileSaver from 'file-saver';
	const { saveAs } = fileSaver;

	import { onMount } from 'svelte';
	import { WEBUI_NAME, config, prompts, tools as _tools, user } from '$lib/stores';
	import { createNewPrompt, deletePromptByCommand, getPrompts } from '$lib/apis/prompts';

	import { goto } from '$app/navigation';
	import {
		createNewTool,
		deleteToolById,
		exportTools,
		getToolById,
		getToolList,
		getTools
	} from '$lib/apis/tools';
	import ArrowDownTray from '../icons/ArrowDownTray.svelte';
	import Tooltip from '../common/Tooltip.svelte';
	import ConfirmDialog from '../common/ConfirmDialog.svelte';
	import ToolMenu from './Tools/ToolMenu.svelte';
	import EllipsisHorizontal from '../icons/EllipsisHorizontal.svelte';
	import ValvesModal from './common/ValvesModal.svelte';
	import ManifestModal from './common/ManifestModal.svelte';
	import Heart from '../icons/Heart.svelte';
	import DeleteConfirmDialog from '$lib/components/common/ConfirmDialog.svelte';
	import GarbageBin from '../icons/GarbageBin.svelte';
	import Search from '../icons/Search.svelte';
	import Plus from '../icons/Plus.svelte';
	import Spinner from '../common/Spinner.svelte';
	import { capitalizeFirstLetter } from '$lib/utils';

	let shiftKey = false;
	let loaded = false;

	let toolsImportInputElement: HTMLInputElement;
	let importFiles;

	let showConfirm = false;
	let query = '';

	let showManifestModal = false;
	let showValvesModal = false;
	let selectedTool = null;

	let showDeleteConfirm = false;

	let tools = [];
	let filteredItems = [];

	$: filteredItems = tools.filter(
		(t) =>
			query === '' ||
			t.name.toLowerCase().includes(query.toLowerCase()) ||
			t.id.toLowerCase().includes(query.toLowerCase())
	);

	const shareHandler = async (tool) => {
		const item = await getToolById(localStorage.token, tool.id).catch((error) => {
			toast.error(`${error}`);
			return null;
		});

		toast.success('正在将您重定向到社区');

		const url = 'https://ai.706.com';

		const tab = await window.open(`${url}/tools/create`, '_blank');

		const messageHandler = (event) => {
			if (event.origin !== url) return;
			if (event.data === 'loaded') {
				tab.postMessage(JSON.stringify(item), '*');
				window.removeEventListener('message', messageHandler);
			}
		};

		window.addEventListener('message', messageHandler, false);
		console.log(item);
	};

	const cloneHandler = async (tool) => {
		const _tool = await getToolById(localStorage.token, tool.id).catch((error) => {
			toast.error(`${error}`);
			return null;
		});

		if (_tool) {
			sessionStorage.tool = JSON.stringify({
				..._tool,
				id: `${_tool.id}_clone`,
				name: `${_tool.name} (Clone)`
			});
			goto('/workspace/tools/create');
		}
	};

	const exportHandler = async (tool) => {
		const _tool = await getToolById(localStorage.token, tool.id).catch((error) => {
			toast.error(`${error}`);
			return null;
		});

		if (_tool) {
			let blob = new Blob([JSON.stringify([_tool])], {
				type: 'application/json'
			});
			saveAs(blob, `tool-${_tool.id}-export-${Date.now()}.json`);
		}
	};

	const deleteHandler = async (tool) => {
		const res = await deleteToolById(localStorage.token, tool.id).catch((error) => {
			toast.error(`${error}`);
			return null;
		});

		if (res) {
			toast.success('工具已删除');
			await init();
		}
	};

	const init = async () => {
		tools = await getToolList(localStorage.token);
		_tools.set(await getTools(localStorage.token));
	};

	onMount(async () => {
		await init();
		loaded = true;

		const onKeyDown = (event) => {
			if (event.key === 'Shift') {
				shiftKey = true;
			}
		};

		const onKeyUp = (event) => {
			if (event.key === 'Shift') {
				shiftKey = false;
			}
		};

		const onBlur = () => {
			shiftKey = false;
		};

		window.addEventListener('keydown', onKeyDown);
		window.addEventListener('keyup', onKeyUp);
		window.addEventListener('blur-sm', onBlur);

		return () => {
			window.removeEventListener('keydown', onKeyDown);
			window.removeEventListener('keyup', onKeyUp);
			window.removeEventListener('blur-sm', onBlur);
		};
	});
</script>

<svelte:head>
	<title>
		工具 | {$WEBUI_NAME}
	</title>
</svelte:head>

{#if loaded}
	<div class="flex flex-col gap-2 my-1.5">
		<div class="flex justify-between items-center">
			<div class="flex md:self-center text-xl font-medium px-0.5 items-center">
				工具
				<div class="flex self-center w-[1px] h-6 mx-2.5 bg-gray-50 dark:bg-gray-850" />
				<span class="text-lg font-medium text-gray-500 dark:text-gray-300">{filteredItems.length}</span>
			</div>
		</div>

		<div class="flex w-full space-x-2">
			<div class="flex flex-1 rounded-full px-2 border border-gray-200 dark:border-gray-800">
				<div class=" self-center ml-1 mr-3">
					<Search className="size-3.5" />
				</div>
				<input
					class=" w-full text-sm pr-4 py-1 rounded-r-xl outline-hidden bg-transparent"
					bind:value={query}
					placeholder="搜索工具"
				/>
			</div>

			<div>
				<a
					class=" px-2 py-2 rounded-xl hover:bg-gray-700/10 dark:hover:bg-gray-100/10 dark:text-gray-300 dark:hover:text-white transition font-medium text-sm flex items-center space-x-1"
					href="/workspace/tools/create"
				>
					<Plus className="size-3.5" />
				</a>
			</div>
		</div>
	</div>

	<div class="mb-5 mt-3 gap-2 grid lg:grid-cols-2 xl:grid-cols-3">
		{#each filteredItems as tool}
			<div class="flex space-x-4 border border-gray-100 dark:border-gray-850 cursor-pointer w-full px-3 py-2 dark:hover:bg-white/5 hover:bg-black/5 rounded-xl transition">
				<a
					class=" flex flex-1 space-x-3.5 cursor-pointer w-full"
					href={`/workspace/tools/edit?id=${encodeURIComponent(tool.id)}`}
				>
					<div class="flex items-center text-left">
						<div class=" flex-1 self-center">
							<Tooltip content={tool?.meta?.description ?? ''} placement="top-start">
								<div class=" font-semibold flex items-center gap-1.5">
									<div
										class=" text-xs font-bold px-1 rounded-sm uppercase line-clamp-1 bg-gray-500/20 text-gray-700 dark:text-gray-200"
									>
										TOOL
									</div>

									{#if tool?.meta?.manifest?.version}
										<div
											class="text-xs font-bold px-1 rounded-sm line-clamp-1 bg-gray-500/20 text-gray-700 dark:text-gray-200"
										>
											v{tool?.meta?.manifest?.version ?? ''}
										</div>
									{/if}

									<div class="line-clamp-1">
										{tool.name}
										<span class=" text-gray-500 text-xs font-medium shrink-0">{tool.id}</span>
									</div>
								</div>
							</Tooltip>

							<div class="px-0.5">
								<div class="flex gap-1.5 mt-0.5 mb-0.5">
									<div class=" text-xs overflow-hidden text-ellipsis line-clamp-1">
										{tool.meta.description}
									</div>
								</div>

								<div class="text-xs text-gray-500 shrink-0">
									<Tooltip
										content={tool?.user?.email ?? '已删除用户'}
										className="flex shrink-0"
										placement="top-start"
									>
										由 {capitalizeFirstLetter(
											tool?.user?.name ?? tool?.user?.email ?? '已删除用户'
										)} 提供
									</Tooltip>
								</div>
							</div>
						</div>
					</div>
				</a>
				<div class="flex flex-row gap-0.5 self-center">
					{#if shiftKey}
						<Tooltip content="删除">
							<button
								class="self-center w-fit text-sm px-2 py-2 dark:text-gray-300 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-xl"
								type="button"
								on:click={() => {
									deleteHandler(tool);
								}}
							>
								<GarbageBin />
							</button>
						</Tooltip>
					{:else}
						{#if tool?.meta?.manifest?.funding_url ?? false}
							<Tooltip content="Support">
								<button
									class="self-center w-fit text-sm px-2 py-2 dark:text-gray-300 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-xl"
									type="button"
									on:click={() => {
										selectedTool = tool;
										showManifestModal = true;
									}}
								>
									<Heart />
								</button>
							</Tooltip>
						{/if}

						<Tooltip content="值">
							<button
								class="self-center w-fit text-sm px-2 py-2 dark:text-gray-300 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-xl"
								type="button"
								on:click={() => {
									selectedTool = tool;
									showValvesModal = true;
								}}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="size-4"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
									/>
								</svg>
							</button>
						</Tooltip>

						<ToolMenu
							editHandler={() => {
								goto(`/workspace/tools/edit?id=${encodeURIComponent(tool.id)}`);
							}}
							shareHandler={() => {
								shareHandler(tool);
							}}
							cloneHandler={() => {
								cloneHandler(tool);
							}}
							exportHandler={() => {
								exportHandler(tool);
							}}
							deleteHandler={async () => {
								selectedTool = tool;
								showDeleteConfirm = true;
							}}
							onClose={() => {}}
						>
							<button
								class="self-center w-fit text-sm p-1.5 dark:text-gray-300 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-xl"
								type="button"
							>
								<EllipsisHorizontal className="size-5" />
							</button>
						</ToolMenu>
					{/if}
				</div>
			</div>
		{/each}
	</div>

	{#if $user?.role === 'admin'}
		<div class=" flex justify-end w-full mb-2">
			<div class="flex space-x-2">
				<input
					id="documents-import-input"
					bind:this={toolsImportInputElement}
					bind:files={importFiles}
					type="file"
					accept=".json"
					hidden
					on:change={() => {
						console.log(importFiles);
						showConfirm = true;
					}}
				/>

				<button
					class="flex text-xs items-center space-x-1 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 transition"
					on:click={() => {
						toolsImportInputElement.click();
					}}
				>
					<div class=" self-center mr-2 font-medium line-clamp-1">导入工具</div>

					<div class=" self-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 16 16"
							fill="currentColor"
							class="w-4 h-4"
						>
							<path
								fill-rule="evenodd"
								d="M4 2a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 4 14h8a1.5 1.5 0 0 0 1.5-1.5V6.621a1.5 1.5 0 0 0-.44-1.06L9.94 2.439A1.5 1.5 0 0 0 8.878 2H4Zm4 9.5a.75.75 0 0 1-.75-.75V8.06l-.72.72a.75.75 0 0 1-1.06-1.06l2-2a.75.75 0 0 1 1.06 0l2 2a.75.75 0 1 1-1.06 1.06l-.72-.72v2.69a.75.75 0 0 1-.75.75Z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
				</button>

				{#if tools.length}
					<button
						class="flex text-xs items-center space-x-1 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 transition"
						on:click={async () => {
							const _tools = await exportTools(localStorage.token).catch((error) => {
								toast.error(`${error}`);
								return null;
							});

							if (_tools) {
								let blob = new Blob([JSON.stringify(_tools)], {
									type: 'application/json'
								});
								saveAs(blob, `tools-export-${Date.now()}.json`);
							}
						}}
					>
						<div class=" self-center mr-2 font-medium line-clamp-1">导出工具</div>

						<div class=" self-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 16 16"
								fill="currentColor"
								class="w-4 h-4"
							>
								<path
									fill-rule="evenodd"
									d="M4 2a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 4 14h8a1.5 1.5 0 0 0 1.5-1.5V6.621a1.5 1.5 0 0 0-.44-1.06L9.94 2.439A1.5 1.5 0 0 0 8.878 2H4Zm4 3.5a.75.75 0 0 1 .75.75v2.69l.72-.72a.75.75 0 1 1 1.06 1.06l-2 2a.75.75 0 0 1-1.06 0l-2-2a.75.75 0 0 1 1.06-1.06l.72.72V6.25A.75.75 0 0 1 8 5.5Z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
					</button>
				{/if}
			</div>
		</div>
	{/if}

	<DeleteConfirmDialog
		bind:show={showDeleteConfirm}
		title="删除工具？"
		on:confirm={() => {
			deleteHandler(selectedTool);
		}}
	>
		<div class=" text-sm text-gray-500">
			这将删除 <span class="  font-semibold">{selectedTool.name}</span>
		</div>
	</DeleteConfirmDialog>

	<ValvesModal bind:show={showValvesModal} type="tool" id={selectedTool?.id ?? null} />
	<ManifestModal bind:show={showManifestModal} manifest={selectedTool?.meta?.manifest ?? {}} />

	<ConfirmDialog
		bind:show={showConfirm}
		on:confirm={() => {
			const reader = new FileReader();
			reader.onload = async (event) => {
				const _tools = JSON.parse(event.target.result);
				console.log(_tools);

				for (const tool of _tools) {
					const res = await createNewTool(localStorage.token, tool).catch((error) => {
						toast.error(`${error}`);
						return null;
					});
				}

				toast.success('工具导入成功');
				tools.set(await getTools(localStorage.token));
			};

			reader.readAsText(importFiles[0]);
		}}
	>
		<div class="text-sm text-gray-500">
			<div class=" bg-yellow-500/20 text-yellow-700 dark:text-yellow-200 rounded-lg px-4 py-3">
				<div>请仔细阅读以下警告：</div>

				<ul class=" mt-1 list-disc pl-4 text-xs">
					<li>
						注意：工具有权执行任意代码。
					</li>
					<li>切勿安装来源不完全可信的工具。</li>
				</ul>
			</div>

			<div class="my-3">
				我已阅读并理解我的行为所带来的影响，明白执行任意代码所涉及的风险。且我已验证代码来源可信度。
			</div>
		</div>
	</ConfirmDialog>
{:else}
	<div class="w-full h-full flex justify-center items-center">
		<Spinner />
	</div>
{/if}
