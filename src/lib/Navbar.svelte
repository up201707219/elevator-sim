<script>
  import menuIcon from "./assets/svg/menu.svg"
  import logo from "./assets/img/S+_logo.png"
  import searchIcon from "./assets/svg/search.svg"

  export let hasSidebar = false;
  export let navbarFixed = true;

  let mobileNavOpen = false;
  function toggleNav(){
    mobileNavOpen = !mobileNavOpen;
  }

</script>
<div class="mobile">{#if hasSidebar}
  <span on:click>sidebar</span>
{/if}
  <img src={menuIcon} alt="nav" class="navbar-icon" on:click={toggleNav}>
</div>


<nav class="navbar {navbarFixed ? "fixed" : ""} {mobileNavOpen ? "open" : ""}">
  <div class="left">
    {#if hasSidebar}
        <a id="nav-button" on:click><img src={menuIcon} alt="menu" class="sidebar-icon"></a>
    {/if}
    <img class="logo" src={logo} alt="logo">
  </div>
  
  <div class="navbar-menu">
    <a href="/">Início</a>
    <a href="/lessons">Lições</a>
    <a href="/quiz">Provas</a>
    <a href="">Simulador</a>
  </div>
  
  <div class="right">
      <a href=""><img src={searchIcon} alt="search" class="sidebar-icon" ></a>
  </div>
</nav>

<style>
  .mobile{
    display: none;
  }
  .navbar{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    padding: 1%;
    padding-top: 2rem;
    padding-bottom: 0rem;
    z-index: 10;
    width: 98%;

    /* beggining of fixed bar */
    
    /* position: fixed;
    top: 0;
    left: 0;
     */
    
    /* end of fixed bar */
    
    background-color: white;
    border-bottom: 1px solid black;
}
.navbar.fixed{
  position: sticky;
  top: 0;
  left: 0;
}

.left{
    display: flex;
    align-items: flex-start;
}

.navbar a{
    margin: 20px;
    font-size: 16pt;
    color: rgb(149, 149, 149);
    text-decoration: none;
    transition: 0.5s;
}

.navbar a:hover{
    color: black;
}

#nav-button{
    margin-top: 6px;
    position: relative;
    transition: 1s;
    cursor: pointer;
}

.sidebar-icon:hover{
  filter: invert(55%) sepia(99%) saturate(321%) hue-rotate(176deg) brightness(100%) contrast(105%);
}

.logo{
    margin-left: 10px;
    margin-top: 10px;
    margin-bottom: 20px;
    max-height: 30px;
    max-width: 130px
}

.right{
  margin-right: 20px;
}

@media (max-width: 420px){
  .mobile{
    display: flex;
    /* display: none; */
    justify-content: space-between;
    width: 92%;
    padding: 4%;
    position: relative;
    top: 0;
    z-index: 18;
  }
  .navbar{
    margin: 0;
    padding: 0;
    width: 100%;
    display: none;
  }
  .left{
    display: none;
  }
  .right{
    display: none;
  }
  .navbar.open{
    display: block;
  }
  .navbar-menu{
    margin:0px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .navbar-icon{
    width: 30px;
    z-index: 18;
  }
}
</style>
