import type { UnknownAction, Action as BasicAction, Store, Dispatch } from '@reduxjs/toolkit';
import { getContext } from 'svelte';
import diff from 'microdiff';

export const contextStoreKey = Symbol('redux-store');
export const contextStoreStateKey = Symbol('redux-store-state');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useStore<State = unknown, Action extends BasicAction<any> = UnknownAction>() {
	const store = getContext<Store<State, Action>>(contextStoreKey);
	return store;
}

export function useSelector<TState, TSelected>(
	selector: (state: TState) => TSelected
): {
	readonly value: TSelected;
} {
	if (typeof selector !== 'function')
		throw new Error('You must pass a function as a selector to useSelector');

	const store = getContext(contextStoreKey);

	let lastState = $state<TState>(selector(store.getState()));

	store.subscribe(() => {
		const nextState = selector(store.getState());

		if (nextState !== lastState || diff(lastState, nextState).length > 0) {
			lastState = nextState;
		}
	});

	return {
		get value() {
			return lastState;
		}
	};
}

export function useDispatch<
	AppDispatch extends Dispatch<UnknownAction> = Dispatch<UnknownAction>
>(): AppDispatch {
	const store = useStore();
	return store.dispatch as AppDispatch;
}
