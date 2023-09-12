<script>
    import Navbar from "../lib/Navbar.svelte";
    import Sidebar from "../lib/Sidebar.svelte";

    var hasSidebar = true;
    
    var toggleSidebar;

    function onMenuClick(){
        toggleSidebar();
    }
</script>

<main>
    {#if hasSidebar}
        <Navbar hasSidebar on:click={onMenuClick}/>
        <Sidebar bind:toggleSidebar={toggleSidebar}/>
    {:else}
        <Navbar/>    
    {/if}
</main>

<style>
    @import url('https://fonts.googleapis.com/css?family=Open Sans');
    :root{
        font-family: 'Open Sans', sans-serif;
    }

</style>

