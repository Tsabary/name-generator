import "./styles.scss";
import React, {useState} from "react";
import { Link } from "react-router-dom";

import {
  renderAvatars,
  handleInvite
} from "../functions";

const Header = ({ currentProject, addMember }) => {

  const [inviteEmail, setInviteEmail] = useState("");
  const [formSubmited, setFormSubmited] = useState(false);

  return (
    <div className="shuffler-header">
      <input
        className="shuffler-header__invite-checkbox"
        type="checkbox"
        id="invite_members"
      />
      <span className="shuffler-header__visible">
        <Link className="shuffler__navigate-back" to="/studio">
          <span className="tiny-margin-right">&#x2190;</span>
          {currentProject.title}
        </Link>
        <div className="shuffler-header__seperator" />

        {!!currentProject && !!currentProject.team ? (
          <div className="shuffler-header__members">
            {currentProject.team.length}{" "}
            {currentProject.team.length === 1 ? "member:" : "members:"}
            <div className="shuffler-header__member-avatars">
              {renderAvatars(currentProject.team)}
            </div>
          </div>
        ) : null}

        <div className="shuffler-header__seperator" />
        <div>
          <label className="text-button" htmlFor="invite_members">
            + Add members
          </label>
        </div>
      </span>
      <span className="shuffler-header__hidden">
        <label className="text-button" htmlFor="invite_members">
        <span className="tiny-margin-right">&#x2190;</span> Dashboard
        </label>
        {formSubmited ? (
          <div className="text-button" onClick={() => setFormSubmited(false)}>
            Add another member
          </div>
        ) : (
          <form
            onSubmit={e =>
              handleInvite(
                e,
                addMember,
                inviteEmail,
                setInviteEmail,
                setFormSubmited,
                currentProject.id
              )
            }
            className="shuffler-header__invite-form"
          >
            <input
              className="input-field__input"
              type="email"
              placeholder="Email address"
              autoComplete="new-password"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              required
            />
            <button type="submit" className="text-button">
              Add member
            </button>
          </form>
        )}
      </span>
    </div>
  );
};

export default Header;