# AI Customer Support Chat

This project is an AI-powered customer support application built with Next.js and OpenAI.

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- OpenAI API key

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/your-username/ai_customer_support.git
   cd ai_customer_support
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add your OpenAI API key:
   ```
   OPEN_AI_KEY=your_openai_api_key_here
   ```

4. Start the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:3000` to see the application running.

## Project Structure

- `app/`: Contains the main application code
  - `api/`: API routes
  - `components/`: React components
  - `layout.js`: Root layout component
  - `page.js`: Main page component
- `public/`: Static assets
- `app/SystemPrompt.js`: Contains the system prompt for the AI

## Features

- AI-powered customer support chat
- Persistent chat history using `ChatMessageHistory`
- Integration with OpenAI's GPT-4 model

## API Routes

- `POST /api/chat`: Handles chat messages and returns AI responses

## Customization

You can customize the AI behavior by modifying the system prompt in `app/SystemPrompt.js`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
