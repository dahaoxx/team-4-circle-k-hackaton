using System.Text.Json;
using CircleK.ProxyApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace CircleK.ProxyApi.Controllers;

/// <summary>Read-only metadata and dataset admin operations.</summary>
[ApiController]
[Produces("application/json")]
public sealed class AdminController(ICircleKClient client) : ControllerBase
{
    /// <summary>Dataset metadata (name, purpose, entity counts).</summary>
    [HttpGet("api/metadata")]
    public async Task<ActionResult<JsonElement>> Metadata(CancellationToken ct)
        => Ok(await client.GetRawAsync("api/metadata", ct));

    /// <summary>Strategic context block for the hackathon.</summary>
    [HttpGet("api/strategic-context")]
    public async Task<ActionResult<JsonElement>> StrategicContext(CancellationToken ct)
        => Ok(await client.GetRawAsync("api/strategic-context", ct));

    /// <summary>Download the upstream dataset's current state as JSON.</summary>
    [HttpGet("api/admin/export")]
    public async Task<ActionResult<JsonElement>> Export(CancellationToken ct)
        => Ok(await client.GetRawAsync("api/admin/export", ct));

    /// <summary>Reset the upstream dataset back to the seed data.</summary>
    [HttpPost("api/admin/reset")]
    public async Task<ActionResult<JsonElement>> Reset(CancellationToken ct)
        => Ok(await client.ResetAsync(ct));
}
