namespace CircleK.ProxyApi.Models;

/// <summary>A single line item within a store transaction.</summary>
public sealed record StoreItem
{
    public string? Name { get; init; }
    public int? PriceNok { get; init; }
    public string? Category { get; init; }
}

/// <summary>An in-store retail purchase.</summary>
public sealed record StoreTransaction
{
    public string? TransactionId { get; init; }
    public string? StationId { get; init; }
    public string? MemberId { get; init; }
    public string? Timestamp { get; init; }
    public IReadOnlyList<StoreItem>? Items { get; init; }
    public int? TotalNok { get; init; }
    public string? PaymentMethod { get; init; }
    public bool? DuringChargingSession { get; init; }
    public int? HourOfDay { get; init; }
    public string? Weekday { get; init; }
}
