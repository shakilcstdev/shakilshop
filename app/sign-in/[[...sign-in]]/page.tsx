
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-screen w-full min-w-0 max-w-full overflow-x-hidden px-4 py-8 sm:px-6">
      <div className="mx-auto flex w-full min-w-0 max-w-md justify-center">
        <SignIn
          appearance={{
            elements: {
              rootBox: {
                width: "100%",
                maxWidth: "100%",
                marginInline: "auto",
              },
              cardBox: {
                width: "100%",
                maxWidth: "100%",
              },
              card: {
                width: "100%",
                maxWidth: "100%",
                marginInline: "auto",
              },
            },
          }}
        />
      </div>
    </main>
  );
}