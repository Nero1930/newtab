<script>
    import { onMount } from 'svelte'
    import { fly } from 'svelte/transition'
    import { createClient } from 'pexels';
    import { srcStore, blurStore, searchStore, categoryStore } from '../model/store'
    import { options, categorys } from '../config/enum'

    let src, blur, search, categoryList
    src = ''
    let showSetting = false
    let query = localStorage.query || 'Nature'
    let cacheDisable = false
    const client = createClient('563492ad6f917000010000011c19959213a14c69909ece0f26773ec2')

    // const unsplash = new Unsplash({
    //     accessKey: 'Z196EvMHvD5BJYvepoYWQXigFUCd78B4=t-3i16WMp4M'
    // })
    function initSetting() {
        blur = localStorage.blur || 0
        search = localStorage.search || options[0].label
        categoryList = []
        if (localStorage.categoryList) categoryList = JSON.parse(localStorage.categoryList)
        blurStore.set(blur)
        searchStore.set(search)
        categoryStore.set(categoryList)
    }
    function setBlur(e) {
        const value = e.target.value
        blurStore.set(value)
    }
    async function getPic(cacheDisable) {
        // 先不缓存了
        cacheDisable = true

        const results = JSON.parse(localStorage.getItem('res'))
        if (results && results.length && !cacheDisable) {
            const index = Math.floor(Math.random() * (results.length - 1))
            src = results[index].src.landscape
            srcStore.set(src)
        } else {
            try {
                let res = null
                if (!query) {
                    new Notification('提示', {
                        body: '未设置图片关键字，将使用随机精选图片',
                        icon: './smile.png'
                    })
                    res = await client.photos.curated({ per_page: 1 })
                } else {
                    res = await client.photos.search({ query, per_page: 20, orientation: 'horizontal' })
                }
                localStorage.query = query
                const photos = res.photos
                if (photos && photos.length) {
                    localStorage.setItem('res', JSON.stringify(photos))
                    const index = Math.floor(Math.random() * (photos.length - 1))
                    src = photos[index].src.landscape
                    srcStore.set(src)
                }
            } catch (e) {
                if (e)
                    src = sessionStorage.getItem('customPicture') || './default.jpg'
                    srcStore.set(src)
            }
        }
    }
    function toggleSetting() {
        showSetting = !showSetting
    }
    function upload(e) {
        const file = e.target.files && e.target.files[0]
        if (file && file.type && file.type.includes && file.type.includes('image')) {
            const reader = new FileReader()
            reader.onload = (e) => {
                src = e.target.result || './default.jpg'
                srcStore.set(src)
                sessionStorage.setItem('customPicture', src)
            }
            reader.readAsDataURL(file)
        }
    }
    function uploadPicture() {
        const upload = document.querySelector('#upload')
        upload.click()
    }
    function switchSearch(e) {
        const label = e.target.value
        search = label
        localStorage.search = label
        searchStore.set(label)
    }
    function checkCategory(e) {
        const value = e.target.getAttribute('category')
        const index = categoryList.indexOf(value)
        if (index > -1) {
            categoryList.splice(index, 1)
        } else {
            categoryList.push(value)
        }
        localStorage.categoryList = JSON.stringify(categoryList)
        categoryStore.set(categoryList)
    }
    onMount(()=>{
        initSetting()
        if (!sessionStorage.getItem('customPicture'))
            getPic(cacheDisable)
        else srcStore.set(sessionStorage.getItem('customPicture'))
    })
</script>
<div class="change" on:click={toggleSetting}>自定义设置</div>
{#if showSetting}
<div in:fly="{{ x:'15%', duration:500 }}" out:fly="{{ x:'-15%', duration:500 }}" class="picture-setting">
    <div class="setting-mask" on:click={toggleSetting}></div>
    <div class="pannel">
        <div class="setting-item">
            <label>图片关键词</label>
            <span class="info">(图片服务可能会卡顿,等会就好啦)</span>
            <input bind:value={query} required on:change={(e)=>cacheDisable=true}>
            <button class="searchBtn" on:click={getPic(cacheDisable)}>换张图片</button>
        </div>
        <div class="setting-item">
            <label>图片模糊度</label>
            <input type="number" min="0" value="0" on:change={setBlur}>
        </div>
        <div class="setting-item">
            <label>上传本地图片</label>
            <input id="upload" type="file" accept="image/*" on:change={upload}>
            <button class="uploadBtn" on:click={uploadPicture}>点击上传</button>
        </div>
        <div class="setting-item">
            <label>切换搜索引擎</label>
            <select value={search} on:change={switchSearch}>
                {#each options as option}
                    <option label={option.label}>{option.label}</option>
                {/each}
            </select>
        </div>
        <div class="setting-item">
            <label>选择一言类别(刷新页面后生效)</label>
            {#each categorys as category}
                <div class="check">
                    <input
                        class="checkbox"
                        type="checkbox"
                        checked={categoryList.includes(category.value)}
                        on:change={checkCategory}
                        category={category.value}
                    >
                    <span class="label">{category.label}</span>
                </div>
            {/each}
        </div>
    </div>
</div>
{/if}

<style lang="scss">
    .picture-setting {
        width: 100vw;
        height: 100vh;
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9;
        .pannel  {
            width: 15%;
            height: 100vh;
            position: fixed;
            right: 0;
            top: 0;
            background: rgba(#fff, .6);
            padding: 20px;
            text-align: left;

            .info {
                color: #666;
                font-size: 14px;
            }
            .setting-item {
                position: relative;
                margin: 20px 0;
                label {
                    margin-bottom: 10px;
                }
                input {
                    width: 100%;
                    outline: none;
                    margin: 0 !important;
                }
            }
            #upload {
                display: none;
            }
            .uploadBtn {

            }
            .searchBtn {
                position: absolute;
                right: 0;
            }
            .check {
                display: inline-block;
                width: 120px;
                .checkbox {
                    display: inline-block;
                    width: 20px !important;
                }
            }
        }
        .setting-mask {
            width: 85%;
            height: 100vh;
            position: fixed;
            left: 0;
            top: 0;
        }
    }
        .change {
            cursor: pointer;
            position: absolute;
            // z-index: 10;
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