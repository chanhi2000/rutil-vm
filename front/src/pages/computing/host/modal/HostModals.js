import React from "react";
import HostModal from "./HostModal";
import HostDeleteModal from "./HostDeleteModal";
import HostActionModal from "./HostActionModal";

const HostModals = ({ activeModal, host, selectedHosts = [], clusterId, onClose }) => {
  const modals = {
    create: (
      <HostModal
        isOpen={activeModal === 'create'}
        clusterId={clusterId}
        onClose={onClose}
      />
    ),
    edit: (
      <HostModal
        editMode
        isOpen={activeModal === 'edit'}
        hId={host?.id}
        clusterId={clusterId}
        onClose={onClose}
      />
    ),
    delete: (
      <HostDeleteModal
        isOpen={activeModal === 'delete' }
        data={selectedHosts}
        onClose={onClose}
      />
    ),
    action: (
      <HostActionModal
        isOpen={['deactivate', 'activate', 'restart', 'reInstall', 'register', 'haOn', 'haOff'].includes(activeModal)}
        action={activeModal}
        data={selectedHosts}
        onClose={onClose}
      />
    ),
  };

  return (
    <>
      {Object.keys(modals).map((key) => (
          <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
};

export default HostModals;