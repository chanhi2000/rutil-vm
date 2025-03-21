import React from "react";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "./BaseModal.css";
import { RVI24, rvi24Close } from "../icons/RutilVmIcons";
/**
 * @name BaseModal
 * @description 기본 모달 테두리
 *
 * @returns
 */
const BaseModal = ({
  isOpen,
  onClose,
  targetName,
  submitTitle,
  onSubmit,
  children,
  contentStyle = {},
}) => {
  
  // console.log("...");
  return (
    <Modal className="Modal" overlayClassName="Overlay"
      // overlayClassName="Overlay newRolePopupOverlay" <-- DiskActionModal, DomainGetDiskModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={targetName}
      shouldCloseOnOverlayClick={false}
    >
      <div className="modal" style={contentStyle}>
        <div className="popup-header center">
          <h1>
            {`${targetName} ${submitTitle}`}
          </h1>
          <button onClick={onClose}>
            <RVI24 iconDef={rvi24Close} />
          </button>
        </div>
        
        {children}

        {/* 하단 버튼 */}
        <div className="edit-footer">
          <button className="action" onClick={onSubmit}>{submitTitle}</button>
          <button className="cancel" onClick={onClose}>취소</button>
        </div>
      </div>
    </Modal>
  );
};

export default BaseModal;
