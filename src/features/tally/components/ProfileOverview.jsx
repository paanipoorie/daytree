function ProfileOverview({ user }) {
  return (
    <section className="profile-overview">
      <div className="profile-avatar">
        {user?.profilePicture?.url ? (
          <img 
            src={user.profilePicture.url} 
            alt="Profile" 
            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
          />
        ) : (
          "profile_pic"
        )}
      </div>
      <p>Hi, {user?.username || user?.email || "user"}</p>
    </section>
  );
}

export default ProfileOverview;
