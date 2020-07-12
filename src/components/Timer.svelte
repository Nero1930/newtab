
<script>
    import { onMount, onDestroy } from 'svelte';
    import { workStatus } from '../config/enum'
    import Notify from '../utils/notification'

    let status = +localStorage.status || 0
    const m_seconds = 60 * 10

    const notify = new Notify()
    if (window.Notification.permision !== 'granted') {
        notify.getPermision()
    }
    onMount(() => {
        if (status % 2 === 1) timer()
    })
    function setColor(color) {
        const border = `5px solid ${color}`;
        const right = document.querySelector('.circle_process .rightcircle')
        const left = document.querySelector('.circle_process .leftcircle')
        right.style.setProperty('border-top', border)
        right.style.setProperty('border-right', border)
        left.style.setProperty('border-left', border)
        left.style.setProperty('border-bottom', border)
    }
    function start(time) {
        if (localStorage.timeId) {
            clearInterval(localStorage.timeId)
            localStorage.timeId = null
        }
        let timeId = null;
        const startTime = localStorage.startTime || new Date().valueOf()
        localStorage.startTime = startTime
        const right = document.querySelector('.circle_process .rightcircle')
        const left = document.querySelector('.circle_process .leftcircle')
        function step() {
            // 还是50毫秒刷一帧吧
            let now = new Date().valueOf()
            if (now - startTime > time) {
                clearInterval(timeId)
                status = status === 3 ? 0 : status + 1
                localStorage.status = status
                localStorage.startTime = ''
                notify.popNotify({
                    title: '计时结束',
                    body: `是时候开始${workStatus[status]}了！`,
                    icon: 'https://www.dogedoge.com/assets/new_logo_header.min.png',
                    callback: function () {
                        console.log('朕知道了')
                    }
                })
            }
            const deg = (now - startTime) / time * 360
            if (deg <= 180) {
                right.style.setProperty('-webkit-transform', `rotate(${deg - 135}deg)`);
            } else if(deg <= 360 && deg > 180) {
                right.style.setProperty('-webkit-transform', `rotate(45deg)`);
                left.style.setProperty('-webkit-transform', `rotate(${deg + 45}deg)`);
            }
        }
        timeId = window.setInterval(step, 50)
        localStorage.timeId = timeId
    }
    function reset() {
        const right = document.querySelector('.circle_process .rightcircle')
        const left = document.querySelector('.circle_process .leftcircle')
        right.style.setProperty('-webkit-transform', 'rotate(-135deg)')
        left.style.setProperty('-webkit-transform', 'rotate(-135deg)')
    }
    function timer() {
        const time = status < 2 ? 30 * m_seconds : 5 * m_seconds
        const color = status < 2 ? '#ff3e00' : 'aquamarine'
        setColor(color)
        start(time)
        if (status === 0) {
            status = 1
            reset()
            localStorage.status = status
        } else if (status === 2) {
            status = 3
            reset()
            localStorage.status = status
        }
    }
</script>
<div class="circle_process">
    <div class="wrapper right">
        <div class="circle rightcircle"></div>
    </div>
    <div class="wrapper left">
        <div class="circle leftcircle"></div>
    </div>
    <div class="btn" on:click={timer}>{workStatus[status]}</div>
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