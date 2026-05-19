/**
 * @openapi
 * components:
 *   schemas:
 *     # --- CORE SCHEMAS ---
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "usr_9281a0b3"
 *         email:
 *           type: string
 *           format: email
 *           example: "developer@example.com"
 *         displayName:
 *           type: string
 *           example: "Jane Doe"
 *         avatarUrl:
 *           type: string
 *           nullable: true
 *           example: "https://lh3.googleusercontent.com/a/some_id"
 *         isVerified:
 *           type: boolean
 *           example: true
 *     RegisterInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "developer@example.com"
 *         password:
 *           type: string
 *           minLength: 6
 *           example: "securePassword123"
 *         displayName:
 *           type: string
 *           example: "Jane Doe"
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "developer@example.com"
 *         password:
 *           type: string
 *           example: "securePassword123"
 *     ChatInput:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         message:
 *           type: string
 *           description: "The user query or prompt sent to the LLM assistant"
 *           example: "How do I implement clean architecture in NestJS?"
 *         systemPrompt:
 *           type: string
 *           description: "Optional system configuration instructions for the agent"
 *           example: "You are a master software architect."
 *         history:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, assistant]
 *               content:
 *                 type: string
 *
 *     Prompt:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "d3b07384-d113-4ec5-a587-31efbd68c103"
 *         userId:
 *           type: string
 *           example: "google-oauth2|12345"
 *         title:
 *           type: string
 *           example: "Clean Architecture Setup"
 *         description:
 *           type: string
 *           example: "Initial blueprint for a NestJS layered application structure"
 *         category:
 *           type: string
 *           example: "Architectural"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["nestjs", "clean-architecture", "backend"]
 *         body:
 *           type: string
 *           example: "Create a 4-layer design featuring Domain, Application, Infrastructure, and Presentation..."
 *         variables:
 *           type: array
 *           items:
 *             type: string
 *           example: ["layers", "framework"]
 *         model:
 *           type: string
 *           example: "gpt-4o"
 *         favorite:
 *           type: boolean
 *           example: false
 *         usageCount:
 *           type: integer
 *           example: 4
 *         versions:
 *           type: array
 *           items:
 *             type: object
 *           example: []
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     PromptInput:
 *       type: object
 *       required:
 *         - title
 *         - body
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: "Optional UUID to perform an upsert/update operation if a matching record exists"
 *         title:
 *           type: string
 *           example: "Clean Architecture Setup"
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         body:
 *           type: string
 *         variables:
 *           type: array
 *           items:
 *             type: string
 *         model:
 *           type: string
 *         favorite:
 *           type: boolean
 *
 *     Agent:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *         name:
 *           type: string
 *           example: "VibeCoder"
 *         role:
 *           type: string
 *           example: "Senior Frontend Engineer"
 *         systemPrompt:
 *           type: string
 *           example: "You write beautiful, accessible Tailwind and React components."
 *         tools:
 *           type: array
 *           items:
 *             type: string
 *           example: ["web_search", "write_file"]
 *         model:
 *           type: string
 *           example: "gpt-4o"
 *         temperature:
 *           type: number
 *           example: 0.7
 *         status:
 *           type: string
 *           enum: [draft, active, archived]
 *           example: "active"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     AgentInput:
 *       type: object
 *       required:
 *         - name
 *         - systemPrompt
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         role:
 *           type: string
 *         systemPrompt:
 *           type: string
 *         tools:
 *           type: array
 *           items:
 *             type: string
 *         model:
 *           type: string
 *         temperature:
 *           type: number
 *         status:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *
 *     Component:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           example: "GlassmorphicButton"
 *         description:
 *           type: string
 *         category:
 *           type: string
 *           example: "UI / Buttons"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         code:
 *           type: string
 *           example: "export default function Button() { return <button className='backdrop-blur-md bg-white/30'>Click me</button> }"
 *         dependencies:
 *           type: array
 *           items:
 *             type: string
 *           example: ["lucide-react"]
 *         favorite:
 *           type: boolean
 *         usageCount:
 *           type: integer
 *     ComponentInput:
 *       type: object
 *       required:
 *         - name
 *         - code
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         code:
 *           type: string
 *         dependencies:
 *           type: array
 *           items:
 *             type: string
 *         favorite:
 *           type: boolean
 *
 *     Template:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           example: "Vite + Tailwind Boilerplate"
 *         description:
 *           type: string
 *         stack:
 *           type: array
 *           items:
 *             type: string
 *           example: ["React", "TypeScript", "Vite", "Tailwind"]
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         structure:
 *           type: string
 *           example: "src/components, src/hooks, src/context"
 *         notes:
 *           type: string
 *     TemplateInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         stack:
 *           type: array
 *           items:
 *             type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         structure:
 *           type: string
 *         notes:
 *           type: string
 *
 *     Snippet:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *           example: "Debounced Resize Hook"
 *         language:
 *           type: string
 *           example: "typescript"
 *         description:
 *           type: string
 *         code:
 *           type: string
 *           example: "export function useDebounce<T>(value: T, delay: number) { ... }"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *     SnippetInput:
 *       type: object
 *       required:
 *         - title
 *         - language
 *         - code
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         language:
 *           type: string
 *         description:
 *           type: string
 *         code:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *
 *     Connector:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         type:
 *           type: string
 *           example: "supabase"
 *         name:
 *           type: string
 *           example: "Production Database"
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         notes:
 *           type: string
 *     ConnectorInput:
 *       type: object
 *       required:
 *         - type
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         type:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         notes:
 *           type: string
 *
 *     SocialDraft:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         platform:
 *           type: string
 *           example: "twitter"
 *         content:
 *           type: string
 *           example: "Incredibly excited to announce the release of Dev Studio 1.0! 🚀"
 *         mediaUrls:
 *           type: array
 *           items:
 *             type: string
 *     SocialDraftInput:
 *       type: object
 *       required:
 *         - platform
 *         - content
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         platform:
 *           type: string
 *         content:
 *           type: string
 *         mediaUrls:
 *           type: array
 *           items:
 *             type: string
 *
 *     MailTemplate:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         channel:
 *           type: string
 *           example: "welcome-email"
 *         subject:
 *           type: string
 *           example: "Welcome to Dev Studio!"
 *         content:
 *           type: string
 *           example: "Hi {{name}}, we're thrilled to have you here..."
 *     MailTemplateInput:
 *       type: object
 *       required:
 *         - channel
 *         - content
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         channel:
 *           type: string
 *         subject:
 *           type: string
 *         content:
 *           type: string
 *
 *     InterviewQuestion:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         question:
 *           type: string
 *           example: "Explain event loop in Node.js."
 *         answer:
 *           type: string
 *           example: "The event loop allows Node.js to perform non-blocking I/O operations..."
 *         difficulty:
 *           type: string
 *           enum: [junior, mid, senior]
 *           example: "mid"
 *         area:
 *           type: string
 *           enum: [frontend, backend, devops, testing, database, softskills, general]
 *           example: "backend"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         category:
 *           type: string
 *         favorite:
 *           type: boolean
 *         answerDepths:
 *           type: array
 *           items:
 *             type: object
 *         isGlobal:
 *           type: boolean
 *     InterviewQuestionInput:
 *       type: object
 *       required:
 *         - question
 *         - answer
 *         - area
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         question:
 *           type: string
 *         answer:
 *           type: string
 *         difficulty:
 *           type: string
 *         area:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         category:
 *           type: string
 *         favorite:
 *           type: boolean
 *         isGlobal:
 *           type: boolean
 *
 *     UserProgress:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *         itemId:
 *           type: string
 *           example: "question_uuid"
 *         areaId:
 *           type: string
 *           example: "backend"
 *         completed:
 *           type: boolean
 *           example: true
 *
 *     SavedJob:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *           example: "Senior Node.js Developer"
 *         company:
 *           type: string
 *           example: "Tech Solutions Inc."
 *         location:
 *           type: string
 *           example: "Remote, US"
 *         url:
 *           type: string
 *         platform:
 *           type: string
 *         status:
 *           type: string
 *           enum: [saved, applied, interviewing, offered, rejected]
 *           example: "saved"
 *         salary:
 *           type: string
 *         remote:
 *           type: boolean
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         notes:
 *           type: string
 *     SavedJobInput:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         company:
 *           type: string
 *         location:
 *           type: string
 *         url:
 *           type: string
 *         platform:
 *           type: string
 *         status:
 *           type: string
 *         salary:
 *           type: string
 *         remote:
 *           type: boolean
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         notes:
 *           type: string
 *
 *     FreelanceOffer:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *           example: "Build custom Shopify gateway"
 *         client:
 *           type: string
 *         platform:
 *           type: string
 *           example: "Upwork"
 *         budget:
 *           type: string
 *           example: "1500"
 *         currency:
 *           type: string
 *           example: "USD"
 *         status:
 *           type: string
 *           example: "new"
 *         description:
 *           type: string
 *         url:
 *           type: string
 *         deadline:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         notes:
 *           type: string
 *     FreelanceOfferInput:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         client:
 *           type: string
 *         platform:
 *           type: string
 *         budget:
 *           type: string
 *         currency:
 *           type: string
 *         status:
 *           type: string
 *         description:
 *           type: string
 *         url:
 *           type: string
 *         deadline:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         notes:
 *           type: string
 *
 *     MyService:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *           example: "Fullstack SaaS MVP Development"
 *         platform:
 *           type: string
 *           example: "Fiverr"
 *         url:
 *           type: string
 *         category:
 *           type: string
 *         price:
 *           type: string
 *           example: "3500"
 *         currency:
 *           type: string
 *           example: "USD"
 *         status:
 *           type: string
 *           example: "active"
 *         description:
 *           type: string
 *         deliveryDays:
 *           type: integer
 *           example: 7
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         notes:
 *           type: string
 *     MyServiceInput:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         platform:
 *           type: string
 *         url:
 *           type: string
 *         category:
 *           type: string
 *         price:
 *           type: string
 *         currency:
 *           type: string
 *         status:
 *           type: string
 *         description:
 *           type: string
 *         deliveryDays:
 *           type: integer
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         notes:
 *           type: string
 *
 *     UserProfile:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *         displayName:
 *           type: string
 *           example: "Mostafa"
 *         avatarUrl:
 *           type: string
 *         location:
 *           type: string
 *           example: "Paris, France"
 *     UserProfileInput:
 *       type: object
 *       properties:
 *         displayName:
 *           type: string
 *         avatarUrl:
 *           type: string
 *         location:
 *           type: string
 *
 *     CVProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *         title:
 *           type: string
 *           example: "My Resume"
 *         focus:
 *           type: string
 *           example: "fullstack"
 *         personalInfo:
 *           type: object
 *           example: { name: "John Doe", email: "john@example.com" }
 *         summary:
 *           type: string
 *         experience:
 *           type: array
 *           items:
 *             type: object
 *           example: []
 *         skills:
 *           type: object
 *           example: { technical: ["Node.js", "React"], soft: ["Leadership"] }
 *         education:
 *           type: array
 *           items:
 *             type: object
 *         projects:
 *           type: array
 *           items:
 *             type: object
 *         languages:
 *           type: array
 *           items:
 *             type: object
 *     CVProfileInput:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         focus:
 *           type: string
 *         personalInfo:
 *           type: object
 *         summary:
 *           type: string
 *         experience:
 *           type: array
 *           items:
 *             type: object
 *         skills:
 *           type: object
 *         education:
 *           type: array
 *           items:
 *             type: object
 *         projects:
 *           type: array
 *           items:
 *             type: object
 *         languages:
 *           type: array
 *           items:
 *             type: object
 *
 *     PlannerTask:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *         date:
 *           type: string
 *           format: date
 *           example: "2026-05-19"
 *         title:
 *           type: string
 *           example: "Implement Swagger UI definitions"
 *         description:
 *           type: string
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           example: "high"
 *         status:
 *           type: string
 *           enum: [todo, in-progress, done]
 *           example: "todo"
 *         category:
 *           type: string
 *           enum: [activities, work, learning, general]
 *           example: "work"
 *         order:
 *           type: integer
 *         estimatedMinutes:
 *           type: integer
 *     PlannerTaskInput:
 *       type: object
 *       required:
 *         - date
 *         - title
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         date:
 *           type: string
 *           format: date
 *           example: "2026-05-19"
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         priority:
 *           type: string
 *         status:
 *           type: string
 *         category:
 *           type: string
 *         order:
 *           type: integer
 *         estimatedMinutes:
 *           type: integer
 *
 * # --- PATH DEFINITIONS ---
 *
 * /api/auth/register:
 *   post:
 *     summary: Register a new developer account
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       200:
 *         description: Account successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 requireVerification:
 *                   type: boolean
 *                 email:
 *                   type: string
 *                 devVerificationCode:
 *                   type: string
 *       400:
 *         description: Missing or invalid parameters
 *       409:
 *         description: Email conflict
 *
 * /api/auth/login:
 *   post:
 *     summary: Authenticate developer and set JWT cookie
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 *
 * /api/auth/verify-email:
 *   post:
 *     summary: Verify email address using the confirmation code
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - token
 *             properties:
 *               email:
 *                 type: string
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email successfully verified
 *
 * /api/auth/logout:
 *   post:
 *     summary: Clear the authentication cookie and end session
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Logged out successfully
 *
 * /api/auth/user:
 *   get:
 *     summary: Get currently authenticated user session details
 *     tags:
 *       - Authentication
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user profile details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized session
 *
 * /api/chat:
 *   post:
 *     summary: Interact with the AI assistant / LLM runtime
 *     tags:
 *       - Chat
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatInput'
 *     responses:
 *       200:
 *         description: LLM response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *
 * # --- PROMPTS ---
 * /api/prompts:
 *   get:
 *     summary: Retrieve all prompts owned by the authenticated developer
 *     tags:
 *       - Prompts
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of prompts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Prompt'
 *   post:
 *     summary: Create or update a prompt
 *     description: Perform an upsert. If an `id` is supplied and belongs to the user, the prompt will be updated. Otherwise, a new prompt will be created.
 *     tags:
 *       - Prompts
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PromptInput'
 *     responses:
 *       200:
 *         description: The created or updated prompt
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prompt'
 * /api/prompts/bulk:
 *   post:
 *     summary: Import multiple prompts in bulk
 *     tags:
 *       - Prompts
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/PromptInput'
 *     responses:
 *       200:
 *         description: List of successfully imported prompts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Prompt'
 * /api/prompts/{id}:
 *   delete:
 *     summary: Delete a prompt by ID
 *     tags:
 *       - Prompts
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Successfully deleted
 *
 * # --- AGENTS ---
 * /api/agents:
 *   get:
 *     summary: Retrieve all AI agents owned by the developer
 *     tags:
 *       - Agents
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Agent'
 *   post:
 *     summary: Create or update an AI agent
 *     tags:
 *       - Agents
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AgentInput'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agent'
 * /api/agents/bulk:
 *   post:
 *     summary: Import agents in bulk
 *     tags:
 *       - Agents
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/AgentInput'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Agent'
 * /api/agents/{id}:
 *   delete:
 *     summary: Delete an AI agent
 *     tags:
 *       - Agents
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Deleted
 *
 * # --- COMPONENTS ---
 * /api/components:
 *   get:
 *     summary: Retrieve all custom UI components
 *     tags:
 *       - Components
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Component'
 *   post:
 *     summary: Create or update a UI component
 *     tags:
 *       - Components
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ComponentInput'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Component'
 * /api/components/bulk:
 *   post:
 *     summary: Import UI components in bulk
 *     tags:
 *       - Components
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/ComponentInput'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Component'
 * /api/components/{id}:
 *   delete:
 *     summary: Delete a UI component
 *     tags:
 *       - Components
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Deleted
 *
 * # --- TEMPLATES ---
 * /api/templates:
 *   get:
 *     summary: Retrieve all project templates
 *     tags:
 *       - Templates
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Template'
 *   post:
 *     summary: Create or update a template
 *     tags:
 *       - Templates
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TemplateInput'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Template'
 * /api/templates/bulk:
 *   post:
 *     summary: Import templates in bulk
 *     tags:
 *       - Templates
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/TemplateInput'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Template'
 * /api/templates/{id}:
 *   delete:
 *     summary: Delete a project template
 *     tags:
 *       - Templates
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Deleted
 *
 * # --- SNIPPETS ---
 * /api/snippets:
 *   get:
 *     summary: Retrieve all code snippets
 *     tags:
 *       - Snippets
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Snippet'
 *   post:
 *     summary: Create or update a code snippet
 *     tags:
 *       - Snippets
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SnippetInput'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Snippet'
 * /api/snippets/bulk:
 *   post:
 *     summary: Import code snippets in bulk
 *     tags:
 *       - Snippets
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/SnippetInput'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Snippet'
 * /api/snippets/{id}:
 *   delete:
 *     summary: Delete a code snippet
 *     tags:
 *       - Snippets
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Deleted
 *
 * # --- CONNECTORS ---
 * /api/connectors:
 *   get:
 *     summary: Retrieve all developer database/API connectors
 *     tags:
 *       - Connectors
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Connector'
 *   post:
 *     summary: Create or update a connector
 *     tags:
 *       - Connectors
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConnectorInput'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Connector'
 * /api/connectors/bulk:
 *   post:
 *     summary: Import connectors in bulk
 *     tags:
 *       - Connectors
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/ConnectorInput'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Connector'
 * /api/connectors/{id}:
 *   delete:
 *     summary: Delete a connector
 *     tags:
 *       - Connectors
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Deleted
 *
 * # --- SOCIAL DRAFTS ---
 * /api/social:
 *   get:
 *     summary: "Retrieve all social media drafts (Alias: /api/social-drafts)"
 *     tags:
 *       - Social
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SocialDraft'
 *   post:
 *     summary: Create or update a social draft
 *     tags:
 *       - Social
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SocialDraftInput'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SocialDraft'
 * /api/social/bulk:
 *   post:
 *     summary: Import social drafts in bulk
 *     tags:
 *       - Social
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/SocialDraftInput'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SocialDraft'
 * /api/social/{id}:
 *   delete:
 *     summary: Delete a social draft
 *     tags:
 *       - Social
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Deleted
 *
 * # --- MAIL TEMPLATES ---
 * /api/mail:
 *   get:
 *     summary: "Retrieve all cold mail/message templates (Alias: /api/mail-templates)"
 *     tags:
 *       - Mail
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MailTemplate'
 *   post:
 *     summary: Create or update a mail template
 *     tags:
 *       - Mail
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MailTemplateInput'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MailTemplate'
 * /api/mail/bulk:
 *   post:
 *     summary: Import mail templates in bulk
 *     tags:
 *       - Mail
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/MailTemplateInput'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MailTemplate'
 * /api/mail/{id}:
 *   delete:
 *     summary: Delete a mail template
 *     tags:
 *       - Mail
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Deleted
 *
 * # --- INTERVIEW & PROGRESS ---
 * /api/interview/questions:
 *   get:
 *     summary: "Retrieve interview questions (Alias: /api/interview-questions)"
 *     tags:
 *       - Interview
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InterviewQuestion'
 *   post:
 *     summary: Create or update an interview question
 *     tags:
 *       - Interview
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InterviewQuestionInput'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InterviewQuestion'
 * /api/interview/questions/bulk:
 *   post:
 *     summary: Import interview questions in bulk
 *     tags:
 *       - Interview
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/InterviewQuestionInput'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InterviewQuestion'
 * /api/interview/questions/{id}:
 *   delete:
 *     summary: Delete an interview question by ID
 *     tags:
 *       - Interview
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Deleted
 *
 * /api/interview/progress:
 *   get:
 *     summary: "Retrieve user progress checklist (Alias: /api/progress)"
 *     tags:
 *       - Interview
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserProgress'
 * /api/interview/progress/toggle:
 *   post:
 *     summary: Toggle completion check of a learning question/item
 *     tags:
 *       - Interview
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - itemId
 *               - areaId
 *             properties:
 *               itemId:
 *                 type: string
 *               areaId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated progress state
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProgress'
 *
 * # --- JOBS & OFFERS & SERVICES ---
 * /api/jobs:
 *   get:
 *     summary: Retrieve developer's saved job boards & applications
 *     tags:
 *       - Jobs
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SavedJob'
 *   post:
 *     summary: Create or update a saved job application
 *     tags:
 *       - Jobs
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SavedJobInput'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SavedJob'
 * /api/jobs/bulk:
 *   post:
 *     summary: Import saved job boards in bulk
 *     tags:
 *       - Jobs
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/SavedJobInput'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SavedJob'
 * /api/jobs/{id}:
 *   delete:
 *     summary: Delete a saved job card
 *     tags:
 *       - Jobs
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Deleted
 *
 * /api/offers:
 *   get:
 *     summary: "Retrieve freelance project offers (Alias: /api/freelance-offers)"
 *     tags:
 *       - Offers
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FreelanceOffer'
 *   post:
 *     summary: Create or update freelance offer card
 *     tags:
 *       - Offers
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FreelanceOfferInput'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FreelanceOffer'
 * /api/offers/bulk:
 *   post:
 *     summary: Import freelance offers in bulk
 *     tags:
 *       - Offers
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/FreelanceOfferInput'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FreelanceOffer'
 * /api/offers/{id}:
 *   delete:
 *     summary: Delete a freelance offer
 *     tags:
 *       - Offers
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Deleted
 *
 * /api/services:
 *   get:
 *     summary: "Retrieve my listed gig services (Alias: /api/my-services)"
 *     tags:
 *       - Services
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MyService'
 *   post:
 *     summary: Create or update listed service gig
 *     tags:
 *       - Services
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MyServiceInput'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MyService'
 * /api/services/bulk:
 *   post:
 *     summary: Import services in bulk
 *     tags:
 *       - Services
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/MyServiceInput'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MyService'
 * /api/services/{id}:
 *   delete:
 *     summary: Delete a listed service gig card
 *     tags:
 *       - Services
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Deleted
 *
 * # --- PROFILE ---
 * /api/profile:
 *   get:
 *     summary: Get user profile details
 *     tags:
 *       - Profile
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *   post:
 *     summary: Create or update user profile details
 *     tags:
 *       - Profile
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserProfileInput'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *
 * # --- CV PROFILE ---
 * /api/cv:
 *   get:
 *     summary: Retrieve CV resume profiles
 *     tags:
 *       - CV
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CVProfile'
 *   post:
 *     summary: Create or update CV resume profile
 *     tags:
 *       - CV
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CVProfileInput'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CVProfile'
 * /api/cv/{id}:
 *   delete:
 *     summary: Delete a CV profile card
 *     tags:
 *       - CV
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Deleted
 * /api/cv/ats-check:
 *   post:
 *     summary: Analyze CV resume matching score against a job description using AI
 *     tags:
 *       - CV
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cvProfile
 *               - jobDescription
 *             properties:
 *               cvProfile:
 *                 $ref: '#/components/schemas/CVProfileInput'
 *               jobDescription:
 *                 type: string
 *     responses:
 *       200:
 *         description: ATS compatibility audit report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 score:
 *                   type: number
 *                 grade:
 *                   type: string
 *                 summary:
 *                   type: string
 *                 jobTitle:
 *                   type: string
 *                 detectedFocus:
 *                   type: string
 *                 matchedKeywords:
 *                   type: array
 *                   items:
 *                     type: string
 *                 missingKeywords:
 *                   type: array
 *                   items:
 *                     type: string
 *                 suggestions:
 *                   type: array
 *                   items:
 *                     type: string
 * /api/cv/parse-pdf:
 *   post:
 *     summary: Parse a base64-encoded PDF resume file into raw text
 *     tags:
 *       - CV
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fileBase64
 *             properties:
 *               fileBase64:
 *                 type: string
 *                 description: "Base64 encoded string of the PDF file"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 text:
 *                   type: string
 *
 * # --- PLANNER ---
 * /api/planner:
 *   get:
 *     summary: Retrieve planner tasks (optionally filtered by date range)
 *     tags:
 *       - Planner
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: "Start date (YYYY-MM-DD)"
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: "End date (YYYY-MM-DD)"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PlannerTask'
 *   post:
 *     summary: Create or update planner task card
 *     tags:
 *       - Planner
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlannerTaskInput'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlannerTask'
 * /api/planner/{id}:
 *   delete:
 *     summary: Delete a planner task card
 *     tags:
 *       - Planner
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Deleted
 * /api/planner/suggest:
 *   post:
 *     summary: Get AI suggested scheduled routine enhancements based on active tasks
 *     tags:
 *       - Planner
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - tasks
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               tasks:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/PlannerTask'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 suggestions:
 *                   type: array
 *                   items:
 *                     type: string
 *                 schedule:
 *                   type: string
 * /api/planner/seed:
 *   post:
 *     summary: Seed default high-quality learning and developer schedules for a month
 *     tags:
 *       - Planner
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               month:
 *                 type: string
 *                 example: "2026-05"
 *               clear:
 *                 type: boolean
 *                 description: "Whether to clear existing tasks first for this month"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 count:
 *                   type: integer
 */
export const swaggerDocsPlaceholder = true;
