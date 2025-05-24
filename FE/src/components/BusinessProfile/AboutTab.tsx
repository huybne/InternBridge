import '../../pages/identity/user/business/BusinessProfile.css';

const AboutTab = ({ user }) => {
  return (
    <div className="tab-pane active">
      <h3>About {user?.username || 'User'}</h3>
      <table className="table table-bordered">
        <tbody>
          <tr>
            <td>
              <strong>Username</strong>
            </td>
            <td>{user?.username || '-'}</td>
          </tr>
          <tr>
            <td>
              <strong>Email</strong>
            </td>
            <td>{user?.email || '-'}</td>
          </tr>
          <tr>
            <td>
              <strong>Role</strong>
            </td>
            <td>{user?.roleNames?.join(', ') || '-'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AboutTab;
