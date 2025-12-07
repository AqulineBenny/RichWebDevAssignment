export async function GET() {
    try {
        const apiKey = process.env.OPENWEATHER_API_KEY;
        if (apiKey) {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Dublin,IE&units=metric&appid=${apiKey}`);
            if (response.ok) {
                const data = await response.json();
                return Response.json({
                    temp: Math.round(data.main.temp),
                    description: data.weather[0].description,
                    city: data.name
                });
            }
        }
    } catch (error) {
      
    }

    return Response.json({
        temp: 15,
        description: 'Partly Cloudy',
        city: 'Dublin'
    });
}
