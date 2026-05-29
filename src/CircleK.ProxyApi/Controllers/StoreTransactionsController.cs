using CircleK.ProxyApi.Models;
using CircleK.ProxyApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace CircleK.ProxyApi.Controllers;

[Route("api/store-transactions")]
public sealed class StoreTransactionsController(ICircleKClient client) : ResourceControllerBase<StoreTransaction>(client)
{
    protected override string ResourceName => "store_transactions";
}
