import React from "react";
import SettingUserSessionsModal from "./SettingUserSessionsModal"

/**
 * @name SettingUserSessionsModals
 * @description 관리 > 활성 사용자 세션 모달 모음
 * 
 * @returns 
 */
const SettingUserSessionsModals = ({
  modalType, userSession, onClose 
}) => {
  const allModals = {
    create:  (
      <SettingUserSessionsModal isOpen={modalType==="endSession"} onClose={onClose} 
        targetName={"사용자 세션"}
      />
    ),
  }
  console.log("...")
    return (
      <>
        {Object.keys(allModals).map((key) => (
          <React.Fragment key={key}>{allModals[key]}</React.Fragment>
        ))}
      </>
    );
}

export default SettingUserSessionsModals
