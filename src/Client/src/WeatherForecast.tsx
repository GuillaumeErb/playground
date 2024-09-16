import React, { useState, useEffect } from 'react';

interface WeatherForecastContract {
    date: string;
    temperatureC: number;
    summary: string;
};

function WeatherForecast() {
    const [forecasts, setForecasts] = useState<WeatherForecastContract[]>([]);

    useEffect(() => {
        fetch('/api/weatherforecast')
            .then(response => response.json())
            .then(data => setForecasts(data));
    }, []);

    return (
        <div>
            <h1>Weather Forecast</h1>
            <ul>
                {forecasts.map((forecast, index) => (
                    <li key={index}>
                        {forecast.date}: {forecast.temperatureC} °C - {forecast.summary}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default WeatherForecast;
