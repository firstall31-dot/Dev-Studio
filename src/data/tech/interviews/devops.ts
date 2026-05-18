import type { InterviewQuestion } from "../../../types/skills";

const now = Date.now();
const q = (i: number) => `iq_do_${i}`;

export const devopsCoreQuestions: InterviewQuestion[] = [
  {
    id: q(1), area: "devops", difficulty: "junior",
    question: "What is the difference between a Docker image and a container?",
    answer: "An image is a read-only blueprint (layers of filesystem changes + metadata). A container is a running instance of an image with its own writable layer, network, and process space. Multiple containers can run from the same image simultaneously.",
    tags: ["docker", "containers"], createdAt: now,
  },
  {
    id: q(2), area: "devops", difficulty: "junior",
    question: "What is CI/CD and why is it important?",
    answer: "CI (Continuous Integration): automatically build and test code on every push, catching bugs early. CD (Continuous Delivery/Deployment): automatically deploy validated code to staging or production. Together they reduce release risk, shorten feedback loops, and enable frequent reliable releases.",
    tags: ["ci-cd", "automation"], createdAt: now,
  },
  {
    id: q(3), area: "devops", difficulty: "mid",
    question: "Explain the difference between horizontal and vertical scaling.",
    answer: "Vertical (scale up): add more CPU/RAM to existing server. Simple but has limits and single point of failure. Horizontal (scale out): add more servers behind a load balancer. Requires stateless services (session in DB/Redis) but provides near-unlimited scale and redundancy. Cloud-native apps favor horizontal.",
    tags: ["scalability", "architecture"], createdAt: now,
  },
  {
    id: q(4), area: "devops", difficulty: "mid",
    question: "What is Kubernetes and what problems does it solve?",
    answer: "Kubernetes (K8s) is a container orchestration platform. It solves: scheduling containers across nodes, auto-scaling (HPA), self-healing (restarts failed pods), rolling updates with zero downtime, service discovery, secret/config management, and storage orchestration. Overkill for small teams; powerful for microservices at scale.",
    tags: ["kubernetes", "containers", "orchestration"], favorite: true, createdAt: now,
  },
  {
    id: q(5), area: "devops", difficulty: "mid",
    question: "What is Infrastructure as Code (IaC) and name some tools?",
    answer: "IaC means defining and provisioning infrastructure through code files (version-controlled, reviewable, repeatable) instead of manual UI clicks. Tools: Terraform (multi-cloud, declarative), Pulumi (code in TS/Python), AWS CDK, Ansible (configuration management), Helm (K8s package manager). Benefits: reproducibility, drift detection, disaster recovery.",
    tags: ["iac", "terraform", "devops"], createdAt: now,
  },
  {
    id: q(6), area: "devops", difficulty: "mid",
    question: "What is a blue-green deployment?",
    answer: "Two identical production environments (blue = current, green = new). Deploy new version to green, run smoke tests, then switch traffic (load balancer or DNS) from blue to green. Instant rollback: just switch back. Cost: double infrastructure during transition. Variant: canary deployment gradually shifts % of traffic.",
    tags: ["deployment", "zero-downtime"], favorite: true, createdAt: now,
  },
  {
    id: q(7), area: "devops", difficulty: "senior",
    question: "How do you handle secrets in a CI/CD pipeline securely?",
    answer: "Never store secrets in code or plain env files. Use: CI secrets store (GitHub Actions secrets, GitLab CI variables), cloud vaults (AWS Secrets Manager, HashiCorp Vault), K8s Secrets (encrypted at rest). Rotate secrets regularly. Audit secret access logs. Use short-lived credentials (IAM roles, OIDC) over long-lived keys. Mask secrets in logs.",
    tags: ["security", "secrets", "ci-cd"], createdAt: now,
  },
  {
    id: q(8), area: "devops", difficulty: "senior",
    question: "Explain the concept of observability and its three pillars.",
    answer: "Observability is the ability to understand internal system state from external outputs. Three pillars: 1) Logs — structured event records (use JSON, add correlation IDs). 2) Metrics — numeric measurements over time (latency p95/p99, error rate, throughput — USE method). 3) Traces — request flow across distributed services. Tools: OpenTelemetry, Datadog, Grafana/Prometheus, Jaeger.",
    tags: ["observability", "monitoring", "sre"], favorite: true, createdAt: now,
  },
  {
    id: q(9), area: "devops", difficulty: "senior",
    question: "What is a multi-stage Docker build and why use it?",
    answer: "Multi-stage builds use multiple `FROM` statements in one Dockerfile. Build dependencies (compiler, test tools) are in early stages; only artifacts are copied to the final minimal image. Result: production image has no build tools, drastically smaller (e.g., 1GB Node build → 100MB Alpine runtime). Improves security and pull times.",
    tags: ["docker", "optimization", "security"], createdAt: now,
  },
  {
    id: q(10), area: "devops", difficulty: "mid",
    question: "What is the difference between a load balancer and an API gateway?",
    answer: "Load balancer: distributes traffic across server instances (L4 TCP or L7 HTTP), health checks, sticky sessions. API Gateway: higher-level — handles auth, rate limiting, request transformation, routing to multiple backend services, SSL termination, caching. Often used together: gateway in front, LB behind each service.",
    tags: ["networking", "architecture"], createdAt: now,
  },
];
