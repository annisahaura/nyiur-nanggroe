# Contributing to Nyiur Nanggroe

Thank you for contributing to Nyiur Nanggroe! Follow these steps to set up the codebase and submit your changes.

## Development Setup

1. **Clone the Repo** and install dependencies:
   ```bash
   npm install
   ```
2. **Setup Local Database**:
   - Install Supabase CLI
   - Spin up local containers: `supabase start`
3. **Environment Variables**:
   - Copy `.env.example` to `.env.local`
   - Fill in your local Supabase keys and API providers.
4. **Run Server**:
   ```bash
   npm run dev
   ```

## Development Guidelines

1. **Type Safety**: Maintain TypeScript compatibility. Don't use `any` unless absolutely necessary.
2. **Component Separation**: Reuse UI components from `src/components/ui/` rather than adding new style utility files.
3. **Testing**: Run tests before submitting changes:
   ```bash
   npm run test
   ```
4. **Code Quality**: Keep functions modular and separate UI from data access logic.
