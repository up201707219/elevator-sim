<script>
    
    import menuIcon from "./assets/svg/menu.svg"
    import logo from "./assets/img/S+_logo.png"

    export var colapsed = true;

    
    let actions = [
        {
            name:"Ação 1",
            children: ["teste 1", "teste 2"],
            open: false,
            node: null
        },
        {
            name:"Ação 2",
            children: ["teste 1"],
            open: false,
            node: null
        },
        {
            name:"Ação 3",
            children: [],
            open: false,
            node: null
        },
        {
            name:"Ação 4",
            children: ["teste 1", "teste 2", "teste 3"],
            open: false,
            node: null
        }
    ];
    
    export function toggleSidebar(){
        colapsed = !colapsed;
    }

    function toggleAcordion(act){
        if(act.children.length === 0){
            return;
        }

        for(var i=0; i<actions.length; i++){
            if(actions[i] !== act){
                actions[i].open = false;
                if(actions[i].node !== null){
                    actions[i].node.style.height = 0 +"px";
                }
            }
        }
        if(act.open = !act.open){
            act.node.style.height = act.node.scrollHeight +"px";
        }
        else{
            act.node.style.height = 0 +"px";
        }
        

    }

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="overlay {colapsed ? "" : "close"}" id="myOverlay" on:click={colapsed ? "" : toggleSidebar}></div>
<div class="sidebar {colapsed ? "closed": ""}" id="mySidebar">
    <div class="flex-container">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-missing-attribute -->
        <a class="sidebar-button" on:click={toggleSidebar}><img src={menuIcon} alt="menu" class="sidebar-icon"></a>
        <img class="logo" src={logo} alt="logo">
    </div>
    <div class="block-container">
        {#each actions as action, i}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="block-item {action.open ? "active" : ""}" on:click={() => toggleAcordion(action)}>
                <!-- svelte-ignore a11y-missing-attribute -->
                <a>{action.name}</a>
                {#if action.children.length !== 0}
                    <span style="float: right;">{action.open ? "-" : "+"}</span>
                {/if}
            </div>
            
            {#if action.children.length !== 0}
                <div bind:this={action.node} class="panel">
                    {#each action.children as child}
                        <div class="panel-item">{child}</div>
                    {/each}
                </div>
            {/if}
        {/each}
    </div>
</div>

<style>
    .overlay{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0%;
        z-index:-1;
        transition: 0.5s;
    }
    .overlay.close{
        z-index: 19;
        background-color: black;
        opacity: 30%;
        transition: 0.5s;
    }

    .block-container{
        display: block;
        text-align: left;
        border-bottom: 1px solid white;
    }

    .sidebar{
        position: fixed;
        left: 0;
        top: 0;
        width: min(20rem, 30%);
        height: 100%;
        overflow-x: hidden;
        background-color: rgb(100, 183, 255);
        z-index: 20;
        transition: 0.5s;
        overflow-y: auto;
    }
    .sidebar.closed{
        width: 0;
    }

    .sidebar .flex-container{
        margin-top: 2rem;
        margin-bottom: 2rem;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
    }

    a .sidebar-icon{
        cursor: pointer;
        transition: 0.3s;
    }

    .sidebar-icon:hover{
        filter: invert(99%) sepia(66%) saturate(951%) hue-rotate(186deg) brightness(118%) contrast(101%);
    }

    .sidebar-button{
        position: relative;
        margin: 10px;
        margin-left: 40px;
        margin-right: 20px;
        margin-top: 12px;
    }

    .block-item{
        border: 1px solid rgb(100, 183, 255);
        color: rgb(149, 149, 149);
        padding: 1rem;
        transition: 0.3s;
        border-top: 1px solid white;
        cursor: pointer;
    }
    .active, .block-item:hover{
        background-color: aqua;
        color: black;
    }
    .block-item a{
        font-size: 16pt;
        text-decoration: none;
        white-space: nowrap;
        margin-left: 4rem;
    }

    .panel{
        overflow: hidden;
        background-color: white;
        height: 0; 
        transition: 0.3s;
    }

    .panel-item{
        padding: 1rem;
        padding-left: 6rem;
        padding-bottom: 1rem;
        white-space: nowrap;
        cursor: pointer;
    }
    .panel-item:hover{
        background-color: antiquewhite;
    }

    .logo{
        margin-left: 10px;
        margin-top: 10px;
        max-height: 30px;
        max-width: 130px
    }
</style>