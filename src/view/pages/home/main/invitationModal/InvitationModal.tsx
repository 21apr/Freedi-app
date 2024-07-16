import { FC, useState, useEffect } from "react";
import Modal from "../../../../components/modal/Modal";
import styles from "./InvitationModal.module.scss";
import {
  getInvitationPathName,
  getMaxInvitationDigits,
} from "../../../../../controllers/db/invitations/getInvitations";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../../../controllers/hooks/useLanguages";
import Button from "../../../../components/buttons/button/Button";

interface Props {
  setShowModal: (show: boolean) => void;
}
const InvitationModal: FC<Props> = ({ setShowModal }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [maxInvitation, setMaxInvitation] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    getMaxInvitationDigits().then((result) => {
      return setMaxInvitation(result);
    });
  }, []);

  async function handleJoin(ev: React.FormEvent<HTMLFormElement>) {
    try {
      ev.preventDefault();

      let pins = gettingPinsFromInput(maxInvitation, ev);
	  setMaxInvitation(pins);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Modal>
      <div className={styles.invitation}>
        <form
          className={styles.invitation__form}
          onSubmit={(e) => handleJoin(e)}
        >
          <input
            type="number"
            placeholder="Enter PIN"
            id="pin"
            required={true}
            value={pin}
            onChange={(e) => setPin(parseInt(e.target.value))}
          />
          {errorMessage && (
            <div className={styles.invitation__error}>{errorMessage}</div>
          )}
          <div className="btns">
            <button type="submit" className="btn btn--affirmation">
              {t("Join")}
            </button>

            <Button
              text={t("Cancel")}
              onClick={() => setShowModal(false)}
              className="btn"
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};
export default InvitationModal;
