<script context="module">
    import Modal from "$lib/modal.svelte";

    let previewImageMenu;

    function handleImageUpload(e){
        let image = e.target.files[0];
        if(!image) return;
        previewImageMenu = URL.createObjectURL(image);
    }

	// retain module scoped expansion state for each tree node
	const _expansionState = {
		/* treeNodeId: expanded <boolean> */
	}
</script>
<script>
//	import { slide } from 'svelte/transition'
	export let tree
    tree.showModal = false
	const {title, children} = tree

	tree.expanded =  true;
	const toggleExpansion = () => {
		tree.expanded = !tree.expanded
	}
	$: arrowDown = tree.expanded
</script>

<ul><!-- transition:slide -->
	<li>
		{#if children}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<span on:click={toggleExpansion}>
				<span class="arrow" class:arrowDown>&#x25b6</span>
				{tree.title}
                {#if tree.id}
                    <button on:click|stopPropagation={()=>{tree.showModal = true;}}>edit</button>
                {/if}
			</span>
			{#if tree.expanded}
                {#each tree.children as child}
                    <svelte:self tree={child} />
                {/each}
			{/if}
        {:else}
            <span>
                <span class="no-arrow"/>
                {tree.title}

                {#if tree.title !== "tree"}
                    <button on:click={()=>{tree.showModal = true;}}>edit</button>
                {/if}
            </span>
        {/if}
        {#if tree.id}
            <form action="?/insertNewButton" method="post">
                <Modal bind:this={tree.modal} bind:showModal={tree.showModal}>
                    <div class="edit-header" slot="header">
                        <h2>Editar</h2>
                        
                    </div>
                    <input type="hidden" name="id" value={tree.id ?? "0"}>
                    <input type="hidden" name="parent-id" value={tree.parent}>
                    <label for="title">Opção</label>
                    <input type="text" name="title" value={tree.title}>
                    <label for="response">Tipo</label>
                    <select name="response" bind:value={tree.response}>
                        <option value="menu">menu</option>
                    <option value="answer">resposta</option>
                </select>
                {#if tree.response === "menu"}
                <br>
                <img class="input image-component" src={previewImageMenu} alt="imagem da opção"> 
                <br>
                <input type="file" name="image" accept="image/*" on:change={(e) => {handleImageUpload(e)}}>
                <br>
                {:else}
                <br>
                <label for="description">Descrição: </label>
                <textarea class="details-input" type="text" name="description" value={tree.description}></textarea>
                {/if}
                <br>
                <label for="points">Cotação</label>
                <input type="number" name="points" value={tree.points?tree.points:0}>
                <br>
                
                <div class="edit-actions" slot="actions">
                    <button type="submit">submeter</button>
                    <button on:click|preventDefault={() => {tree.modal.close()}}>sair</button>
                </div>
                
            </Modal>
        </form>
        {/if}
	</li>
</ul>

<style>
	ul {
		margin: 0;
		list-style: none;
		padding-left: 1.2rem; 
		user-select: none;
	}
	.no-arrow { padding-left: 1.0rem; }
	.arrow {
		cursor: pointer;
		display: inline-block;
		/* transition: transform 200ms; */
	}
	.arrowDown { transform: rotate(90deg); }
</style>