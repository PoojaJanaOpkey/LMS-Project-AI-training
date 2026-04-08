# MySQL Setup Script for LMS
Write-Host "=== LMS MySQL Setup ===" -ForegroundColor Cyan
Write-Host ""

# Option 1: Set MySQL root password to blank (for development)
Write-Host "Option 1: Reset MySQL root password to blank (recommended for local development)" -ForegroundColor Yellow
Write-Host "Run these commands in MySQL Command Line Client or MySQL Workbench:" -ForegroundColor Green
Write-Host ""
Write-Host "ALTER USER 'root'@'localhost' IDENTIFIED BY '';" -ForegroundColor White
Write-Host "FLUSH PRIVILEGES;" -ForegroundColor White
Write-Host ""

# Option 2: Set a specific password
Write-Host "Option 2: Use a specific password" -ForegroundColor Yellow
Write-Host "1. Set your MySQL root password:" -ForegroundColor Green
Write-Host "   ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_password';" -ForegroundColor White
Write-Host "2. Update appsettings.json with:" -ForegroundColor Green
Write-Host "   Server=localhost;Database=lms_db;User=root;Password=your_password;" -ForegroundColor White
Write-Host ""

# Option 3: Create database directly
Write-Host "Option 3: Create database manually" -ForegroundColor Yellow
Write-Host "Run in MySQL:" -ForegroundColor Green
Write-Host "CREATE DATABASE IF NOT EXISTS lms_db;" -ForegroundColor White
Write-Host ""

Write-Host "After setting up MySQL, run:" -ForegroundColor Cyan
Write-Host "dotnet ef migrations add InitialCreate" -ForegroundColor White
Write-Host "dotnet ef database update" -ForegroundColor White
Write-Host ""
Write-Host "Or use this quick command for blank password:" -ForegroundColor Cyan  
Write-Host 'mysql -u root -e "ALTER USER ''root''@''localhost'' IDENTIFIED BY ''''; FLUSH PRIVILEGES; CREATE DATABASE IF NOT EXISTS lms_db;"' -ForegroundColor White
