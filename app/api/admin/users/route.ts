import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Clerk থেকে লগইন করা ইউজারের আইডি নিন
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized – you must be logged in" },
        { status: 401 }
      );
    }

    // 2. Clerk থেকে ওই ইউজারের সম্পূর্ণ প্রোফাইল আনুন
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);

    // 3. এখানে আপনার অন্য যেকোনো ডাটা সোর্স (যেমন Sanity, MongoDB, Firebase) থেকে
    //    ইউজারের আরও তথ্য নিয়ে আসতে পারেন – কল্পনা করি একটি ফাংশন আছে getAdditionalUserData()
    //    যেটা ইউজারের ইমেইল বা আইডি দিয়ে ডাটাবেস থেকে ডাটা আনে।
    const additionalData = await getAdditionalUserData(user.primaryEmailAddress?.emailAddress);

    // 4. রেসপন্স তৈরি করুন (Clerk তথ্য + অতিরিক্ত তথ্য একত্রে)
    const combinedData = {
      clerkUser: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
        email: user.primaryEmailAddress?.emailAddress,
        imageUrl: user.imageUrl,
        createdAt: user.createdAt,
        lastSignInAt: user.lastSignInAt,
        emailVerified: user.primaryEmailAddress?.verification?.status === "verified",
        banned: user.banned,
        locked: user.locked,
        twoFactorEnabled: user.twoFactorEnabled,
      },
      additional: additionalData, // যেমন: favouriteProducts, orders, অথবা কিছুই না
    };

    return NextResponse.json(combinedData);
  } catch (error) {
    console.error("Error in /api/user/combined-data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// এই ফাংশনটি আপনার পছন্দমতো ইমপ্লিমেন্ট করুন।
// উদাহরণ: Sanity থেকে ইউজার সম্পর্কিত কাস্টম ডাটা আনা।
async function getAdditionalUserData(email?: string | null) {
  if (!email) return null;

  // নিচের উদাহরণটি শুধু স্থির ডাটা রিটার্ন করে। আপনি বাস্তব ডাটাবেস কল দিতে পারেন।
  // যেমন Sanity ক্লায়েন্ট দিয়ে GROQ কোয়েরি:
  /*
    const sanityClient = getSanityClient();
    const orders = await sanityClient.fetch(`*[_type == "order" && email == $email]`, { email });
    return { orders };
  */
  
  // অস্থায়ী উদাহরণ (ডামি ডাটা)
  return {
    customMessage: "আপনার জন্য অতিরিক্ত কোনো তথ্য নেই (আপনি ডাটাবেস যুক্ত করতে পারেন)",
    lastLoginFromIP: "127.0.0.1",
  };
}