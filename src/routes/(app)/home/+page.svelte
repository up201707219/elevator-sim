<script>
    export let data
</script>

<main>
    <div class="container">
        <h1>Sobre o Software</h1>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam eveniet voluptate perspiciatis reiciendis dolorum cum accusantium laudantium porro, ea aliquam voluptatum, minima voluptatibus quod maxime consequuntur numquam totam maiores laborum?
    </div>
    <h1>{data.user.username}: isAdmin = {data.user.isAdmin}</h1>
</main>

<style>
    .container{
        width: 80%;
        margin: 2rem;
        margin: auto;
        margin-top: 2rem;
    }
    h1{
        text-align: center;
    }
</style>

