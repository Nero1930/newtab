<script>
    import Background from './components/Background.svelte'
    import Greeting from './components/Greeting.svelte'
    import Search from './components/Search.svelte'
	import Timer from './components/Timer.svelte'
	import Setting from './components/Setting.svelte'
</script>

<main>
    <Background />
    <Greeting />
    <Timer />
    <Search />
	<Setting />
</main>

<style>
	main {
		text-align: center;
		max-width: 240px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
