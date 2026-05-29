namespace CircleK.ProxyApi.Models;

/// <summary>A physical Circle K location in Norway.</summary>
public sealed record Station
{
    public string? StationId { get; init; }
    public string? Name { get; init; }
    public string? City { get; init; }
    public string? Region { get; init; }
    public string? Type { get; init; }
    public bool? Manned { get; init; }
    public double? Lat { get; init; }
    public double? Lng { get; init; }
    public int? FuelPumps { get; init; }

    /// <summary>EV charger counts keyed by power class, e.g. {"50kW":0,"150kW":4,"350kW":1,"total":5}.</summary>
    public Dictionary<string, int>? EvChargers { get; init; }

    public bool? HasCarwash { get; init; }
    public bool? HasKitchen { get; init; }
    public bool? HasExtraSeating { get; init; }
    public string? OpenedDate { get; init; }
}
