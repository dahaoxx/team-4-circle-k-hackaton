using CircleK.ProxyApi.Models;
using CircleK.ProxyApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace CircleK.ProxyApi.Controllers;

/// <summary>
/// Example of CUSTOM server-side logic that the app/website can call directly.
/// Instead of having the frontend fetch raw lists and crunch numbers, we aggregate
/// upstream data here and return a purpose-built shape. Use this as the template for
/// your own business endpoints.
/// </summary>
[ApiController]
[Route("api/insights")]
[Produces("application/json")]
public sealed class InsightsController(ICircleKClient client) : ControllerBase
{
    /// <summary>
    /// Charging KPIs for one station: total sessions, energy, revenue, average
    /// power, and the in-store conversion rate of charging customers.
    /// </summary>
    [HttpGet("stations/{stationId}/charging-summary")]
    public async Task<ActionResult<StationChargingSummary>> ChargingSummary(string stationId, CancellationToken ct)
    {
        var station = await client.GetAsync<Station>("stations", stationId, ct);
        if (station is null) return NotFound();

        // Pull all charging sessions for this station (page through if needed).
        var sessions = new List<ChargingSession>();
        const int pageSize = 1000;
        var offset = 0;
        while (true)
        {
            var page = await client.ListAsync<ChargingSession>(
                "charging_sessions",
                new ListQuery { Limit = pageSize, Offset = offset },
                new Dictionary<string, string?> { ["station_id"] = stationId },
                ct);

            sessions.AddRange(page.Data);
            offset += pageSize;
            if (offset >= page.Total || page.Data.Count == 0) break;
        }

        var count = sessions.Count;
        var totalKwh = sessions.Sum(s => s.KwhDelivered ?? 0);
        var totalRevenue = sessions.Sum(s => s.AmountNok ?? 0);
        var enteredStore = sessions.Count(s => s.EnteredStore == true);
        var storeRevenue = sessions.Sum(s => s.StoreSpentNok ?? 0);

        return Ok(new StationChargingSummary
        {
            StationId = stationId,
            StationName = station.Name,
            SessionCount = count,
            TotalKwh = Math.Round(totalKwh, 2),
            TotalRevenueNok = Math.Round(totalRevenue, 2),
            AvgSessionKwh = count == 0 ? 0 : Math.Round(totalKwh / count, 2),
            StoreConversionRate = count == 0 ? 0 : Math.Round((double)enteredStore / count, 3),
            StoreRevenueNok = Math.Round(storeRevenue, 2),
        });
    }

    public sealed record StationChargingSummary
    {
        public string StationId { get; init; } = "";
        public string? StationName { get; init; }
        public int SessionCount { get; init; }
        public double TotalKwh { get; init; }
        public double TotalRevenueNok { get; init; }
        public double AvgSessionKwh { get; init; }
        public double StoreConversionRate { get; init; }
        public double StoreRevenueNok { get; init; }
    }
}
