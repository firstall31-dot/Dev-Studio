import type { SkillAreaData, ServiceIntegration } from "../../types/skills";
import { Server } from "lucide-react";

const nodeServices: ServiceIntegration[] = [
  {
    id: "nd-passport",
    name: "Passport.js",
    category: "auth",
    description: "Flexible authentication middleware for Node.js. Supports 500+ strategies including local, Google, GitHub, JWT, and more.",
    docsUrl: "https://www.passportjs.org/docs/",
    packageName: "passport passport-local passport-jwt",
    badge: "Popular",
    snippet: {
      lang: "typescript",
      install: "npm install passport passport-local passport-jwt jsonwebtoken",
      code: `import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

// Local strategy (email + password)
passport.use(new LocalStrategy({ usernameField: 'email' },
  async (email, password, done) => {
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.hash))
      return done(null, false, { message: 'Invalid credentials' });
    return done(null, user);
  }
));

// JWT strategy (Bearer token)
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET!,
}, async (payload, done) => {
  const user = await User.findById(payload.sub);
  return user ? done(null, user) : done(null, false);
}));

// Protect a route
app.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json(req.user);
});`,
    },
  },
  {
    id: "nd-clerk",
    name: "Clerk",
    category: "auth",
    description: "Drop-in auth with pre-built UI components. Handles users, sessions, MFA, social login, and organisations out of the box.",
    docsUrl: "https://clerk.com/docs/quickstarts/express",
    packageName: "@clerk/express",
    badge: "Recommended",
    snippet: {
      lang: "typescript",
      install: "npm install @clerk/express",
      code: `import { clerkMiddleware, requireAuth, getAuth } from '@clerk/express';

app.use(clerkMiddleware()); // injects auth state on every request

// Protect a route
app.get('/dashboard', requireAuth(), (req, res) => {
  const { userId } = getAuth(req);
  res.json({ userId });
});

// Webhook to sync users to your DB
app.post('/webhooks/clerk', express.raw({ type: 'application/json' }), async (req, res) => {
  const event = await verifyClerkWebhook(req);
  if (event.type === 'user.created') {
    await db.users.create({ clerkId: event.data.id, email: event.data.email_addresses[0].email_address });
  }
  res.json({ received: true });
});`,
    },
  },
  {
    id: "nd-auth0",
    name: "Auth0",
    category: "auth",
    description: "Enterprise-grade identity platform. Social login, SSO, MFA, anomaly detection, and compliance features built in.",
    docsUrl: "https://auth0.com/docs/quickstart/backend/nodejs",
    packageName: "express-openid-connect jwks-rsa",
    snippet: {
      lang: "typescript",
      install: "npm install express-openid-connect jwks-rsa jsonwebtoken",
      code: `import { auth, requiresAuth } from 'express-openid-connect';

app.use(auth({
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
}));

// Protect routes
app.get('/profile', requiresAuth(), (req, res) => {
  res.json(req.oidc.user);
});

app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});`,
    },
  },
  {
    id: "nd-stripe",
    name: "Stripe",
    category: "payment",
    description: "Full-featured payments API. Subscriptions, one-time charges, invoices, Connect marketplace payments, and webhook handling.",
    docsUrl: "https://stripe.com/docs/api?lang=node",
    packageName: "stripe",
    badge: "Popular",
    snippet: {
      lang: "typescript",
      install: "npm install stripe",
      code: `import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Create a checkout session
app.post('/create-checkout', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price: req.body.priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: \`\${process.env.FRONTEND_URL}/success?session={CHECKOUT_SESSION_ID}\`,
    cancel_url: \`\${process.env.FRONTEND_URL}/cancel\`,
  });
  res.json({ url: session.url });
});

// Webhook — verify signature before trusting payload
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), (req, res) => {
  const event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature']!, process.env.STRIPE_WEBHOOK_SECRET!);
  if (event.type === 'customer.subscription.updated') { /* handle */ }
  res.json({ received: true });
});`,
    },
  },
  {
    id: "nd-resend",
    name: "Resend",
    category: "email",
    description: "Developer-first transactional email API. React email templates, open/click tracking, and high deliverability.",
    docsUrl: "https://resend.com/docs/send-with-nodejs",
    packageName: "resend",
    badge: "Recommended",
    snippet: {
      lang: "typescript",
      install: "npm install resend",
      code: `import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

// Send a transactional email
await resend.emails.send({
  from: 'no-reply@yourdomain.com',
  to: user.email,
  subject: 'Welcome to the app!',
  html: '<h1>Welcome!</h1><p>Thanks for signing up.</p>',
});

// With React Email template
import { render } from '@react-email/render';
import WelcomeEmail from './emails/welcome';

const html = render(<WelcomeEmail username={user.name} />);
await resend.emails.send({ from, to, subject, html });`,
    },
  },
  {
    id: "nd-nodemailer",
    name: "Nodemailer",
    category: "email",
    description: "The classic Node.js SMTP email library. Works with Gmail, Outlook, Mailgun, SendGrid SMTP, and any SMTP server.",
    docsUrl: "https://nodemailer.com/about/",
    packageName: "nodemailer @types/nodemailer",
    badge: "Popular",
    snippet: {
      lang: "typescript",
      install: "npm install nodemailer",
      code: `import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

await transporter.sendMail({
  from: '"My App" <no-reply@myapp.com>',
  to: 'user@example.com',
  subject: 'Password Reset',
  html: '<p>Click <a href="...">here</a> to reset your password.</p>',
});`,
    },
  },
  {
    id: "nd-bullmq",
    name: "BullMQ",
    category: "queue",
    description: "Production-ready job queue backed by Redis. Delayed jobs, retries, priority, rate limiting, and real-time dashboard.",
    docsUrl: "https://docs.bullmq.io/",
    packageName: "bullmq ioredis",
    badge: "Recommended",
    snippet: {
      lang: "typescript",
      install: "npm install bullmq ioredis",
      code: `import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';

const connection = new Redis(process.env.REDIS_URL!);

// Producer — add jobs from your API routes
const emailQueue = new Queue('emails', { connection });

app.post('/register', async (req, res) => {
  const user = await createUser(req.body);
  await emailQueue.add('welcome', { userId: user.id, email: user.email }, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
  });
  res.json({ user });
});

// Worker — process in a separate process
new Worker('emails', async (job) => {
  if (job.name === 'welcome') {
    await sendWelcomeEmail(job.data.email);
  }
}, { connection });`,
    },
  },
  {
    id: "nd-redis",
    name: "ioredis (Cache)",
    category: "cache",
    description: "Robust Redis client for Node.js. Caching, sessions, pub/sub, rate limiting, and distributed locks.",
    docsUrl: "https://github.com/redis/ioredis",
    packageName: "ioredis",
    badge: "Popular",
    snippet: {
      lang: "typescript",
      install: "npm install ioredis",
      code: `import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL!);

// Cache-aside pattern
async function getCachedUser(userId: string) {
  const cached = await redis.get(\`user:\${userId}\`);
  if (cached) return JSON.parse(cached);

  const user = await db.users.findById(userId);
  await redis.setex(\`user:\${userId}\`, 300, JSON.stringify(user)); // TTL 5 min
  return user;
}

// Rate limiting
async function checkRateLimit(ip: string) {
  const key = \`rl:\${ip}\`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, 60); // 1-min window
  return count <= 100; // 100 req/min
}`,
    },
  },
  {
    id: "nd-s3",
    name: "AWS S3 / Cloudflare R2",
    category: "storage",
    description: "Object storage for user uploads, media, and files. Use aws-sdk v3 — works with S3-compatible providers like R2 and MinIO.",
    docsUrl: "https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/",
    packageName: "@aws-sdk/client-s3 @aws-sdk/s3-request-presigner",
    snippet: {
      lang: "typescript",
      install: "npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner multer",
      code: `import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID!, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY! },
});

// Generate a presigned upload URL (client uploads directly to S3)
app.post('/uploads/presign', requireAuth(), async (req, res) => {
  const key = \`uploads/\${req.user.id}/\${Date.now()}-\${req.body.filename}\`;
  const url = await getSignedUrl(s3, new PutObjectCommand({
    Bucket: process.env.S3_BUCKET!, Key: key, ContentType: req.body.contentType,
  }), { expiresIn: 300 });
  res.json({ url, key });
});`,
    },
  },
  {
    id: "nd-socketio",
    name: "Socket.io",
    category: "realtime",
    description: "Bidirectional, event-based real-time communication. Rooms, namespaces, auto-reconnect, and Redis adapter for multi-server scaling.",
    docsUrl: "https://socket.io/docs/v4/",
    packageName: "socket.io",
    badge: "Popular",
    snippet: {
      lang: "typescript",
      install: "npm install socket.io",
      code: `import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.FRONTEND_URL, credentials: true },
});

io.use((socket, next) => {
  // Auth middleware — verify JWT from handshake
  const token = socket.handshake.auth.token;
  try {
    socket.data.user = jwt.verify(token, process.env.JWT_SECRET!);
    next();
  } catch { next(new Error('Unauthorized')); }
});

io.on('connection', (socket) => {
  socket.join(\`user:\${socket.data.user.id}\`);

  socket.on('message:send', async (data) => {
    const msg = await saveMessage(data);
    io.to(\`room:\${data.roomId}\`).emit('message:new', msg);
  });
});

// Send to a user from a REST route
app.post('/notify', (req, res) => {
  io.to(\`user:\${req.body.userId}\`).emit('notification', req.body.payload);
  res.json({ ok: true });
});`,
    },
  },
];

const aspnetServices: ServiceIntegration[] = [
  {
    id: "as-identity",
    name: "ASP.NET Identity",
    category: "auth",
    description: "Microsoft's built-in membership system. User management, roles, claims, password hashing, and email confirmation out of the box.",
    docsUrl: "https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity",
    packageName: "Microsoft.AspNetCore.Identity.EntityFrameworkCore",
    badge: "Official",
    snippet: {
      lang: "csharp",
      install: "dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore",
      code: `// Program.cs
builder.Services.AddDbContext<AppDbContext>(o => o.UseSqlServer(connectionString));
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options => {
    options.Password.RequiredLength = 8;
    options.SignIn.RequireConfirmedEmail = true;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters {
            ValidateIssuer = true, ValidateAudience = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

// In a controller
[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginDto dto) {
    var user = await _userManager.FindByEmailAsync(dto.Email);
    if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
        return Unauthorized();
    var token = GenerateJwtToken(user);
    return Ok(new { token });
}`,
    },
  },
  {
    id: "as-duende",
    name: "Duende IdentityServer",
    category: "auth",
    description: "OpenID Connect and OAuth 2.0 framework for ASP.NET Core. SSO, API protection, token management, and BFF pattern.",
    docsUrl: "https://docs.duendesoftware.com/identityserver/v7",
    packageName: "Duende.IdentityServer",
    badge: "Recommended",
    snippet: {
      lang: "csharp",
      install: "dotnet add package Duende.IdentityServer",
      code: `// Program.cs — minimal IdentityServer setup
builder.Services.AddIdentityServer(options => {
    options.Events.RaiseErrorEvents = true;
    options.Events.RaiseSuccessEvents = true;
})
.AddInMemoryClients(Config.Clients)
.AddInMemoryApiScopes(Config.ApiScopes)
.AddInMemoryIdentityResources(Config.IdentityResources)
.AddAspNetIdentity<ApplicationUser>();

// Config.cs
public static IEnumerable<Client> Clients => new[] {
    new Client {
        ClientId = "spa",
        AllowedGrantTypes = GrantTypes.Code,
        RedirectUris = { "https://app.example.com/callback" },
        AllowedScopes = { "openid", "profile", "api" },
        RequirePkce = true,
        RequireClientSecret = false,
    }
};`,
    },
  },
  {
    id: "as-stripe",
    name: "Stripe.NET",
    category: "payment",
    description: "Official Stripe SDK for .NET. Strongly-typed API for charges, subscriptions, invoices, and webhook processing.",
    docsUrl: "https://stripe.com/docs/api?lang=dotnet",
    packageName: "Stripe.net",
    badge: "Popular",
    snippet: {
      lang: "csharp",
      install: "dotnet add package Stripe.net",
      code: `// Program.cs
StripeConfiguration.ApiKey = builder.Configuration["Stripe:SecretKey"];

// Create checkout session
[HttpPost("create-checkout")]
public async Task<IActionResult> CreateCheckout([FromBody] CheckoutDto dto) {
    var options = new SessionCreateOptions {
        PaymentMethodTypes = new List<string> { "card" },
        LineItems = new List<SessionLineItemOptions> {
            new() { Price = dto.PriceId, Quantity = 1 }
        },
        Mode = "subscription",
        SuccessUrl = $"{_config["FrontendUrl"]}/success",
        CancelUrl = $"{_config["FrontendUrl"]}/cancel",
    };
    var service = new SessionService();
    var session = await service.CreateAsync(options);
    return Ok(new { url = session.Url });
}

// Webhook
[HttpPost("webhooks/stripe")]
public async Task<IActionResult> StripeWebhook() {
    var json = await new StreamReader(Request.Body).ReadToEndAsync();
    var stripeEvent = EventUtility.ConstructEvent(json,
        Request.Headers["Stripe-Signature"], _config["Stripe:WebhookSecret"]);
    if (stripeEvent.Type == "customer.subscription.updated") { /* handle */ }
    return Ok();
}`,
    },
  },
  {
    id: "as-mailkit",
    name: "MailKit",
    category: "email",
    description: "The go-to SMTP/IMAP client for .NET. Supports SMTP, DKIM signing, HTML emails, and is fully async.",
    docsUrl: "https://github.com/jstedfast/MailKit",
    packageName: "MailKit",
    badge: "Popular",
    snippet: {
      lang: "csharp",
      install: "dotnet add package MailKit MimeKit",
      code: `using MimeKit;
using MailKit.Net.Smtp;

public class EmailService {
    public async Task SendAsync(string to, string subject, string htmlBody) {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("My App", "no-reply@myapp.com"));
        message.To.Add(MailboxAddress.Parse(to));
        message.Subject = subject;
        message.Body = new BodyBuilder { HtmlBody = htmlBody }.ToMessageBody();

        using var client = new SmtpClient();
        await client.ConnectAsync(_config["Smtp:Host"], 587, SecureSocketOptions.StartTls);
        await client.AuthenticateAsync(_config["Smtp:User"], _config["Smtp:Pass"]);
        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }
}`,
    },
  },
  {
    id: "as-redis",
    name: "StackExchange.Redis",
    category: "cache",
    description: "High-performance Redis client for .NET. Distributed caching, sessions, pub/sub, and IDistributedCache integration.",
    docsUrl: "https://stackexchange.github.io/StackExchange.Redis/",
    packageName: "StackExchange.Redis Microsoft.Extensions.Caching.StackExchangeRedis",
    snippet: {
      lang: "csharp",
      install: "dotnet add package StackExchange.Redis Microsoft.Extensions.Caching.StackExchangeRedis",
      code: `// Program.cs — adds IDistributedCache backed by Redis
builder.Services.AddStackExchangeRedisCache(options => {
    options.Configuration = builder.Configuration.GetConnectionString("Redis");
    options.InstanceName = "myapp:";
});

// Usage via IDistributedCache
public class UserService(IDistributedCache cache) {
    public async Task<User?> GetUserAsync(string id) {
        var cached = await cache.GetStringAsync($"user:{id}");
        if (cached != null) return JsonSerializer.Deserialize<User>(cached);

        var user = await _db.Users.FindAsync(id);
        if (user != null) await cache.SetStringAsync($"user:{id}",
            JsonSerializer.Serialize(user),
            new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5) });
        return user;
    }
}`,
    },
  },
  {
    id: "as-hangfire",
    name: "Hangfire",
    category: "queue",
    description: "Background job processing for .NET. Fire-and-forget, delayed, recurring, and continuations. Dashboard included.",
    docsUrl: "https://docs.hangfire.io/en/latest/",
    packageName: "Hangfire.Core Hangfire.SqlServer",
    badge: "Popular",
    snippet: {
      lang: "csharp",
      install: "dotnet add package Hangfire.Core Hangfire.SqlServer Hangfire.AspNetCore",
      code: `// Program.cs
builder.Services.AddHangfire(cfg => cfg
    .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UseSqlServerStorage(connectionString));
builder.Services.AddHangfireServer();

app.UseHangfireDashboard("/hangfire"); // protect this in prod!

// Enqueue a fire-and-forget job
BackgroundJob.Enqueue<IEmailService>(s => s.SendWelcomeEmailAsync(userId));

// Recurring job (cron)
RecurringJob.AddOrUpdate<IReportService>("daily-report",
    s => s.GenerateDailyReportAsync(), Cron.Daily);`,
    },
  },
  {
    id: "as-azure-blob",
    name: "Azure Blob Storage",
    category: "storage",
    description: "Microsoft's object storage for unstructured data. SDKs for upload, download, SAS tokens, and lifecycle management.",
    docsUrl: "https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction",
    packageName: "Azure.Storage.Blobs",
    snippet: {
      lang: "csharp",
      install: "dotnet add package Azure.Storage.Blobs",
      code: `using Azure.Storage.Blobs;
using Azure.Storage.Sas;

public class BlobStorageService(IConfiguration config) {
    private readonly BlobServiceClient _client = new(config["Azure:StorageConnection"]);

    public async Task<string> UploadAsync(Stream fileStream, string containerName, string blobName) {
        var container = _client.GetBlobContainerClient(containerName);
        await container.CreateIfNotExistsAsync();
        var blob = container.GetBlobClient(blobName);
        await blob.UploadAsync(fileStream, overwrite: true);
        return blob.Uri.ToString();
    }

    public Uri GenerateSasUrl(string containerName, string blobName, int expiryMinutes = 60) {
        var blob = _client.GetBlobContainerClient(containerName).GetBlobClient(blobName);
        return blob.GenerateSasUri(BlobSasPermissions.Read,
            DateTimeOffset.UtcNow.AddMinutes(expiryMinutes));
    }
}`,
    },
  },
  {
    id: "as-signalr",
    name: "SignalR",
    category: "realtime",
    description: "Real-time web functionality for ASP.NET Core. WebSockets with automatic fallback, hubs, groups, and Azure SignalR Service for scaling.",
    docsUrl: "https://learn.microsoft.com/en-us/aspnet/core/signalr/introduction",
    packageName: "Microsoft.AspNetCore.SignalR",
    badge: "Official",
    snippet: {
      lang: "csharp",
      install: "# Built into ASP.NET Core — no extra package needed",
      code: `// Define a Hub
public class ChatHub : Hub {
    public async Task SendMessage(string roomId, string message) {
        var msg = new { User = Context.User?.Identity?.Name, Text = message, Time = DateTime.UtcNow };
        await Clients.Group(roomId).SendAsync("ReceiveMessage", msg);
    }
    public async Task JoinRoom(string roomId) => await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
}

// Program.cs
builder.Services.AddSignalR();
app.MapHub<ChatHub>("/hubs/chat");

// Send from a controller/service
public class NotificationService(IHubContext<ChatHub> hub) {
    public async Task NotifyUserAsync(string userId, object payload) =>
        await hub.Clients.User(userId).SendAsync("Notification", payload);
}`,
    },
  },
];

const phpServices: ServiceIntegration[] = [
  {
    id: "ph-sanctum",
    name: "Laravel Sanctum",
    category: "auth",
    description: "Lightweight API token authentication for SPAs and mobile apps. Cookie-based sessions for SPAs, token-based for APIs.",
    docsUrl: "https://laravel.com/docs/sanctum",
    packageName: "laravel/sanctum",
    badge: "Official",
    snippet: {
      lang: "php",
      install: "composer require laravel/sanctum && php artisan vendor:publish --provider=\"Laravel\\Sanctum\\SanctumServiceProvider\"",
      code: `// User model
use Laravel\\Sanctum\\HasApiTokens;

class User extends Authenticatable {
    use HasApiTokens, HasFactory, Notifiable;
}

// routes/api.php
Route::post('/login', function (Request $request) {
    if (!Auth::attempt($request->only('email', 'password'))) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }
    $token = Auth::user()->createToken('api-token', ['read', 'write']);
    return response()->json(['token' => $token->plainTextToken]);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->delete('/logout', function (Request $request) {
    $request->user()->currentAccessToken()->delete();
    return response()->json(['message' => 'Logged out']);
});`,
    },
  },
  {
    id: "ph-passport",
    name: "Laravel Passport",
    category: "auth",
    description: "Full OAuth2 server for Laravel. Authorization codes, client credentials, password grant, and personal access tokens.",
    docsUrl: "https://laravel.com/docs/passport",
    packageName: "laravel/passport",
    snippet: {
      lang: "php",
      install: "composer require laravel/passport && php artisan passport:install",
      code: `// User model
use Laravel\\Passport\\HasApiTokens;

class User extends Authenticatable {
    use HasApiTokens;
}

// config/auth.php — set guard driver to 'passport'
'api' => ['driver' => 'passport', 'provider' => 'users'],

// Issue a personal token (e.g. for testing)
$token = $user->createToken('Personal Access Token')->accessToken;

// Client Credentials grant (machine-to-machine)
// POST /oauth/token with grant_type=client_credentials
// Protect routes: middleware('client')`,
    },
  },
  {
    id: "ph-cashier",
    name: "Laravel Cashier (Stripe)",
    category: "payment",
    description: "Expressive billing interface for Stripe. Subscriptions, invoices, proration, trial periods, and coupon handling.",
    docsUrl: "https://laravel.com/docs/billing",
    packageName: "laravel/cashier",
    badge: "Official",
    snippet: {
      lang: "php",
      install: "composer require laravel/cashier && php artisan migrate",
      code: `// User model
use Laravel\\Cashier\\Billable;

class User extends Authenticatable {
    use Billable;
}

// Subscribe a user
$user->newSubscription('default', 'price_monthly')
     ->trialDays(14)
     ->create($paymentMethodId);

// Check subscription status
if ($user->subscribed('default')) { /* access granted */ }
if ($user->subscription('default')->onTrial()) { /* on trial */ }

// One-time charge
$user->charge(1999, $paymentMethodId); // $19.99

// Generate billing portal URL
$url = $user->billingPortalUrl(route('dashboard'));
return redirect($url);`,
    },
  },
  {
    id: "ph-mail",
    name: "Laravel Mail",
    category: "email",
    description: "Elegant email API with Mailable classes. Works with SMTP, Mailgun, Postmark, SES, Resend, and more drivers.",
    docsUrl: "https://laravel.com/docs/mail",
    packageName: "Built-in",
    badge: "Official",
    snippet: {
      lang: "php",
      install: "# Built into Laravel — configure .env: MAIL_MAILER=resend RESEND_API_KEY=...",
      code: `// Create a Mailable
// php artisan make:mail WelcomeMail

class WelcomeMail extends Mailable {
    use Queueable, SerializesModels;

    public function __construct(public User $user) {}

    public function envelope(): Envelope {
        return new Envelope(subject: 'Welcome to the App!');
    }

    public function content(): Content {
        return new Content(view: 'emails.welcome'); // resources/views/emails/welcome.blade.php
    }
}

// Send immediately
Mail::to($user->email)->send(new WelcomeMail($user));

// Send via queue (recommended for production)
Mail::to($user->email)->queue(new WelcomeMail($user));`,
    },
  },
  {
    id: "ph-horizon",
    name: "Laravel Horizon",
    category: "queue",
    description: "Beautiful dashboard and configuration for Redis queues. Monitors jobs, failures, throughput, and runtime — all in real time.",
    docsUrl: "https://laravel.com/docs/horizon",
    packageName: "laravel/horizon",
    badge: "Recommended",
    snippet: {
      lang: "php",
      install: "composer require laravel/horizon && php artisan horizon:install",
      code: `// Create a Job
// php artisan make:job ProcessOrder

class ProcessOrder implements ShouldQueue {
    use Queueable;

    public function __construct(public Order $order) {}

    public function handle(PaymentService $payments): void {
        $payments->charge($this->order);
        $this->order->update(['status' => 'processed']);
    }

    public function failed(Throwable $e): void {
        // Notify team or log failure
        Log::error('Order processing failed', ['order' => $this->order->id, 'error' => $e->getMessage()]);
    }
}

// Dispatch from controller
ProcessOrder::dispatch($order)->onQueue('orders');

// Start Horizon (replaces php artisan queue:work in production)
// php artisan horizon`,
    },
  },
  {
    id: "ph-spatie",
    name: "Spatie Permission",
    category: "auth",
    description: "Role and permission management for Laravel. Assign roles/permissions to users, use gates, and cache for performance.",
    docsUrl: "https://spatie.be/docs/laravel-permission",
    packageName: "spatie/laravel-permission",
    badge: "Popular",
    snippet: {
      lang: "php",
      install: "composer require spatie/laravel-permission && php artisan migrate",
      code: `// User model
use Spatie\\Permission\\Traits\\HasRoles;

class User extends Authenticatable {
    use HasRoles;
}

// Create roles and permissions
Role::create(['name' => 'admin']);
Permission::create(['name' => 'publish articles']);

// Assign to user
$user->assignRole('admin');
$user->givePermissionTo('publish articles');

// Check in code
if ($user->hasRole('admin')) { /* ... */ }
if ($user->can('publish articles')) { /* ... */ }

// Protect routes
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::resource('admin/posts', AdminPostController::class);
});`,
    },
  },
  {
    id: "ph-redis",
    name: "Laravel Cache (Redis)",
    category: "cache",
    description: "Laravel's unified cache layer with Redis driver. Tags, TTL, atomic locks, and cache busting built in.",
    docsUrl: "https://laravel.com/docs/cache",
    packageName: "predis/predis",
    snippet: {
      lang: "php",
      install: "composer require predis/predis # and set CACHE_DRIVER=redis in .env",
      code: `// Remember pattern — fetch or store
$user = Cache::remember("user:{$id}", now()->addMinutes(5), fn() => User::find($id));

// Store with tags (allows group invalidation)
Cache::tags(['users', "user:{$id}"])->put("user:{$id}:profile", $profile, 300);
Cache::tags(['users'])->flush(); // invalidate all user caches

// Atomic lock — prevent race conditions
$lock = Cache::lock('payment:' . $orderId, 10); // 10s TTL
if ($lock->get()) {
    try { processPayment($order); }
    finally { $lock->release(); }
}

// Rate limiting
if (RateLimiter::tooManyAttempts("login:{$ip}", 5)) {
    return response()->json(['error' => 'Too many attempts'], 429);
}
RateLimiter::hit("login:{$ip}", 60);`,
    },
  },
  {
    id: "ph-s3",
    name: "Laravel Storage (S3)",
    category: "storage",
    description: "Laravel's filesystem abstraction. Local, S3, DigitalOcean Spaces, and any Flysystem adapter — same API for all.",
    docsUrl: "https://laravel.com/docs/filesystem",
    packageName: "league/flysystem-aws-s3-v3",
    snippet: {
      lang: "php",
      install: "composer require league/flysystem-aws-s3-v3",
      code: `// .env: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_DEFAULT_REGION, AWS_BUCKET

// Store file
$path = Storage::disk('s3')->put('uploads', $request->file('avatar'));

// Store with custom name
$path = Storage::disk('s3')->putFileAs('avatars', $file, "{$user->id}.jpg");

// Generate temporary URL
$url = Storage::disk('s3')->temporaryUrl($path, now()->addMinutes(30));

// Controller example
public function upload(Request $request) {
    $request->validate(['file' => 'required|file|max:10240']);
    $path = Storage::disk('s3')->put('uploads/' . Auth::id(), $request->file('file'));
    return response()->json(['path' => $path, 'url' => Storage::disk('s3')->url($path)]);
}`,
    },
  },
];

const pythonServices: ServiceIntegration[] = [
  {
    id: "py-fastapi-auth",
    name: "FastAPI OAuth2 + JWT",
    category: "auth",
    description: "FastAPI's built-in OAuth2 password flow with JWT tokens. Dependency-injected current user, token refresh, and scopes.",
    docsUrl: "https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/",
    packageName: "python-jose[cryptography] passlib[bcrypt]",
    badge: "Official",
    snippet: {
      lang: "python",
      install: "pip install python-jose[cryptography] passlib[bcrypt] python-multipart",
      code: `from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=30)):
    payload = {**data, "exp": datetime.utcnow() + expires_delta}
    return jwt.encode(payload, settings.JWT_SECRET, algorithm="HS256")

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        user = await db.get(User, payload["sub"])
        if not user: raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/token")
async def login(form: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    user = await authenticate_user(db, form.username, form.password)
    if not user: raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": create_access_token({"sub": str(user.id)}), "token_type": "bearer"}`,
    },
  },
  {
    id: "py-stripe",
    name: "stripe-python",
    category: "payment",
    description: "Official Stripe SDK for Python. Subscriptions, one-time charges, webhooks, and async support with httpx.",
    docsUrl: "https://stripe.com/docs/api?lang=python",
    packageName: "stripe",
    snippet: {
      lang: "python",
      install: "pip install stripe",
      code: `import stripe
from fastapi import APIRouter, Request, Header

stripe.api_key = settings.STRIPE_SECRET_KEY
router = APIRouter()

@router.post("/create-checkout")
async def create_checkout(price_id: str, current_user: User = Depends(get_current_user)):
    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=[{"price": price_id, "quantity": 1}],
        mode="subscription",
        success_url=f"{settings.FRONTEND_URL}/success",
        cancel_url=f"{settings.FRONTEND_URL}/cancel",
        customer_email=current_user.email,
    )
    return {"url": session.url}

@router.post("/webhooks/stripe")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None)):
    payload = await request.body()
    event = stripe.Webhook.construct_event(payload, stripe_signature, settings.STRIPE_WEBHOOK_SECRET)
    if event["type"] == "customer.subscription.updated":
        await handle_subscription_update(event["data"]["object"])
    return {"received": True}`,
    },
  },
  {
    id: "py-fastapi-mail",
    name: "fastapi-mail",
    category: "email",
    description: "Async email sending for FastAPI with Jinja2 templates. SMTP, STARTTLS, background tasks, and HTML/text multipart.",
    docsUrl: "https://sabuhish.github.io/fastapi-mail/",
    packageName: "fastapi-mail",
    snippet: {
      lang: "python",
      install: "pip install fastapi-mail aiosmtplib",
      code: `from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

conf = ConnectionConfig(
    MAIL_USERNAME=settings.SMTP_USER,
    MAIL_PASSWORD=settings.SMTP_PASS,
    MAIL_FROM="no-reply@myapp.com",
    MAIL_PORT=587,
    MAIL_SERVER=settings.SMTP_HOST,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
)

fm = FastMail(conf)

@router.post("/send-welcome")
async def send_welcome(user: User = Depends(get_current_user), background_tasks: BackgroundTasks = BackgroundTasks()):
    message = MessageSchema(
        subject="Welcome!",
        recipients=[user.email],
        body=f"<h1>Hi {user.name}, welcome aboard!</h1>",
        subtype="html",
    )
    background_tasks.add_task(fm.send_message, message)
    return {"message": "Email queued"}`,
    },
  },
  {
    id: "py-redis",
    name: "redis-py / aioredis",
    category: "cache",
    description: "Async Redis client for Python. Caching, pub/sub, rate limiting with async/await support built in.",
    docsUrl: "https://redis-py.readthedocs.io/en/stable/",
    packageName: "redis[asyncio]",
    snippet: {
      lang: "python",
      install: "pip install redis[asyncio]",
      code: `import redis.asyncio as redis
import json

redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)

# Cache-aside pattern
async def get_user(user_id: str, db: AsyncSession) -> User:
    cached = await redis_client.get(f"user:{user_id}")
    if cached:
        return User(**json.loads(cached))

    user = await db.get(User, user_id)
    if user:
        await redis_client.setex(f"user:{user_id}", 300, json.dumps(user.dict()))
    return user

# Rate limiter dependency
async def rate_limit(request: Request):
    key = f"rl:{request.client.host}"
    count = await redis_client.incr(key)
    if count == 1:
        await redis_client.expire(key, 60)
    if count > 100:
        raise HTTPException(status_code=429, detail="Too many requests")`,
    },
  },
  {
    id: "py-celery",
    name: "Celery + Redis",
    category: "queue",
    description: "Distributed task queue for Python. Async tasks, periodic jobs (beat), retries, and result backends.",
    docsUrl: "https://docs.celeryq.dev/en/stable/",
    packageName: "celery redis",
    badge: "Popular",
    snippet: {
      lang: "python",
      install: "pip install celery[redis]",
      code: `# celery_app.py
from celery import Celery

celery_app = Celery("myapp", broker=settings.REDIS_URL, backend=settings.REDIS_URL)
celery_app.conf.update(task_serializer="json", accept_content=["json"])

# tasks.py
from celery_app import celery_app

@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def send_welcome_email(self, user_id: str):
    try:
        user = User.objects.get(id=user_id)
        email_service.send(user.email, "Welcome!")
    except Exception as exc:
        raise self.retry(exc=exc)

# In FastAPI route — enqueue from request handler
@router.post("/register")
async def register(data: RegisterSchema, db: AsyncSession = Depends(get_db)):
    user = await create_user(db, data)
    send_welcome_email.delay(str(user.id))  # non-blocking
    return user`,
    },
  },
  {
    id: "py-s3",
    name: "boto3 / S3",
    category: "storage",
    description: "AWS SDK for Python. S3 uploads, presigned URLs, multipart, and compatible with R2, MinIO, and DigitalOcean Spaces.",
    docsUrl: "https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3.html",
    packageName: "boto3",
    snippet: {
      lang: "python",
      install: "pip install boto3",
      code: `import boto3
from botocore.exceptions import ClientError

s3 = boto3.client("s3",
    region_name=settings.AWS_REGION,
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
)

# Generate presigned upload URL (client uploads directly to S3)
@router.post("/uploads/presign")
async def presign_upload(filename: str, content_type: str, user: User = Depends(get_current_user)):
    key = f"uploads/{user.id}/{filename}"
    url = s3.generate_presigned_url("put_object",
        Params={"Bucket": settings.S3_BUCKET, "Key": key, "ContentType": content_type},
        ExpiresIn=300)
    return {"url": url, "key": key}

# Direct upload (small files)
@router.post("/uploads")
async def upload_file(file: UploadFile, user: User = Depends(get_current_user)):
    key = f"uploads/{user.id}/{file.filename}"
    s3.upload_fileobj(file.file, settings.S3_BUCKET, key)
    return {"key": key}`,
    },
  },
];

const goServices: ServiceIntegration[] = [
  {
    id: "go-jwt",
    name: "golang-jwt",
    category: "auth",
    description: "Widely-used Go JWT library. Sign, parse, and validate JWT tokens with HMAC, RSA, and ECDSA algorithms.",
    docsUrl: "https://github.com/golang-jwt/jwt",
    packageName: "github.com/golang-jwt/jwt/v5",
    badge: "Popular",
    snippet: {
      lang: "go",
      install: "go get github.com/golang-jwt/jwt/v5",
      code: `package auth

import (
    "github.com/golang-jwt/jwt/v5"
    "net/http"
    "strings"
    "time"
)

type Claims struct {
    UserID string \`json:"sub"\`
    jwt.RegisteredClaims
}

func CreateToken(userID string, secret []byte) (string, error) {
    claims := Claims{
        UserID: userID,
        RegisteredClaims: jwt.RegisteredClaims{
            ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
            IssuedAt:  jwt.NewNumericDate(time.Now()),
        },
    }
    return jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString(secret)
}

// Middleware — extract and validate JWT from Authorization header
func JWTMiddleware(secret []byte, next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        token := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer ")
        claims := &Claims{}
        if _, err := jwt.ParseWithClaims(token, claims, func(t *jwt.Token) (interface{}, error) {
            return secret, nil
        }); err != nil {
            http.Error(w, "Unauthorized", http.StatusUnauthorized)
            return
        }
        ctx := context.WithValue(r.Context(), "userID", claims.UserID)
        next.ServeHTTP(w, r.WithContext(ctx))
    })
}`,
    },
  },
  {
    id: "go-stripe",
    name: "stripe-go",
    category: "payment",
    description: "Official Stripe SDK for Go. Full API coverage with strong types, pagination iterators, and webhook verification.",
    docsUrl: "https://stripe.com/docs/api?lang=go",
    packageName: "github.com/stripe/stripe-go/v79",
    snippet: {
      lang: "go",
      install: "go get github.com/stripe/stripe-go/v79",
      code: `import (
    "github.com/stripe/stripe-go/v79"
    "github.com/stripe/stripe-go/v79/checkout/session"
    "github.com/stripe/stripe-go/v79/webhook"
)

func init() { stripe.Key = os.Getenv("STRIPE_SECRET_KEY") }

func CreateCheckoutSession(priceID, email string) (*stripe.CheckoutSession, error) {
    params := &stripe.CheckoutSessionParams{
        PaymentMethodTypes: stripe.StringSlice([]string{"card"}),
        LineItems: []*stripe.CheckoutSessionLineItemParams{
            {Price: stripe.String(priceID), Quantity: stripe.Int64(1)},
        },
        Mode:          stripe.String(string(stripe.CheckoutSessionModeSubscription)),
        SuccessURL:    stripe.String(os.Getenv("FRONTEND_URL") + "/success"),
        CancelURL:     stripe.String(os.Getenv("FRONTEND_URL") + "/cancel"),
        CustomerEmail: stripe.String(email),
    }
    return session.New(params)
}

func HandleStripeWebhook(w http.ResponseWriter, r *http.Request) {
    payload, _ := io.ReadAll(r.Body)
    event, err := webhook.ConstructEvent(payload, r.Header.Get("Stripe-Signature"), os.Getenv("STRIPE_WEBHOOK_SECRET"))
    if err != nil { w.WriteHeader(http.StatusBadRequest); return }
    if event.Type == "customer.subscription.updated" { /* handle */ }
    w.WriteHeader(http.StatusOK)
}`,
    },
  },
  {
    id: "go-mail",
    name: "gomail",
    category: "email",
    description: "Simple and efficient email library for Go. SMTP, HTML/text, attachments, and headers — no extra dependencies.",
    docsUrl: "https://github.com/go-gomail/gomail",
    packageName: "gopkg.in/gomail.v2",
    snippet: {
      lang: "go",
      install: "go get gopkg.in/gomail.v2",
      code: `import (
    "gopkg.in/gomail.v2"
    "crypto/tls"
)

type Mailer struct { dialer *gomail.Dialer }

func NewMailer(host string, port int, user, pass string) *Mailer {
    d := gomail.NewDialer(host, port, user, pass)
    d.TLSConfig = &tls.Config{InsecureSkipVerify: false}
    return &Mailer{dialer: d}
}

func (m *Mailer) Send(to, subject, htmlBody string) error {
    msg := gomail.NewMessage()
    msg.SetHeader("From", "no-reply@myapp.com")
    msg.SetHeader("To", to)
    msg.SetHeader("Subject", subject)
    msg.SetBody("text/html", htmlBody)
    return m.dialer.DialAndSend(msg)
}`,
    },
  },
  {
    id: "go-redis",
    name: "go-redis",
    category: "cache",
    description: "Type-safe Redis client for Go. Pipelining, pub/sub, Cluster, Sentinel, and full context support.",
    docsUrl: "https://redis.uptrace.dev/",
    packageName: "github.com/redis/go-redis/v9",
    badge: "Popular",
    snippet: {
      lang: "go",
      install: "go get github.com/redis/go-redis/v9",
      code: `import "github.com/redis/go-redis/v9"

var rdb = redis.NewClient(&redis.Options{Addr: os.Getenv("REDIS_URL")})

// Cache-aside
func GetUser(ctx context.Context, id string, db *DB) (*User, error) {
    cached, err := rdb.Get(ctx, "user:"+id).Result()
    if err == nil {
        var u User
        json.Unmarshal([]byte(cached), &u)
        return &u, nil
    }
    user, err := db.FindUser(ctx, id)
    if err != nil { return nil, err }
    data, _ := json.Marshal(user)
    rdb.SetEx(ctx, "user:"+id, data, 5*time.Minute)
    return user, nil
}

// Atomic rate limiter using INCR + EXPIRE
func RateLimit(ctx context.Context, ip string, limit int) (bool, error) {
    key := "rl:" + ip
    count, err := rdb.Incr(ctx, key).Result()
    if count == 1 { rdb.Expire(ctx, key, time.Minute) }
    return count <= int64(limit), err
}`,
    },
  },
  {
    id: "go-asynq",
    name: "asynq",
    category: "queue",
    description: "Simple, reliable, and efficient distributed task queue backed by Redis. Retries, scheduling, and a web UI.",
    docsUrl: "https://github.com/hibiken/asynq",
    packageName: "github.com/hibiken/asynq",
    snippet: {
      lang: "go",
      install: "go get github.com/hibiken/asynq",
      code: `import "github.com/hibiken/asynq"

// Producer — enqueue tasks
client := asynq.NewClient(asynq.RedisClientOpt{Addr: os.Getenv("REDIS_URL")})

task, _ := asynq.NewTask("email:welcome", payload, asynq.MaxRetry(3), asynq.Timeout(30*time.Second))
client.Enqueue(task, asynq.Queue("critical"), asynq.ProcessIn(5*time.Second))

// Consumer — process tasks in a worker binary
srv := asynq.NewServer(asynq.RedisClientOpt{Addr: os.Getenv("REDIS_URL")},
    asynq.Config{Concurrency: 10, Queues: map[string]int{"critical": 6, "default": 3}})

mux := asynq.NewServeMux()
mux.HandleFunc("email:welcome", func(ctx context.Context, t *asynq.Task) error {
    var p WelcomeEmailPayload
    json.Unmarshal(t.Payload(), &p)
    return emailService.SendWelcome(ctx, p.UserID)
})
srv.Run(mux)`,
    },
  },
  {
    id: "go-minio",
    name: "MinIO / S3 (aws-sdk-go)",
    category: "storage",
    description: "S3-compatible object storage with Go SDK. Presigned URLs, multipart uploads, and bucket lifecycle — works with AWS S3, R2, and MinIO.",
    docsUrl: "https://github.com/aws/aws-sdk-go-v2",
    packageName: "github.com/aws/aws-sdk-go-v2/service/s3",
    snippet: {
      lang: "go",
      install: "go get github.com/aws/aws-sdk-go-v2/config github.com/aws/aws-sdk-go-v2/service/s3",
      code: `import (
    "github.com/aws/aws-sdk-go-v2/aws"
    "github.com/aws/aws-sdk-go-v2/config"
    "github.com/aws/aws-sdk-go-v2/service/s3"
    "github.com/aws/aws-sdk-go-v2/service/s3/presign"
)

cfg, _ := config.LoadDefaultConfig(context.TODO(), config.WithRegion(os.Getenv("AWS_REGION")))
s3Client := s3.NewFromConfig(cfg)
presignClient := presign.NewPresignClient(s3Client)

// Generate presigned upload URL (client uploads directly)
func PresignUpload(ctx context.Context, bucket, key string) (string, error) {
    req, err := presignClient.PresignPutObject(ctx, &s3.PutObjectInput{
        Bucket: aws.String(bucket), Key: aws.String(key),
    }, presign.WithPresignExpires(5*time.Minute))
    if err != nil { return "", err }
    return req.URL, nil
}`,
    },
  },
];

export const backendArea: SkillAreaData = {
  id: "backend",
  label: "Backend",
  icon: Server,
  description: "APIs, databases, authentication, and scalable architecture — choose your stack.",
  concepts: [],
  resources: [],
  checklist: [
    { id: "auth", label: "Authentication & authorization (JWT/session, RBAC)" },
    { id: "valid", label: "Input validation & sanitization on every endpoint" },
    { id: "sql", label: "Parameterized queries — no string concatenation" },
    { id: "rate", label: "Rate limiting on auth and sensitive endpoints" },
    { id: "https", label: "HTTPS enforced; security headers set" },
    { id: "logs", label: "Structured logging with correlation IDs" },
    { id: "health", label: "Health check endpoint configured" },
    { id: "migrations", label: "DB migrations versioned and reversible" },
    { id: "secrets", label: "Secrets in env vars / vault — never hardcoded" },
    { id: "timeout", label: "Request timeouts & circuit breakers on external calls" },
  ],
  subAreas: [
    {
      id: "node",
      label: "Node.js",
      color: "border-primary/40 bg-primary/10 text-primary",
      accent: "border-primary/30",
      tags: ["nodejs", "node", "express"],
      concepts: [
        {
          title: "Event Loop & Non-Blocking I/O",
          body: "Node.js is single-threaded but handles concurrency via the event loop. I/O operations (DB queries, HTTP calls) are offloaded to libuv. Never block the event loop with CPU-heavy synchronous code.",
        },
        {
          title: "Express Middleware Chain",
          body: "Middleware functions have access to (req, res, next). They execute in order — authentication, validation, business logic, error handling. Error middleware takes four args (err, req, res, next) and must be registered last.",
        },
        {
          title: "Async/Await & Error Handling",
          body: "Always await async operations and wrap in try/catch, or use an async wrapper that calls next(err). Unhandled Promise rejections will crash the process in Node.js 15+.",
        },
        {
          title: "Streams",
          body: "Node.js streams process data in chunks — essential for large files and real-time data. Readable, Writable, Transform, and Duplex streams. Use pipe() or pipeline() to chain them safely.",
        },
        {
          title: "Cluster & Worker Threads",
          body: "Node runs on a single CPU core by default. Cluster module forks worker processes to use all cores. Worker Threads handle CPU-intensive tasks without blocking the event loop.",
        },
        {
          title: "Module System (CommonJS vs ESM)",
          body: "CommonJS (require/module.exports) is the Node legacy. ESM (import/export) is the standard. Use 'type': 'module' in package.json for ESM. Mixing requires careful .cjs/.mjs extensions.",
        },
      ],
      resources: [
        {
          label: "Node.js Docs",
          url: "https://nodejs.org/en/docs",
          desc: "Official Node.js API documentation and guides.",
        },
        {
          label: "Express.js Guide",
          url: "https://expressjs.com/en/guide/routing.html",
          desc: "Official Express routing, middleware, and error handling guide.",
        },
        {
          label: "Node Best Practices",
          url: "https://github.com/goldbergyoni/nodebestpractices",
          desc: "Comprehensive Node.js production best practices repository.",
        },
        {
          label: "Fastify Docs",
          url: "https://fastify.dev/docs/latest",
          desc: "High-performance Node.js framework — alternative to Express.",
        },
      ],
      checklist: [
        { id: "nd-helmet", label: "helmet() middleware for security headers" },
        { id: "nd-cors", label: "CORS configured with explicit allowed origins" },
        { id: "nd-ratelimit", label: "Rate limiting on /auth and public endpoints" },
        { id: "nd-validate", label: "Body validation with Zod/Joi before business logic" },
        { id: "nd-errors", label: "Centralized error handler (err, req, res, next)" },
        { id: "nd-async", label: "All async route handlers wrapped in try/catch or asyncWrapper" },
        { id: "nd-env", label: "dotenv loaded at app entry; secrets never in code" },
        { id: "nd-logs", label: "Structured logging with pino/winston + request IDs" },
        { id: "nd-pool", label: "Database connection pooling (not new connection per request)" },
        { id: "nd-graceful", label: "Graceful shutdown: drain connections on SIGTERM" },
      ],
      services: nodeServices,
    },
    {
      id: "aspnet",
      label: "ASP.NET Core",
      color: "border-primary/40 bg-primary/10 text-primary",
      accent: "border-primary/30",
      tags: ["aspnet", "dotnet", "csharp"],
      concepts: [
        {
          title: "Middleware Pipeline",
          body: "ASP.NET Core processes requests through an ordered middleware pipeline configured in Program.cs. Order matters — authentication before authorization, routing before endpoints. Use Use/Run/Map to compose the pipeline.",
        },
        {
          title: "Dependency Injection (Built-in)",
          body: "ASP.NET Core has a built-in IoC container. Register services as Transient (new per request), Scoped (once per HTTP request), or Singleton (once per app lifetime). Inject via constructor parameters.",
        },
        {
          title: "Minimal APIs vs Controllers",
          body: "Minimal APIs (.NET 6+): map routes as lambda functions directly in Program.cs — great for microservices. Controllers: class-based approach with [ApiController], better for larger APIs with more structure.",
        },
        {
          title: "Entity Framework Core",
          body: "EF Core is the recommended ORM. DbContext manages the connection and tracks entities. Use migrations for schema changes. Avoid N+1 queries with Include()/ThenInclude() eager loading.",
        },
        {
          title: "Authentication & Authorization",
          body: "ASP.NET Core uses scheme-based authentication (JWT Bearer, Cookie, OAuth). [Authorize] attribute protects endpoints. Policy-based authorization decouples complex rules from controllers.",
        },
        {
          title: "Async All the Way Down",
          body: "ASP.NET Core is fully async-capable. Use async/await for all I/O-bound work. Never use .Result or .Wait() on async operations — this causes deadlocks. Use ConfigureAwait(false) in libraries.",
        },
      ],
      resources: [
        {
          label: "ASP.NET Core Docs",
          url: "https://learn.microsoft.com/en-us/aspnet/core",
          desc: "Official Microsoft documentation for ASP.NET Core.",
        },
        {
          label: "EF Core Docs",
          url: "https://learn.microsoft.com/en-us/ef/core",
          desc: "Entity Framework Core — official documentation.",
        },
        {
          label: ".NET Architecture Guides",
          url: "https://dotnet.microsoft.com/en-us/learn/dotnet/architecture-guides",
          desc: "Free e-books on microservices, DDD, and clean architecture with .NET.",
        },
        {
          label: "Andrew Lock's Blog",
          url: "https://andrewlock.net",
          desc: "Deep technical posts on ASP.NET Core internals and patterns.",
        },
      ],
      checklist: [
        { id: "as-https", label: "UseHttpsRedirection() and HSTS configured" },
        { id: "as-auth", label: "JWT Bearer or Cookie auth scheme configured correctly" },
        { id: "as-policy", label: "Authorization policies defined — no magic strings in [Authorize]" },
        { id: "as-validate", label: "Model validation with Data Annotations or FluentValidation" },
        { id: "as-ef", label: "EF Core queries use async methods (ToListAsync, FirstOrDefaultAsync)" },
        { id: "as-migrate", label: "EF Core migrations checked in and applied on startup (dev only)" },
        { id: "as-config", label: "Secrets in User Secrets (dev) / Azure Key Vault (prod)" },
        { id: "as-health", label: "MapHealthChecks() endpoint for liveness probes" },
        { id: "as-cors", label: "CORS policy explicitly configured — no AllowAnyOrigin in prod" },
        { id: "as-problem", label: "Returns RFC 7807 ProblemDetails for errors (UseExceptionHandler)" },
      ],
      services: aspnetServices,
    },
    {
      id: "php",
      label: "PHP",
      color: "border-primary/40 bg-primary/10 text-primary",
      accent: "border-primary/30",
      tags: ["php", "laravel"],
      concepts: [
        {
          title: "PHP Execution Model",
          body: "PHP is traditionally synchronous and share-nothing — each request starts a fresh process/thread. No in-memory state between requests by default. Persistent connections require FPM tuning or tools like Swoole/RoadRunner.",
        },
        {
          title: "Laravel's Service Container",
          body: "Laravel's IoC container automatically resolves class dependencies via type-hinting. Bind interfaces to implementations in AppServiceProvider. Use singleton() for shared instances, bind() for fresh instances per resolve.",
        },
        {
          title: "Eloquent ORM",
          body: "Eloquent maps database tables to Model classes. Relationships are defined as methods (hasMany, belongsTo, belongsToMany). Use eager loading (with()) to avoid N+1 queries.",
        },
        {
          title: "Artisan CLI & Migrations",
          body: "Artisan is Laravel's command-line tool for generating code, running migrations, managing queues. Migrations version-control your database schema — always prefer migrations over manual SQL changes.",
        },
        {
          title: "Queues & Jobs",
          body: "Laravel queues defer time-consuming tasks (emails, notifications, API calls) to background workers. Drivers: database, Redis, SQS. Use Horizon to monitor Redis queues in production.",
        },
        {
          title: "PHP 8+ Features",
          body: "Modern PHP includes: named arguments, match expressions, enums, fibers (coroutines), readonly properties, union types, nullsafe operator (?->). Use strict_types=1 for type safety.",
        },
      ],
      resources: [
        {
          label: "PHP Official Docs",
          url: "https://www.php.net/docs.php",
          desc: "Official PHP language reference and function documentation.",
        },
        {
          label: "Laravel Docs",
          url: "https://laravel.com/docs",
          desc: "Official Laravel documentation — the leading PHP framework.",
        },
        {
          label: "PHP: The Right Way",
          url: "https://phptherightway.com",
          desc: "Best practices, coding standards, and modern PHP patterns.",
        },
        {
          label: "Laracasts",
          url: "https://laracasts.com",
          desc: "Video tutorials on Laravel, Vue, and modern PHP development.",
        },
      ],
      checklist: [
        { id: "ph-version", label: "PHP 8.2+ with strict_types=1 in all files" },
        { id: "ph-composer", label: "Dependencies managed via Composer; composer.lock committed" },
        { id: "ph-env", label: "Secrets in .env (never committed); .env.example committed" },
        { id: "ph-prepared", label: "All DB queries use prepared statements or Eloquent ORM" },
        { id: "ph-xss", label: "User output escaped with htmlspecialchars() or Blade {{ }}" },
        { id: "ph-csrf", label: "CSRF token on all state-changing forms (@csrf in Blade)" },
        { id: "ph-validate", label: "Request validation before processing (Form Requests in Laravel)" },
        { id: "ph-queues", label: "Long-running tasks dispatched to queue (not in request cycle)" },
        { id: "ph-cache", label: "Route and config cached in production (php artisan optimize)" },
        { id: "ph-logs", label: "Structured logging via Monolog (Laravel Log facade)" },
      ],
      services: phpServices,
    },
    {
      id: "python",
      label: "Python/FastAPI",
      color: "border-primary/40 bg-primary/10 text-primary",
      accent: "border-primary/30",
      tags: ["python", "fastapi", "django"],
      concepts: [
        {
          title: "FastAPI Core Concepts",
          body: "FastAPI is an ASGI framework built on Starlette + Pydantic. Automatic OpenAPI/Swagger docs generated from type hints. Native async/await support via ASGI. Pydantic models provide automatic request validation, serialization, and error responses. Dependency injection via Depends() for shared logic (auth, DB sessions).",
        },
        {
          title: "Pydantic Validation",
          body: "Pydantic uses Python type hints for runtime data validation. Define models as classes inheriting BaseModel. Field types, validators, and constraints are enforced automatically. V2 (pydantic-v2) is significantly faster (Rust core). Use model_validator for cross-field validation, field_validator for single fields.",
        },
        {
          title: "Async & ASGI",
          body: "ASGI (Asynchronous Server Gateway Interface) enables async request handling. async def route handlers enable concurrent I/O without threads. Use asyncpg, motor, or httpx for async DB/HTTP operations. Run with uvicorn (single) or gunicorn + uvicorn workers (production). Never mix blocking I/O (requests, psycopg2) in async handlers.",
        },
        {
          title: "Django Architecture (MTV)",
          body: "Django uses MTV: Model (ORM/DB layer), Template (HTML rendering), View (request handler). The ORM maps Python classes to DB tables. Django Admin auto-generates a CRUD UI from models. Middleware pipeline processes every request/response. Django REST Framework (DRF) extends Django for API development.",
        },
        {
          title: "Django ORM & N+1",
          body: "Django ORM maps DB rows to Python objects. N+1 problem: querying N objects then fetching a related field per object = N+1 queries. Fix with select_related() (SQL JOIN for ForeignKey) or prefetch_related() (separate query for ManyToMany/reverse FK). Use django-debug-toolbar to detect N+1 in development.",
        },
        {
          title: "Python Packaging & Virtual Envs",
          body: "Use pip + venv or Poetry for dependency management. requirements.txt for simple projects; pyproject.toml + poetry.lock for complex ones. Always pin versions in production (pip freeze > requirements.txt). Use python-dotenv or pydantic-settings for config. Type-annotate all functions — run mypy in CI for static type checking.",
        },
      ],
      resources: [
        {
          label: "FastAPI Docs",
          url: "https://fastapi.tiangolo.com",
          desc: "Official FastAPI documentation with tutorials and API reference.",
        },
        {
          label: "Django Docs",
          url: "https://docs.djangoproject.com",
          desc: "Official Django documentation — models, views, ORM, and deployment.",
        },
        {
          label: "Real Python",
          url: "https://realpython.com",
          desc: "Tutorials and articles on FastAPI, Django, async Python, and more.",
        },
        {
          label: "Pydantic Docs",
          url: "https://docs.pydantic.dev",
          desc: "Pydantic V2 data validation and settings management reference.",
        },
      ],
      checklist: [
        { id: "py-async", label: "async def used for all route handlers (no blocking I/O)" },
        { id: "py-pydantic", label: "All request bodies and responses use Pydantic models" },
        { id: "py-deps", label: "Auth, DB session, and common logic via FastAPI Depends()" },
        { id: "py-select", label: "Django: select_related/prefetch_related on all FK/M2M queries" },
        { id: "py-env", label: "Config via pydantic-settings (BaseSettings) — not os.environ directly" },
        { id: "py-migrate", label: "DB schema managed via Django migrations or Alembic" },
        { id: "py-types", label: "Type annotations on all functions; mypy clean in CI" },
        { id: "py-tests", label: "Tests with pytest + pytest-asyncio for async routes" },
        { id: "py-uvicorn", label: "Production: gunicorn + uvicorn workers (not uvicorn alone)" },
        { id: "py-secrets", label: "Secrets via environment variables — never hardcoded" },
      ],
      services: pythonServices,
    },
    {
      id: "go",
      label: "Go",
      color: "border-primary/40 bg-primary/10 text-primary",
      accent: "border-primary/30",
      tags: ["go", "golang"],
      concepts: [
        {
          title: "Goroutines & Channels",
          body: "Goroutines are lightweight, multiplexed onto OS threads by the Go scheduler. Launch with go fn(). Channels are typed conduits for safe goroutine communication: ch <- value (send), <-ch (receive). Buffered channels (make(chan T, n)) don't block until full. Use select for non-blocking multi-channel operations.",
        },
        {
          title: "Interfaces & Composition",
          body: "Go uses implicit interface satisfaction — a type implements an interface by having the required methods (no implements keyword). This enables duck typing with compile-time safety. Compose behavior via embedding structs and interfaces. The io.Reader/Writer interfaces are the canonical example of small, composable interfaces.",
        },
        {
          title: "Error Handling",
          body: "Go uses explicit error returns — functions return (T, error). Always check errors: if err != nil { return nil, err }. Use fmt.Errorf('context: %w', err) to wrap errors with context. errors.Is() and errors.As() unwrap the chain. Avoid panic in libraries; use it only for truly unrecoverable states.",
        },
        {
          title: "Standard Library HTTP",
          body: "Go's net/http package is production-ready without a framework. ServeMux routes requests; http.HandlerFunc wraps functions as handlers. Popular routers: Chi (lightweight, middleware composable), Gin (fast, Rails-like). Frameworks add middleware, binding, and DI but Go's stdlib handles most production needs.",
        },
        {
          title: "Context Propagation",
          body: "context.Context carries deadlines, cancellation signals, and request-scoped values across API boundaries. Always pass ctx as the first parameter to functions that do I/O. Use context.WithTimeout() for DB queries and HTTP calls. A canceled context causes database drivers and HTTP clients to abort automatically.",
        },
        {
          title: "Modules & Build",
          body: "Go modules (go.mod/go.sum) manage dependencies. go get adds dependencies; go mod tidy cleans unused ones. go build compiles to a single static binary — no runtime required. Cross-compile with GOOS/GOARCH env vars. The standard build produces production-ready binaries: docker scratch images are common.",
        },
      ],
      resources: [
        {
          label: "Go Official Docs",
          url: "https://go.dev/doc/",
          desc: "Official Go documentation, spec, and standard library reference.",
        },
        {
          label: "Go by Example",
          url: "https://gobyexample.com",
          desc: "Annotated Go programs covering all core language concepts.",
        },
        {
          label: "Effective Go",
          url: "https://go.dev/doc/effective_go",
          desc: "Official guide to writing idiomatic Go code.",
        },
        {
          label: "awesome-go",
          url: "https://awesome-go.com",
          desc: "Curated list of Go frameworks, libraries, and tools.",
        },
      ],
      checklist: [
        { id: "go-errors", label: "All errors checked — no blank identifier _ on error returns" },
        { id: "go-ctx", label: "context.Context as first param on all I/O functions" },
        { id: "go-timeout", label: "context.WithTimeout on all DB queries and HTTP calls" },
        { id: "go-goroutine", label: "All goroutines have a clear lifetime and cancellation path" },
        { id: "go-race", label: "go test -race passes — no data races" },
        { id: "go-vet", label: "go vet and staticcheck pass in CI" },
        { id: "go-binary", label: "Single statically-linked binary built for deployment" },
        { id: "go-interfaces", label: "Interfaces defined at consumer (not producer) — small and focused" },
        { id: "go-tidy", label: "go mod tidy run — go.sum committed and up to date" },
        { id: "go-bench", label: "Critical paths benchmarked with go test -bench" },
      ],
      services: goServices,
    },
  ],
};
