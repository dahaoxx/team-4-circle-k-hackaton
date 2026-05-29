namespace CircleK.ProxyApi.Models;

/// <summary>A fuel pump sale.</summary>
public sealed record FuelTransaction
{
    public string? TransactionId { get; init; }
    public string? StationId { get; init; }
    public string? MemberId { get; init; }
    public string? Timestamp { get; init; }
    public string? FuelType { get; init; }
    public double? Litres { get; init; }
    public double? PricePerLitreNok { get; init; }
    public double? AmountNok { get; init; }
    public string? PaymentMethod { get; init; }
    public bool? LinkedCarwashPurchase { get; init; }
    public bool? LinkedStorePurchase { get; init; }
}
