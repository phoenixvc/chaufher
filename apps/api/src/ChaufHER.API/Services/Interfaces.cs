using ChaufHER.API.Entities;

namespace ChaufHER.API.Services;

public interface IRideService
{
    Task<Ride> CreateRideAsync(CreateRideRequest request);
    Task<Ride?> GetRideByIdAsync(Guid id);
    Task<Ride?> GetRideByNumberAsync(string rideNumber);
    Task<IEnumerable<Ride>> GetRiderRidesAsync(Guid riderId, RideStatus? status = null);
    Task<IEnumerable<Ride>> GetDriverRidesAsync(Guid driverId, RideStatus? status = null);
    Task AssignDriverAsync(Guid rideId, Guid driverId);
    Task UpdateStatusAsync(Guid rideId, RideStatus status);
    Task CancelRideAsync(Guid rideId, Guid cancelledById, string reason);
    Task CompleteRideAsync(Guid rideId, decimal actualFare);
}

public interface IDriverService
{
    Task<Driver> RegisterDriverAsync(RegisterDriverRequest request);
    Task<Driver?> GetDriverByIdAsync(Guid id);
    Task<Driver?> GetDriverByUserIdAsync(Guid userId);
    Task<IEnumerable<Driver>> GetAvailableDriversAsync(double lat, double lng, DateTime pickupTime);
    Task<IEnumerable<Driver>> GetPendingDriversAsync();
    Task ApproveDriverAsync(Guid driverId, Guid adminId);
    Task RejectDriverAsync(Guid driverId, Guid adminId, string reason);
    Task UpdateLocationAsync(Guid driverId, double lat, double lng);
    Task SetOnlineStatusAsync(Guid driverId, bool isOnline);
}

public interface INotificationService
{
    Task SendPushNotificationAsync(Guid userId, string title, string body);
    Task SendSmsAsync(string phoneNumber, string message);
    Task SendEmailAsync(string email, string subject, string body);
    Task SendRideReminderAsync(Ride ride, ReminderType reminderType);
    Task SendRideStatusUpdateAsync(Ride ride);
    Task SendDriverAssignedNotificationAsync(Ride ride);
}

public interface IPaymentService
{
    Task<Payment> CreatePaymentAsync(Guid rideId, decimal amount, PaymentMethod method);
    Task<string> CreatePaymentIntentAsync(Payment payment);
    Task ProcessPaymentAsync(string paymentIntentId);
    Task RefundPaymentAsync(Guid paymentId);
    Task<IEnumerable<Payment>> GetDriverPayoutsAsync(Guid driverId, DateTime from, DateTime to);
}

// Request DTOs
public record CreateRideRequest(
    Guid RiderId,
    DateTime ScheduledPickupTime,
    string PickupAddress,
    double PickupLatitude,
    double PickupLongitude,
    string DropoffAddress,
    double DropoffLatitude,
    double DropoffLongitude,
    int PassengerCount = 1,
    bool HasChildren = false,
    string? SpecialRequirements = null
);

public record RegisterDriverRequest(
    Guid UserId,
    string VehicleMake,
    string VehicleModel,
    int VehicleYear,
    string VehicleColor,
    string LicensePlate,
    int VehicleCapacity = 4
);

public enum ReminderType
{
    OneHourBefore,
    TenMinutesBefore,
    DriverOnTheWay
}
