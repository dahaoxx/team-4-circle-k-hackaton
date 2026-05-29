using CircleK.ProxyApi.Models;
using CircleK.ProxyApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace CircleK.ProxyApi.Controllers;

[Route("api/fuel-transactions")]
public sealed class FuelTransactionsController(ICircleKClient client) : ResourceControllerBase<FuelTransaction>(client)
{
    protected override string ResourceName => "fuel_transactions";
}
