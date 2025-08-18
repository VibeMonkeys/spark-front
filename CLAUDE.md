# CLAUDE.md - Frontend

This file provides guidance to Claude Code (claude.ai/code) when working with the frontend code in this repository.

## Project Overview

This is a React frontend application for the "spark" random mission service. It's built with TypeScript and follows **Feature-Sliced Design (FSD)** architecture for optimal maintainability and scalability.

## Architecture

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand or Redux Toolkit
- **Styling**: Tailwind CSS + CSS Modules
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Form Handling**: React Hook Form + Zod validation
- **Testing**: Vitest + Testing Library + MSW
- **Architecture Pattern**: Feature-Sliced Design (FSD)

## Brand Design System

### 🎨 Brand Colors (SPARK Personal Color Palette)

**SPARK** uses a signature purple-to-blue gradient as its primary brand color, reflecting innovation, creativity, and trust.

#### Primary Brand Colors
```css
/* Main Brand Gradient */
bg-gradient-to-r from-purple-600 to-blue-600
text-gradient: linear-gradient(to right, #9333ea, #2563eb)

/* Primary Purple */
purple-600: #9333ea
purple-700: #7c3aed (hover states)
purple-50: #faf5ff (light backgrounds)
purple-100: #e9d5ff (subtle backgrounds)

/* Secondary Blue */
blue-600: #2563eb
blue-700: #1d4ed8 (hover states)
blue-50: #eff6ff (light backgrounds)
blue-100: #dbeafe (subtle backgrounds)
```

#### Usage Guidelines

**✅ Primary Brand Applications:**
- Headers and titles: `bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent`
- Primary buttons: `bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700`
- Key interactive elements: icons, links, active states
- Progress bars and completion indicators
- Notification badges and success states

**✅ Supporting Color Applications:**
- Single color elements: `text-purple-600`, `bg-purple-600`
- Subtle backgrounds: `bg-purple-50`, `bg-purple-100`
- Borders and outlines: `border-purple-200`, `border-purple-500`
- Hover states: `hover:bg-purple-50`, `hover:text-purple-700`

**❌ Avoid:**
- Using pure blue colors without purple (breaks brand consistency)
- Mixing with other color gradients (green, red, etc.) in primary elements
- Using brand colors for error states (use red variants instead)

#### Component Examples
```tsx
// Headers
<h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
  SPARK
</h1>

// Primary Buttons
<Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
  미션 시작하기
</Button>

// Interactive Elements
<Switch className="data-[state=checked]:bg-purple-600" />
<Badge className="bg-purple-100 text-purple-700">태그</Badge>

// Hashtags and Links
<a className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">#해시태그</a>
```

#### Color Accessibility
- All brand colors meet WCAG AA contrast requirements
- Use `text-purple-700` on light backgrounds for better readability
- Provide hover states for all interactive elements
- Ensure sufficient contrast in gradient text applications

## Feature-Sliced Design Structure

### Layer Hierarchy (Bottom-up dependency)
```
src/
├── shared/           # Layer 1: Reusable resources
├── entities/         # Layer 2: Business entities
├── features/         # Layer 3: User interactions
├── widgets/          # Layer 4: Compositional layer
├── pages/           # Layer 5: Application pages
└── app/             # Layer 6: Application initialization
```

### Detailed Package Structure
```
src/
├── app/                              # Application Layer
│   ├── providers/                    # Global providers (Router, Store, Theme)
│   ├── store/                        # Global store configuration
│   ├── styles/                       # Global styles
│   └── index.tsx                     # App entry point
├── pages/                            # Pages Layer
│   ├── mission-list/                 # Mission list page
│   ├── mission-detail/               # Mission detail page
│   ├── profile/                      # User profile page
│   └── index.ts                      # Pages public API
├── widgets/                          # Widgets Layer
│   ├── mission-card/                 # Mission card widget
│   ├── navigation/                   # Navigation widget
│   ├── mission-filter/               # Mission filter widget
│   └── index.ts                      # Widgets public API
├── features/                         # Features Layer
│   ├── create-mission/               # Create mission feature
│   ├── complete-mission/             # Complete mission feature
│   ├── filter-missions/              # Filter missions feature
│   ├── auth/                         # Authentication feature
│   └── index.ts                      # Features public API
├── entities/                         # Entities Layer
│   ├── mission/                      # Mission entity
│   ├── user/                         # User entity
│   └── index.ts                      # Entities public API
└── shared/                           # Shared Layer
    ├── api/                          # API layer
    ├── config/                       # Configuration
    ├── lib/                          # External libraries setup
    ├── ui/                           # UI kit components
    ├── utils/                        # Utility functions
    └── types/                        # Global types
```

## Layer Responsibilities

### 1. Shared Layer (`shared/`)
**Purpose**: Reusable resources used across the entire application
```
shared/
├── api/
│   ├── base.ts                       # Axios instance configuration
│   ├── types.ts                      # API response types
│   └── endpoints.ts                  # API endpoints constants
├── config/
│   ├── constants.ts                  # Application constants
│   └── env.ts                        # Environment variables
├── lib/
│   ├── react-query/                  # React Query setup
│   ├── router/                       # Router configuration
│   └── validation/                   # Zod schemas
├── ui/                               # Design system components
│   ├── button/
│   ├── input/
│   ├── modal/
│   └── index.ts
├── utils/
│   ├── format.ts                     # Formatting utilities
│   ├── date.ts                       # Date utilities
│   └── validation.ts                 # Validation helpers
└── types/
    ├── common.ts                     # Common types
    └── api.ts                        # API types
```

### 2. Entities Layer (`entities/`)
**Purpose**: Business entities that represent core domain models
```
entities/
├── mission/
│   ├── model/
│   │   ├── types.ts                  # Mission types
│   │   ├── store.ts                  # Mission store
│   │   └── selectors.ts              # Mission selectors
│   ├── api/
│   │   ├── mission.ts                # Mission API calls
│   │   └── types.ts                  # Mission API types
│   ├── lib/
│   │   ├── validation.ts             # Mission validation
│   │   └── utils.ts                  # Mission utilities
│   └── index.ts                      # Mission public API
└── user/
    ├── model/
    ├── api/
    ├── lib/
    └── index.ts
```

### 3. Features Layer (`features/`)
**Purpose**: User interactions and business features
```
features/
├── create-mission/
│   ├── ui/
│   │   ├── create-mission-form.tsx   # Form component
│   │   └── create-mission-modal.tsx  # Modal wrapper
│   ├── model/
│   │   ├── store.ts                  # Feature state
│   │   └── types.ts                  # Feature types
│   ├── api/
│   │   └── create-mission.ts         # Feature API
│   ├── lib/
│   │   ├── validation.ts             # Form validation
│   │   └── hooks.ts                  # Feature hooks
│   └── index.ts                      # Feature public API
├── complete-mission/
├── filter-missions/
└── auth/
```

### 4. Widgets Layer (`widgets/`)
**Purpose**: Independent UI blocks that combine multiple features
```
widgets/
├── mission-card/
│   ├── ui/
│   │   ├── mission-card.tsx          # Main widget component
│   │   ├── mission-card.module.css   # Widget styles
│   │   └── mission-actions.tsx       # Action buttons
│   ├── model/
│   │   └── types.ts                  # Widget types
│   ├── lib/
│   │   └── utils.ts                  # Widget utilities
│   └── index.ts                      # Widget public API
├── navigation/
└── mission-filter/
```

### 5. Pages Layer (`pages/`)
**Purpose**: Application pages that compose widgets and features
```
pages/
├── mission-list/
│   ├── ui/
│   │   ├── mission-list-page.tsx     # Page component
│   │   └── mission-list-page.module.css
│   ├── model/
│   │   └── types.ts                  # Page-specific types
│   └── index.ts                      # Page public API
├── mission-detail/
└── profile/
```

### 6. App Layer (`app/`)
**Purpose**: Application initialization and global configuration
```
app/
├── providers/
│   ├── with-router.tsx               # Router provider
│   ├── with-store.tsx                # Store provider
│   ├── with-query.tsx                # React Query provider
│   └── index.ts                      # Compose providers
├── store/
│   ├── root-store.ts                 # Root store configuration
│   └── middleware.ts                 # Store middleware
├── styles/
│   ├── globals.css                   # Global styles
│   └── variables.css                 # CSS variables
└── index.tsx                         # App entry point
```

## FSD Rules and Principles

### 1. Import Rule
**Lower layers cannot import from higher layers**
```typescript
// ✅ Allowed
import { Button } from 'shared/ui'           // shared → shared
import { Mission } from 'entities/mission'   // features → entities
import { CreateMission } from 'features'     // widgets → features

// ❌ Forbidden
import { MissionCard } from 'widgets'        // entities → widgets
import { HomePage } from 'pages'             // features → pages
```

### 2. Public API Rule
**Each slice must export its public API through index.ts**
```typescript
// entities/mission/index.ts
export { Mission } from './model/types'
export { useMission } from './model/store'
export { createMission } from './api/mission'

// features/create-mission/index.ts
export { CreateMissionForm } from './ui/create-mission-form'
export { useCreateMission } from './lib/hooks'
```

### 3. Segment Structure
**Each slice should follow the segment pattern**
```
slice/
├── ui/           # UI components
├── model/        # State management
├── api/          # API layer
├── lib/          # Utilities and helpers
├── config/       # Configuration
└── index.ts      # Public API
```

## Implementation Examples

### Entity Example (Mission)
```typescript
// entities/mission/model/types.ts
export interface Mission {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  status: 'pending' | 'completed' | 'failed'
  createdAt: string
  dueDate?: string
}

// entities/mission/model/store.ts
import { create } from 'zustand'

interface MissionStore {
  missions: Mission[]
  currentMission: Mission | null
  setMissions: (missions: Mission[]) => void
  setCurrentMission: (mission: Mission) => void
}

export const useMissionStore = create<MissionStore>((set) => ({
  missions: [],
  currentMission: null,
  setMissions: (missions) => set({ missions }),
  setCurrentMission: (mission) => set({ currentMission: mission })
}))

// entities/mission/index.ts
export type { Mission } from './model/types'
export { useMissionStore } from './model/store'
export { missionApi } from './api/mission'
```

### Feature Example (Create Mission)
```typescript
// features/create-mission/ui/create-mission-form.tsx
import { useCreateMission } from '../lib/hooks'
import { Button } from 'shared/ui'

export const CreateMissionForm = () => {
  const { mutate: createMission, isLoading } = useCreateMission()
  
  // Form implementation
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <Button type="submit" loading={isLoading}>
        Create Mission
      </Button>
    </form>
  )
}

// features/create-mission/lib/hooks.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { missionApi } from 'entities/mission'

export const useCreateMission = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: missionApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] })
    }
  })
}

// features/create-mission/index.ts
export { CreateMissionForm } from './ui/create-mission-form'
export { useCreateMission } from './lib/hooks'
```

## Common Commands

### Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint

# Fix linting issues
npm run lint:fix
```

### Testing
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run component tests
npm run test:ui

# Run E2E tests
npm run test:e2e
```

### Code Quality
```bash
# Format code with Prettier
npm run format

# Check formatting
npm run format:check

# FSD architecture validation
npm run fsd:lint

# Bundle analyzer
npm run analyze
```

## Development Guidelines

### File Naming Conventions
- **Components**: PascalCase (`CreateMissionForm.tsx`)
- **Hooks**: camelCase with `use` prefix (`useCreateMission.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Types**: PascalCase (`Mission.ts`)
- **Constants**: SCREAMING_SNAKE_CASE (`API_ENDPOINTS.ts`)

### Component Structure
```typescript
// Standard component structure
import { FC } from 'react'
import { cn } from 'shared/lib/utils'
import styles from './component-name.module.css'

interface ComponentNameProps {
  // Props definition
}

export const ComponentName: FC<ComponentNameProps> = ({
  // Props destructuring
}) => {
  // Hooks
  // Event handlers
  // Computed values
  
  return (
    <div className={cn(styles.component, className)}>
      {/* JSX */}
    </div>
  )
}
```

### State Management Strategy
- **Local State**: `useState` for component-specific state
- **Form State**: React Hook Form for form management
- **Server State**: React Query for API data
- **Global State**: Zustand for application-wide state
- **URL State**: React Router for navigation state

### Testing Strategy
- **Unit Tests**: Individual functions and hooks
- **Component Tests**: UI components with Testing Library
- **Integration Tests**: Feature workflows
- **E2E Tests**: Critical user journeys with Playwright
- **Visual Tests**: Storybook visual regression

### Performance Optimization
- **Code Splitting**: Route-based and component-based splitting
- **Lazy Loading**: Dynamic imports for heavy components
- **Memoization**: React.memo, useMemo, useCallback where needed
- **Bundle Analysis**: Regular bundle size monitoring
- **Image Optimization**: WebP format, lazy loading, responsive images

## Configuration Files

- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `package.json` - Project dependencies and scripts
- `.eslintrc.js` - ESLint configuration with FSD rules
- `vitest.config.ts` - Testing configuration
- `.env` - Environment variables

## FSD Best Practices

1. **Start Small**: Begin with simple slices and grow complexity
2. **Public API First**: Design the interface before implementation
3. **Single Responsibility**: Each slice should have one clear purpose
4. **Composition Over Inheritance**: Prefer composition in widgets
5. **Domain-Driven**: Align slices with business domains
6. **Testing**: Test public APIs, not internal implementation
7. **Documentation**: Maintain clear README for each feature