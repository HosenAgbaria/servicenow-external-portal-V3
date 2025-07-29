# ServiceNow External Portal

A modern, dynamic React portal that renders ServiceNow catalog items and record producers using real-time API metadata. Built with Vite, React, TypeScript, TailwindCSS, and shadcn/ui.

## ✨ Features

- **🎯 Dynamic Form Rendering**: Automatically renders forms based on ServiceNow field metadata
- **🔗 Real-time API Integration**: Uses ServiceNow APIs to fetch catalog items, requests, and knowledge base
- **🎨 Modern UI/UX**: Sophisticated, professional design with gradients, animations, and glass effects
- **📱 Responsive Design**: Works beautifully on all devices and screen sizes
- **⚡ State Management**: Zustand stores for catalog, requests, and UI state
- **🛡️ Type Safety**: Full TypeScript support with comprehensive type definitions
- **🧩 Component Library**: Built with shadcn/ui components for consistency
- **🔐 Form Validation**: Comprehensive client-side validation with error handling
- **📁 File Upload**: Support for file attachments and document uploads
- **🔄 Conditional Fields**: Dynamic field visibility based on dependencies
- **🔔 Toast Notifications**: User-friendly success/error notifications
- **⏳ Loading States**: Professional loading spinners and progress indicators

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: TailwindCSS + shadcn/ui + Inter Font
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **API**: Mock ServiceNow API (easily swappable to real APIs)

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   │   ├── button.tsx      # Enhanced button with gradients
│   │   ├── card.tsx        # Modern card components
│   │   ├── input.tsx       # Form input fields
│   │   ├── textarea.tsx    # Text area component
│   │   ├── select.tsx      # Dropdown select component
│   │   ├── checkbox.tsx    # Checkbox component
│   │   ├── radio-group.tsx # Radio button group
│   │   ├── file-input.tsx  # File upload component
│   │   ├── toast.tsx       # Toast notifications
│   │   └── loading-spinner.tsx # Loading indicators
│   ├── DynamicFormRenderer.tsx  # Complete dynamic form renderer
│   └── Header.tsx          # Modern navigation header
├── pages/
│   ├── HomePage.tsx        # Sophisticated landing page
│   ├── ServiceCatalogPage.tsx  # Enhanced catalog browsing
│   ├── RequestSubmissionPage.tsx  # Dynamic form submission
│   ├── RequestsListPage.tsx  # User requests list
│   ├── RequestDetailsPage.tsx  # Individual request view
│   └── KnowledgeBasePage.tsx  # Knowledge base
├── stores/
│   ├── catalogStore.ts     # Catalog state management
│   ├── requestsStore.ts    # Requests state management
│   └── uiStore.ts          # UI state management
├── services/
│   └── api.ts              # Comprehensive API service layer
├── types/
│   └── index.ts            # Complete TypeScript type definitions
└── lib/
    └── utils.ts            # Utility functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd servicenow-portal
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎨 Design System

### Color Palette
- **Primary**: Slate grays and blue accents
- **Gradients**: Beautiful blue-to-purple gradients
- **Background**: Subtle gradient backgrounds
- **Text**: High contrast for accessibility

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Hierarchy**: Clear heading and body text styles

### Components
- **Cards**: Elevated with shadows and hover effects
- **Buttons**: Multiple variants including gradients
- **Forms**: Professional styling with validation states
- **Loading**: Smooth animations and spinners

## 🔧 API Integration

### Current Implementation

The project uses a comprehensive mock API service (`src/services/api.ts`) that simulates ServiceNow API responses with:

- **Complete Field Types**: All ServiceNow field types supported
- **Dynamic Forms**: Conditional field visibility and dependencies
- **Validation**: Client-side validation with error messages
- **File Upload**: Mock file handling
- **Reference Fields**: Dynamic option loading

### ServiceNow Field Type Support

| ServiceNow Type | React Component | Features |
|----------------|----------------|----------|
| `string` | Input (text) | Text validation, placeholders |
| `number` | Input (number) | Min/max validation |
| `boolean` | Checkbox | True/false selection |
| `choice` | Select | Dropdown with options |
| `reference` | Select | Dynamic reference loading |
| `glide_date` | Input (date) | Date picker |
| `glide_date_time` | Input (datetime-local) | Date/time picker |
| `email` | Input (email) | Email validation |
| `url` | Input (url) | URL validation |
| `textarea` | Textarea | Multi-line text |
| `file` | FileInput | File upload with drag/drop |

### Switching to Real ServiceNow APIs

See [SERVICENOW_API_INTEGRATION.md](./SERVICENOW_API_INTEGRATION.md) for complete integration guide.

## 📋 Dynamic Form Features

### Field Dependencies
```typescript
// Show field when another field has specific value
{
  name: 'end_date',
  label: 'End Date',
  type: 'date',
  showWhen: {
    field: 'duration',
    value: 'temporary'
  }
}
```

### Validation Rules
```typescript
{
  name: 'email',
  label: 'Email',
  type: 'email',
  required: true,
  validation: {
    type: 'email',
    message: 'Please enter a valid email address'
  }
}
```

### Reference Fields
```typescript
{
  name: 'department',
  label: 'Department',
  type: 'reference',
  required: true,
  reference: 'cmn_department'
}
```

## 🎯 State Management

### Catalog Store
- Catalog items and categories
- Search and filtering
- Pagination
- Loading states

### Requests Store
- User requests
- Request details
- Status tracking
- Comments and attachments

### UI Store
- Global loading states
- Error handling
- Theme management
- Toast notifications

## 🔒 Security & Best Practices

### Form Validation
- Client-side validation for all field types
- Real-time error feedback
- Accessibility-compliant error messages
- Required field indicators

### Error Handling
- Comprehensive error boundaries
- User-friendly error messages
- Retry mechanisms
- Fallback states

### Accessibility
- ARIA labels and descriptions
- Keyboard navigation
- Screen reader support
- Focus management
- High contrast ratios

## 🧪 Testing

### Component Testing
```bash
npm run test
```

### E2E Testing
```bash
npm run test:e2e
```

### Accessibility Testing
```bash
npm run test:a11y
```

## 📦 Deployment

### Build for Production
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

### Environment Variables
```bash
# .env.local
VITE_SERVICENOW_INSTANCE=https://your-instance.service-now.com
VITE_SERVICENOW_CLIENT_ID=your_client_id
VITE_SERVICENOW_CLIENT_SECRET=your_client_secret
```

## 🚀 Performance Optimizations

- **Code Splitting**: Route-based code splitting
- **Lazy Loading**: Components loaded on demand
- **Memoization**: Optimized re-renders
- **Bundle Analysis**: Webpack bundle analyzer
- **Image Optimization**: Optimized assets

## 🔄 Development Workflow

### Code Quality
- ESLint configuration
- Prettier formatting
- TypeScript strict mode
- Husky pre-commit hooks

### Git Workflow
```bash
# Feature branch
git checkout -b feature/new-feature

# Development
npm run dev

# Testing
npm run test

# Build
npm run build

# Commit
git commit -m "feat: add new feature"
```

## 📚 Documentation

- [API Integration Guide](./SERVICENOW_API_INTEGRATION.md)
- [Component Documentation](./docs/components.md)
- [State Management Guide](./docs/state.md)
- [Styling Guide](./docs/styling.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Documentation**: [Wiki](https://github.com/your-repo/wiki)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Dynamic form rendering
- ✅ Modern UI design
- ✅ Basic validation
- ✅ Mock API integration

### Phase 2 (Next)
- 🔄 Real ServiceNow API integration
- 🔄 Advanced form features
- 🔄 Multi-step forms
- 🔄 File upload handling

### Phase 3 (Future)
- 📋 Advanced workflows
- 📋 Real-time updates
- 📋 Mobile app
- 📋 Advanced analytics

---

**Built with ❤️ for modern ServiceNow portals**
