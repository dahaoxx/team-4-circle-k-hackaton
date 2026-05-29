using CircleK.ProxyApi.Models;
using CircleK.ProxyApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace CircleK.ProxyApi.Controllers;

[Route("api/weather-observations")]
public sealed class WeatherObservationsController(ICircleKClient client) : ResourceControllerBase<WeatherObservation>(client)
{
    protected override string ResourceName => "weather_observations";
}
