using CircleK.ProxyApi.Models;
using CircleK.ProxyApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace CircleK.ProxyApi.Controllers;

[Route("api/carwash-visits")]
public sealed class CarwashVisitsController(ICircleKClient client) : ResourceControllerBase<CarwashVisit>(client)
{
    protected override string ResourceName => "carwash_visits";
}
