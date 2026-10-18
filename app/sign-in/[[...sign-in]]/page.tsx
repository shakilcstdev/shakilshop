
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen w-full min-w-0 max-w-full items-center justify-center overflow-x-clip bg-gray-50 px-3 py-6 sm:px-6">
      <div className="flex w-full min-w-0 max-w-full items-center justify-center">
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto w-full max-w-full",
              cardBox: "w-full max-w-full",
              card: "w-full max-w-full",
            },
          }}
        />
      </div>
    </main>
  );
}