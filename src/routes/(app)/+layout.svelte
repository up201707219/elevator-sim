<script>
    import Navbar from "$lib/Navbar.svelte";
    import Sidebar from "$lib/Sidebar.svelte";

    var hasSidebar = true;
    
    var toggleSidebar;
    var colapsed;

    function onMenuClick(){
        toggleSidebar();
        console.log(colapsed);
    }
</script>

<style>
    @import url('https://fonts.googleapis.com/css?family=Open Sans');
    :root{
        font-family: 'Open Sans', sans-serif;
    }

    body{
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        margin: 0;
    }

    .footer{
        position: relative;
        margin: 0%;
        /* margin-top: 10px; */
        margin-top: auto;
        margin-bottom: -10px;
        padding-bottom: 5px;
        bottom: 0px;
        width: 100%;
        height: 16rem;
        background-color: black;
        opacity: 80%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
    }
</style>

{#if hasSidebar}
    <Navbar hasSidebar on:click={onMenuClick}/>
    <Sidebar bind:toggleSidebar={toggleSidebar}/>
{:else}
    <Navbar/>    
{/if}

<body>
    <slot/>

    <br style="margin-bottom: 0rem;">
    <div class="footer"><h1>Placeholder</h1></div>
</body>