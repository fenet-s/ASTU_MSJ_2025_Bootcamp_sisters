export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Campus Marketplace</h1>
      <p className="mt-4 text-gray-600">Welcome to the student hub.</p>
      <a
        href="/login"
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Go to Login
      </a>
    </div>
  );
}
