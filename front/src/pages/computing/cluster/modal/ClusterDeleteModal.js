import React, { useMemo } from 'react';
import Modal from 'react-modal';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDeleteCluster } from '../../../../api/RQHook';
import { warnButton, xButton } from '../../../../utils/Icon';

const ClusterDeleteModal = ({ isOpen, onClose, data }) => {
  const navigate = useNavigate();
  const { mutate: deleteCluster } = useDeleteCluster();

  const { ids, names } = useMemo(() => {
    if (!data) return { ids: [], names: [] };
    
    const dataArray = Array.isArray(data) ? data : [data];
    return {
      ids: dataArray.map((item) => item.id),
      names: dataArray.map((item) => item.name || 'undefined'),
    };
  }, [data]);

  const handleDelete = () => {
    if (ids.length === 0) {
      toast.error('삭제할 클러스터 ID가 없습니다.');
      return;
    }
  
    ids.forEach((clusterId, index) => {
      deleteCluster(clusterId, {
        onSuccess: () => {
          if (ids.length === 1 || index === ids.length - 1) { // 마지막 클러스터 삭제 후 이동
            onClose();
            toast.success("클러스터 삭제 성공")
            // navigate('/computing/rutil-manager/clusters');
          }
        },
        onError: (error) => {
          toast.error(`클러스터 삭제 오류:`, error);
        },
      });
    });
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="Modal" overlayClassName="Overlay" shouldCloseOnOverlayClick={false} >
      <div className="storage-delete-popup">
        <div className="popup-header">
          <h1>클러스터 삭제</h1>
          <button onClick={onClose}>{ xButton() }</button>
        </div>

        <div className="disk-delete-box">
          <div>
            { warnButton() }
            <span> {names.join(', ')} 를(을) 삭제하시겠습니까? </span>
          </div>
        </div>

        <div className="edit-footer">
          <button style={{ display: 'none' }}></button>
          <button onClick={handleDelete}>OK</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </Modal>
  );
};

export default ClusterDeleteModal;
