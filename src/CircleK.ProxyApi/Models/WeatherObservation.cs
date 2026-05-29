namespace CircleK.ProxyApi.Models;

/// <summary>A daily weather observation for a station.</summary>
public sealed record WeatherObservation
{
    public string? ObservationId { get; init; }
    public string? StationId { get; init; }
    public string? Date { get; init; }
    public double? TempC { get; init; }
    public double? PrecipitationMm { get; init; }
    public bool? Snow { get; init; }
    public double? WindMs { get; init; }
    public string? Conditions { get; init; }
}
