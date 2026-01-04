namespace ChaufHER.API.Entities;

public class User
{
    public Guid Id { get; private set; }
    public string Email { get; private set; } = default!;
    public string PhoneNumber { get; private set; } = default!;
    public string FirstName { get; private set; } = default!;
    public string LastName { get; private set; } = default!;
    public string? ProfilePhotoUrl { get; private set; }
    public UserRole Role { get; private set; }
    public bool IsActive { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }
    public DateTime? LastLoginAt { get; private set; }
    
    // External Auth
    public string? ExternalAuthId { get; private set; }
    public string? ExternalAuthProvider { get; private set; }
    
    // Notification Preferences
    public bool EnablePushNotifications { get; private set; } = true;
    public bool EnableSmsNotifications { get; private set; } = true;
    public bool EnableEmailNotifications { get; private set; } = true;
    
    // Navigation
    public ICollection<Ride> Rides { get; private set; } = new List<Ride>();

    public string FullName => $"{FirstName} {LastName}";

    private User() { } // EF Core

    public static User CreateRider(
        string email,
        string phoneNumber,
        string firstName,
        string lastName,
        string? externalAuthId = null,
        string? externalAuthProvider = null)
    {
        return new User
        {
            Id = Guid.NewGuid(),
            Email = email.ToLowerInvariant(),
            PhoneNumber = phoneNumber,
            FirstName = firstName,
            LastName = lastName,
            Role = UserRole.Rider,
            IsActive = true,
            ExternalAuthId = externalAuthId,
            ExternalAuthProvider = externalAuthProvider,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    public void UpdateProfile(string firstName, string lastName, string? photoUrl)
    {
        FirstName = firstName;
        LastName = lastName;
        ProfilePhotoUrl = photoUrl;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateNotificationPreferences(bool push, bool sms, bool email)
    {
        EnablePushNotifications = push;
        EnableSmsNotifications = sms;
        EnableEmailNotifications = email;
        UpdatedAt = DateTime.UtcNow;
    }

    public void RecordLogin()
    {
        LastLoginAt = DateTime.UtcNow;
    }

    public void Deactivate()
    {
        IsActive = false;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Reactivate()
    {
        IsActive = true;
        UpdatedAt = DateTime.UtcNow;
    }
}

public enum UserRole
{
    Rider = 0,
    Driver = 1,
    Admin = 2
}
