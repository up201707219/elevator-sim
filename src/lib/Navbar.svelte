<script>
  import menuIcon from "./assets/svg/menu.svg"
  import logo from "./assets/img/S+_logo.png"
  import searchIcon from "./assets/svg/search.svg"

  export var hasSidebar = false;

</script>

<nav class="navbar">
  <div class="left">
    {#if hasSidebar}
        <a id="nav-button" on:click><img src={menuIcon} alt="menu" class="sidebar-icon"></a>
    {/if}
    <img class="logo" src={logo} alt="logo">
  </div>
  
  <div class="navbar-menu">
    <a href="">Home</a>
    <a href="">Content</a>
    <a href="">About Us</a>
    <a href="">Help</a>
  </div>
  
  <div class="right">
      <a><img src={searchIcon} alt="search" class="sidebar-icon"></a>
  </div>
</nav>

<style>
  .navbar{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    
    /* beginning of top bar */

    /* margin: 1rem;
    margin-top: 2rem;
    padding-bottom: 0rem; */

    /* end of top bar */


    /* beggining of fixed bar */
    
    position: fixed;
    top: 0;
    left: 0;
    padding: 1%;
    padding-top: 2rem;
    padding-bottom: 0;
    width: 98%;
    
    /* end of fixed bar */
    
    background-color: white;
    border-bottom: 1px solid black;
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
</style>
