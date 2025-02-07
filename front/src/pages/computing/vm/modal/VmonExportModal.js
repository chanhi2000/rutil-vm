import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import TablesOuter from '../../../../components/table/TablesOuter';
import TableColumnsInfo from '../../../../components/table/TableColumnsInfo';
import { useAllDataCenters, useAllHosts } from '../../../../api/RQHook';


const VmonExportModal = ({ isOpen, onRequestClose, selectedVm }) => {

  //모든 데이터센터 목록 가져오기
  const { 
    data: datacenters, 
  } = useAllDataCenters((e) =>({
    ...e,
  }));
  const [selectedDatacenter, setSelectedDatacenter] = useState('');
  // 데이터센터 목록 중 첫 번째 값을 기본값으로 설정
  useEffect(() => {
    if (datacenters && datacenters.length > 0) {
      setSelectedDatacenter(datacenters[0].name); // 첫 번째 데이터센터 이름을 기본값으로 설정
    }
  }, [datacenters]);



  // 모든 호스트 목록가져오기(수정해야됨 모든아님)
  const [host, setHost] = useState('#');
  const { 
    data: hosts, 
  } = useAllHosts(toTableItemPredicateHosts);
  function toTableItemPredicateHosts(host) {
    return {                
      name: host?.name ?? '',                                                     
    };
  }


  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="디스크 업로드"
      className="Modal"
      overlayClassName="Overlay"
      shouldCloseOnOverlayClick={false}
    >
      <div className="vm-bring-popup">
        <div className="popup-header">
          <h1>가상머신 가져오기</h1>
          <button onClick={onRequestClose}>
            <FontAwesomeIcon icon={faTimes} fixedWidth />
          </button>
        </div>

        <div className="border-b border-gray-400">
          <div className="vm_select_box">
            <label htmlFor="datacenter">데이터 센터</label>
               <select
              id="datacenter"
              value={selectedDatacenter}
              onChange={(e) => setSelectedDatacenter(e.target.value)}
            >
              {datacenters?.map((datacenter, index) => (
                <option key={index} value={datacenter.name}>
                  {datacenter.name}
                </option>
              ))}
            </select>
          </div>
          <div className="vm_select_box">
            <label htmlFor="source">소스</label>
            <select id="source">
              <option value="none">가상 어플라이언스(OVA)</option>
            </select>
          </div>
        </div>

        <div >
          <div className="vm_select_box">
            <label htmlFor="vm_bring_host">호스트</label>
            <select id="host_select" value={host} onChange={(e) => setHost(e.target.value)}>  
              {hosts?.map((hostItem, index) => (
                <option key={index} value={hostItem.name}>
                  {hostItem.name}
                </option>
              ))}
            </select>
          </div>
          <div className="vm_select_box">
            <label htmlFor="filePath">파일 경로</label>
            <input type="text" id="filePath" />
          </div>
        </div>

        <div className="px-1.5">
          <div className="load-btn">로드</div>
        </div>

        <div className="vm-bring-table">
          <div>
            <div className="font-bold">소스 상의 가상 머신</div>
            <TablesOuter
              columns={TableColumnsInfo.VM_BRING_POPUP}
              data={[]}
              onRowClick={() => console.log('Row clicked')}
            />
          </div>
          <div>
            <div className="font-bold">가져오기할 가상 머신</div>
            <TablesOuter
              columns={TableColumnsInfo.VM_BRING_POPUP}
              data={[]}
              onRowClick={() => console.log('Row clicked')}
            />
          </div>
        </div>

        <div className="edit-footer">
          <button style={{ display: 'none' }}></button>
          <button>OK</button>
          <button onClick={onRequestClose}>취소</button>
        </div>
      </div>
    </Modal>
  );
};

export default VmonExportModal;
