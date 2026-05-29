using CircleK.ProxyApi.Services;

var builder = WebApplication.CreateBuilder(args);

const string FrontendCors = "frontend";

// --- Configuration -----------------------------------------------------------
// Upstream Circle K backend base URL (overridable via CircleK__BaseUrl env var).
var upstreamBaseUrl = builder.Configuration["CircleK:BaseUrl"]
    ?? "https://circle-k-group-4-775886516859.europe-north2.run.app";

// Allowed frontend origins. Empty => allow any origin (convenient for local dev).
var allowedOrigins = builder.Configuration
    .GetSection("CircleK:Cors:AllowedOrigins").Get<string[]>() ?? [];

// --- Services ----------------------------------------------------------------
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(o => o.SwaggerDoc("v1",
    new() { Title = "Circle K Proxy API", Version = "v1" }));

// Typed gateway to the upstream Circle K backend.
builder.Services.AddHttpClient<ICircleKClient, CircleKClient>(c =>
{
    c.BaseAddress = new Uri(upstreamBaseUrl.TrimEnd('/') + "/");
    c.Timeout = TimeSpan.FromSeconds(30);
});

builder.Services.AddExceptionHandler<CircleKExceptionHandler>();
builder.Services.AddProblemDetails();

builder.Services.AddCors(options => options.AddPolicy(FrontendCors, policy =>
{
    if (allowedOrigins.Length == 0)
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    else
        policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod().AllowCredentials();
}));

var app = builder.Build();

// --- Pipeline ----------------------------------------------------------------
app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(o => o.SwaggerEndpoint("/swagger/v1/swagger.json", "Circle K Proxy API v1"));
}

app.UseCors(FrontendCors);
app.MapControllers();

// Liveness probe for this proxy.
app.MapGet("/health", () => Results.Ok(new { status = "ok", service = "circle-k-proxy" }));

app.Run();
