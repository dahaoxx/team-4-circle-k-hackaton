using System.Net;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using CircleK.ProxyApi.Models;
using Microsoft.AspNetCore.WebUtilities;

namespace CircleK.ProxyApi.Services;

/// <summary>
/// Default <see cref="ICircleKClient"/> backed by a typed <see cref="HttpClient"/>.
/// The HttpClient base address is configured in Program.cs from CircleK:BaseUrl.
/// </summary>
public sealed class CircleKClient(HttpClient http) : ICircleKClient
{
    /// <summary>
    /// JSON options matching the upstream API: snake_case fields, omit nulls so that
    /// PATCH/POST bodies don't send fields the caller didn't set.
    /// </summary>
    public static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web)
    {
        PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
        DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull,
    };

    public async Task<PagedResult<T>> ListAsync<T>(
        string resource,
        ListQuery? query = null,
        IReadOnlyDictionary<string, string?>? filters = null,
        CancellationToken ct = default)
    {
        var qs = new Dictionary<string, string?>();
        if (query?.Limit is { } limit) qs["limit"] = limit.ToString();
        if (query?.Offset is { } offset) qs["offset"] = offset.ToString();
        if (!string.IsNullOrWhiteSpace(query?.Q)) qs["q"] = query!.Q;
        if (filters is not null)
            foreach (var (k, v) in filters)
                if (!string.IsNullOrEmpty(v)) qs[k] = v;

        var url = QueryHelpers.AddQueryString($"api/{resource}", qs);
        using var res = await http.GetAsync(url, ct);
        await EnsureSuccess(res, ct);
        return (await res.Content.ReadFromJsonAsync<PagedResult<T>>(Json, ct))!;
    }

    public async Task<T?> GetAsync<T>(string resource, string id, CancellationToken ct = default)
    {
        using var res = await http.GetAsync($"api/{resource}/{Uri.EscapeDataString(id)}", ct);
        if (res.StatusCode == HttpStatusCode.NotFound) return default;
        await EnsureSuccess(res, ct);
        return await res.Content.ReadFromJsonAsync<T>(Json, ct);
    }

    public async Task<T> CreateAsync<T>(string resource, T body, CancellationToken ct = default)
    {
        using var res = await http.PostAsJsonAsync($"api/{resource}", body, Json, ct);
        await EnsureSuccess(res, ct);
        return (await res.Content.ReadFromJsonAsync<T>(Json, ct))!;
    }

    public async Task<T> ReplaceAsync<T>(string resource, string id, T body, CancellationToken ct = default)
    {
        using var res = await http.PutAsJsonAsync($"api/{resource}/{Uri.EscapeDataString(id)}", body, Json, ct);
        await EnsureSuccess(res, ct);
        return (await res.Content.ReadFromJsonAsync<T>(Json, ct))!;
    }

    public async Task<T> PatchAsync<T>(string resource, string id, JsonElement body, CancellationToken ct = default)
    {
        using var content = new StringContent(body.GetRawText(), Encoding.UTF8, "application/json");
        using var res = await http.PatchAsync($"api/{resource}/{Uri.EscapeDataString(id)}", content, ct);
        await EnsureSuccess(res, ct);
        return (await res.Content.ReadFromJsonAsync<T>(Json, ct))!;
    }

    public async Task<bool> DeleteAsync(string resource, string id, CancellationToken ct = default)
    {
        using var res = await http.DeleteAsync($"api/{resource}/{Uri.EscapeDataString(id)}", ct);
        if (res.StatusCode == HttpStatusCode.NotFound) return false;
        await EnsureSuccess(res, ct);
        return true;
    }

    public async Task<JsonElement> GetRawAsync(string path, CancellationToken ct = default)
    {
        using var res = await http.GetAsync(path, ct);
        await EnsureSuccess(res, ct);
        return await res.Content.ReadFromJsonAsync<JsonElement>(Json, ct);
    }

    public async Task<JsonElement> ResetAsync(CancellationToken ct = default)
    {
        using var res = await http.PostAsync("api/admin/reset", content: null, ct);
        await EnsureSuccess(res, ct);
        return await res.Content.ReadFromJsonAsync<JsonElement>(Json, ct);
    }

    private static async Task EnsureSuccess(HttpResponseMessage res, CancellationToken ct)
    {
        if (res.IsSuccessStatusCode) return;
        var body = await res.Content.ReadAsStringAsync(ct);
        throw new CircleKApiException(res.StatusCode, body);
    }
}
