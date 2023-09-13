<script>
    export let data;
</script>

<!-- <h1>hello</h1> -->
<div><h1>{data.context}</h1></div>
<ul>
    {#each data.answers as answer}    
        <li>{answer}</li>
    {/each}
</ul>