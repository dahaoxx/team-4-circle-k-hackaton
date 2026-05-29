namespace CircleK.ProxyApi.Models;

/// <summary>A loyalty program member.</summary>
public sealed record LoyaltyMember
{
    public string? MemberId { get; init; }
    public bool? ExtraMember { get; init; }
    public string? JoinedDate { get; init; }
    public string? Tier { get; init; }
    public bool? IsActive { get; init; }
    public string? AgeBand { get; init; }
    public string? VehicleType { get; init; }
    public string? VehicleModel { get; init; }
    public int? BatteryKwh { get; init; }
    public int? AvgVisitsPerMonth { get; init; }
    public int? LifetimeSpentNok { get; init; }
    public string? PreferredStationId { get; init; }
    public bool? OptInMarketing { get; init; }
    public bool? OptInPersonalisation { get; init; }
    public bool? AppUser { get; init; }
}
