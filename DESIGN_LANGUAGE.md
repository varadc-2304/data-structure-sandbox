# Design Language Document

Complete design system reference for Quest Grade Platform. All colors use HSL values defined as CSS variables in `src/index.css`.

---

## Color System

### Core Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| Primary | `hsl(0, 84%, 60%)` | `hsl(0, 84%, 60%)` | Main actions, brand |
| Background | `hsl(0, 0%, 100%)` | `hsl(0, 0%, 5%)` | Page background |
| Foreground | `hsl(0, 0%, 10%)` | `hsl(0, 0%, 98%)` | Main text |
| Card | `hsl(0, 0%, 100%)` | `hsl(0, 0%, 8%)` | Card background |
| Secondary | `hsl(0, 0%, 96%)` | `hsl(0, 0%, 12%)` | Secondary actions |
| Muted | `hsl(0, 0%, 96%)` | `hsl(0, 0%, 12%)` | Disabled states |
| Border | `hsl(0, 0%, 90%)` | `hsl(0, 0%, 15%)` | Borders, inputs |
| Success | `hsl(142, 71%, 45%)` | `hsl(142, 71%, 45%)` | Success states |
| Warning | `hsl(38, 92%, 50%)` | `hsl(38, 92%, 50%)` | Warnings |
| Destructive | `hsl(0, 84%, 60%)` | `hsl(0, 84%, 60%)` | Errors, delete |

**Usage Guidelines:**
- Primary: Actions, highlights, brand elements
- Secondary: Secondary actions, subtle backgrounds
- Muted: Disabled states, placeholders, less important text
- Success/Warning/Destructive: Semantic feedback

---

## Typography

**Font Stack:** System fonts (`system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`)

| Size | Class | Pixels | Usage |
|------|-------|--------|-------|
| 3xl | `text-3xl` | 30px | Page titles |
| 2xl | `text-2xl` | 24px | Card titles |
| xl | `text-xl` | 20px | Section headings |
| lg | `text-lg` | 18px | Large body text |
| base | `text-base` | 16px | Default body |
| sm | `text-sm` | 14px | Secondary text |
| xs | `text-xs` | 12px | Fine print |

**Weights:** `font-bold` (700), `font-semibold` (600), `font-medium` (500), `font-normal` (400)  
**Mono:** `font-mono` for code, assessment codes, timers

---

## Spacing & Layout

**Scale:** Tailwind default (4px base unit: 0, 1, 2, 3, 4, 6, 8, 12, 16, 20, 24)

| Pattern | Class | Usage |
|---------|-------|-------|
| Form container | `space-y-6` | 24px vertical gap |
| Form field | `space-y-2` | 8px between label/input |
| Sections | `space-y-4` | 16px between sections |
| Card padding | `p-6` | 24px all sides |
| Page padding | `p-4` / `p-8` | Mobile / Desktop |

**Layout Patterns:**
- Centered: `max-w-2xl mx-auto`
- Full width: `container mx-auto px-4`
- Flex: `flex items-center gap-4`
- Grid: `grid grid-cols-1 md:grid-cols-2 gap-4`

---

## Border Radius

**Base:** `1.5rem` (24px) via CSS variable `--radius`

| Class | Value | Usage |
|-------|-------|-------|
| `rounded-md` | 22px | Buttons, inputs |
| `rounded-lg` | 24px | Cards, containers |
| `rounded-3xl` | 24px | Option buttons, info cards |
| `rounded-full` | 50% | Icons, avatars |

**Border Width:** `border` (1px), `border-2` (2px for cards)

---

## Component Patterns

### Cards

```tsx
<Card className="border-2">
  <CardHeader>
    <CardTitle className="text-2xl">Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>{/* Content */}</CardContent>
</Card>
```

**Icon Header:**
```tsx
<div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
  <Icon className="h-8 w-8 text-primary" />
</div>
```

**Info Card:**
```tsx
<div className="flex items-start gap-3 p-4 bg-secondary rounded-3xl">
  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
    <Icon className="h-5 w-5 text-primary" />
  </div>
  <div className="flex-1">
    <p className="font-semibold">Label</p>
    <p className="text-sm text-muted-foreground">Value</p>
  </div>
</div>
```

### Buttons

**Variants:** `default`, `outline`, `secondary`, `ghost`, `destructive`, `link`  
**Sizes:** `sm` (h-9), `default` (h-10), `lg` (h-11), `icon` (h-10 w-10)

```tsx
<Button className="w-full h-12 text-base">Primary</Button>
<Button variant="outline" size="lg">Secondary</Button>
<Button variant="outline" size="icon"><Icon className="h-5 w-5" /></Button>
```

### Forms

```tsx
<form className="space-y-6">
  <div className="space-y-2">
    <Label htmlFor="field">Label</Label>
    <Input id="field" className="h-12" />
  </div>
</form>
```

**Large Input (codes):**
```tsx
<Input className="h-14 text-2xl font-mono tracking-wider text-center uppercase" />
```

### Loading States

```tsx
<div className="text-center space-y-4">
  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
  <p className="text-muted-foreground">Loading...</p>
</div>
```

### Dialogs

```tsx
<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Title</AlertDialogTitle>
      <AlertDialogDescription>Description</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Confirm</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Navigation

**Header:**
```tsx
<div className="border-b bg-card sticky top-0 z-10">
  <div className="container mx-auto px-4 py-3 flex items-center justify-between">
    {/* Content */}
  </div>
</div>
```

**Fixed Bottom:**
```tsx
<div className="fixed bottom-0 left-0 right-0 border-t bg-card z-20 shadow-lg">
  <div className="container mx-auto px-4 py-4">
    {/* Navigation */}
  </div>
</div>
```

### MCQ Option Button

```tsx
<button className={cn(
  "w-full p-4 text-left rounded-3xl border-2 transition-all",
  "hover:border-primary hover:bg-primary/5",
  isSelected ? "border-primary bg-primary/10 font-medium" : "border-border bg-card"
)}>
  <div className="flex items-center gap-3">
    <div className={cn(
      "h-6 w-6 rounded-full border-2 flex items-center justify-center",
      isSelected ? "border-primary bg-primary" : "border-border"
    )}>
      {isSelected && <div className="h-3 w-3 rounded-full bg-white" />}
    </div>
    <span className="text-base">{optionText}</span>
  </div>
</button>
```

---

## Icons

**Library:** Lucide React  
**Sizes:** `h-4 w-4` (16px), `h-5 w-5` (20px), `h-8 w-8` (32px), `h-10 w-10` (40px)

**Common Icons:** `GraduationCap`, `KeyRound`, `Clock`, `CheckCircle2`, `ShieldAlert`, `Menu`, `Moon`/`Sun`, `LogOut`, `Play`, `RotateCcw`, `ChevronDown`/`ChevronUp`, `Trophy`, `Calendar`

---

## Animations

- **Spinner:** `animate-spin rounded-full h-12 w-12 border-b-2 border-primary`
- **Pulse:** `animate-pulse`
- **Transitions:** `transition-colors` (150ms), `transition-all` (200ms)
- **Accordion:** `0.2s ease-out`

---

## Design Principles

1. **Consistency** - Use same colors, spacing, and patterns throughout
2. **Accessibility** - WCAG AA contrast, semantic HTML, focus states, ARIA labels
3. **Responsiveness** - Mobile-first, breakpoints: `md:` (768px), `lg:` (1024px), `xl:` (1280px), `2xl:` (1400px)
4. **Dark Mode** - All components support both themes via CSS variables
5. **User Experience** - Clear feedback, loading states, error handling, consistent navigation
6. **Performance** - System fonts, minimal animations, optimized assets, lazy loading

---

## UI Component Library

**Base:** shadcn/ui (Radix UI + Tailwind CSS + CVA)

**Components:** Accordion, Alert, Alert Dialog, Avatar, Badge, Button, Card, Checkbox, Dialog, Dropdown Menu, Input, Label, Select, Sheet, Tabs, Toast, Tooltip

**Customization:** Tailwind utilities, CSS variables, variant props

**Structure:**
```
components/
  ui/component-name.tsx  # Base component
  ComponentName.tsx       # Custom implementation
```

---

## Implementation

**CSS Variables:** Defined in `src/index.css`  
**Tailwind Config:** `tailwind.config.ts`  
**Theme Toggle:** CSS class `dark` on root, localStorage persistence

**Best Practices:**
1. Always use design tokens (no hardcoded colors/spacing)
2. Follow component patterns
3. Test in both themes
4. Maintain accessibility
5. Keep designs simple
6. Use consistent spacing
7. Test responsive design

---

**Version:** 1.0 | **Last Updated:** 2024
