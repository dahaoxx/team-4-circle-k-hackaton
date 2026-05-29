using CircleK.ProxyApi.Models;
using CircleK.ProxyApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace CircleK.ProxyApi.Controllers;

[Route("api/stations")]
public sealed class StationsController(ICircleKClient client) : ResourceControllerBase<Station>(client)
{
    protected override string ResourceName => "stations";

    // Add custom station-specific endpoints here, e.g. GET api/stations/{id}/nearby.
}
