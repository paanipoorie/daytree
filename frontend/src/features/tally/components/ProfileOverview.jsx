function ProfileOverview({ user }) {
  const initials = user?.username 
    ? user.username.charAt(0).toUpperCase() 
    : user?.email 
      ? user.email.charAt(0).toUpperCase() 
      : "?";

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
          <span className="avatar-initials" style={{ fontSize: '32px', fontWeight: '900' }}>{initials}</span>
        )}
      </div>
      <p>Hi, {user?.username || user?.email || "user"}</p>
    </section>
  );
}

export default ProfileOverview;
