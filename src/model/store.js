import {
    writable
} from 'svelte/store'
import {
    options
} from '../config/enum'

const srcStore = writable('./default.jpg')
const blurStore = writable(0)
const searchStore = writable(options[0].label)
const categoryStore = writable('')

export {
    srcStore,
    blurStore,
    searchStore,
    categoryStore
}