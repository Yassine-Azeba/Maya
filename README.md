# Setup
npx create-next-app@latest
npx shadcn@latest init
npm install next-themes
add components/theme-provider.tsx
add <ThemeProvider/> in layout.tsx
Create neon account
Create neon database
Retrieve connection string
(optionnal) npx neonctl@latest init
npm install drizzle-orm @neondatabase/serverless dotenv
npm install -D drizzle-kit tsx
setup .env file
create lib/drizzle.tsx file
create src/db/schema.tsx file
npm install next-auth
create api/auth/[...nextauth].ts file
add GoogleProvider
Create google client
add client id and client secret in .env file
Check if authentication works
add drizzle.config.ts file
add drizzle adapter:
- npm install drizzle-orm @auth/drizzle-adapter
- npm install drizzle-kit --save-dev
- update src/db/schema.ts
- npm install @auth/core
- npm install postgres
- add adapter in nextauth.ts

# Tools
## Planning and Vizualization
- Kanban
- Gantt
- Calendar
- Dependencies
- React.Flow view (tree)
## Clarity and Focus
- Charts
- Priorities
- Risks
- Dependencies
## Collaboration & Communication (v2)
- Assignements
- Mentions

# App description
Top level container : Space | Plane
    Classification : object | Line
        work unit : echo    | Dot

# Pages
- Workspace
- Settings
- Help
- tools/kanban
- tools/gantt
- tools/calendar
- tools/charts
- tools/priorities
- tools/risks
- tools/dependencies
- tools/Assignements
- tools/mentions

Plane : Project Management
    Classification : Programms | Projects
        Dots : NADIN (Programms) | CC Fleet (Programms) | E Invoicing (Projects) | WeFleet (Projects)
        Classification : Streams (child of programms)
            Dots : Contremarque (son of NADIN) | Invoicing (son of NADIN) | ...
            Classification : Tasks
                Dots : Task 1 (son of CC FLeet) | ...

Description :
Each Nest is configured with multiple nested Branches and contains Nodes linked by parent-child relationships.