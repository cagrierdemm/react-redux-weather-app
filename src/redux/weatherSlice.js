import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCities = createAsyncThunk('weather/getCities', async () =>{
    const res = await axios(`${process.env.REACT_APP_CITIES_URL}`)
    return res.data;
})

export const fetchWeather = createAsyncThunk('weather/getWeather', async (city) =>{
    const res = await axios(`${process.env.REACT_APP_API_URL}?&q=${city}&appid=${process.env.REACT_APP_API_KEY}&units=metric&lang=tr`)
    return res.data;
})

export const weatherSlice = createSlice({
    name: 'weather',
    initialState: {
        data: {
            cities: [],
            weather: [],
        },
        status: {
            cities: 'idle',
            weather: 'idle',
        },
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCities.pending, (state, action) => {
                state.status.cities = 'loading';
            })
            .addCase(fetchCities.fulfilled, (state, action) => {
                state.data.cities = action.payload;
                state.status.cities = 'succeeded';
            })
            .addCase(fetchCities.rejected, (state, action) => {
                state.status.cities = 'failed';
            })
            .addCase(fetchWeather.pending, (state, action) => {
                state.status.weather = 'loading';
            })
            .addCase(fetchWeather.fulfilled, (state, action) => {
                state.data.weather = action.payload;
                state.status.weather = 'succeeded';
            })
            .addCase(fetchWeather.rejected, (state, action) => {
                state.status.weather = 'failed';
            })
    },
})

export default weatherSlice.reducer;
