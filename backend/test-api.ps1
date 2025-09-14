# GreenCycle API Test Script
# This script tests all the major endpoints of the GreenCycle API

$baseUrl = "http://localhost:3001/api"
$headers = @{"Content-Type" = "application/json"}

Write-Host "🧪 GreenCycle API Testing Script" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Test 1: Health Check
Write-Host "`n1. Testing Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/../health" -Method GET
    Write-Host "✅ Health check passed: $($response.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: User Registration
Write-Host "`n2. Testing User Registration..." -ForegroundColor Yellow
$userRegData = @{
    name = "Test User"
    email = "testuser@example.com"
    password = "password123"
    phone = "1234567890"
    address = "123 Test Street, Test City"
    role = "user"
} | ConvertTo-Json

try {
    $userResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -Body $userRegData -Headers $headers
    Write-Host "✅ User registration successful" -ForegroundColor Green
    $userToken = $userResponse.token
} catch {
    Write-Host "❌ User registration failed: $($_.Exception.Message)" -ForegroundColor Red
    $userToken = $null
}

# Test 3: NGO Registration
Write-Host "`n3. Testing NGO Registration..." -ForegroundColor Yellow
$ngoRegData = @{
    name = "Test NGO Admin"
    email = "testngo@example.com"
    password = "password123"
    phone = "1234567891"
    role = "ngo"
    ngoDetails = @{
        name = "Green Earth NGO"
        description = "Environmental conservation organization"
        address = "456 NGO Avenue, Green City"
        city = "Green City"
        state = "GreenState"
        pincode = "123456"
        latitude = "28.7041"
        longitude = "77.1025"
        certificationNumber = "NGO123456"
        website = "https://greenearth.org"
        specializations = @("electronics", "batteries", "appliances")
        operatingHours = "9 AM - 6 PM"
        capacity = "100"
    }
} | ConvertTo-Json -Depth 3

try {
    $ngoResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -Body $ngoRegData -Headers $headers
    Write-Host "✅ NGO registration successful" -ForegroundColor Green
    $ngoToken = $ngoResponse.token
} catch {
    Write-Host "❌ NGO registration failed: $($_.Exception.Message)" -ForegroundColor Red
    $ngoToken = $null
}

# Test 4: Admin Login
Write-Host "`n4. Testing Admin Login..." -ForegroundColor Yellow
$adminLoginData = @{
    email = "admin@greencycle.com"
    password = "admin123"
} | ConvertTo-Json

try {
    $adminResponse = Invoke-RestMethod -Uri "$baseUrl/auth/admin/login" -Method POST -Body $adminLoginData -Headers $headers
    Write-Host "✅ Admin login successful" -ForegroundColor Green
    $adminToken = $adminResponse.token
} catch {
    Write-Host "❌ Admin login failed: $($_.Exception.Message)" -ForegroundColor Red
    $adminToken = $null
}

# Test 5: Device Upload (if user token exists)
if ($userToken) {
    Write-Host "`n5. Testing Device Upload..." -ForegroundColor Yellow
    $deviceHeaders = $headers.Clone()
    $deviceHeaders["Authorization"] = "Bearer $userToken"
    
    $deviceData = @{
        deviceType = "smartphone"
        brand = "TestBrand"
        model = "TestModel X"
        condition = "working"
        description = "Old smartphone in good working condition"
        weight_kg = "0.2"
        estimatedValue = "50"
    } | ConvertTo-Json
    
    try {
        $deviceResponse = Invoke-RestMethod -Uri "$baseUrl/devices/upload" -Method POST -Body $deviceData -Headers $deviceHeaders
        Write-Host "✅ Device upload successful" -ForegroundColor Green
        $deviceId = $deviceResponse.data.device.id
    } catch {
        Write-Host "❌ Device upload failed: $($_.Exception.Message)" -ForegroundColor Red
        $deviceId = $null
    }
}

# Test 6: Get Nearby NGOs (if user token exists)
if ($userToken) {
    Write-Host "`n6. Testing Get Nearby NGOs..." -ForegroundColor Yellow
    $ngoHeaders = $headers.Clone()
    $ngoHeaders["Authorization"] = "Bearer $userToken"
    
    try {
        $ngosResponse = Invoke-RestMethod -Uri "$baseUrl/ngos/nearby?latitude=28.7041&longitude=77.1025&radius=10" -Method GET -Headers $ngoHeaders
        Write-Host "✅ Get nearby NGOs successful: $($ngosResponse.data.ngos.Count) NGOs found" -ForegroundColor Green
    } catch {
        Write-Host "❌ Get nearby NGOs failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 7: Schedule Pickup (if user and device exist)
if ($userToken -and $deviceId) {
    Write-Host "`n7. Testing Pickup Scheduling..." -ForegroundColor Yellow
    $pickupHeaders = $headers.Clone()
    $pickupHeaders["Authorization"] = "Bearer $userToken"
    
    $pickupData = @{
        device_ids = @($deviceId)
        pickup_date = (Get-Date).AddDays(1).ToString("yyyy-MM-dd")
        pickup_time = "10:00"
        address = "123 Test Street, Test City"
        special_instructions = "Call before arriving"
    } | ConvertTo-Json
    
    try {
        $pickupResponse = Invoke-RestMethod -Uri "$baseUrl/pickups/schedule" -Method POST -Body $pickupData -Headers $pickupHeaders
        Write-Host "✅ Pickup scheduling successful" -ForegroundColor Green
        $pickupId = $pickupResponse.data.pickup.id
    } catch {
        Write-Host "❌ Pickup scheduling failed: $($_.Exception.Message)" -ForegroundColor Red
        $pickupId = $null
    }
}

# Test 8: Admin Analytics (if admin token exists)
if ($adminToken) {
    Write-Host "`n8. Testing Admin Analytics..." -ForegroundColor Yellow
    $analyticsHeaders = $headers.Clone()
    $analyticsHeaders["Authorization"] = "Bearer $adminToken"
    
    try {
        $analyticsResponse = Invoke-RestMethod -Uri "$baseUrl/analytics/admin/overview" -Method GET -Headers $analyticsHeaders
        Write-Host "✅ Admin analytics successful" -ForegroundColor Green
        Write-Host "   - Total Users: $($analyticsResponse.data.overview.total_users)" -ForegroundColor Cyan
        Write-Host "   - Total NGOs: $($analyticsResponse.data.overview.total_ngos)" -ForegroundColor Cyan
        Write-Host "   - Total Devices: $($analyticsResponse.data.overview.total_devices)" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ Admin analytics failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 9: User Gamification Profile (if user token exists)
if ($userToken) {
    Write-Host "`n9. Testing User Gamification Profile..." -ForegroundColor Yellow
    $gamificationHeaders = $headers.Clone()
    $gamificationHeaders["Authorization"] = "Bearer $userToken"
    
    try {
        $gamificationResponse = Invoke-RestMethod -Uri "$baseUrl/gamification/profile" -Method GET -Headers $gamificationHeaders
        Write-Host "✅ User gamification profile successful" -ForegroundColor Green
        Write-Host "   - Points: $($gamificationResponse.data.profile.points)" -ForegroundColor Cyan
        Write-Host "   - Level: $($gamificationResponse.data.profile.level)" -ForegroundColor Cyan
        Write-Host "   - Ranking: $($gamificationResponse.data.profile.ranking)/$($gamificationResponse.data.profile.total_users)" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ User gamification profile failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 10: Get Leaderboard
if ($userToken) {
    Write-Host "`n10. Testing Leaderboard..." -ForegroundColor Yellow
    $leaderboardHeaders = $headers.Clone()
    $leaderboardHeaders["Authorization"] = "Bearer $userToken"
    
    try {
        $leaderboardResponse = Invoke-RestMethod -Uri "$baseUrl/gamification/leaderboard?limit=5" -Method GET -Headers $leaderboardHeaders
        Write-Host "✅ Leaderboard successful: $($leaderboardResponse.data.leaderboard.Count) users" -ForegroundColor Green
    } catch {
        Write-Host "❌ Leaderboard failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 11: NGO Dashboard (if NGO token exists)
if ($ngoToken) {
    Write-Host "`n11. Testing NGO Dashboard..." -ForegroundColor Yellow
    $ngoDashboardHeaders = $headers.Clone()
    $ngoDashboardHeaders["Authorization"] = "Bearer $ngoToken"
    
    try {
        $ngoDashboardResponse = Invoke-RestMethod -Uri "$baseUrl/analytics/ngo/overview" -Method GET -Headers $ngoDashboardHeaders
        Write-Host "✅ NGO dashboard successful" -ForegroundColor Green
    } catch {
        Write-Host "❌ NGO dashboard failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 12: Public Global Statistics
Write-Host "`n12. Testing Public Global Statistics..." -ForegroundColor Yellow
try {
    $globalResponse = Invoke-RestMethod -Uri "$baseUrl/analytics/public/global" -Method GET
    Write-Host "✅ Public global statistics successful" -ForegroundColor Green
    Write-Host "   - Total Users: $($globalResponse.data.total_users)" -ForegroundColor Cyan
    Write-Host "   - Verified NGOs: $($globalResponse.data.verified_ngos)" -ForegroundColor Cyan
    Write-Host "   - Total Devices: $($globalResponse.data.total_devices)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Public global statistics failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🏁 API Testing Complete!" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green

# Summary
Write-Host "`n📊 Test Summary:" -ForegroundColor Magenta
Write-Host "• Health check, user/NGO registration, and admin login tested" -ForegroundColor White
Write-Host "• Device upload and nearby NGO search tested" -ForegroundColor White
Write-Host "• Pickup scheduling functionality tested" -ForegroundColor White
Write-Host "• Analytics endpoints for admin, NGO, and public tested" -ForegroundColor White
Write-Host "• Gamification system including profile and leaderboard tested" -ForegroundColor White

Write-Host "`n💡 Next Steps:" -ForegroundColor Magenta
Write-Host "• Test file uploads using multipart form data" -ForegroundColor White
Write-Host "• Test badge earning and challenge completion" -ForegroundColor White
Write-Host "• Test pickup status updates and rating system" -ForegroundColor White
Write-Host "• Test admin NGO verification workflow" -ForegroundColor White
Write-Host "• Test error handling and edge cases" -ForegroundColor White