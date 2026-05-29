namespace CircleK.ProxyApi.Models;

/// <summary>An EV charging session.</summary>
public sealed record ChargingSession
{
    public string? SessionId { get; init; }
    public string? StationId { get; init; }
    public string? MemberId { get; init; }
    public string? StartedAt { get; init; }
    public int? DurationMin { get; init; }
    public double? KwhDelivered { get; init; }
    public int? ChargerMaxKw { get; init; }
    public double? AvgSessionKw { get; init; }
    public double? PricePerKwhNok { get; init; }
    public double? AmountNok { get; init; }
    public bool? EnteredStore { get; init; }
    public double? StoreSpentNok { get; init; }
    public string? PaymentMethod { get; init; }
    public string? Weekday { get; init; }
    public int? HourOfDay { get; init; }
}
