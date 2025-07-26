import { VercelV0Chat } from "@/components/ui/v0-ai-chat";

export default function Index() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20">
      {/* Main AI-powered Search Engine Area */}
      <VercelV0Chat />
    </main>
  );
}
