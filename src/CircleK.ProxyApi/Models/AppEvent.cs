namespace CircleK.ProxyApi.Models;

/// <summary>A mobile app user interaction event.</summary>
public sealed record AppEvent
{
    public string? EventId { get; init; }
    public string? MemberId { get; init; }
    public string? Timestamp { get; init; }
    public string? EventType { get; init; }
    public int? SessionDurationSeconds { get; init; }
    public string? Platform { get; init; }
}
