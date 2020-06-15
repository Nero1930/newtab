<script>
    import { onMount } from 'svelte'
    import Unsplash from 'unsplash-js'

    let src = './default.jpeg'

    const unsplash = new Unsplash({
        accessKey: 'Z196EvMHvD5BJYvepoYWQXigFUCd78B4t-3i16WMp4M'
    })

    let time = new Date().valueOf()
    async function getPic() {
        let newTime = new Date().valueOf()
        if (newTime - time <= 3000) return
        const results = JSON.parse(sessionStorage.getItem('res'))
        if (results && results.length) {
            const index = Math.floor(Math.random() * (results.length - 1))
            src = results[index].urls.regular
            time = new Date().valueOf()
        } else {
            /**
             * 不要蹭infinity的接口了，图片质量8太行
            */
            // const res = await fetch('https://infinity-api.infinitynewtab.com/random-wallpaper');
            // const json = await res.json();
            // const { data } = json;
            // if (data && data.length) {
            //     src = data[0] && data[0].src && data[0].src.rawSrc;
            // }
            /**
             * 这个接口现在有请求次数限制（每小时50次），调试的时候先注释掉不要调
             */
            try {
            const response = await unsplash.search.photos('landscape', Math.ceil(Math.random() * 100), 10, { orientation: 'landscape'})
                const json = await response.json();
                sessionStorage.setItem('res', JSON.stringify(json.results))
                const index = Math.floor(Math.random() * (json.results - 1))
                src = json.results[index].urls.regular
                time = new Date().valueOf()
            } catch (e) {
                if (e) src = './default.jpeg'
                time = new Date().valueOf()
            }
        }
    }
    onMount(()=>getPic())
</script>
<img class="background" {src} alt="图片加载中..." />
<div class="mask"></div>
<div class="change" on:click={getPic}>换张图片</div>
<div>

</div>

<style>
    .background {
        width: 100vw;
        height: 100vh;
        background-size: cover;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -2;
        filter: blur(1px);
    }
    .mask {
        width: 100vw;
        height: 100vh;
        display: block;
        background: rgba(0, 0, 0, .3);
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
    }
    .change {
        cursor: pointer;
        position: absolute;
        bottom: 20px;
        right: 20px;
        height: 36px;
        line-height: 36px;
        color: #e5e5e5;
        font-size: 18px;
        text-shadow: 1px 1px #666;
    }
    .change:hover {
        transition: cubic-bezier(0.075, 0.82, 0.165, 1);
        transform: scale(1.08)
    }
</style>