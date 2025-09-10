<script lang="ts">
	import { useDispatch, useSelector } from '$lib/index.js';
	import type { RootState } from '../store.js';
	import { increment, incrementSecondValue } from '../store.js';

	const count = useSelector((state: RootState) => {
		return state.counter.value;
	});
	const secondCount = useSelector((state: RootState) => {
		return state.counter.secondValue;
	});
	const allCounts = useSelector((state: RootState) => {
		return state.counter;
	});
	const allCountsAreEven = $derived.by(() => {
		return allCounts.value.value % 2 === 0 && allCounts.value.secondValue % 2 === 0;
	});
	const listOfPastValues = useSelector((state: RootState) => {
		return state.counter.listOfPastValues;
	});
	const complexListOfPastValues = useSelector((state: RootState) => {
		return state.counter.complexListOfPastValues;
	});

	const sumOfCounts = $derived(listOfPastValues.value.reduce((acc, curr) => acc + curr, 0));
	const dispatch = useDispatch();

	$inspect('count', count.value);
	$inspect('secondCount', secondCount.value);
	$inspect('allCounts', allCounts.value);
	$inspect('allCountsAreEven', allCountsAreEven);
	$inspect('listOfPastValues', listOfPastValues.value);
	$inspect('complexListOfPastValues', complexListOfPastValues.value);
</script>

<h1>Hello</h1>
<button onclick={() => dispatch(increment())}>
	Clicks: {count.value}
</button>
<button onclick={() => dispatch(incrementSecondValue())}>
	Second Clicks: {secondCount.value}
</button>
<p>All Counts: {JSON.stringify(allCounts.value)}</p>
<p>Sum of Counts: {sumOfCounts}</p>
<p>All Counts Are Even: {allCountsAreEven}</p>
