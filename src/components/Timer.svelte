
<script>
    let status = '开始工作'
    const m_seconds = 6 * 1000

    function setColor(color) {
        const border = `5px solid ${color}`;
        const right = document.querySelector('.circle_process .rightcircle')
        const left = document.querySelector('.circle_process .leftcircle')
        right.style.setProperty('border-top', border)
        right.style.setProperty('border-right', border)
        left.style.setProperty('border-left', border)
        left.style.setProperty('border-bottom', border)
    }
    function start(time, color) {
        let timeId = null;
        const startTime = new Date().valueOf()
        const right = document.querySelector('.circle_process .rightcircle')
        const left = document.querySelector('.circle_process .leftcircle')
        if (color) setColor(color);
        function step() {
            // 还是50毫秒刷一帧吧
            let span = new Date().valueOf()
            if (span - startTime > time) clearInterval(timeId)
            const deg = (span - startTime) / time * 360
            if (deg <= 180) {
                right.style.setProperty('-webkit-transform', `rotate(${deg - 135}deg)`);
            } else if(deg <= 360 && deg > 180) {
                left.style.setProperty('-webkit-transform', `rotate(${deg + 45}deg)`);
            }
        }
        timeId = window.setInterval(step, 50)
    }
    function reset() {
        const right = document.querySelector('.circle_process .rightcircle')
        const left = document.querySelector('.circle_process .leftcircle')
        right.style.setProperty('-webkit-transform', 'rotate(-135deg)')
        left.style.setProperty('-webkit-transform', 'rotate(-135deg)')
    }
    function timer() {
        reset()
        if (status === '开始工作') {
            const time = 30 * m_seconds
            status = '工作中...'
            start(time, '#ff3e00')
            setTimeout(()=>{
                status = '开始休息'
            }, time)
        } else if (status === '开始休息') {
            const time = 5 * m_seconds
            status = '休息中...'
            start(time, 'aquamarine')
            setTimeout(()=>{
                status = '开始工作'
            }, time)
        } else return
    }
    window.start = start
    window.reset = reset
</script>
<div class="circle_process">
    <div class="wrapper right">
        <div class="circle rightcircle"></div>
    </div>
    <div class="wrapper left">
        <div class="circle leftcircle"></div>
    </div>
    <div class="btn" on:click={timer}>{status}</div>
</div>

<style>
    .btn {
        position: relative;
        height: 36px;
        top: calc(50% - 18px);
        margin: 0 auto;
        z-index: 9;
        color: #fff;
        font-size: 28px;
        font-weight: 600;
        /* background: rgba(255,255,255, .6); */
        line-height: 36px;
        text-align: center;
        cursor: pointer;
    }
    .circle_process{
        position: relative;
        margin: 30px auto 0;
        width: 199px;
        height : 200px;
        background: rgba(255,255,255, .4);
        clip-path: circle(99px at 100px 100px)
    }
    .circle_process .wrapper{
        width: 100px;
        height: 200px;
        position: absolute;
        top:0;
        overflow: hidden;
    }
    .circle_process .right{
        right:1px;
    }
    .circle_process .left{
        left:1px;
    }
    .circle_process .circle{
        width: 190px;
        height: 190px;
        border:5px solid transparent;
        border-radius: 50%;
        position: absolute;
        top:0;
        transform : rotate(-135deg);
    }
    .circle_process .rightcircle {
        border-top:5px solid aquamarine;
        border-right:5px solid aquamarine;
        right:0;
        /* -webkit-animation: circle_right 5s linear infinite; */
    }
    .circle_process .leftcircle {
        border-bottom:5px solid aquamarine;
        border-left:5px solid aquamarine;
        left:0;
        /* -webkit-animation: circle_left 5s linear infinite; */
    }
    /* @-webkit-keyframes circle_right{
        0%{
            -webkit-transform: rotate(-135deg);
        }
        50%,100%{
            -webkit-transform: rotate(45deg);
        }
    }
    @-webkit-keyframes circle_left{
        0%,50%{
            -webkit-transform: rotate(-135deg);
        }
        100%{
            -webkit-transform: rotate(45deg);
        }
    } */
</style>