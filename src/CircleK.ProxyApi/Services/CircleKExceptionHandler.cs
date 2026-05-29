using Microsoft.AspNetCore.Diagnostics;

namespace CircleK.ProxyApi.Services;

/// <summary>
/// Relays upstream failures from the Circle K backend to the caller, preserving the
/// original status code and body so the frontend sees a faithful error.
/// </summary>
public sealed class CircleKExceptionHandler(ILogger<CircleKExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext, Exception exception, CancellationToken ct)
    {
        if (exception is not CircleKApiException ex) return false;

        logger.LogWarning("Upstream Circle K API returned {Status}: {Body}", (int)ex.StatusCode, ex.Body);

        httpContext.Response.StatusCode = (int)ex.StatusCode;
        httpContext.Response.ContentType = "application/json";
        var body = string.IsNullOrWhiteSpace(ex.Body)
            ? $"{{\"error\":\"Upstream returned {(int)ex.StatusCode}\"}}"
            : ex.Body;
        await httpContext.Response.WriteAsync(body, ct);
        return true;
    }
}
