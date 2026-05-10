function ProfileOverview({ user }) {
  return (
    <section className="profile-overview">
      <div className="profile-avatar">profile_pic</div>
      <p>Hi, {user?.email || "user"}</p>
    </section>
  );
}

export default ProfileOverview;
