namespace CircleK.ProxyApi.Models;

/// <summary>A carwash service visit.</summary>
public sealed record CarwashVisit
{
    public string? VisitId { get; init; }
    public string? StationId { get; init; }
    public string? MemberId { get; init; }
    public string? Timestamp { get; init; }
    public string? WashType { get; init; }
    public int? AmountNok { get; init; }
    public bool? IsSubscription { get; init; }
}
