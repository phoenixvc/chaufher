using ChaufHER.API.Data;
using ChaufHER.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace ChaufHER.API.Services;

public class RideService : IRideService
{
    private readonly ChaufHERDbContext _context;
    private readonly INotificationService _notificationService;
    private readonly ILogger<RideService> _logger;

    public RideService(
        ChaufHERDbContext context,
        INotificationService notificationService,
        ILogger<RideService> logger)
    {
        _context = context;
        _notificationService = notificationService;
        _logger = logger;
    }

    public async Task<Ride> CreateRideAsync(CreateRideRequest request)
    {
        // TODO: Calculate estimated distance and fare using Azure Maps
        var estimatedDistance = 10.0m; // Placeholder
        var estimatedDuration = 25; // Placeholder
        var estimatedFare = 150.00m; // Placeholder

        var ride = Ride.CreateScheduled(
            request.RiderId,
            request.ScheduledPickupTime,
            request.PickupAddress,
            request.PickupLatitude,
            request.PickupLongitude,
            request.DropoffAddress,
            request.DropoffLatitude,
            request.DropoffLongitude,
            estimatedDistance,
            estimatedDuration,
            estimatedFare,
            request.PassengerCount,
            request.HasChildren,
            request.SpecialRequirements);

        _context.Rides.Add(ride);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Ride {RideNumber} created for rider {RiderId}", ride.RideNumber, request.RiderId);
        return ride;
    }

    public async Task<Ride?> GetRideByIdAsync(Guid id)
    {
        return await _context.Rides
            .Include(r => r.Rider)
            .Include(r => r.Driver)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<Ride?> GetRideByNumberAsync(string rideNumber)
    {
        return await _context.Rides
            .Include(r => r.Rider)
            .Include(r => r.Driver)
            .FirstOrDefaultAsync(r => r.RideNumber == rideNumber);
    }

    public async Task<IEnumerable<Ride>> GetRiderRidesAsync(Guid riderId, RideStatus? status = null)
    {
        var query = _context.Rides
            .Include(r => r.Driver)
            .Where(r => r.RiderId == riderId);

        if (status.HasValue)
            query = query.Where(r => r.Status == status.Value);

        return await query.OrderByDescending(r => r.ScheduledPickupTime).ToListAsync();
    }

    public async Task<IEnumerable<Ride>> GetDriverRidesAsync(Guid driverId, RideStatus? status = null)
    {
        var query = _context.Rides
            .Include(r => r.Rider)
            .Where(r => r.DriverId == driverId);

        if (status.HasValue)
            query = query.Where(r => r.Status == status.Value);

        return await query.OrderByDescending(r => r.ScheduledPickupTime).ToListAsync();
    }

    public async Task AssignDriverAsync(Guid rideId, Guid driverId)
    {
        var ride = await _context.Rides.FindAsync(rideId)
            ?? throw new InvalidOperationException("Ride not found");

        ride.AssignDriver(driverId);
        await _context.SaveChangesAsync();

        await _notificationService.SendDriverAssignedNotificationAsync(ride);
    }

    public async Task UpdateStatusAsync(Guid rideId, RideStatus status)
    {
        var ride = await _context.Rides.FindAsync(rideId)
            ?? throw new InvalidOperationException("Ride not found");

        switch (status)
        {
            case RideStatus.DriverEnRoute:
                ride.DriverEnRoute();
                break;
            case RideStatus.DriverArrived:
                ride.DriverArrived();
                break;
            case RideStatus.InProgress:
                ride.StartRide();
                break;
            default:
                throw new InvalidOperationException($"Cannot transition to {status} via this method");
        }

        await _context.SaveChangesAsync();
        await _notificationService.SendRideStatusUpdateAsync(ride);
    }

    public async Task CancelRideAsync(Guid rideId, Guid cancelledById, string reason)
    {
        var ride = await _context.Rides.FindAsync(rideId)
            ?? throw new InvalidOperationException("Ride not found");

        ride.Cancel(cancelledById, reason);
        await _context.SaveChangesAsync();
        await _notificationService.SendRideStatusUpdateAsync(ride);
    }

    public async Task CompleteRideAsync(Guid rideId, decimal actualFare)
    {
        var ride = await _context.Rides.FindAsync(rideId)
            ?? throw new InvalidOperationException("Ride not found");

        ride.Complete(actualFare);
        await _context.SaveChangesAsync();
        await _notificationService.SendRideStatusUpdateAsync(ride);
    }
}

public class DriverService : IDriverService
{
    private readonly ChaufHERDbContext _context;
    private readonly ILogger<DriverService> _logger;

    public DriverService(ChaufHERDbContext context, ILogger<DriverService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Driver> RegisterDriverAsync(RegisterDriverRequest request)
    {
        var driver = Driver.Create(
            request.UserId,
            request.VehicleMake,
            request.VehicleModel,
            request.VehicleYear,
            request.VehicleColor,
            request.LicensePlate,
            request.VehicleCapacity);

        _context.Drivers.Add(driver);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Driver {DriverId} registered for user {UserId}", driver.Id, request.UserId);
        return driver;
    }

    public async Task<Driver?> GetDriverByIdAsync(Guid id)
    {
        return await _context.Drivers
            .Include(d => d.User)
            .Include(d => d.Documents)
            .Include(d => d.Availability)
            .FirstOrDefaultAsync(d => d.Id == id);
    }

    public async Task<Driver?> GetDriverByUserIdAsync(Guid userId)
    {
        return await _context.Drivers
            .Include(d => d.User)
            .FirstOrDefaultAsync(d => d.UserId == userId);
    }

    public async Task<IEnumerable<Driver>> GetAvailableDriversAsync(double lat, double lng, DateTime pickupTime)
    {
        // TODO: Implement proper geo-spatial query
        return await _context.Drivers
            .Include(d => d.User)
            .Include(d => d.Availability)
            .Where(d => d.VerificationStatus == DriverVerificationStatus.Approved)
            .Where(d => d.IsOnline && d.IsAvailable)
            .ToListAsync();
    }

    public async Task<IEnumerable<Driver>> GetPendingDriversAsync()
    {
        return await _context.Drivers
            .Include(d => d.User)
            .Include(d => d.Documents)
            .Where(d => d.VerificationStatus == DriverVerificationStatus.Pending ||
                        d.VerificationStatus == DriverVerificationStatus.DocumentsSubmitted)
            .OrderBy(d => d.CreatedAt)
            .ToListAsync();
    }

    public async Task ApproveDriverAsync(Guid driverId, Guid adminId)
    {
        var driver = await _context.Drivers.FindAsync(driverId)
            ?? throw new InvalidOperationException("Driver not found");

        driver.Approve(adminId);
        await _context.SaveChangesAsync();
    }

    public async Task RejectDriverAsync(Guid driverId, Guid adminId, string reason)
    {
        var driver = await _context.Drivers.FindAsync(driverId)
            ?? throw new InvalidOperationException("Driver not found");

        driver.Reject(adminId, reason);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateLocationAsync(Guid driverId, double lat, double lng)
    {
        var driver = await _context.Drivers.FindAsync(driverId)
            ?? throw new InvalidOperationException("Driver not found");

        driver.UpdateLocation(lat, lng);
        await _context.SaveChangesAsync();
    }

    public async Task SetOnlineStatusAsync(Guid driverId, bool isOnline)
    {
        var driver = await _context.Drivers.FindAsync(driverId)
            ?? throw new InvalidOperationException("Driver not found");

        if (isOnline)
            driver.GoOnline();
        else
            driver.GoOffline();

        await _context.SaveChangesAsync();
    }
}

public class NotificationService : INotificationService
{
    private readonly ILogger<NotificationService> _logger;

    public NotificationService(ILogger<NotificationService> logger)
    {
        _logger = logger;
    }

    public Task SendPushNotificationAsync(Guid userId, string title, string body)
    {
        // TODO: Implement Azure Notification Hubs
        _logger.LogInformation("Push notification sent to {UserId}: {Title}", userId, title);
        return Task.CompletedTask;
    }

    public Task SendSmsAsync(string phoneNumber, string message)
    {
        // TODO: Implement SMS provider (Twilio, etc.)
        _logger.LogInformation("SMS sent to {PhoneNumber}", phoneNumber);
        return Task.CompletedTask;
    }

    public Task SendEmailAsync(string email, string subject, string body)
    {
        // TODO: Implement email provider (SendGrid, etc.)
        _logger.LogInformation("Email sent to {Email}: {Subject}", email, subject);
        return Task.CompletedTask;
    }

    public Task SendRideReminderAsync(Ride ride, ReminderType reminderType)
    {
        var message = reminderType switch
        {
            ReminderType.OneHourBefore => $"Reminder: Your ride is in 1 hour",
            ReminderType.TenMinutesBefore => $"Your driver will arrive in 10 minutes",
            ReminderType.DriverOnTheWay => $"Your driver is on the way!",
            _ => "Ride reminder"
        };

        _logger.LogInformation("Reminder sent for ride {RideNumber}: {Message}", ride.RideNumber, message);
        return Task.CompletedTask;
    }

    public Task SendRideStatusUpdateAsync(Ride ride)
    {
        _logger.LogInformation("Status update sent for ride {RideNumber}: {Status}", ride.RideNumber, ride.Status);
        return Task.CompletedTask;
    }

    public Task SendDriverAssignedNotificationAsync(Ride ride)
    {
        _logger.LogInformation("Driver assigned notification sent for ride {RideNumber}", ride.RideNumber);
        return Task.CompletedTask;
    }
}

public class PaymentService : IPaymentService
{
    private readonly ChaufHERDbContext _context;
    private readonly ILogger<PaymentService> _logger;

    public PaymentService(ChaufHERDbContext context, ILogger<PaymentService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Payment> CreatePaymentAsync(Guid rideId, decimal amount, PaymentMethod method)
    {
        var payment = Payment.Create(rideId, amount, method);
        _context.Payments.Add(payment);
        await _context.SaveChangesAsync();
        return payment;
    }

    public Task<string> CreatePaymentIntentAsync(Payment payment)
    {
        // TODO: Implement Stripe
        return Task.FromResult($"pi_{Guid.NewGuid():N}");
    }

    public Task ProcessPaymentAsync(string paymentIntentId)
    {
        // TODO: Implement Stripe webhook handling
        return Task.CompletedTask;
    }

    public async Task RefundPaymentAsync(Guid paymentId)
    {
        var payment = await _context.Payments.FindAsync(paymentId)
            ?? throw new InvalidOperationException("Payment not found");

        payment.Refund();
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Payment>> GetDriverPayoutsAsync(Guid driverId, DateTime from, DateTime to)
    {
        return await _context.Payments
            .Include(p => p.Ride)
            .Where(p => p.Ride.DriverId == driverId)
            .Where(p => p.Status == PaymentStatus.Succeeded)
            .Where(p => p.PaidAt >= from && p.PaidAt <= to)
            .ToListAsync();
    }
}
