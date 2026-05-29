using System.Net;

namespace CircleK.ProxyApi.Services;

/// <summary>
/// Thrown when the upstream Circle K backend returns a non-success status code.
/// Carries the upstream status and body so the proxy can relay them faithfully.
/// </summary>
public sealed class CircleKApiException(HttpStatusCode statusCode, string? body)
    : Exception($"Circle K backend returned {(int)statusCode} ({statusCode}).")
{
    public HttpStatusCode StatusCode { get; } = statusCode;
    public string? Body { get; } = body;
}
