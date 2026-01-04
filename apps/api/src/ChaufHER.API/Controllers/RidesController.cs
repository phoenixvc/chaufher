using ChaufHER.API.Entities;
using ChaufHER.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChaufHER.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RidesController : ControllerBase
{
    private readonly IRideService _rideService;
    private readonly ILogger<RidesController> _logger;

    public RidesController(IRideService rideService, ILogger<RidesController> logger)
    {
        _rideService = rideService;
        _logger = logger;
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<RideResponse>> CreateRide([FromBody] CreateRideRequest request)
    {
        try
        {
            var ride = await _rideService.CreateRideAsync(request);
            return CreatedAtAction(nameof(GetRide), new { id = ride.Id }, MapToResponse(ride));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<RideResponse>> GetRide(Guid id)
    {
        var ride = await _rideService.GetRideByIdAsync(id);
        if (ride == null)
            return NotFound();

        return Ok(MapToResponse(ride));
    }

    [HttpGet("number/{rideNumber}")]
    public async Task<ActionResult<RideResponse>> GetRideByNumber(string rideNumber)
    {
        var ride = await _rideService.GetRideByNumberAsync(rideNumber);
        if (ride == null)
            return NotFound();

        return Ok(MapToResponse(ride));
    }

    [HttpGet("rider/{riderId:guid}")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<RideResponse>>> GetRiderRides(
        Guid riderId,
        [FromQuery] RideStatus? status = null)
    {
        var rides = await _rideService.GetRiderRidesAsync(riderId, status);
        return Ok(rides.Select(MapToResponse));
    }

    [HttpGet("driver/{driverId:guid}")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<RideResponse>>> GetDriverRides(
        Guid driverId,
        [FromQuery] RideStatus? status = null)
    {
        var rides = await _rideService.GetDriverRidesAsync(driverId, status);
        return Ok(rides.Select(MapToResponse));
    }

    [HttpPost("{id:guid}/assign-driver")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AssignDriver(Guid id, [FromBody] AssignDriverRequest request)
    {
        try
        {
            await _rideService.AssignDriverAsync(id, request.DriverId);
            return Ok();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("{id:guid}/status")]
    [Authorize]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateStatusRequest request)
    {
        try
        {
            await _rideService.UpdateStatusAsync(id, request.Status);
            return Ok();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("{id:guid}/cancel")]
    [Authorize]
    public async Task<IActionResult> CancelRide(Guid id, [FromBody] CancelRideRequest request)
    {
        try
        {
            // TODO: Get user ID from claims
            var userId = Guid.NewGuid(); // Placeholder
            await _rideService.CancelRideAsync(id, userId, request.Reason);
            return Ok();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("{id:guid}/complete")]
    [Authorize]
    public async Task<IActionResult> CompleteRide(Guid id, [FromBody] CompleteRideRequest request)
    {
        try
        {
            await _rideService.CompleteRideAsync(id, request.ActualFare);
            return Ok();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    private static RideResponse MapToResponse(Ride ride)
    {
        return new RideResponse(
            ride.Id,
            ride.RideNumber,
            ride.ScheduledPickupTime,
            ride.PickupAddress,
            ride.DropoffAddress,
            ride.EstimatedDistance,
            ride.EstimatedDurationMinutes,
            ride.EstimatedFare,
            ride.ActualFare,
            ride.Status.ToString(),
            ride.PassengerCount,
            ride.HasChildren,
            ride.Driver != null ? new DriverSummary(
                ride.Driver.Id,
                ride.Driver.User.FullName,
                ride.Driver.User.ProfilePhotoUrl,
                ride.Driver.VehicleMake,
                ride.Driver.VehicleModel,
                ride.Driver.VehicleColor,
                ride.Driver.LicensePlate,
                ride.Driver.Rating
            ) : null
        );
    }
}

// Request/Response DTOs
public record AssignDriverRequest(Guid DriverId);
public record UpdateStatusRequest(RideStatus Status);
public record CancelRideRequest(string Reason);
public record CompleteRideRequest(decimal ActualFare);

public record RideResponse(
    Guid Id,
    string RideNumber,
    DateTime ScheduledPickupTime,
    string PickupAddress,
    string DropoffAddress,
    decimal EstimatedDistance,
    int EstimatedDurationMinutes,
    decimal EstimatedFare,
    decimal? ActualFare,
    string Status,
    int PassengerCount,
    bool HasChildren,
    DriverSummary? Driver
);

public record DriverSummary(
    Guid Id,
    string Name,
    string? PhotoUrl,
    string VehicleMake,
    string VehicleModel,
    string VehicleColor,
    string LicensePlate,
    decimal Rating
);
