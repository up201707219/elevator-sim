<script>
    import Modal from "$lib/modal.svelte"

    let showModal = false;
    let modal;
</script>

<div>
    This will have a modal
    <button on:click={()=>{showModal=true;}}>open</button>
</div>

<Modal bind:this={modal} bind:showModal>
    <h2 slot="header">Isto é um modal</h2>
    <div class="test">
        Uma mensagem do modal
    </div>
    <div slot="actions">
        <button on:click={modal.close}>botão 1</button>
        <button>botão 2</button>
    </div>
</Modal>

<style>
    .test{
        padding: 1rem;
    }
</style>