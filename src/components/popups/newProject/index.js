import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import countries from "./countries";
import languages from "./languages";

import { AuthContext } from "../../../providers/Auth";

import { newProject } from "../../../actions";

import InputField from "../../formComponents/inputField";

const NewProject = ({ newProject }) => {
  const [values, setValues] = useState(null);
  const [languageLabel, setLanguageLabel] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(false);
  const { currentUserProfile } = useContext(AuthContext);

  useEffect(() => {
    if (!!currentUserProfile) {
      setValues({
        ...values,
        users: [currentUserProfile.uid],
        team: [
          {
            uid: currentUserProfile.uid,
            name: currentUserProfile.name || "",
            avatar: currentUserProfile.avatar || ""
          }
        ]
      });
    }
  }, [currentUserProfile]);

  const handleSubmit = event => {
    event.preventDefault();

    if (!!values.title && values.country && values.lang) {
      setSubmitting(true);
      newProject(values, setSubmitting);
    } else {
      setFormError(true);
    }
  };
  const createCountryOptions = () => {
    const languageOptions = [];
    languages.map(language => {
      languageOptions.push(language.name);
    });
    return languageOptions;
  };

  const handleLanguageSelect = langChoice => {
    languages.filter(lang => {
      if (lang.name === langChoice.value) {
        setValues({ ...values, lang: lang.code });
        setLanguageLabel(lang.name);
      }
    });
  };

  return (
    <div className="popup" id="new-project">
      <a className="popup__close" href="#">
        Close
      </a>
      <div className="popup__container">
        <div className="popup__title medium-margin-bottom">
          Create a new project
        </div>
        {submitting ? (
          <div className="centered">
            <Loader
              type="Grid"
              color="#1472FF"
              height={100}
              width={100}
              timeout={3000} //3 secs
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <InputField
              type="text"
              placeHolder="Title"
              value={!!values && values.title}
              onChange={title => setValues({ ...values, title })}
              label="Title"
            />

            <div className="tiny-margin-bottom tiny-margin-top">
              Where are most of your customers from?
            </div>
            <Dropdown
              options={countries}
              onChange={country =>
                setValues({ ...values, country: country.value })
              }
              value={!!values && values.country}
              placeholder="Country"
            />

            <div className="tiny-margin-bottom medium-margin-top">
              What language would most of your customers speak?
            </div>
            <Dropdown
              options={createCountryOptions()}
              onChange={lang => handleLanguageSelect(lang)}
              value={languageLabel}
              placeholder="Language"
            />
            {formError ? (
              <div className="form-error small-margin-top">
                Please fill out all three fields
              </div>
            ) : null}
            <div className="popup__button medium-margin-top">
              <button type="submit" className="boxed-button ">
                Launch
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default connect(null, { newProject })(NewProject);
