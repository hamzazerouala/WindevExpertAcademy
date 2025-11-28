# WindevExpert Academy UI Redesign Document

## Overview

This document outlines the redesign of the WindevExpert Academy learning platform UI, maintaining the exact design elements from the existing implementation while organizing them into a structured design specification. The platform offers courses on WINDEV, WEBDEV, Mobile development, HFSQL, and WLanguage technologies.

## Design Principles

| Principle | Description |
|----------|-------------|
| Responsive Design | Fully responsive layout adapting to mobile, tablet, and desktop views |
| Dark/Light Mode | Toggleable theme system with appropriate color schemes |
| Multilingual Support | Support for French, English, and Arabic languages with RTL layout handling |
| Interactive Elements | Hover states, animations, and transitions for enhanced UX |
| Consistent Components | Reusable UI components throughout the application |
| Gradient-Based Design | Extensive use of gradients for visual appeal |
| Card-Based Layout | Content organized in distinct cards for clarity |

## Color System

### Theme Colors

| Element | Light Theme | Dark Theme |
|--------|-------------|------------|
| Background | `bg-slate-50` | `bg-slate-950` |
| Surface | `bg-white` | `bg-slate-900` |
| Primary | Yellow/Orange gradient | Yellow/Orange gradient |
| Secondary | Blue/Purple gradient | Blue/Purple gradient |
| Borders | `border-slate-200` | `border-slate-800` |

### Category Colors

| Category | Gradient Class |
|----------|----------------|
| WINDEV | `from-blue-500 to-blue-700` |
| WEBDEV | `from-purple-500 to-purple-700` |
| MOBILE | `from-green-500 to-green-700` |
| HFSQL | `from-yellow-500 to-yellow-700` |
| WLANGAGE | `from-red-500 to-red-700` |
| PACKS | `from-gray-600 to-gray-800` |

## Typography

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Headings | Cairo (Arabic), Sans-serif (others) | Various | Bold | Theme appropriate |
| Body Text | Cairo (Arabic), Sans-serif (others) | 14-16px | Regular | Theme appropriate |
| Captions | Cairo (Arabic), Sans-serif (others) | 12-14px | Light | Muted theme colors |

## Component Library

### Buttons

| Variant | Classes | Usage |
|---------|---------|-------|
| Primary | `bg-gradient-to-r from-yellow-500 to-orange-600` | Main actions, CTAs |
| Secondary | `bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700` | Secondary actions |
| Ghost | `text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800` | Minimal emphasis actions |
| Outline | `border border-slate-200 dark:border-slate-700` | Alternative secondary actions |

### Input Fields

- Left/right aligned icons based on RTL setting
- Focus states with blue ring
- Rounded corners (`rounded-xl`)
- Appropriate padding and spacing

### Cards

- Rounded corners (`rounded-2xl`)
- Subtle shadows (`shadow-lg`, `shadow-2xl` on hover)
- Border treatment based on theme
- Smooth transitions for hover effects

## Navigation Structure

### Main Navigation Bar

- Sticky header with backdrop blur
- Brand logo linking to home
- Primary navigation links:
  - Home
  - Categories
  - Contact
- Utility controls:
  - Language selector (FR/AR/EN)
  - Theme toggle (Light/Dark)
  - User avatar/profile access

### Mobile Navigation

- Collapsible hamburger menu
- Vertical navigation stack
- Language and theme controls in menu
- Close button for menu dismissal

## Application Views

### Authentication System

The application has two authentication views that share common components:

#### Login View
- Welcome heading ("Welcome Back!") with subtitle ("Ready to master WLangage?")
- Email input field with mail icon
- Password input with lock icon
- "Forgot password" link
- Sign in button
- Registration link for new users ("No account yet? Create Account")

#### Registration View
- Join heading ("Join the Elite") with subtitle ("Access the best WinDev resources.")
- Email input field
- Password input field
- Confirm password input field
- Create account button
- Login link for existing users ("Already a member? Login")

### Categories Page

- Grid layout of category cards (responsive: 1 column on mobile, 2 on tablet, 3 on desktop)
- Each card represents a technology category:
  - WINDEV (Monitor icon, blue gradient)
  - WEBDEV (Globe icon, purple gradient)
  - MOBILE (Smartphone icon, green gradient)
  - HFSQL (Database icon, yellow gradient)
  - WLANGAGE (Code icon, red gradient)
  - PACKS (Package icon, gray gradient)
- Visual representation with category-specific colors
- Hover effects showing "Start Learning" call-to-action
- Icons representing each technology with backdrop blur effect

### Course Catalog Page

#### Header Section

- Page title ("Courses") and description ("Ready to master WLangage?")
- Search bar with search icon and placeholder text
- Filter controls in a horizontal bar

#### Filter Controls

- Category filter dropdown with all categories
- Level filter dropdown (All/Beginner/Intermediate/Expert)
- Price filter dropdown (All/Free/Premium)

#### Course Grid

- Responsive grid of course cards (1 column on mobile, 2 on tablet, 3 on desktop)
- Each card contains:
  - Category-colored thumbnail with play icon on hover
  - Free/Premium badge positioned at top corner
  - Category tag at bottom
  - Difficulty level badge with color coding (green for beginner, blue for intermediate, purple for expert)
  - Version indicator
  - Course title with language support
  - Instructor name
  - Star rating display with numerical rating
  - Review count
  - Lesson count and duration

### Video Player Page

#### Video Area

- Aspect ratio maintained video container with placeholder
- Large play button overlay in center
- Progress bar with draggable control
- Video identification watermark

#### Content Area

- Course title and current position
- Certificate button for completed courses
- Tabbed interface for:
  - Overview
  - Q&A
  - Resources
- Detailed content description with language support

#### Sidebar

- Course content listing with fixed width
- Expandable modules showing lessons
- Lesson items with status indicators:
  - Completed (checkmark icon)
  - Current (animated pulsing dot)
  - Locked (lock icon)
- Time estimates for each lesson

## Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| Mobile (<768px) | Single column layout, collapsible navigation, stacked filters |
| Tablet (768px-1024px) | Two column layouts where appropriate, persistent navigation |
| Desktop (>1024px) | Full multi-column layouts, expanded navigation |

## Internationalization Features

- Full RTL support for Arabic language
- Dedicated font handling for Arabic script (Cairo)
- Language-specific text direction throughout UI
- Context-appropriate text alignment based on language selection
- Translated content for all UI elements in French, English, and Arabic

## Interactive States

| State | Visual Treatment |
|-------|------------------|
| Hover | Scale transformation (1.02x), shadow enhancement, color shifts |
| Active | Scale reduction (0.98x) for pressed effect |
| Focus | Ring indicators for keyboard navigation |
| Loading | Animated pulse effects |
| Disabled | Reduced opacity, removed interactions |

## Data Models

### Course Model

| Property | Type | Description |
|----------|------|-------------|
| id | Number | Unique identifier |
| title | Object | Localized titles (fr/en/ar) |
| author | Object | Localized author names (fr/en/ar) |
| price | String | "FREE" or "PREMIUM" |
| duration | String | Duration in hours |
| lessonsCount | Number | Number of lessons |
| image | String | Background gradient class |
| progress | Number | Completion percentage |
| level | String | "beginner", "intermediate", or "expert" |
| version | String | Compatible software version |
| rating | Number | Average rating (0-5) |
| reviewsCount | Number | Number of reviews |
| category | String | Category identifier |

### Category Model

| Property | Type | Description |
|----------|------|-------------|
| id | String | Category identifier |
| label | String | Display name |
| icon | Component | Lucide React icon component |
| color | String | Gradient color classes |

## Accessibility Considerations

- Proper contrast ratios for text in both themes
- Focus indicators for keyboard navigation
- Semantic HTML structure
- ARIA attributes where appropriate
- Screen reader compatible labeling

## Performance Optimization

- Efficient CSS with Tailwind utility classes
- Minimal JavaScript for interactive elements
- Optimized SVG icons from Lucide React
- Lazy loading for non-critical assets
- Efficient rendering with React component structure
