name: incremental-backend-development-prisma
version: 1.0
category: backend

description: >
Enforces strict incremental, production-grade backend development using
Express, Prisma (MongoDB), and JWT. Focuses on clean architecture,
schema evolution, and safe database changes while scaling.

---

context:
role: senior backend engineer
goal: build production-grade backend incrementally
stack:

* express
* prisma (mongodb)
* jwt (stateless auth)
* zod (validation)
* docker (optional)

---

principles:

* build one feature/module at a time
* evolve database schema safely and incrementally
* keep prisma schema minimal and accurate
* ensure backward compatibility when modifying schema
* avoid unused models and fields

---

rules:

scope_isolation:

* only implement current requirement
* do not add future models or fields
* do not pre-create relations unless required

architecture:

* use feature-based structure (features/<feature>)
* separate controller, service, route, schema
* prisma is the single source of truth for data layer

prisma_setup:

* initialize prisma only once
* use mongodb provider
* store DATABASE_URL in env
* always generate client after schema change
* never manually edit generated prisma client

commands:

* npx prisma init
* npx prisma generate

schema_rules:

* define only required models
* use proper types (String, Boolean, DateTime, etc.)
* always include id field:

  * id String @id @default(auto()) @map("_id") @db.ObjectId
* use @unique only when necessary
* use createdAt with @default(now())
* avoid optional fields unless required

adding_new_model:
steps:

* understand data requirement
* create new model in schema.prisma
* follow naming consistency (PascalCase model names)
* define minimal fields required for current feature
* run prisma generate
* use model via prisma client in service layer only

example:
model Post {
id        String   @id @default(auto()) @map("_id") @db.ObjectId
title     String
content   String
createdAt DateTime @default(now())
}

modifying_schema:
rules:

* never break existing fields used in production
* prefer additive changes over destructive
* if removing field:

  * ensure no code depends on it
  * remove safely in same increment
* if changing type:

  * handle migration logic in service layer

steps:

* update schema.prisma
* run prisma generate
* update service logic accordingly

relations:

* add relations only when required
* use explicit relation fields
* avoid deep nesting early

example:
model User {
id    String @id @default(auto()) @map("_id") @db.ObjectId
email String @unique
posts Post[]
}

model Post {
id      String @id @default(auto()) @map("_id") @db.ObjectId
title   String
userId  String @db.ObjectId
user    User   @relation(fields: [userId], references: [id])
}

service_layer:

* all prisma queries must exist in service layer
* controllers must not directly use prisma
* keep queries minimal and efficient

validation:

* use zod schemas per feature
* validate before hitting service layer
* never trust request body directly

error_handling:

* central error middleware
* no raw prisma errors exposed to client

api_design:

* RESTful endpoints
* consistent response format
* include only required fields in response

jwt_auth:

* stateless authentication
* include only userId in token
* protect routes via middleware

---

workflow:
steps:

* understand feature requirement
* design minimal prisma schema (if needed)
* generate prisma client
* implement service logic
* implement controller
* wire route
* validate inputs
* test endpoint

---

anti_patterns:

* adding unused models or fields
* modifying schema without updating services
* querying prisma directly in controllers
* overusing relations early
* breaking schema in production
* not regenerating prisma client

---

output:
requirements:

* production grade
* minimal but scalable
* schema-safe changes
* copy paste ready

---

mindset:

* schema is contract, treat it carefully
* build incrementally, not perfectly
* avoid migrations that break production
* optimize for long-term maintainability
