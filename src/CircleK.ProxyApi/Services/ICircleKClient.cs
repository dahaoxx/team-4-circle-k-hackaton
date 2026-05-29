using System.Text.Json;
using CircleK.ProxyApi.Models;

namespace CircleK.ProxyApi.Services;

/// <summary>
/// Typed gateway over the upstream Circle K Hackathon API. One generic method per
/// REST operation; the resource segment (e.g. "stations") selects the collection.
/// Build custom server-side logic on top of these primitives in your controllers.
/// </summary>
public interface ICircleKClient
{
    /// <summary>GET /api/{resource} — paginated list with optional filters.</summary>
    Task<PagedResult<T>> ListAsync<T>(
        string resource,
        ListQuery? query = null,
        IReadOnlyDictionary<string, string?>? filters = null,
        CancellationToken ct = default);

    /// <summary>GET /api/{resource}/{id}. Returns null on 404.</summary>
    Task<T?> GetAsync<T>(string resource, string id, CancellationToken ct = default);

    /// <summary>POST /api/{resource}.</summary>
    Task<T> CreateAsync<T>(string resource, T body, CancellationToken ct = default);

    /// <summary>PUT /api/{resource}/{id} — full replace.</summary>
    Task<T> ReplaceAsync<T>(string resource, string id, T body, CancellationToken ct = default);

    /// <summary>PATCH /api/{resource}/{id} — partial update from a raw JSON body.</summary>
    Task<T> PatchAsync<T>(string resource, string id, JsonElement body, CancellationToken ct = default);

    /// <summary>DELETE /api/{resource}/{id}. Returns false on 404.</summary>
    Task<bool> DeleteAsync(string resource, string id, CancellationToken ct = default);

    /// <summary>GET an arbitrary read-only JSON endpoint (metadata, strategic-context, export).</summary>
    Task<JsonElement> GetRawAsync(string path, CancellationToken ct = default);

    /// <summary>POST /api/admin/reset — restore the seed dataset.</summary>
    Task<JsonElement> ResetAsync(CancellationToken ct = default);
}
