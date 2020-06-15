<script>
import { onMount } from 'svelte';
let name  = localStorage && localStorage.getItem('name');
let inputName = '';
function greeting() {
    const time = new Date();
    if (time.getHours() >= 12 && time.getHours() < 18) {
        return '下午好'
    } else if (time.getHours() >= 18 && time.getHours() < 23) {
        return '晚上好'
    } else if (time.getHours() >= 23 || time.getHours() < 5) {
        return '夜深了'
    } else if (time.getHours() >= 5 && time.getHours() < 9) {
        return '早上好'
    } else if (time.getHours() >= 9 && time.getHours() < 12) {
        return '上午好'
    }
}

function updateName() {
    if (window) {
        const inputName = window.prompt('请输入您的名字/昵称');
        if (inputName.length) {
            localStorage.setItem('name', inputName);
            name = inputName;
        }
    }
}
async function getWord() {
    const res = await fetch('https://v1.hitokoto.cn/');
    const data = await res.json();
    const { hitokoto, from } = data;
    return {
        hitokoto, from
    };
}
onMount(()=>{
    if (!name) updateName();
})
</script>
{#if name}
<h1 on:click={updateName}>{greeting()}, {name}</h1>
{/if}

<div class="word">
    {#await getWord()}
    <h2>正在酝酿</h2>
    {:then content}
    <h2>{content.hitokoto}</h2>
    <h3>—— {content.from}</h3>
    {/await}
</div>

<style lang="scss">
h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 700;
}
.word {
    width: 100%;
    position: fixed;
    font-weight: 200;
    bottom: 40px;
    color: #fff;
    text-shadow: 1px 1px #333030;

    h3 {
        margin-left: 20px;
    }
}
</style>