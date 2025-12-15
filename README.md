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

# App description
Top level container : Space
    Classification : object
        work unit : echo

Description :
Each Nest is configured with multiple nested Branches and contains Nodes linked by parent-child relationships.
🟢
| 🔴 | Nest    | When deleted all related branches are deleted   | 
| 🔴 | Nest    | When deleted all related Leafs are deleted      | 
| 🔴 | Branch  | Is top level or not                             | 
| 🔴 | Branch  | Must belong to exactly one Nest                 |                 
| 🔴 | Branch  | When deleted, all related Leafs are deleted     | 
| 🔴 | Branch  | Parent Branch can't be from another Nest        | 
| 🔴 | Leaf    | Must be linked to exactly one Branche           | 
| 🔴 | Leaf    | Implicitly belongs to a Nest                    | 
| 🔴 | Leaf    | Branche can't be from another Nest              | 
| 🔴 | Leaf    | Parent Leaf can't be from another Nest          | 
| 🔴 | Leaf    | Parent can't be the Leaf itself                 | 
| 🔴 | Leaf    | When deleted, all child Leafs must be deleted   | 


# Todo
A continuer demain :
- Création suppression Echo (Form, DeleteButton)
- Implémenter contrainte :
    - Assignation parent Objet
        - pas dans un autre space
        - pas fils de l'objet en lui même
    - Assignation parent echo
        - objet de l'echo parent appartient au space de l'objet de l'echo lui même
        - objet de l'echo parent n'est pas fils de l'echo lui même


Workflows :
- Create Space
- Create Objects
    - If parent assign : check if parent object is in the same space
    - If parent assign : check if parent object is not child or child of child.