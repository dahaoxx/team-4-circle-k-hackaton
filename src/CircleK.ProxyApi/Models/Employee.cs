namespace CircleK.ProxyApi.Models;

/// <summary>A station staff member.</summary>
public sealed record Employee
{
    public string? EmployeeId { get; init; }
    public string? StationId { get; init; }
    public string? Role { get; init; }
    public string? ShiftPattern { get; init; }
    public int? TenureMonths { get; init; }
    public bool? IsFullTime { get; init; }
    public bool? TrainedBarista { get; init; }
    public bool? TrainedKitchen { get; init; }
}
