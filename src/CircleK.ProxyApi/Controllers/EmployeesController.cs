using CircleK.ProxyApi.Models;
using CircleK.ProxyApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace CircleK.ProxyApi.Controllers;

[Route("api/employees")]
public sealed class EmployeesController(ICircleKClient client) : ResourceControllerBase<Employee>(client)
{
    protected override string ResourceName => "employees";
}
