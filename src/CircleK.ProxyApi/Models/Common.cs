namespace CircleK.ProxyApi.Models;

/// <summary>
/// Standard envelope returned by every list endpoint of the Circle K backend.
/// </summary>
public sealed record PagedResult<T>
{
    public int Total { get; init; }
    public int Limit { get; init; }
    public int Offset { get; init; }
    public IReadOnlyList<T> Data { get; init; } = [];
}

/// <summary>
/// Query options shared by all list endpoints. Bound from the query string.
/// In addition to these, any top-level scalar field can be passed as an
/// exact-match filter (forwarded verbatim to the backend).
/// </summary>
public sealed record ListQuery
{
    /// <summary>Page size, 1-1000. Backend default is 50.</summary>
    public int? Limit { get; init; }

    /// <summary>Number of records to skip. Backend default is 0.</summary>
    public int? Offset { get; init; }

    /// <summary>Substring search across all fields.</summary>
    public string? Q { get; init; }
}
