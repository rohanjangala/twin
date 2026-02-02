import Twin from '@/components/twin';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl h-[85vh] flex flex-col">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            AI Digital Twin
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            w/ access to LinkedIn, Github and more
          </p>
        </div>

        <div className="flex-1 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200/50 relative">
          <Twin />
        </div>

        <footer className="mt-6 text-center text-xs text-gray-400">
          <p><i>limited for professional conversations</i></p>
        </footer>
      </div>
    </main>
  );
}