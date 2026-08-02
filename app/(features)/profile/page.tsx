import ProfilePageContainer from "./components/ProfilePageContainer";

export const dynamic = 'force-dynamic';

export default function ProfilePage() {
  return (
    <div className="container-width mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <ProfilePageContainer />
    </div>
  );
}
