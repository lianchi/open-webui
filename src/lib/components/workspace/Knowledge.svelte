<script lang="ts">
	import Fuse from 'fuse.js';

	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	dayjs.extend(relativeTime);

	import { toast } from 'svelte-sonner';
	import { onMount } from 'svelte';

	import { WEBUI_NAME, knowledge } from '$lib/stores';
	import {
		getKnowledgeBases,
		deleteKnowledgeById,
		getKnowledgeBaseList
	} from '$lib/apis/knowledge';

	import { goto } from '$app/navigation';

	import DeleteConfirmDialog from '../common/ConfirmDialog.svelte';
	import ItemMenu from './Knowledge/ItemMenu.svelte';
	import Badge from '../common/Badge.svelte';
	import Search from '../icons/Search.svelte';
	import Plus from '../icons/Plus.svelte';
	import Spinner from '../common/Spinner.svelte';
	import { capitalizeFirstLetter } from '$lib/utils';
	import Tooltip from '../common/Tooltip.svelte';

	let loaded = false;

	let query = '';
	let selectedItem = null;
	let showDeleteConfirm = false;

	let fuse = null;

	let knowledgeBases = [];
	let filteredItems = [];

	$: if (knowledgeBases) {
		fuse = new Fuse(knowledgeBases, {
			keys: ['name', 'description']
		});
	}

	$: if (fuse) {
		filteredItems = query
			? fuse.search(query).map((e) => {
					return e.item;
				})
			: knowledgeBases;
	}

	const deleteHandler = async (item) => {
		const res = await deleteKnowledgeById(localStorage.token, item.id).catch((e) => {
			toast.error(`${e}`);
		});

		if (res) {
			knowledgeBases = await getKnowledgeBaseList(localStorage.token);
			knowledge.set(await getKnowledgeBases(localStorage.token));
			toast.success('知识库删除成功。');
		}
	};

	onMount(async () => {
		knowledgeBases = await getKnowledgeBaseList(localStorage.token);
		loaded = true;
	});
</script>

<svelte:head>
	<title>
		知识库 | {$WEBUI_NAME}
	</title>
</svelte:head>

{#if loaded}
	<DeleteConfirmDialog
		bind:show={showDeleteConfirm}
		on:confirm={() => {
			deleteHandler(selectedItem);
		}}
	/>

	<div class="flex flex-col gap-2 my-1.5">
		<div class="flex justify-between items-center">
			<div class="flex md:self-center text-xl font-medium px-0.5 items-center">
				知识库
				<div class="flex self-center w-[1px] h-6 mx-2.5 bg-gray-50 dark:bg-gray-850" />
				<span class="text-lg font-medium text-gray-500 dark:text-gray-300">{filteredItems.length}</span>
			</div>
		</div>

		<div class="flex w-full space-x-2">
			<div class="flex flex-1 rounded-full px-2 border border-gray-200 dark:border-gray-800">
				<div class="self-center ml-1 mr-3">
					<Search className="size-3.5" />
				</div>
				<input
					class=" w-full text-sm py-1 rounded-r-xl outline-hidden bg-transparent"
					bind:value={query}
					placeholder="搜索知识库"
				/>
			</div>

			<div>
				<button
					class=" px-2 py-2 rounded-xl hover:bg-gray-700/10 dark:hover:bg-gray-100/10 dark:text-gray-300 dark:hover:text-white transition font-medium text-sm flex items-center space-x-1"
					aria-label="创建知识库"
					on:click={() => {
						goto('/workspace/knowledge/create');
					}}
				>
					<Plus className="size-3.5" />
				</button>
			</div>
		</div>
	</div>

	<div class="mb-5 mt-3 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
		{#each filteredItems as item}
			<button
				class="flex space-x-4 border border-gray-100 dark:border-gray-850 cursor-pointer text-left w-full px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-850 transition rounded-xl"
				on:click={() => {
					if (item?.meta?.document) {
						toast.error('只能编辑文件集，创建一个新的知识库来编辑/添加文件。');
					} else {
						goto(`/workspace/knowledge/${item.id}`);
					}
				}}
			>
				<div class=" w-full">
					<div class="flex items-center justify-between -mt-1">
						{#if item?.meta?.document}
							<Badge type="muted" content='文档' />
						{:else}
							<Badge type="success" content='文件集' />
						{/if}

						<div class=" flex self-center -mr-1 translate-y-1">
							<ItemMenu
								on:delete={() => {
									selectedItem = item;
									showDeleteConfirm = true;
								}}
							/>
						</div>
					</div>

					<div class=" self-center flex-1 px-1 mb-1">
						<div class=" font-semibold line-clamp-1 h-fit">{item.name}</div>

						<div class=" text-xs overflow-hidden text-ellipsis line-clamp-1">
							{item.description}
						</div>

						<div class="mt-3 flex justify-between">
							<div class="text-xs text-gray-500">
								<Tooltip
									content={item?.user?.email ?? '已删除用户'}
									className="flex shrink-0"
									placement="top-start"
								>
									由 {capitalizeFirstLetter(
										item?.user?.name ?? item?.user?.email ?? '已删除用户'
									)} 提供
								</Tooltip>
							</div>
							<div class=" text-xs text-gray-500 line-clamp-1">
								更新于 {dayjs(item.updated_at * 1000).fromNow()}
							</div>
						</div>
					</div>
				</div>
			</button>
		{/each}
	</div>

	<div class=" text-gray-500 text-xs mt-1 mb-2">
		ⓘ 在输入框中输入 '#' 号来加载你需要的知识库内容。
	</div>
{:else}
	<div class="w-full h-full flex justify-center items-center">
		<Spinner />
	</div>
{/if}
