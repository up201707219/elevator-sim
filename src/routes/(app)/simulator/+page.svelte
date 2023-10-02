<script>
    import mc12 from "$lib/assets/img/MC12-esboço.png"
    let aux = 0;
    let coord;
    let x = 0;
    let y = 0;
    function updateAux(n){
        aux += n;
    }
    function checkCoord(event){
        x = event.offsetX;
        y = event.offsetY;
    }
</script>

<main>
    <div class="center-image">
        <img class="sim-image" src= {mc12} alt="comando do ascensor" width="{parseInt(603/1.5)}px" height="{parseInt(803/1.5)}px" usemap="#image-map">
        <map name="image-map" class="image-map">
            <area alt="arrow_up" title="arrow_up" href="" coords="183,302,220,337" shape="rect" on:click|preventDefault={() => updateAux(1)}>
            <area alt="arrow_left" title="arrow_left" href="/in_construction" coords="131,351,167,385" shape="rect">
            <area alt="arrow_right" title="arrow_right" href="/in_construction" coords="237,352,273,385" shape="rect">
            <area alt="arrow_down" title="arrow_down" href="" coords="185,398,222,431" shape="rect" on:click|preventDefault={() => updateAux(-1)}>
            
            <area alt="drive_key" title="drive_key" href="/in_construction" coords="131,304,166,337" shape="rect">
            <area alt="enter_key" title="enter_key" href="/in_construction" coords="185,352,220,383" shape="rect">
            <area alt="shift_key" title="shift_key" href="/in_construction" coords="132,398,168,430" shape="rect">
            
            <area alt="func_key" title="func_key" href="/in_construction" coords="331,268,369,300" shape="rect">
            <area alt="select_key" title="select_key" href="/in_construction" coords="332,318,368,350" shape="rect">
            <area alt="side_up" title="side_up" href="/in_construction" coords="332,364,368,398" shape="rect">
            <area alt="side_down" title="side_down" href="/in_construction" coords="331,414,368,449" shape="rect">
        </map>
        <div class="remote-display">
            <div>
                x: {x} y: {y}
            </div>
            <div style="margin: 1rem; font-size:20pt">
                {aux}
            </div>
        </div>
    </div>

</main>

<style>
    .center-image{
        position: relative;
        width: fit-content;
        margin: auto;
        margin-top: 2rem;
    }
    .sim-image{
        max-width: 100%;
        height: auto;
    }
    .remote-display{
        position: absolute;
        top: 103px;
        left: 152px;
        height: 160px;
        width: 120px;
        font-size: 8pt;
        overflow: hidden;
        background-color: aqua;
    }
</style>