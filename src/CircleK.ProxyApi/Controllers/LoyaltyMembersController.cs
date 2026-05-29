using CircleK.ProxyApi.Models;
using CircleK.ProxyApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace CircleK.ProxyApi.Controllers;

[Route("api/loyalty-members")]
public sealed class LoyaltyMembersController(ICircleKClient client) : ResourceControllerBase<LoyaltyMember>(client)
{
    protected override string ResourceName => "loyalty_members";
}
