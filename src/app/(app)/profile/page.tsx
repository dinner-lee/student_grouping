import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/login");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-0.5">
        <div className="font-display text-[17px] font-bold tracking-tight">사용자 정보 수정</div>
        <div className="text-[12.5px] text-stone-400">
          표시되는 이름을 변경할 수 있습니다. 프로필 사진은 Google 로그인 연동 시 자동으로
          가져옵니다.
        </div>
      </div>
      <ProfileForm name={user.name} image={user.image} username={user.username} />
    </div>
  );
}
