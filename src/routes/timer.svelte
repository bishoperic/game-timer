<script>
	import { page } from '$app/stores';
	import { Buffer } from 'buffer';

	let timerData = $page.url.searchParams.get('data');

	console.log(timerData);
	console.log(JSON.parse(Buffer.from(timerData, 'base64').toString('ascii')));
</script>

<style>
	/* your styles go here */
</style>
