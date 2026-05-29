using CircleK.ProxyApi.Models;
using CircleK.ProxyApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace CircleK.ProxyApi.Controllers;

[Route("api/charging-sessions")]
public sealed class ChargingSessionsController(ICircleKClient client) : ResourceControllerBase<ChargingSession>(client)
{
    protected override string ResourceName => "charging_sessions";
}
