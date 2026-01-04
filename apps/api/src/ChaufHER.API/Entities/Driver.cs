namespace ChaufHER.API.Entities;

public class Driver
{
    public Guid Id { get; private set; }
    
    // User reference
    public Guid UserId { get; private set; }
    public User User { get; private set; } = default!;
    
    // Verification
    public DriverVerificationStatus VerificationStatus { get; private set; }
    public BackgroundCheckStatus BackgroundCheckStatus { get; private set; }
    public DateTime? VerifiedAt { get; private set; }
    public Guid? VerifiedByAdminId { get; private set; }
    
    // Vehicle
    public string VehicleMake { get; private set; } = default!;
    public string VehicleModel { get; private set; } = default!;
    public int VehicleYear { get; private set; }
    public string VehicleColor { get; private set; } = default!;
    public string LicensePlate { get; private set; } = default!;
    public int VehicleCapacity { get; private set; }
    public string? VehiclePhotoUrl { get; private set; }
    
    // Performance
    public decimal Rating { get; private set; }
    public int TotalRides { get; private set; }
    public int TotalRatings { get; private set; }
    public decimal AcceptanceRate { get; private set; }
    public decimal CancellationRate { get; private set; }
    
    // Location (last known)
    public double? LastLatitude { get; private set; }
    public double? LastLongitude { get; private set; }
    public DateTime? LastLocationUpdate { get; private set; }
    
    // Status
    public bool IsOnline { get; private set; }
    public bool IsAvailable { get; private set; }
    
    // Timestamps
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }
    
    // Navigation
    public ICollection<DriverDocument> Documents { get; private set; } = new List<DriverDocument>();
    public ICollection<DriverAvailability> Availability { get; private set; } = new List<DriverAvailability>();
    public ICollection<Ride> Rides { get; private set; } = new List<Ride>();

    private Driver() { } // EF Core

    public static Driver Create(
        Guid userId,
        string vehicleMake,
        string vehicleModel,
        int vehicleYear,
        string vehicleColor,
        string licensePlate,
        int vehicleCapacity = 4)
    {
        return new Driver
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            VehicleMake = vehicleMake,
            VehicleModel = vehicleModel,
            VehicleYear = vehicleYear,
            VehicleColor = vehicleColor,
            LicensePlate = licensePlate.ToUpperInvariant(),
            VehicleCapacity = vehicleCapacity,
            VerificationStatus = DriverVerificationStatus.Pending,
            BackgroundCheckStatus = BackgroundCheckStatus.NotStarted,
            Rating = 5.0m,
            TotalRides = 0,
            TotalRatings = 0,
            AcceptanceRate = 100m,
            CancellationRate = 0m,
            IsOnline = false,
            IsAvailable = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public void Approve(Guid adminId)
    {
        if (VerificationStatus == DriverVerificationStatus.Approved)
            throw new InvalidOperationException("Driver is already approved");

        VerificationStatus = DriverVerificationStatus.Approved;
        VerifiedAt = DateTime.UtcNow;
        VerifiedByAdminId = adminId;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Reject(Guid adminId, string reason)
    {
        VerificationStatus = DriverVerificationStatus.Rejected;
        VerifiedByAdminId = adminId;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Suspend()
    {
        VerificationStatus = DriverVerificationStatus.Suspended;
        IsOnline = false;
        IsAvailable = false;
        UpdatedAt = DateTime.UtcNow;
    }

    public void GoOnline()
    {
        if (VerificationStatus != DriverVerificationStatus.Approved)
            throw new InvalidOperationException("Only approved drivers can go online");

        IsOnline = true;
        IsAvailable = true;
        UpdatedAt = DateTime.UtcNow;
    }

    public void GoOffline()
    {
        IsOnline = false;
        IsAvailable = false;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateLocation(double latitude, double longitude)
    {
        LastLatitude = latitude;
        LastLongitude = longitude;
        LastLocationUpdate = DateTime.UtcNow;
    }

    public void SetBusy()
    {
        IsAvailable = false;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetAvailable()
    {
        if (!IsOnline)
            throw new InvalidOperationException("Driver must be online to become available");

        IsAvailable = true;
        UpdatedAt = DateTime.UtcNow;
    }

    public void AddRating(int rating)
    {
        var totalScore = Rating * TotalRatings + rating;
        TotalRatings++;
        Rating = totalScore / TotalRatings;
        UpdatedAt = DateTime.UtcNow;
    }

    public void IncrementRideCount()
    {
        TotalRides++;
        UpdatedAt = DateTime.UtcNow;
    }

    public bool IsAvailableAt(DateTime dateTime)
    {
        var dayOfWeek = dateTime.DayOfWeek;
        var timeOfDay = TimeOnly.FromDateTime(dateTime);

        return Availability.Any(a =>
            a.DayOfWeek == dayOfWeek &&
            a.StartTime <= timeOfDay &&
            a.EndTime >= timeOfDay &&
            a.IsActive);
    }
}

public enum DriverVerificationStatus
{
    Pending = 0,
    DocumentsSubmitted = 1,
    UnderReview = 2,
    Approved = 3,
    Rejected = 4,
    Suspended = 5
}

public enum BackgroundCheckStatus
{
    NotStarted = 0,
    InProgress = 1,
    Passed = 2,
    Failed = 3
}
