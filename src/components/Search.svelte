<script>
import { searchStore } from '../model/store'
import { options } from '../config/enum'
let keyword = '';
let searchPrefix = options[0].value

searchStore.subscribe(newVal => {
    for (let option of options) {
        if (option.label === newVal)
            searchPrefix = option.value
    }
})
function search() {
    const link = `https://${searchPrefix}${keyword}`
    window && window.open(link)
}
function press(e) {
    const searchInput = document.querySelector('.search input')
    if (e.keyCode === 13 && document.activeElement === searchInput) {
        search()
    }
}
</script>
<div class="search" on:keydown={press}>
    <input type="text" bind:value={keyword} />
    <div class="icon" on:click={search}></div>
</div>

<style lang="scss">
    .search {
        width: 100vw;
        height: 45px;
        overflow: hidden;
        position: absolute;
        bottom: 160px;
        input { 
            color: #ff3e00;
            line-height: 45px;
            width: 50%;
            height: 45px;
            border-radius: 3px;
            font-size: 26px;
            outline: none;
            box-shadow: 1px 1px #e5e5e5;
            text-shadow: 0 0 0 #303330;
            -webkit-text-fill-color: transparent; 
        }
        .icon {
            height: 40px;
            width: 40px;
            cursor: pointer;
            right: calc(25% + 5px);
            position: absolute;
            top: 2px;
            background: url('./icon-search.svg');
            background-repeat: no-repeat;
            background-size: cover;
            &:hover {
                transform: scale(1.08)
            }
        }
    }
</style>