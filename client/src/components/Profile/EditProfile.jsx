export default function EditProfile() {
  return (
    <div className="edit-profile">
      <h1>Edit Profile</h1>
      {/* Add form elements here */}
      <form>
        <div className="edit-picture">
            <label htmlFor="profile-picture">Profile Picture:</label>
        <input type="file" id="profile-picture" name="profile-picture" accept="image/*" />
        </div>
        <div className="edit-details">
             <label htmlFor="username">Username:</label>
        <input type="text" id="username" name="username" />
        <label htmlFor="bio">Bio:</label>
        <textarea id="bio" name="bio" rows="4" cols="50"></textarea>
        </div>
       <div className="edit-details">
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" />
        <label htmlFor="location">Location:</label>
        <input type="text" id="location" name="location" />
        </div>
        <div className="edit-details">
        <label htmlFor="phone">Phone Number:</label>
        <input type="tel" id="phone" name="phone" />
        <label htmlFor="profession">Profession:</label>
        <input type="text" id="profession" name="profession" />
        </div>
        

        <button type="submit">Save Changes</button>
      </form>
     
    </div>
  );
}