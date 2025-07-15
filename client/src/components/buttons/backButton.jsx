import { useNavigate } from "react-router-dom";
import "./backButton.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward } from "@fortawesome/free-solid-svg-icons";
export default function BackButton() {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <button className="back-button" onClick={handleBack}>
      <FontAwesomeIcon icon={faBackward} />
      <span className="back-text">Back</span>
    </button>
  );
}
