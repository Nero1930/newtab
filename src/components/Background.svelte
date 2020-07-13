<script>
    import { srcStore, blurStore } from '../model/store'
    let src = './default.jpeg'
    let blur = 0
    srcStore.subscribe(newVal => src = newVal)
    blurStore.subscribe(newVal => blur = newVal)
</script>
<img class="background" style={`filter: blur(${blur}px)`} {src} alt="图片加载中..." />
<div class="mask"></div>

<style lang="scss">
    .background {
        width: 100vw;
        height: 100vh;
        background-size: cover;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -2;
    }
    .mask {
        width: 100vw;
        height: 100vh;
        display: block;
        background: rgba(0, 0, 0, .2);
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
    }
</style>