<script>
    import image from "$lib/assets/img/login_logo.png";

    export let form;
</script>

<main>
    <div class="container">
        <div class="login-info">
            <div class="image-container">
                <img class="logo" src={image} alt="">
            </div>
            <form class="login-form" method="post" action="?/checkCredentials">
                <input class="input" type="text" name="username" placeholder="Username">
                <br>
                <input class="input" type="password" name="password" placeholder="Password">
                <br>
                <button class="input login-button" type="submit">Login</button>
                <br style="margin-bottom: 3rem;">

            </form>
            {#if form?.invalid}
                <p>Credenciais erradas</p>
            {/if}
        </div>
    </div>
</main>

<style>
    .container{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgb(153, 153, 153);
        margin-left: 0;
    }
    .image-container{
        width: 100%;
        margin: 0;
    }
    .logo{
        max-width: 98%;
        margin: 1%;
        /* max-height: 10rem; */
    }
    .login-info{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        margin: 8rem 10rem;
        width: 25rem;
        height: 42rem;
        background-color: rgba(255, 255, 255, 0.699);
        box-shadow: 5px 3px 5px 3px rgba(17, 17, 17, 0.541);
        color: black;
    }
    .login-form{
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }
    .input{
        width: 80%;
        font: inherit;
        margin: 0.5rem;
    }
    .login-button{
        font: inherit;
        color: white;
        background-color: gray;
    }
</style>