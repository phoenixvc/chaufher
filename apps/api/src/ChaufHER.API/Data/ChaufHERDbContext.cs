using ChaufHER.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace ChaufHER.API.Data;

public class ChaufHERDbContext : DbContext
{
    public ChaufHERDbContext(DbContextOptions<ChaufHERDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Driver> Drivers => Set<Driver>();
    public DbSet<Ride> Rides => Set<Ride>();
    public DbSet<DriverDocument> DriverDocuments => Set<DriverDocument>();
    public DbSet<DriverAvailability> DriverAvailabilities => Set<DriverAvailability>();
    public DbSet<Payment> Payments => Set<Payment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.PhoneNumber);
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.PhoneNumber).HasMaxLength(20);
            entity.Property(e => e.FirstName).HasMaxLength(100);
            entity.Property(e => e.LastName).HasMaxLength(100);
        });

        // Driver
        modelBuilder.Entity<Driver>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.User)
                  .WithOne()
                  .HasForeignKey<Driver>(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => e.LicensePlate).IsUnique();
            entity.Property(e => e.Rating).HasPrecision(3, 2);
            entity.Property(e => e.AcceptanceRate).HasPrecision(5, 2);
            entity.Property(e => e.CancellationRate).HasPrecision(5, 2);
        });

        // Ride
        modelBuilder.Entity<Ride>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.RideNumber).IsUnique();
            entity.HasOne(e => e.Rider)
                  .WithMany(u => u.Rides)
                  .HasForeignKey(e => e.RiderId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Driver)
                  .WithMany(d => d.Rides)
                  .HasForeignKey(e => e.DriverId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.Property(e => e.EstimatedDistance).HasPrecision(10, 2);
            entity.Property(e => e.EstimatedFare).HasPrecision(10, 2);
            entity.Property(e => e.ActualFare).HasPrecision(10, 2);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.ScheduledPickupTime);
        });

        // DriverDocument
        modelBuilder.Entity<DriverDocument>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Driver)
                  .WithMany(d => d.Documents)
                  .HasForeignKey(e => e.DriverId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // DriverAvailability
        modelBuilder.Entity<DriverAvailability>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Driver)
                  .WithMany(d => d.Availability)
                  .HasForeignKey(e => e.DriverId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Payment
        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Ride)
                  .WithOne(r => r.Payment)
                  .HasForeignKey<Payment>(e => e.RideId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.Property(e => e.Amount).HasPrecision(10, 2);
            entity.Property(e => e.PlatformFee).HasPrecision(10, 2);
            entity.Property(e => e.DriverPayout).HasPrecision(10, 2);
        });
    }
}
