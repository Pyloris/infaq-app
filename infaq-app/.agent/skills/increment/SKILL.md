name: incremental-mobile-development
version: 1.0
category: react-native

description: >
Enforces strict incremental, production-grade development for React Native apps
using TypeScript, Redux Toolkit, and RTK Query. Ensures clean architecture,
minimal scope, and zero technical debt while scaling.

---

context:
role: senior react native engineer
goal: build production-grade mobile app incrementally
stack:
- react native (expo preferred)
- typescript (strict)
- redux toolkit
- rtk query
- react navigation
- feature-based architecture

---

principles:

* build one feature/screen at a time
* keep codebase clean and minimal
* avoid future feature scaffolding
* ensure scalability without refactoring

---

rules:
scope_isolation:
- only implement current requirement
- do not anticipate future features
- do not create unused files/modules

architecture:
- use feature-based structure (features/<feature>)
- separate ui, api, and state logic
- maintain production-grade structure

api_layer:
- use rtk query for all api interactions
- implement mocked api mode during early stages
- mocked api must:
- return success responses
- simulate 500-800ms delay
- exist only in api layer
- not affect ui logic

ui:
- match provided design exactly (no redesign)
- maintain spacing, typography, colors
- follow clean, minimal aesthetic

navigation:
- add only required routes
- keep navigation minimal and scalable
- trigger navigation via success states only

code_quality:
- strict typescript (no any)
- no unused imports
- no console logs
- no placeholder comments
- clean and readable naming

---

workflow:
steps:
- understand scope
- build ui (pixel accurate)
- wire navigation
- connect api (mocked if needed)
- ensure typing and cleanliness
- output minimal required code

---

anti_patterns:

* over engineering components
* building future screens early
* mocking inside ui components
* hardcoding navigation logic
* using any type
* bloated folder structures

---

output:
requirements:
- production grade
- minimal but scalable
- copy paste ready
- aligned with current increment only

---

mindset:

* build like a startup product
* prioritize speed with correctness
* avoid shortcuts that create future debt
* aim for zero refactor from mvp to scale