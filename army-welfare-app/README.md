# Army Welfare Frontend Application

This is the frontend application for the Army Welfare project built with Next.js, TypeScript, and Tailwind CSS.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Shadcn UI Components
- PNPM as package manager

## Prerequisites

- Node.js 18.x or higher
- PNPM package manager

## Getting Started

1. Clone the repository:
```bash
git clone <your-repository-url>
cd frontend
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Build

To create a production build:

```bash
pnpm build
```

To start the production server:

```bash
pnpm start
```

## Project Structure

- `/app` - Next.js app router pages and layouts
- `/components` - Reusable UI components
- `/lib` - Utility functions and shared logic
- `/hooks` - Custom React hooks
- `/styles` - Global styles and Tailwind CSS configuration
- `/public` - Static assets

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:
```env
NEXT_PUBLIC_API_URL=your_backend_api_url
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details 