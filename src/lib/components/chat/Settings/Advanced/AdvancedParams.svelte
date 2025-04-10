<script lang="ts">
	import Switch from '$lib/components/common/Switch.svelte';
	import Tooltip from '$lib/components/common/Tooltip.svelte';
	import { getContext, createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const i18n = getContext('i18n');

	export let admin = false;

	export let params = {
		// Advanced
		stream_response: null, // Set stream responses for this model individually
		function_calling: null,
		seed: null,
		stop: null,
		temperature: null,
		reasoning_effort: null,
		logit_bias: null,
		frequency_penalty: null,
		repeat_last_n: null,
		mirostat: null,
		mirostat_eta: null,
		mirostat_tau: null,
		top_k: null,
		top_p: null,
		min_p: null,
		tfs_z: null,
		num_ctx: null,
		num_batch: null,
		num_keep: null,
		max_tokens: null,
		use_mmap: null,
		use_mlock: null,
		num_thread: null,
		num_gpu: null,
		template: null
	};

	let customFieldName = '';
	let customFieldValue = '';

	$: if (params) {
		dispatch('change', params);
	}
</script>

<div class='space-y-0.5 text-xs pr-4'>
	<div>
		<Tooltip
			content='启用后，模型将实时回复每条聊天信息，在用户发送信息后立即生成回复。这种模式对即时聊天应用非常有用，但可能会影响较慢硬件的性能。'
			placement="top-start"
			className="inline-tooltip"
		>
			<div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
				<div>
					以流式返回对话响应
				</div>
				<button
					class='hover:text-black dark:hover:text-white'
					on:click={() => {
						params.stream_response =
							(params?.stream_response ?? null) === null
								? true
								: params.stream_response
									? false
									: null;
					}}
					type="button"
				>
					{#if params.stream_response === true}
						<span>开启</span>
					{:else if params.stream_response === false}
						<span>关闭</span>
					{:else}
						<span>默认</span>
					{/if}
				</button>
			</div>
		</Tooltip>
	</div>

	<div>
		<Tooltip
			content='默认模式通过在执行前调用一次工具，能够兼容更广泛的模型。原生模式利用模型内置的工具调用能力，但需要模型本身具备该功能的原生支持。'
			placement="top-start"
			className="inline-tooltip"
		>
			<div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
				<div>
					函数调用（Function Calling）
				</div>
				<button
					class='hover:text-black dark:hover:text-white'
					on:click={() => {
						params.function_calling = (params?.function_calling ?? null) === null ? 'native' : null;
					}}
					type="button"
				>
					{#if params.function_calling === 'native'}
						<span>原生</span>
					{:else}
						<span>默认</span>
					{/if}
				</button>
			</div>
		</Tooltip>
	</div>

	<div>
		<Tooltip
			content='设置用于生成的随机数种子。将其设置为特定数字将使模型针对同一提示生成相同的文本。'
			placement="top-start"
			className="inline-tooltip"
		>
			<div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
				<div>
					种子（Seed）
				</div>

				<button
					class='hover:text-black dark:hover:text-white'
					type="button"
					on:click={() => {
						params.seed = (params?.seed ?? null) === null ? 0 : null;
					}}
				>
					{#if (params?.seed ?? null) === null}
						<span>默认</span>
					{:else}
						<span>自定义</span>
					{/if}
				</button>
			</div>
		</Tooltip>

		{#if (params?.seed ?? null) !== null}
			<div class="w-full flex mt-1 px-2">
				<input
					class="w-full rounded-lg py-1 px-4 text-sm dark:text-gray-300 dark:bg-gray-850 outline-hidden"
					type="number"
					placeholder='输入种子'
					bind:value={params.seed}
					autocomplete="off"
					min="0"
				/>
			</div>
		{/if}
	</div>

	<div>
		<Tooltip
			content='设置要使用的停止序列。遇到这种模式时，大语言模型将停止生成文本并返回。可以通过在模型文件中指定多个单独的停止参数来设置多个停止模式。'
			placement="top-start"
			className="inline-tooltip"
		>
			<div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
				<div>
					停止序列 (Stop Sequence)
				</div>

				<button
					class='hover:text-black dark:hover:text-white'
					type="button"
					on:click={() => {
						params.stop = (params?.stop ?? null) === null ? '' : null;
					}}
				>
					{#if (params?.stop ?? null) === null}
						<span> 默认 </span>
					{:else}
						<span>自定义</span>
					{/if}
				</button>
			</div>
		</Tooltip>

		{#if (params?.stop ?? null) !== null}
			<div class="w-full flex mt-1 px-2">
				<input
					class="w-full rounded-lg py-1 px-4 text-sm dark:text-gray-300 dark:bg-gray-850 outline-hidden"
					type="text"
					placeholder='输入停止序列'
					bind:value={params.stop}
					autocomplete="off"
				/>
			</div>
		{/if}
	</div>

	<div>
		<Tooltip
			content='模型的温度。增加温度将使模型的回答更有创意。'
			placement="top-start"
			className="inline-tooltip"
		>
			<div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
				<div>
					温度 (Temperature)
				</div>
				<button
					class='hover:text-black dark:hover:text-white'
					type="button"
					on:click={() => {
						params.temperature = (params?.temperature ?? null) === null ? 0.8 : null;
					}}
				>
					{#if (params?.temperature ?? null) === null}
						<span>默认</span>
					{:else}
						<span>自定义</span>
					{/if}
				</button>
			</div>
		</Tooltip>

		{#if (params?.temperature ?? null) !== null}
			<div class="flex mt-1 space-x-2 px-2">
				<div class="flex-1">
					<input
						id="steps-range"
						type="range"
						min="0"
						max="2"
						step="0.05"
						bind:value={params.temperature}
						class="w-full h-2 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
					/>
				</div>
				<div>
					<input
						bind:value={params.temperature}
						type="number"
						class="bg-transparent text-center w-14"
						min="0"
						max="2"
						step="any"
					/>
				</div>
			</div>
		{/if}
	</div>

	<div>
		<Tooltip
			content='约束推理模型的推理努力程度。仅适用于支持推理努力控制的特定提供商的推理模型。'
			placement="top-start"
			className="inline-tooltip"
		>
			<div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
				<div>
					推理努力
				</div>
				<button
					class='hover:text-black dark:hover:text-white'
					type="button"
					on:click={() => {
						params.reasoning_effort = (params?.reasoning_effort ?? null) === null ? 'medium' : null;
					}}
				>
					{#if (params?.reasoning_effort ?? null) === null}
						<span>默认</span>
					{:else}
						<span>自定义</span>
					{/if}
				</button>
			</div>
		</Tooltip>

		{#if (params?.reasoning_effort ?? null) !== null}
			<div class="flex mt-1 px-2">
				<input
					class="w-full rounded-lg py-1 px-4 text-sm dark:text-gray-300 dark:bg-gray-850 outline-hidden"
					type="text"
					placeholder='输入推理努力'
					bind:value={params.reasoning_effort}
					autocomplete="off"
				/>
			</div>
		{/if}
	</div>

	<div>
		<Tooltip
			content='为受限响应提升或惩罚特定标记。偏置值将被限制在 -100 到 100（包括两端）之间。（默认：无）'
			placement="top-start"
			className="inline-tooltip"
		>
			<div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
				<div>
					Logit 偏置
				</div>
				<button
					class='hover:text-black dark:hover:text-white'
					type="button"
					on:click={() => {
						params.logit_bias = (params?.logit_bias ?? null) === null ? '' : null;
					}}
				>
					{#if (params?.logit_bias ?? null) === null}
						<span>默认</span>
					{:else}
						<span>自定义</span>
					{/if}
				</button>
			</div>
		</Tooltip>

		{#if (params?.logit_bias ?? null) !== null}
			<div class="flex mt-1 px-2">
				<input
					class="w-full rounded-lg pl-2 py-1 px-4 text-sm dark:text-gray-300 dark:bg-gray-850 outline-hidden"
					type="text"
					placeholder='输入以逗号分隔的“token:bias_value”对（例如：5432:100, 413:-100）'
					bind:value={params.logit_bias}
					autocomplete="off"
				/>
			</div>
		{/if}
	</div>

	<div>
		<Tooltip
			content='启用 Mirostat 采样以控制困惑度'
			placement="top-start"
			className="inline-tooltip"
		>
			<div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
				<div>
					Mirostat
				</div>
				<button
					class='hover:text-black dark:hover:text-white'
					type="button"
					on:click={() => {
						params.mirostat = (params?.mirostat ?? null) === null ? 0 : null;
					}}
				>
					{#if (params?.mirostat ?? null) === null}
						<span>默认</span>
					{:else}
						<span>自定义</span>
					{/if}
				</button>
			</div>
		</Tooltip>

		{#if (params?.mirostat ?? null) !== null}
			<div class="flex mt-1 space-x-2 px-2">
				<div class="flex-1">
					<input
						id="steps-range"
						type="range"
						min="0"
						max="2"
						step="1"
						bind:value={params.mirostat}
						class="w-full h-2 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
					/>
				</div>
				<div>
					<input
						bind:value={params.mirostat}
						type="number"
						class=" bg-transparent text-center w-14"
						min="0"
						max="2"
						step="1"
					/>
				</div>
			</div>
		{/if}
	</div>

	<div>
		<Tooltip
			content='影响算法对生成文本反馈的响应速度。较低的学习率将导致调整更慢，而较高的学习率将使算法反应更灵敏。'
			placement="top-start"
			className="inline-tooltip"
		>
			<div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
				<div>
					Mirostat Eta
				</div>
				<button
					class='hover:text-black dark:hover:text-white'
					type="button"
					on:click={() => {
						params.mirostat_eta = (params?.mirostat_eta ?? null) === null ? 0.1 : null;
					}}
				>
					{#if (params?.mirostat_eta ?? null) === null}
						<span>默认</span>
					{:else}
						<span>自定义</span>
					{/if}
				</button>
			</div>
		</Tooltip>

		{#if (params?.mirostat_eta ?? null) !== null}
			<div class="flex mt-1 space-x-2 px-2">
				<div class="flex-1">
					<input
						id="steps-range"
						type="range"
						min="0"
						max="1"
						step="0.05"
						bind:value={params.mirostat_eta}
						class="w-full h-2 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
					/>
				</div>
				<div>
					<input
						bind:value={params.mirostat_eta}
						type="number"
						class=" bg-transparent text-center w-14"
						min="0"
						max="1"
						step="any"
					/>
				</div>
			</div>
		{/if}
	</div>

	<div>
		<Tooltip
			content='控制输出文本中连贯性和多样性之间的平衡。较低的值将产生更加专注和连贯的文本。'
			placement="top-start"
			className="inline-tooltip"
		>
			<div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
				<div>
					Mirostat Tau
				</div>

				<button
					class='hover:text-black dark:hover:text-white'
					type="button"
					on:click={() => {
						params.mirostat_tau = (params?.mirostat_tau ?? null) === null ? 5.0 : null;
					}}
				>
					{#if (params?.mirostat_tau ?? null) === null}
						<span>默认</span>
					{:else}
						<span>自定义</span>
					{/if}
				</button>
			</div>
		</Tooltip>

		{#if (params?.mirostat_tau ?? null) !== null}
			<div class="flex mt-1 space-x-2 px-2">
				<div class="flex-1">
					<input
						id="steps-range"
						type="range"
						min="0"
						max="10"
						step="0.5"
						bind:value={params.mirostat_tau}
						class="w-full h-2 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
					/>
				</div>
				<div>
					<input
						bind:value={params.mirostat_tau}
						type="number"
						class=" bg-transparent text-center w-14"
						min="0"
						max="10"
						step="any"
					/>
				</div>
			</div>
		{/if}
	</div>

	<div>
		<Tooltip
			content='降低生成无意义内容的概率。较高的值（如100）将产生更多样化的回答，而较低的值（如10）则更加保守。'
			placement="top-start"
			className="inline-tooltip"
		>
			<div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
				<div>
					Top K
				</div>
				<button
					class='hover:text-black dark:hover:text-white'
					type="button"
					on:click={() => {
						params.top_k = (params?.top_k ?? null) === null ? 40 : null;
					}}
				>
					{#if (params?.top_k ?? null) === null}
						<span>默认</span>
					{:else}
						<span>自定义</span>
					{/if}
				</button>
			</div>
		</Tooltip>

		{#if (params?.top_k ?? null) !== null}
			<div class="flex mt-1 space-x-2 px-2">
				<div class="flex-1">
					<input
						id="steps-range"
						type="range"
						min="0"
						max="1000"
						step="0.5"
						bind:value={params.top_k}
						class="w-full h-2 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
					/>
				</div>
				<div>
					<input
						bind:value={params.top_k}
						type="number"
						class=" bg-transparent text-center w-14"
						min="0"
						max="100"
						step="any"
					/>
				</div>
			</div>
		{/if}
	</div>

	<div>
		<Tooltip
			content='与 top-k 配合使用。较高的值（例如 0.95）将产生更加多样化的文本，而较低的值（例如 0.5）将产生更加集中和保守的文本。'
			placement="top-start"
			className="inline-tooltip"
		>
			<div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
				<div>
					Top P
				</div>

				<button
					class='hover:text-black dark:hover:text-white'
					type="button"
					on:click={() => {
						params.top_p = (params?.top_p ?? null) === null ? 0.9 : null;
					}}
				>
					{#if (params?.top_p ?? null) === null}
						<span>默认</span>
					{:else}
						<span>自定义</span>
					{/if}
				</button>
			</div>
		</Tooltip>

		{#if (params?.top_p ?? null) !== null}
			<div class="flex mt-1 space-x-2 px-2">
				<div class="flex-1">
					<input
						id="steps-range"
						type="range"
						min="0"
						max="1"
						step="0.05"
						bind:value={params.top_p}
						class="w-full h-2 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
					/>
				</div>
				<div>
					<input
						bind:value={params.top_p}
						type="number"
						class=" bg-transparent text-center w-14"
						min="0"
						max="1"
						step="any"
					/>
				</div>
			</div>
		{/if}
	</div>

	<div>
		<Tooltip
			content='top_p 的替代方法，旨在确保质量和多样性之间的平衡。参数 p 表示相对于最可能令牌的概率，一个令牌被考虑的最小概率。例如，当 p=0.05 且最可能的令牌概率为 0.9 时，概率值小于 0.045 的词元将被过滤掉。'
			placement="top-start"
			className="inline-tooltip"
		>
			<div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
				<div>
					Min P
				</div>
				<button
					class='hover:text-black dark:hover:text-white'
					type="button"
					on:click={() => {
						params.min_p = (params?.min_p ?? null) === null ? 0.0 : null;
					}}
				>
					{#if (params?.min_p ?? null) === null}
						<span>默认</span>
					{:else}
						<span>自定义</span>
					{/if}
				</button>
			</div>
		</Tooltip>

		{#if (params?.min_p ?? null) !== null}
			<div class="flex mt-1 space-x-2 px-2">
				<div class="flex-1">
					<input
						id="steps-range"
						type="range"
						min="0"
						max="1"
						step="0.05"
						bind:value={params.min_p}
						class="w-full h-2 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
					/>
				</div>
				<div>
					<input
						bind:value={params.min_p}
						type="number"
						class=" bg-transparent text-center w-14"
						min="0"
						max="1"
						step="any"
					/>
				</div>
			</div>
		{/if}
	</div>

	<div>
		<Tooltip
			content='根据标记出现的次数，设置一个缩放偏置值来惩罚重复。较高的值（例如1.5）将更强烈地惩罚重复，而较低的值（例如0.9）则更为宽松。当值为0时，此功能将被禁用。'
			placement="top-start"
			className="inline-tooltip"
		>
			<div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
				<div>
					频率惩罚
				</div>

				<button
					class='hover:text-black dark:hover:text-white'
					type="button"
					on:click={() => {
						params.frequency_penalty = (params?.frequency_penalty ?? null) === null ? 1.1 : null;
					}}
				>
					{#if (params?.frequency_penalty ?? null) === null}
						<span>默认</span>
					{:else}
						<span>自定义</span>
					{/if}
				</button>
			</div>
		</Tooltip>

		{#if (params?.frequency_penalty ?? null) !== null}
			<div class="flex mt-1 space-x-2 px-2">
				<div class="flex-1">
					<input
						id="steps-range"
						type="range"
						min="-2"
						max="2"
						step="0.05"
						bind:value={params.frequency_penalty}
						class="w-full h-2 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
					/>
				</div>
				<div>
					<input
						bind:value={params.frequency_penalty}
						type="number"
						class=" bg-transparent text-center w-14"
						min="-2"
						max="2"
						step="any"
					/>
				</div>
			</div>
		{/if}
	</div>

	<div>
		<Tooltip
			content='对至少出现过一次的标记设置固定偏置值。较高的值（例如1.5）将更强烈地惩罚重复，而较低的值（例如0.9）则更为宽松。当值为0时，此功能将被禁用。'
			placement="top-start"
			className="inline-tooltip"
		>
			<div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
				<div>
					重复惩罚（Presence Penalty）
				</div>

				<button
					class='hover:text-black dark:hover:text-white'
					type="button"
					on:click={() => {
						params.presence_penalty = (params?.presence_penalty ?? null) === null ? 0.0 : null;
					}}
				>
					{#if (params?.presence_penalty ?? null) === null}
						<span>默认</span>
					{:else}
						<span>自定义</span>
					{/if}
				</button>
			</div>
		</Tooltip>

		{#if (params?.presence_penalty ?? null) !== null}
			<div class="flex mt-1 space-x-2 px-2">
				<div class="flex-1">
					<input
						id="steps-range"
						type="range"
						min="-2"
						max="2"
						step="0.05"
						bind:value={params.presence_penalty}
						class="w-full h-2 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
					/>
				</div>
				<div>
					<input
						bind:value={params.presence_penalty}
						type="number"
						class=" bg-transparent text-center w-14"
						min="-2"
						max="2"
						step="any"
					/>
				</div>
			</div>
		{/if}
	</div>

	<div>
		<Tooltip
			content='设置模型回溯的范围，以防止重复。'
			placement="top-start"
			className="inline-tooltip"
		>
			<div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
				<div>
					重复最后 N 次
				</div>

				<button
					class='hover:text-black dark:hover:text-white'
					type="button"
					on:click={() => {
						params.repeat_last_n = (params?.repeat_last_n ?? null) === null ? 64 : null;
					}}
				>
					{#if (params?.repeat_last_n ?? null) === null}
						<span>默认</span>
					{:else}
						<span>自定义</span>
					{/if}
				</button>
			</div>
		</Tooltip>

		{#if (params?.repeat_last_n ?? null) !== null}
			<div class="flex mt-1 space-x-2 px-2">
				<div class="flex-1">
					<input
						id="steps-range"
						type="range"
						min="-1"
						max="128"
						step="1"
						bind:value={params.repeat_last_n}
						class="w-full h-2 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
					/>
				</div>
				<div>
					<input
						bind:value={params.repeat_last_n}
						type="number"
						class=" bg-transparent text-center w-14"
						min="-1"
						max="128"
						step="1"
					/>
				</div>
			</div>
		{/if}
	</div>

	<div>
		<Tooltip
			content='无尾采样用于减少输出中出现概率较小的 Token 的影响。较高的值（例如 2.0）将进一步减少影响，而值 1.0 则禁用此设置。'
			placement="top-start"
			className="inline-tooltip"
		>
			<div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
				<div>
					Tfs Z
				</div>

				<button
					class='hover:text-black dark:hover:text-white'
					type="button"
					on:click={() => {
						params.tfs_z = (params?.tfs_z ?? null) === null ? 1 : null;
					}}
				>
					{#if (params?.tfs_z ?? null) === null}
						<span>默认</span>
					{:else}
						<span>自定义</span>
					{/if}
				</button>
			</div>
		</Tooltip>

		{#if (params?.tfs_z ?? null) !== null}
			<div class="flex mt-1 space-x-2 px-2">
				<div class="flex-1">
					<input
						id="steps-range"
						type="range"
						min="0"
						max="2"
						step="0.05"
						bind:value={params.tfs_z}
						class="w-full h-2 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
					/>
				</div>
				<div>
					<input
						bind:value={params.tfs_z}
						type="number"
						class=" bg-transparent text-center w-14"
						min="0"
						max="2"
						step="any"
					/>
				</div>
			</div>
		{/if}
	</div>

	<div>
		<Tooltip
			content='此选项控制刷新上下文时保留多少 Token。例如，如果设置为 2，则将保留对话上下文的最后 2 个 Token。保留上下文有助于保持对话的连续性，但可能会降低响应新主题的能力。'
			placement="top-start"
			className="inline-tooltip"
		>
			<div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
				<div>
					在语境刷新时需保留的 Token 数量
				</div>

				<button
					class='hover:text-black dark:hover:text-white'
					type="button"
					on:click={() => {
						params.num_keep = (params?.num_keep ?? null) === null ? 24 : null;
					}}
				>
					{#if (params?.num_keep ?? null) === null}
						<span>默认</span>
					{:else}
						<span>自定义</span>
					{/if}
				</button>
			</div>
		</Tooltip>

		{#if (params?.num_keep ?? null) !== null}
			<div class="flex mt-1 space-x-2 px-2">
				<div class="flex-1">
					<input
						id="steps-range"
						type="range"
						min="-1"
						max="10240000"
						step="1"
						bind:value={params.num_keep}
						class="w-full h-2 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
					/>
				</div>
				<div class="">
					<input
						bind:value={params.num_keep}
						type="number"
						class=" bg-transparent text-center w-14"
						min="-1"
						step="1"
					/>
				</div>
			</div>
		{/if}
	</div>

	<div>
		<Tooltip
			content='此项用于设置模型在其响应中可以生成的最大 Token 数。增加此限制可让模型提供更长的答案，但也可能增加生成无用或不相关内容的可能性。'
			placement="top-start"
			className="inline-tooltip"
		>
			<div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
				<div>
					最大 Token 数量 (num_predict)
				</div>

				<button
					class='hover:text-black dark:hover:text-white'
					type="button"
					on:click={() => {
						params.max_tokens = (params?.max_tokens ?? null) === null ? 128 : null;
					}}
				>
					{#if (params?.max_tokens ?? null) === null}
						<span>默认</span>
					{:else}
						<span>自定义</span>
					{/if}
				</button>
			</div>
		</Tooltip>

		{#if (params?.max_tokens ?? null) !== null}
			<div class="flex mt-1 space-x-2 px-2">
				<div class="flex-1">
					<input
						id="steps-range"
						type="range"
						min="-2"
						max="131072"
						step="1"
						bind:value={params.max_tokens}
						class="w-full h-2 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
					/>
				</div>
				<div>
					<input
						bind:value={params.max_tokens}
						type="number"
						class=" bg-transparent text-center w-14"
						min="-2"
						step="1"
					/>
				</div>
			</div>
		{/if}
	</div>

	<div>
		<Tooltip
			content='控制生成文本中标记序列的重复度。较高的值（例如1.5）将更强烈地惩罚重复，而较低的值（例如1.1）则更为宽松。当值为1时，此功能将被禁用。'
			placement="top-start"
			className="inline-tooltip"
		>
			<div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
				<div>
					重复惩罚（Ollama）
				</div>

				<button
					class='hover:text-black dark:hover:text-white'
					type="button"
					on:click={() => {
						params.repeat_penalty = (params?.repeat_penalty ?? null) === null ? 1.1 : null;
					}}
				>
					{#if (params?.repeat_penalty ?? null) === null}
						<span>默认</span>
					{:else}
						<span>自定义</span>
					{/if}
				</button>
			</div>
		</Tooltip>

		{#if (params?.repeat_penalty ?? null) !== null}
			<div class="flex mt-1 space-x-2 px-2">
				<div class="flex-1">
					<input
						id="steps-range"
						type="range"
						min="-2"
						max="2"
						step="0.05"
						bind:value={params.repeat_penalty}
						class="w-full h-2 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
					/>
				</div>
				<div>
					<input
						bind:value={params.repeat_penalty}
						type="number"
						class=" bg-transparent text-center w-14"
						min="-2"
						max="2"
						step="any"
					/>
				</div>
			</div>
		{/if}
	</div>

	<div>
		<Tooltip
			content='设置用于生成下一个 Token 的上下文窗口的大小。'
			placement="top-start"
			className="inline-tooltip"
		>
			<div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
				<div>
					上下文长度 (Ollama)
				</div>

				<button
					class='hover:text-black dark:hover:text-white'
					type="button"
					on:click={() => {
						params.num_ctx = (params?.num_ctx ?? null) === null ? 2048 : null;
					}}
				>
					{#if (params?.num_ctx ?? null) === null}
						<span>默认</span>
					{:else}
						<span>自定义</span>
					{/if}
				</button>
			</div>
		</Tooltip>

		{#if (params?.num_ctx ?? null) !== null}
			<div class="flex mt-1 space-x-2 px-2">
				<div class="flex-1">
					<input
						id="steps-range"
						type="range"
						min="-1"
						max="10240000"
						step="1"
						bind:value={params.num_ctx}
						class="w-full h-2 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
					/>
				</div>
				<div class="">
					<input
						bind:value={params.num_ctx}
						type="number"
						class=" bg-transparent text-center w-14"
						min="-1"
						step="1"
					/>
				</div>
			</div>
		{/if}
	</div>

	<div>
		<Tooltip
			content='批处理大小决定了一次可以处理多少个文本请求。更高的批处理大小可以提高模型的性能和速度，但也需要更多内存。'
			placement="top-start"
			className="inline-tooltip"
		>
			<div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
				<div>
					批大小 (num_batch)
				</div>

				<button
					class='hover:text-black dark:hover:text-white'
					type="button"
					on:click={() => {
						params.num_batch = (params?.num_batch ?? null) === null ? 512 : null;
					}}
				>
					{#if (params?.num_batch ?? null) === null}
						<span>默认</span>
					{:else}
						<span>自定义</span>
					{/if}
				</button>
			</div>
		</Tooltip>

		{#if (params?.num_batch ?? null) !== null}
			<div class="flex mt-1 space-x-2 px-2">
				<div class="flex-1">
					<input
						id="steps-range"
						type="range"
						min="256"
						max="8192"
						step="256"
						bind:value={params.num_batch}
						class="w-full h-2 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
					/>
				</div>
				<div>
					<input
						bind:value={params.num_batch}
						type="number"
						class=" bg-transparent text-center w-14"
						min="256"
						step="256"
					/>
				</div>
			</div>
		{/if}
	</div>

	{#if admin}
		<div>
			<Tooltip
				content='启用内存映射（mmap）以加载模型数据。此选项允许系统通过将磁盘文件视为在RAM中来使用磁盘存储作为RAM的扩展。这可以通过更快的数据访问来提高模型性能。然而，它可能无法在所有系统上正常工作，并且可能会消耗大量磁盘空间。'
				placement="top-start"
				className="inline-tooltip"
			>
				<div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
					<div>
						use_mmap（Ollama）
					</div>
					<button
						class='hover:text-black dark:hover:text-white'
						type="button"
						on:click={() => {
							params.use_mmap = (params?.use_mmap ?? null) === null ? true : null;
						}}
					>
						{#if (params?.use_mmap ?? null) === null}
							<span>默认</span>
						{:else}
							<span>自定义</span>
						{/if}
					</button>
				</div>
			</Tooltip>

			{#if (params?.use_mmap ?? null) !== null}
				<div class="flex justify-between items-center mt-1 px-2">
					<div class="text-xs text-gray-500">
						{params.use_mmap ? '启用' : '禁用'}
					</div>
					<div class=" pr-2">
						<Switch bind:state={params.use_mmap} />
					</div>
				</div>
			{/if}
		</div>

		<div>
			<Tooltip
				content='启用内存锁定（mlock）以防止模型数据被交换出RAM。此选项将模型的工作集页面锁定在RAM中，确保它们不会被交换到磁盘。这可以通过避免页面错误和确保快速数据访问来帮助维持性能。'
				placement="top-start"
				className="inline-tooltip"
			>
				<div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
					<div>
						use_mlock（Ollama）
					</div>

					<button
						class='hover:text-black dark:hover:text-white'
						type="button"
						on:click={() => {
							params.use_mlock = (params?.use_mlock ?? null) === null ? true : null;
						}}
					>
						{#if (params?.use_mlock ?? null) === null}
							<span>默认</span>
						{:else}
							<span>自定义</span>
						{/if}
					</button>
				</div>
			</Tooltip>

			{#if (params?.use_mlock ?? null) !== null}
				<div class="flex justify-between items-center mt-1 px-2">
					<div class="text-xs text-gray-500">
						{params.use_mlock ? '启用' : '禁用'}
					</div>

					<div class=" pr-2">
						<Switch bind:state={params.use_mlock} />
					</div>
				</div>
			{/if}
		</div>

		<div>
			<Tooltip
				content='设置用于计算的工作线程数量。该选项可控制并发处理传入请求的线程数量。增加该值可以提高高并发工作负载下的性能，但也可能消耗更多的 CPU 资源。'
				placement="top-start"
				className="inline-tooltip"
			>
				<div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
					<div>
						num_thread（Ollama）
					</div>

					<button
						class='hover:text-black dark:hover:text-white'
						type="button"
						on:click={() => {
							params.num_thread = (params?.num_thread ?? null) === null ? 2 : null;
						}}
					>
						{#if (params?.num_thread ?? null) === null}
							<span>默认</span>
						{:else}
							<span>自定义</span>
						{/if}
					</button>
				</div>
			</Tooltip>

			{#if (params?.num_thread ?? null) !== null}
				<div class="flex mt-1 space-x-2 px-2">
					<div class="flex-1">
						<input
							id="steps-range"
							type="range"
							min="1"
							max="256"
							step="1"
							bind:value={params.num_thread}
							class="w-full h-2 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
						/>
					</div>
					<div class="">
						<input
							bind:value={params.num_thread}
							type="number"
							class=" bg-transparent text-center w-14"
							min="1"
							max="256"
							step="1"
						/>
					</div>
				</div>
			{/if}
		</div>

		<div>
			<Tooltip
				content='设置将加载到 GPU 的层数。增加此值可以显著提高对 GPU 优化的模型的性能，但也可能增加功耗和使用更多 GPU 资源。'
				placement="top-start"
				className="inline-tooltip"
			>
				<div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
					<div>
						num_gpu (Ollama)
					</div>

					<button
						class='hover:text-black dark:hover:text-white'
						type="button"
						on:click={() => {
							params.num_gpu = (params?.num_gpu ?? null) === null ? 0 : null;
						}}
					>
						{#if (params?.num_gpu ?? null) === null}
							<span>默认</span>
						{:else}
							<span>自定义</span>
						{/if}
					</button>
				</div>
			</Tooltip>

			{#if (params?.num_gpu ?? null) !== null}
				<div class="flex mt-1 space-x-2 px-2">
					<div class="flex-1">
						<input
							id="steps-range"
							type="range"
							min="0"
							max="256"
							step="1"
							bind:value={params.num_gpu}
							class="w-full h-2 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
						/>
					</div>
					<div class="">
						<input
							bind:value={params.num_gpu}
							type="number"
							class=" bg-transparent text-center w-14"
							min="0"
							max="256"
							step="1"
						/>
					</div>
				</div>
			{/if}
		</div>

		<!-- <div>
			<div class='py-1.5 px-2 flex w-full justify-between hover:bg-[#f1f2f4] dark:hover:bg-gray-800 rounded-md'>
				<div>{$i18n.t('Template')}</div>

				<button
					class='hover:text-black dark:hover:text-white'
					type="button"
					on:click={() => {
						params.template = (params?.template ?? null) === null ? '' : null;
					}}
				>
					{#if (params?.template ?? null) === null}
						<span>默认</span>
					{:else}
						<span>{$i18n.t('Custom')}</span>
					{/if}
				</button>
			</div>

			{#if (params?.template ?? null) !== null}
				<div class="flex mt-0.5 space-x-2">
					<div class=" flex-1">
						<textarea
							class="px-3 py-1.5 text-sm w-full bg-transparent border dark:border-gray-600 outline-hidden rounded-lg -mb-1"
							placeholder={$i18n.t('Write your model template content here')}
							rows="4"
							bind:value={params.template}
						/>
					</div>
				</div>
			{/if}
		</div> -->
	{/if}
</div>
