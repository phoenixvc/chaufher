namespace ChaufHER.API.Entities;

public class Ride
{
    public Guid Id { get; private set; }
    public string RideNumber { get; private set; } = default!;
    
    // Rider
    public Guid RiderId { get; private set; }
    public User Rider { get; private set; } = default!;
    
    // Driver (nullable until assigned)
    public Guid? DriverId { get; private set; }
    public Driver? Driver { get; private set; }
    
    // Scheduling
    public DateTime ScheduledPickupTime { get; private set; }
    public DateTime? BookingDeadline { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }
    
    // Locations
    public string PickupAddress { get; private set; } = default!;
    public double PickupLatitude { get; private set; }
    public double PickupLongitude { get; private set; }
    public string DropoffAddress { get; private set; } = default!;
    public double DropoffLatitude { get; private set; }
    public double DropoffLongitude { get; private set; }
    
    // Ride Details
    public decimal EstimatedDistance { get; private set; }
    public int EstimatedDurationMinutes { get; private set; }
    public decimal EstimatedFare { get; private set; }
    public decimal? ActualFare { get; private set; }
    
    // Status
    public RideStatus Status { get; private set; }
    public string? CancellationReason { get; private set; }
    public Guid? CancelledById { get; private set; }
    
    // Passengers
    public int PassengerCount { get; private set; }
    public bool HasChildren { get; private set; }
    public string? SpecialRequirements { get; private set; }
    
    // Payment
    public Guid? PaymentId { get; private set; }
    public Payment? Payment { get; private set; }
    
    // Rating
    public int? RiderRating { get; private set; }
    public string? RiderFeedback { get; private set; }
    public int? DriverRating { get; private set; }
    public string? DriverFeedback { get; private set; }

    private Ride() { } // EF Core

    public static Ride CreateScheduled(
        Guid riderId,
        DateTime scheduledPickupTime,
        string pickupAddress,
        double pickupLat,
        double pickupLng,
        string dropoffAddress,
        double dropoffLat,
        double dropoffLng,
        decimal estimatedDistance,
        int estimatedDuration,
        decimal estimatedFare,
        int passengerCount = 1,
        bool hasChildren = false,
        string? specialRequirements = null)
    {
        if (scheduledPickupTime <= DateTime.UtcNow.AddMinutes(30))
            throw new InvalidOperationException("Rides must be scheduled at least 30 minutes in advance");

        if (scheduledPickupTime > DateTime.UtcNow.AddDays(30))
            throw new InvalidOperationException("Rides cannot be scheduled more than 30 days in advance");

        var ride = new Ride
        {
            Id = Guid.NewGuid(),
            RideNumber = GenerateRideNumber(),
            RiderId = riderId,
            ScheduledPickupTime = scheduledPickupTime,
            BookingDeadline = scheduledPickupTime.AddHours(-1),
            PickupAddress = pickupAddress,
            PickupLatitude = pickupLat,
            PickupLongitude = pickupLng,
            DropoffAddress = dropoffAddress,
            DropoffLatitude = dropoffLat,
            DropoffLongitude = dropoffLng,
            EstimatedDistance = estimatedDistance,
            EstimatedDurationMinutes = estimatedDuration,
            EstimatedFare = estimatedFare,
            PassengerCount = passengerCount,
            HasChildren = hasChildren,
            SpecialRequirements = specialRequirements,
            Status = RideStatus.Scheduled,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        return ride;
    }

    public void AssignDriver(Guid driverId)
    {
        if (Status != RideStatus.Scheduled)
            throw new InvalidOperationException("Can only assign driver to scheduled rides");

        DriverId = driverId;
        Status = RideStatus.DriverAssigned;
        UpdatedAt = DateTime.UtcNow;
    }

    public void DriverEnRoute()
    {
        if (Status != RideStatus.DriverAssigned)
            throw new InvalidOperationException("Driver must be assigned before going en route");

        Status = RideStatus.DriverEnRoute;
        UpdatedAt = DateTime.UtcNow;
    }

    public void DriverArrived()
    {
        if (Status != RideStatus.DriverEnRoute)
            throw new InvalidOperationException("Driver must be en route before arriving");

        Status = RideStatus.DriverArrived;
        UpdatedAt = DateTime.UtcNow;
    }

    public void StartRide()
    {
        if (Status != RideStatus.DriverArrived)
            throw new InvalidOperationException("Driver must have arrived before starting ride");

        Status = RideStatus.InProgress;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Complete(decimal actualFare)
    {
        if (Status != RideStatus.InProgress)
            throw new InvalidOperationException("Ride must be in progress to complete");

        ActualFare = actualFare;
        Status = RideStatus.Completed;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Cancel(Guid cancelledById, string reason)
    {
        if (Status == RideStatus.Completed || Status == RideStatus.Cancelled)
            throw new InvalidOperationException("Cannot cancel a completed or already cancelled ride");

        CancelledById = cancelledById;
        CancellationReason = reason;
        Status = RideStatus.Cancelled;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkNoDriverFound()
    {
        if (Status != RideStatus.Scheduled)
            throw new InvalidOperationException("Can only mark no driver found for scheduled rides");

        Status = RideStatus.NoDriverFound;
        UpdatedAt = DateTime.UtcNow;
    }

    private static string GenerateRideNumber()
    {
        var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        var random = new Random();
        var suffix = new string(Enumerable.Repeat(chars, 6)
            .Select(s => s[random.Next(s.Length)]).ToArray());
        return $"CHF-{suffix}";
    }
}

public enum RideStatus
{
    Scheduled = 0,
    DriverAssigned = 1,
    DriverEnRoute = 2,
    DriverArrived = 3,
    InProgress = 4,
    Completed = 5,
    Cancelled = 6,
    NoDriverFound = 7
}
