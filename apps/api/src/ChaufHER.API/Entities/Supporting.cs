namespace ChaufHER.API.Entities;

public class DriverDocument
{
    public Guid Id { get; private set; }
    public Guid DriverId { get; private set; }
    public Driver Driver { get; private set; } = default!;
    public DocumentType Type { get; private set; }
    public string FileUrl { get; private set; } = default!;
    public string FileName { get; private set; } = default!;
    public DateTime ExpiryDate { get; private set; }
    public DocumentStatus Status { get; private set; }
    public string? RejectionReason { get; private set; }
    public Guid? ReviewedByAdminId { get; private set; }
    public DateTime? ReviewedAt { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private DriverDocument() { }

    public static DriverDocument Create(
        Guid driverId,
        DocumentType type,
        string fileUrl,
        string fileName,
        DateTime expiryDate)
    {
        return new DriverDocument
        {
            Id = Guid.NewGuid(),
            DriverId = driverId,
            Type = type,
            FileUrl = fileUrl,
            FileName = fileName,
            ExpiryDate = expiryDate,
            Status = DocumentStatus.Pending,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public void Approve(Guid adminId)
    {
        Status = DocumentStatus.Approved;
        ReviewedByAdminId = adminId;
        ReviewedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Reject(Guid adminId, string reason)
    {
        Status = DocumentStatus.Rejected;
        RejectionReason = reason;
        ReviewedByAdminId = adminId;
        ReviewedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public bool IsExpired => ExpiryDate < DateTime.UtcNow;
    public bool IsExpiringSoon => ExpiryDate < DateTime.UtcNow.AddDays(30);
}

public enum DocumentType
{
    DriversLicense = 0,
    VehicleRegistration = 1,
    Insurance = 2,
    BackgroundCheck = 3,
    ProfilePhoto = 4,
    VehiclePhoto = 5
}

public enum DocumentStatus
{
    Pending = 0,
    Approved = 1,
    Rejected = 2,
    Expired = 3
}

public class DriverAvailability
{
    public Guid Id { get; private set; }
    public Guid DriverId { get; private set; }
    public Driver Driver { get; private set; } = default!;
    public DayOfWeek DayOfWeek { get; private set; }
    public TimeOnly StartTime { get; private set; }
    public TimeOnly EndTime { get; private set; }
    public bool IsActive { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private DriverAvailability() { }

    public static DriverAvailability Create(
        Guid driverId,
        DayOfWeek dayOfWeek,
        TimeOnly startTime,
        TimeOnly endTime)
    {
        if (endTime <= startTime)
            throw new ArgumentException("End time must be after start time");

        return new DriverAvailability
        {
            Id = Guid.NewGuid(),
            DriverId = driverId,
            DayOfWeek = dayOfWeek,
            StartTime = startTime,
            EndTime = endTime,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public void Update(TimeOnly startTime, TimeOnly endTime)
    {
        StartTime = startTime;
        EndTime = endTime;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Activate() { IsActive = true; UpdatedAt = DateTime.UtcNow; }
    public void Deactivate() { IsActive = false; UpdatedAt = DateTime.UtcNow; }
}

public class Payment
{
    public Guid Id { get; private set; }
    public Guid RideId { get; private set; }
    public Ride Ride { get; private set; } = default!;
    public decimal Amount { get; private set; }
    public decimal PlatformFee { get; private set; }
    public decimal DriverPayout { get; private set; }
    public string Currency { get; private set; } = "ZAR";
    public PaymentStatus Status { get; private set; }
    public PaymentMethod Method { get; private set; }
    public string? StripePaymentIntentId { get; private set; }
    public string? StripeChargeId { get; private set; }
    public string? FailureReason { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }
    public DateTime? PaidAt { get; private set; }
    public DateTime? RefundedAt { get; private set; }

    private Payment() { }

    public static Payment Create(
        Guid rideId,
        decimal amount,
        PaymentMethod method,
        decimal platformFeePercentage = 0.15m)
    {
        var platformFee = Math.Round(amount * platformFeePercentage, 2);
        var driverPayout = amount - platformFee;

        return new Payment
        {
            Id = Guid.NewGuid(),
            RideId = rideId,
            Amount = amount,
            PlatformFee = platformFee,
            DriverPayout = driverPayout,
            Method = method,
            Status = PaymentStatus.Pending,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public void SetStripePaymentIntent(string paymentIntentId)
    {
        StripePaymentIntentId = paymentIntentId;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkSucceeded(string chargeId)
    {
        StripeChargeId = chargeId;
        Status = PaymentStatus.Succeeded;
        PaidAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkFailed(string reason)
    {
        FailureReason = reason;
        Status = PaymentStatus.Failed;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Refund()
    {
        Status = PaymentStatus.Refunded;
        RefundedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }
}

public enum PaymentStatus
{
    Pending = 0,
    Processing = 1,
    Succeeded = 2,
    Failed = 3,
    Refunded = 4
}

public enum PaymentMethod
{
    Card = 0,
    ApplePay = 1,
    GooglePay = 2
}
