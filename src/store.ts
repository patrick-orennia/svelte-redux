import { configureStore, createSlice } from '@reduxjs/toolkit';

export interface CounterState {
	value: number;
	secondValue: number;
	listOfPastValues: number[];
	complexListOfPastValues: {
		secondValue: number;
	}[];
}

const initialState: CounterState = {
	value: 0,
	secondValue: -1,
	listOfPastValues: [0],
	complexListOfPastValues: [{ secondValue: 0 }]
};

export const counterSlice = createSlice({
	name: 'counter',
	initialState,
	reducers: {
		increment: (state) => {
			state.value += 1;
			state.listOfPastValues.push(state.value);
		},
		decrement: (state) => {
			state.value -= 1;
			state.listOfPastValues.push(state.value);
		},
		incrementSecondValue: (state) => {
			state.secondValue += 1;
			state.complexListOfPastValues.push({ secondValue: state.secondValue });
		},
		decrementSecondValue: (state) => {
			state.secondValue -= 1;
			state.complexListOfPastValues.push({ secondValue: state.secondValue });
		}
	}
});

export const store = configureStore({
	reducer: {
		counter: counterSlice.reducer
	}
});

export const { increment, decrement, incrementSecondValue, decrementSecondValue } =
	counterSlice.actions;

export type RootState = ReturnType<typeof store.getState>;
