using System.Text.Json;
using CircleK.ProxyApi.Models;
using CircleK.ProxyApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace CircleK.ProxyApi.Controllers;

/// <summary>
/// Generic CRUD proxy for a single Circle K resource collection. Derive a thin
/// controller per resource (set <see cref="ResourceName"/> and a [Route]), and add
/// your own custom actions/business logic there as the app/website needs them.
/// </summary>
[ApiController]
[Produces("application/json")]
public abstract class ResourceControllerBase<T>(ICircleKClient client) : ControllerBase
{
    protected readonly ICircleKClient Client = client;

    /// <summary>Upstream collection segment, e.g. "stations".</summary>
    protected abstract string ResourceName { get; }

    /// <summary>Query params that are pagination/search rather than field filters.</summary>
    private static readonly HashSet<string> Reserved =
        new(StringComparer.OrdinalIgnoreCase) { "limit", "offset", "q" };

    /// <summary>List records. Supports limit/offset/q plus any field=value filter.</summary>
    [HttpGet]
    public async Task<ActionResult<PagedResult<T>>> List([FromQuery] ListQuery query, CancellationToken ct)
    {
        var filters = Request.Query
            .Where(kvp => !Reserved.Contains(kvp.Key))
            .ToDictionary(kvp => kvp.Key, kvp => (string?)kvp.Value.ToString());

        return Ok(await Client.ListAsync<T>(ResourceName, query, filters, ct));
    }

    /// <summary>Get a single record by id.</summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<T>> Get(string id, CancellationToken ct)
    {
        var item = await Client.GetAsync<T>(ResourceName, id, ct);
        return item is null ? NotFound() : Ok(item);
    }

    /// <summary>Create a record.</summary>
    [HttpPost]
    public async Task<ActionResult<T>> Create([FromBody] T body, CancellationToken ct)
    {
        var created = await Client.CreateAsync(ResourceName, body, ct);
        return StatusCode(StatusCodes.Status201Created, created);
    }

    /// <summary>Replace a record (full update).</summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<T>> Replace(string id, [FromBody] T body, CancellationToken ct)
        => Ok(await Client.ReplaceAsync(ResourceName, id, body, ct));

    /// <summary>
    /// Partially update a record. Only the fields present in the request body are sent
    /// upstream (omitted fields are left unchanged).
    /// </summary>
    [HttpPatch("{id}")]
    public async Task<ActionResult<T>> Patch(string id, [FromBody] T body, CancellationToken ct)
    {
        var patch = JsonSerializer.SerializeToElement(body, CircleKClient.Json);
        return Ok(await Client.PatchAsync<T>(ResourceName, id, patch, ct));
    }

    /// <summary>Delete a record.</summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken ct)
        => await Client.DeleteAsync(ResourceName, id, ct) ? NoContent() : NotFound();
}
