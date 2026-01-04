# ChaufHER Monorepo - Quick Start

## ✅ Setup Complete!

Your monorepo is fully configured and ready for development.

## 🚀 Start Developing (3 Commands)

```powershell
# 1. Start local services (PostgreSQL, Redis)
docker compose up -d

# 2. Start all apps in development mode
pnpm dev

# 3. Open in browser
# - PWA: http://localhost:3000
# - Admin: http://localhost:3001
# - API: https://localhost:5001/swagger
```

## 📦 Common Commands

### Development
```powershell
pnpm dev                    # Start all apps
pnpm dev --filter=pwa       # Start only PWA
pnpm dev --filter=admin     # Start only admin
pnpm dev --filter=api       # Start only API (not applicable for .NET)
```

### Building
```powershell
pnpm build                  # Build all apps
pnpm build --filter=pwa     # Build only PWA
```

### Testing
```powershell
pnpm test                   # Run all tests
pnpm test --filter=pwa      # Test only PWA
pnpm typecheck              # Type check all TypeScript
pnpm lint                   # Lint all code
```

### .NET API Commands
```powershell
cd apps/api

# Run API
dotnet run --project src/ChaufHER.API

# Run with hot reload
dotnet watch run --project src/ChaufHER.API

# Run tests
dotnet test

# Database migrations
dotnet ef migrations add MigrationName --project src/ChaufHER.Infrastructure --startup-project src/ChaufHER.API
dotnet ef database update --project src/ChaufHER.Infrastructure --startup-project src/ChaufHER.API

# Format code
dotnet format
```

## 🐳 Docker Commands

```powershell
# Start services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down

# Reset everything (WARNING: deletes data!)
docker compose down -v
docker compose up -d
```

## 📁 Repository Structure

```
chaufher/
├── apps/
│   ├── pwa/          # Next.js PWA (Port 3000)
│   ├── admin/        # Next.js Admin (Port 3001)
│   └── api/          # .NET 9 API (Port 5001)
├── packages/
│   └── ui/           # Shared React components
├── infra/            # Azure Bicep IaC
├── docs/             # Documentation
├── adr/              # Architecture decisions
└── docker-compose.yml # Local services
```

## 🔧 Troubleshooting

### Port Already in Use
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Docker Not Running
```powershell
# Start Docker Desktop, then:
docker compose up -d
```

### pnpm Install Issues
```powershell
# Clear cache and reinstall
pnpm store prune
pnpm install --no-frozen-lockfile
```

### Database Connection Failed
```powershell
# Check if PostgreSQL is running
docker compose ps

# Restart PostgreSQL
docker compose restart postgres

# View logs
docker compose logs postgres
```

### .NET EF Tools Not Found
```powershell
# Install globally
dotnet tool install --global dotnet-ef

# Verify
dotnet ef --version
```

## 📚 Documentation

- **WARP.md** - Comprehensive Warp AI guidance
- **MIGRATION_STATUS.md** - Detailed migration tracking
- **docs/onboarding-guide.md** - Full developer onboarding
- **docs/architecture.md** - System architecture
- **docs/PRD.md** - Product requirements
- **adr/** - All architectural decisions

## 🎯 Your Next Steps

1. ✅ **Start Docker Desktop**
2. ✅ **Run `docker compose up -d`**
3. ✅ **Run `pnpm dev`**
4. ✅ **Open http://localhost:3000**
5. 🎉 **Start building!**

## 🔗 Quick Links

- **GitHub**: https://github.com/phoenixvc/chaufher
- **Local PWA**: http://localhost:3000
- **Local Admin**: http://localhost:3001
- **API Swagger**: https://localhost:5001/swagger

## ✨ Tips

- Use `pnpm dev` to start everything at once
- Turborepo caches builds for faster iteration
- All TypeScript changes hot-reload automatically
- .NET API has hot reload with `dotnet watch`
- Shared UI components in `packages/ui/` available to all apps

---

**Need help?** Check MIGRATION_STATUS.md or docs/onboarding-guide.md
