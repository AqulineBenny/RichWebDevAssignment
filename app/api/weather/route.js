export async function GET() {
  console.log("Weather API called");

  try {
    // Use OpenWeatherMap API or return sample data
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (apiKey) {
      // Real API call
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Dublin,IE&units=metric&appid=${apiKey}`
      );

      if (response.ok) {
        const data = await response.json();
        return Response.json({
          temp: Math.round(data.main.temp),
          description: data.weather[0].description,
          city: data.name,
          humidity: data.main.humidity,
          wind: data.wind.speed
        });
      }
    }

    // Fallback sample data
    return Response.json({
      temp: 15,
      description: 'Partly Cloudy',
      city: 'Dublin',
      humidity: 65,
      wind: 12
    });

  } catch (error) {
    console.error('Weather API error:', error);

    // Return sample data on error
    return Response.json({
      temp: 15,
      description: 'Sunny',
      city: 'Dublin',
      humidity: 60,
      wind: 10
    });
  }
}