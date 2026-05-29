using CircleK.ProxyApi.Models;
using CircleK.ProxyApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace CircleK.ProxyApi.Controllers;

[Route("api/app-events")]
public sealed class AppEventsController(ICircleKClient client) : ResourceControllerBase<AppEvent>(client)
{
    protected override string ResourceName => "app_events";
}
