<script lang="ts">
	import Icon from "@iconify/svelte";
</script>

<div class="main">
	<div class="header">
		<h2>Hierarchy</h2>
	</div>
	<div class="actions">
		<button><Icon icon="material-symbols:add-box-outline" /> Text</button>
		<!--<button><Icon icon="material-symbols:add-box-outline" /> Group</button>-->
		<button><Icon icon="material-symbols:add-box-outline" /> Image</button>
	</div>
	<div class="hierachy">
		{#each as}{/each}
	</div>
</div>

<style>
	.main {
		grid-area: hierarchy;
		background-color: red;
		margin-top: 10px;

		border-radius: 8px;
		background-color: var(--container);
	}
</style>
